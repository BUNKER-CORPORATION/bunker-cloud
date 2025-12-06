import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/database.js';
import { executeFunction, buildFunction, ensureNetwork } from '../lib/runtime.js';
import { config } from '../config.js';
import crypto from 'crypto';

const createFunctionSchema = z.object({
  name: z.string().min(3).max(63).regex(/^[a-z][a-z0-9-]*[a-z0-9]$/),
  runtime: z.enum(['nodejs20', 'nodejs18', 'python311', 'python310', 'go121', 'rust']),
  code: z.string().min(1).max(5 * 1024 * 1024), // 5MB max
  handler: z.string().default('handler'),
  description: z.string().max(500).optional(),
  env_vars: z.record(z.string()).optional().default({}),
  memory: z.number().min(128).max(1024).default(128),
  timeout: z.number().min(1000).max(300000).default(30000),
});

const updateFunctionSchema = z.object({
  code: z.string().min(1).max(5 * 1024 * 1024).optional(),
  handler: z.string().optional(),
  description: z.string().max(500).optional(),
  env_vars: z.record(z.string()).optional(),
  memory: z.number().min(128).max(1024).optional(),
  timeout: z.number().min(1000).max(300000).optional(),
});

const invokeFunctionSchema = z.object({
  payload: z.any().optional(),
  async: z.boolean().default(false),
});

export async function functionRoutes(fastify: FastifyInstance) {
  // Ensure network exists on startup
  await ensureNetwork();

  // List all functions for user
  fastify.get('/functions', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await query(
      `SELECT f.*,
              (SELECT COUNT(*) FROM function_invocations i WHERE i.function_id = f.id) as invocation_count,
              (SELECT i.created_at FROM function_invocations i WHERE i.function_id = f.id ORDER BY i.created_at DESC LIMIT 1) as last_invoked_at
       FROM functions f
       WHERE f.user_id = $1 AND f.deleted_at IS NULL
       ORDER BY f.created_at DESC`,
      [userId]
    );

    return {
      success: true,
      data: result.rows.map((fn) => ({
        id: fn.id,
        name: fn.name,
        runtime: fn.runtime,
        handler: fn.handler,
        description: fn.description,
        memory: fn.memory,
        timeout: fn.timeout,
        status: fn.status,
        url: `https://${fn.name}.${config.baseDomain}`,
        invocation_count: parseInt(fn.invocation_count),
        last_invoked_at: fn.last_invoked_at,
        created_at: fn.created_at,
        updated_at: fn.updated_at,
      })),
    };
  });

  // Get function details
  fastify.get('/functions/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM functions WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Function not found' });
    }

    const fn = result.rows[0];

    // Get recent invocations
    const invocations = await query(
      `SELECT * FROM function_invocations WHERE function_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [id]
    );

    // Get usage stats
    const stats = await query(
      `SELECT
         COUNT(*) as total_invocations,
         COUNT(*) FILTER (WHERE status = 'success') as successful,
         COUNT(*) FILTER (WHERE status = 'error') as failed,
         AVG(duration_ms) as avg_duration,
         SUM(billed_duration_ms) as total_billed_ms
       FROM function_invocations
       WHERE function_id = $1 AND created_at > NOW() - INTERVAL '24 hours'`,
      [id]
    );

    return {
      success: true,
      data: {
        id: fn.id,
        name: fn.name,
        runtime: fn.runtime,
        handler: fn.handler,
        description: fn.description,
        code: fn.code,
        env_vars: fn.env_vars || {},
        memory: fn.memory,
        timeout: fn.timeout,
        status: fn.status,
        url: `https://${fn.name}.${config.baseDomain}`,
        stats_24h: {
          total_invocations: parseInt(stats.rows[0].total_invocations),
          successful: parseInt(stats.rows[0].successful),
          failed: parseInt(stats.rows[0].failed),
          avg_duration_ms: parseFloat(stats.rows[0].avg_duration) || 0,
          total_billed_ms: parseInt(stats.rows[0].total_billed_ms) || 0,
        },
        recent_invocations: invocations.rows.map((inv) => ({
          id: inv.id,
          status: inv.status,
          duration_ms: inv.duration_ms,
          billed_duration_ms: inv.billed_duration_ms,
          error: inv.error_message,
          created_at: inv.created_at,
        })),
        created_at: fn.created_at,
        updated_at: fn.updated_at,
      },
    };
  });

  // Create new function
  fastify.post('/functions', async (request, reply) => {
    const userId = (request as any).userId;
    const body = createFunctionSchema.parse(request.body);

    // Check plan limits
    const limits = await getUserLimits(userId);
    const count = await query(
      `SELECT COUNT(*) FROM functions WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    );

    if (limits.max_functions !== -1 && parseInt(count.rows[0].count) >= limits.max_functions) {
      return reply.status(403).send({
        success: false,
        error: `Function limit reached. Your plan allows ${limits.max_functions} functions.`,
      });
    }

    // Check memory limit
    if (body.memory > limits.max_memory_mb) {
      return reply.status(403).send({
        success: false,
        error: `Memory limit exceeded. Your plan allows up to ${limits.max_memory_mb}MB.`,
      });
    }

    // Check timeout limit
    if (body.timeout > limits.max_timeout_ms) {
      return reply.status(403).send({
        success: false,
        error: `Timeout limit exceeded. Your plan allows up to ${limits.max_timeout_ms}ms.`,
      });
    }

    // Check name uniqueness
    const existing = await query(
      `SELECT id FROM functions WHERE user_id = $1 AND name = $2 AND deleted_at IS NULL`,
      [userId, body.name]
    );

    if (existing.rows.length > 0) {
      return reply.status(409).send({
        success: false,
        error: 'A function with this name already exists',
      });
    }

    // Build/validate function
    const buildResult = await buildFunction(crypto.randomUUID(), body.runtime, body.code);
    if (!buildResult.success) {
      return reply.status(400).send({
        success: false,
        error: buildResult.error,
      });
    }

    // Create function
    const result = await query(
      `INSERT INTO functions (user_id, name, runtime, code, handler, description, env_vars, memory, timeout)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        userId,
        body.name,
        body.runtime,
        body.code,
        body.handler,
        body.description,
        JSON.stringify(body.env_vars),
        body.memory,
        body.timeout,
      ]
    );

    const fn = result.rows[0];

    return {
      success: true,
      data: {
        id: fn.id,
        name: fn.name,
        runtime: fn.runtime,
        handler: fn.handler,
        url: `https://${fn.name}.${config.baseDomain}`,
        status: fn.status,
        created_at: fn.created_at,
      },
    };
  });

  // Update function
  fastify.put('/functions/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const body = updateFunctionSchema.parse(request.body);

    const result = await query(
      `SELECT * FROM functions WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Function not found' });
    }

    const fn = result.rows[0];

    // Check limits if changing memory/timeout
    if (body.memory || body.timeout) {
      const limits = await getUserLimits(userId);
      if (body.memory && body.memory > limits.max_memory_mb) {
        return reply.status(403).send({
          success: false,
          error: `Memory limit exceeded. Your plan allows up to ${limits.max_memory_mb}MB.`,
        });
      }
      if (body.timeout && body.timeout > limits.max_timeout_ms) {
        return reply.status(403).send({
          success: false,
          error: `Timeout limit exceeded. Your plan allows up to ${limits.max_timeout_ms}ms.`,
        });
      }
    }

    // Validate new code if provided
    if (body.code) {
      const buildResult = await buildFunction(id, fn.runtime, body.code);
      if (!buildResult.success) {
        return reply.status(400).send({
          success: false,
          error: buildResult.error,
        });
      }
    }

    // Update function
    const updated = await query(
      `UPDATE functions
       SET code = COALESCE($1, code),
           handler = COALESCE($2, handler),
           description = COALESCE($3, description),
           env_vars = COALESCE($4, env_vars),
           memory = COALESCE($5, memory),
           timeout = COALESCE($6, timeout),
           version = version + 1,
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        body.code,
        body.handler,
        body.description,
        body.env_vars ? JSON.stringify(body.env_vars) : null,
        body.memory,
        body.timeout,
        id,
      ]
    );

    return {
      success: true,
      data: {
        id: updated.rows[0].id,
        version: updated.rows[0].version,
        updated_at: updated.rows[0].updated_at,
      },
    };
  });

  // Delete function
  fastify.delete('/functions/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `UPDATE functions SET deleted_at = NOW(), status = 'deleted'
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
       RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Function not found' });
    }

    return { success: true, message: 'Function deleted' };
  });

  // Invoke function (authenticated)
  fastify.post('/functions/:id/invoke', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const body = invokeFunctionSchema.parse(request.body);

    const result = await query(
      `SELECT * FROM functions WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Function not found' });
    }

    const fn = result.rows[0];

    // Check invocation limits
    const limits = await getUserLimits(userId);
    if (limits.max_invocations_per_month !== -1) {
      const monthlyCount = await query(
        `SELECT COUNT(*) FROM function_invocations i
         JOIN functions f ON i.function_id = f.id
         WHERE f.user_id = $1 AND i.created_at > date_trunc('month', NOW())`,
        [userId]
      );

      if (parseInt(monthlyCount.rows[0].count) >= limits.max_invocations_per_month) {
        return reply.status(429).send({
          success: false,
          error: 'Monthly invocation limit reached',
        });
      }
    }

    // For async invocations, queue and return immediately
    if (body.async) {
      const invocationId = crypto.randomUUID();
      await query(
        `INSERT INTO function_invocations (id, function_id, status, request_payload)
         VALUES ($1, $2, 'queued', $3)`,
        [invocationId, id, JSON.stringify(body.payload)]
      );

      // Queue for background processing (would use Redis in production)
      queueInvocation(fn, invocationId, body.payload);

      return {
        success: true,
        data: {
          invocation_id: invocationId,
          status: 'queued',
        },
      };
    }

    // Synchronous invocation
    return await invokeFunction(fn, body.payload);
  });

  // Get invocation details
  fastify.get('/functions/:id/invocations/:invocationId', async (request, reply) => {
    const userId = (request as any).userId;
    const { id, invocationId } = request.params as { id: string; invocationId: string };

    // Verify function ownership
    const fnResult = await query(
      `SELECT id FROM functions WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (fnResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Function not found' });
    }

    const result = await query(
      `SELECT * FROM function_invocations WHERE id = $1 AND function_id = $2`,
      [invocationId, id]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Invocation not found' });
    }

    const inv = result.rows[0];

    return {
      success: true,
      data: {
        id: inv.id,
        function_id: inv.function_id,
        status: inv.status,
        request_payload: inv.request_payload,
        response_payload: inv.response_payload,
        logs: inv.logs,
        error_message: inv.error_message,
        duration_ms: inv.duration_ms,
        billed_duration_ms: inv.billed_duration_ms,
        memory_used_mb: inv.memory_used_mb,
        created_at: inv.created_at,
        completed_at: inv.completed_at,
      },
    };
  });

  // Get function logs
  fastify.get('/functions/:id/logs', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const { limit = '50', since } = request.query as { limit?: string; since?: string };

    // Verify function ownership
    const fnResult = await query(
      `SELECT id FROM functions WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (fnResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Function not found' });
    }

    const sinceFilter = since ? 'AND created_at > $3' : '';
    const params = since ? [id, parseInt(limit), new Date(since)] : [id, parseInt(limit)];

    const result = await query(
      `SELECT id, status, logs, duration_ms, created_at
       FROM function_invocations
       WHERE function_id = $1 ${sinceFilter}
       ORDER BY created_at DESC
       LIMIT $2`,
      params
    );

    return {
      success: true,
      data: result.rows.map((inv) => ({
        invocation_id: inv.id,
        status: inv.status,
        logs: inv.logs,
        duration_ms: inv.duration_ms,
        timestamp: inv.created_at,
      })),
    };
  });

  // Public invocation endpoint (by function name)
  fastify.post('/invoke/:name', async (request, reply) => {
    const { name } = request.params as { name: string };

    const result = await query(
      `SELECT * FROM functions WHERE name = $1 AND deleted_at IS NULL AND status = 'active'`,
      [name]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Function not found' });
    }

    const fn = result.rows[0];

    return await invokeFunction(fn, request.body);
  });
}

// Helper to execute function and record invocation
async function invokeFunction(fn: any, payload: any) {
  const invocationId = crypto.randomUUID();

  // Record invocation start
  await query(
    `INSERT INTO function_invocations (id, function_id, status, request_payload)
     VALUES ($1, $2, 'running', $3)`,
    [invocationId, fn.id, JSON.stringify(payload)]
  );

  try {
    const result = await executeFunction({
      functionId: fn.id,
      name: fn.name,
      runtime: fn.runtime,
      code: fn.code,
      handler: fn.handler,
      envVars: fn.env_vars || {},
      memory: fn.memory,
      timeout: fn.timeout,
      payload,
    });

    // Update invocation record
    await query(
      `UPDATE function_invocations
       SET status = $1,
           response_payload = $2,
           logs = $3,
           error_message = $4,
           duration_ms = $5,
           billed_duration_ms = $6,
           completed_at = NOW()
       WHERE id = $7`,
      [
        result.success ? 'success' : 'error',
        result.output ? JSON.stringify(result.output) : null,
        result.logs,
        result.error,
        result.duration,
        result.billedDuration,
        invocationId,
      ]
    );

    if (result.success) {
      return {
        success: true,
        data: {
          invocation_id: invocationId,
          output: result.output,
          duration_ms: result.duration,
          billed_duration_ms: result.billedDuration,
        },
      };
    } else {
      return {
        success: false,
        error: result.error,
        invocation_id: invocationId,
        duration_ms: result.duration,
      };
    }
  } catch (error: any) {
    await query(
      `UPDATE function_invocations
       SET status = 'error', error_message = $1, completed_at = NOW()
       WHERE id = $2`,
      [error.message, invocationId]
    );

    return {
      success: false,
      error: error.message,
      invocation_id: invocationId,
    };
  }
}

// Queue async invocation (simplified - would use Redis in production)
function queueInvocation(fn: any, invocationId: string, payload: any) {
  setImmediate(async () => {
    await invokeFunction(fn, payload);
  });
}

// Helper function
async function getUserLimits(userId: string) {
  const result = await query(
    `SELECT p.limits FROM subscriptions s
     JOIN plans p ON s.plan_id = p.id
     WHERE s.user_id = $1 AND s.status = 'active'
     ORDER BY s.created_at DESC LIMIT 1`,
    [userId]
  );
  return result.rows[0]?.limits || config.planLimits.free;
}
