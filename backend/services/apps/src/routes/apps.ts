import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/database.js';
import {
  deployApp,
  getAppContainer,
  getAppLogs,
  getAppStats,
  startApp,
  stopApp,
  restartApp,
  deleteApp,
  ensureNetwork,
} from '../lib/docker.js';
import { config } from '../config.js';

const createAppSchema = z.object({
  name: z.string().min(3).max(63).regex(/^[a-z][a-z0-9-]*[a-z0-9]$/),
  image: z.string().min(1),
  port: z.number().min(1).max(65535).default(3000),
  env_vars: z.record(z.string()).optional().default({}),
  memory: z.string().regex(/^\d+(m|g|mb|gb)?$/i).optional().default('256m'),
  cpus: z.string().regex(/^\d+(\.\d+)?$/).optional().default('0.25'),
  health_check_path: z.string().optional().default('/health'),
});

const updateAppSchema = z.object({
  image: z.string().min(1).optional(),
  env_vars: z.record(z.string()).optional(),
  memory: z.string().regex(/^\d+(m|g|mb|gb)?$/i).optional(),
  cpus: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  health_check_path: z.string().optional(),
});

export async function appRoutes(fastify: FastifyInstance) {
  // Ensure network exists on startup
  await ensureNetwork();

  // List all apps for user
  fastify.get('/apps', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await query(
      `SELECT a.*,
              d.domain as domain_name
       FROM apps a
       LEFT JOIN app_domains d ON d.app_id = a.id AND d.is_primary = true
       WHERE a.user_id = $1 AND a.deleted_at IS NULL
       ORDER BY a.created_at DESC`,
      [userId]
    );

    const apps = await Promise.all(
      result.rows.map(async (app) => {
        const container = await getAppContainer(app.id);
        return {
          id: app.id,
          name: app.name,
          image: app.image,
          status: container?.status || 'stopped',
          state: container?.state || 'unknown',
          url: `https://${app.name}.${config.baseDomain}`,
          custom_domain: app.domain_name ? `https://${app.domain_name}` : null,
          memory: app.memory,
          cpus: app.cpus,
          port: app.port,
          created_at: app.created_at,
          updated_at: app.updated_at,
        };
      })
    );

    return { success: true, data: apps };
  });

  // Get app details
  fastify.get('/apps/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const app = result.rows[0];
    const container = await getAppContainer(app.id);
    const stats = container?.status === 'running' ? await getAppStats(app.id) : null;

    // Get domains
    const domains = await query(
      `SELECT * FROM app_domains WHERE app_id = $1 ORDER BY is_primary DESC`,
      [id]
    );

    // Get recent deployments
    const deployments = await query(
      `SELECT * FROM app_deployments WHERE app_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [id]
    );

    return {
      success: true,
      data: {
        id: app.id,
        name: app.name,
        image: app.image,
        port: app.port,
        status: container?.status || 'stopped',
        state: container?.state || 'unknown',
        url: `https://${app.name}.${config.baseDomain}`,
        memory: app.memory,
        cpus: app.cpus,
        env_vars: app.env_vars || {},
        health_check_path: app.health_check_path,
        stats,
        domains: domains.rows.map((d) => ({
          id: d.id,
          domain: d.domain,
          is_primary: d.is_primary,
          ssl_status: d.ssl_status,
        })),
        deployments: deployments.rows.map((d) => ({
          id: d.id,
          image: d.image,
          status: d.status,
          created_at: d.created_at,
        })),
        created_at: app.created_at,
        updated_at: app.updated_at,
      },
    };
  });

  // Create new app
  fastify.post('/apps', async (request, reply) => {
    const userId = (request as any).userId;
    const body = createAppSchema.parse(request.body);

    // Check plan limits
    const limits = await getUserLimits(userId);
    const appCount = await query(
      `SELECT COUNT(*) FROM apps WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    );

    if (limits.max_apps !== -1 && parseInt(appCount.rows[0].count) >= limits.max_apps) {
      return reply.status(403).send({
        success: false,
        error: `App limit reached. Your plan allows ${limits.max_apps} apps.`,
      });
    }

    // Check if name is unique for user
    const existing = await query(
      `SELECT id FROM apps WHERE user_id = $1 AND name = $2 AND deleted_at IS NULL`,
      [userId, body.name]
    );

    if (existing.rows.length > 0) {
      return reply.status(409).send({
        success: false,
        error: 'An app with this name already exists',
      });
    }

    // Create app record
    const result = await query(
      `INSERT INTO apps (user_id, name, image, port, env_vars, memory, cpus, health_check_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, body.name, body.image, body.port, JSON.stringify(body.env_vars), body.memory, body.cpus, body.health_check_path]
    );

    const app = result.rows[0];

    // Deploy the container
    try {
      const containerId = await deployApp({
        appId: app.id,
        name: app.name,
        image: app.image,
        port: app.port,
        envVars: body.env_vars,
        memory: body.memory,
        cpus: body.cpus,
        healthCheck: {
          path: body.health_check_path,
          interval: 30,
          timeout: 10,
        },
      });

      // Record deployment
      await query(
        `INSERT INTO app_deployments (app_id, image, status, container_id)
         VALUES ($1, $2, 'success', $3)`,
        [app.id, app.image, containerId]
      );

      // Update app status
      await query(`UPDATE apps SET status = 'running' WHERE id = $1`, [app.id]);

      return {
        success: true,
        data: {
          id: app.id,
          name: app.name,
          image: app.image,
          url: `https://${app.name}.${config.baseDomain}`,
          status: 'running',
          created_at: app.created_at,
        },
      };
    } catch (error: any) {
      // Record failed deployment
      await query(
        `INSERT INTO app_deployments (app_id, image, status, error_message)
         VALUES ($1, $2, 'failed', $3)`,
        [app.id, app.image, error.message]
      );

      await query(`UPDATE apps SET status = 'failed' WHERE id = $1`, [app.id]);

      return reply.status(500).send({
        success: false,
        error: `Deployment failed: ${error.message}`,
      });
    }
  });

  // Update app (redeploy)
  fastify.put('/apps/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const body = updateAppSchema.parse(request.body);

    const result = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const app = result.rows[0];
    const updatedImage = body.image || app.image;
    const updatedEnvVars = body.env_vars || app.env_vars || {};
    const updatedMemory = body.memory || app.memory;
    const updatedCpus = body.cpus || app.cpus;
    const updatedHealthPath = body.health_check_path || app.health_check_path;

    // Update app record
    await query(
      `UPDATE apps SET image = $1, env_vars = $2, memory = $3, cpus = $4, health_check_path = $5, updated_at = NOW()
       WHERE id = $6`,
      [updatedImage, JSON.stringify(updatedEnvVars), updatedMemory, updatedCpus, updatedHealthPath, id]
    );

    // Redeploy
    try {
      const containerId = await deployApp({
        appId: app.id,
        name: app.name,
        image: updatedImage,
        port: app.port,
        envVars: updatedEnvVars,
        memory: updatedMemory,
        cpus: updatedCpus,
        healthCheck: {
          path: updatedHealthPath,
          interval: 30,
          timeout: 10,
        },
      });

      await query(
        `INSERT INTO app_deployments (app_id, image, status, container_id)
         VALUES ($1, $2, 'success', $3)`,
        [app.id, updatedImage, containerId]
      );

      await query(`UPDATE apps SET status = 'running' WHERE id = $1`, [app.id]);

      return {
        success: true,
        message: 'App updated and redeployed successfully',
        data: { id: app.id, image: updatedImage },
      };
    } catch (error: any) {
      await query(
        `INSERT INTO app_deployments (app_id, image, status, error_message)
         VALUES ($1, $2, 'failed', $3)`,
        [app.id, updatedImage, error.message]
      );

      return reply.status(500).send({
        success: false,
        error: `Redeployment failed: ${error.message}`,
      });
    }
  });

  // Delete app
  fastify.delete('/apps/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    // Delete container
    await deleteApp(id);

    // Soft delete in database
    await query(`UPDATE apps SET deleted_at = NOW(), status = 'deleted' WHERE id = $1`, [id]);

    return { success: true, message: 'App deleted successfully' };
  });

  // Start app
  fastify.post('/apps/:id/start', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    try {
      await startApp(id);
      await query(`UPDATE apps SET status = 'running' WHERE id = $1`, [id]);
      return { success: true, message: 'App started' };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Stop app
  fastify.post('/apps/:id/stop', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    try {
      await stopApp(id);
      await query(`UPDATE apps SET status = 'stopped' WHERE id = $1`, [id]);
      return { success: true, message: 'App stopped' };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Restart app
  fastify.post('/apps/:id/restart', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    try {
      await restartApp(id);
      return { success: true, message: 'App restarted' };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get app logs
  fastify.get('/apps/:id/logs', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const { lines = '100' } = request.query as { lines?: string };

    const result = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const logs = await getAppLogs(id, parseInt(lines));
    return { success: true, data: { logs } };
  });

  // Get app stats
  fastify.get('/apps/:id/stats', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const stats = await getAppStats(id);
    if (!stats) {
      return reply.status(400).send({ success: false, error: 'App is not running' });
    }

    return { success: true, data: stats };
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
