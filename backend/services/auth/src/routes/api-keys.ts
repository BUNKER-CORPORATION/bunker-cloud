import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { database } from '../lib/database.js';

// Validation schemas
const createApiKeySchema = z.object({
  name: z.string().min(1).max(255),
  scopes: z.array(z.string()).optional().default(['read']),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

// Middleware to verify JWT
async function verifyAuth(app: FastifyInstance, request: any, reply: any) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing authorization header' },
    });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = app.jwt.verify<JWTPayload>(token);
    request.userId = decoded.userId;
  } catch {
    return reply.status(401).send({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
    });
  }
}

export async function apiKeyRoutes(app: FastifyInstance) {
  // Add auth hook to all routes
  app.addHook('preHandler', async (request, reply) => {
    await verifyAuth(app, request, reply);
  });

  // ===========================================
  // LIST API KEYS
  // ===========================================
  app.get('/', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await database.query(
      `SELECT id, name, key_prefix, scopes, rate_limit, last_used_at, usage_count, expires_at, is_active, created_at
       FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    return {
      success: true,
      data: result.rows.map((key) => ({
        id: key.id,
        name: key.name,
        keyPrefix: key.key_prefix,
        scopes: key.scopes,
        rateLimit: key.rate_limit,
        lastUsedAt: key.last_used_at,
        usageCount: key.usage_count,
        expiresAt: key.expires_at,
        isActive: key.is_active,
        createdAt: key.created_at,
      })),
    };
  });

  // ===========================================
  // CREATE API KEY
  // ===========================================
  app.post('/', async (request, reply) => {
    const userId = (request as any).userId;
    const body = createApiKeySchema.parse(request.body);

    // Generate API key (prefix + secret)
    const prefix = 'bk_' + nanoid(6);
    const secret = nanoid(32);
    const fullKey = `${prefix}_${secret}`;
    const keyHash = await bcrypt.hash(fullKey, 10);

    // Calculate expiration
    const expiresAt = body.expiresInDays
      ? new Date(Date.now() + body.expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const result = await database.query(
      `INSERT INTO api_keys (user_id, name, key_prefix, key_hash, scopes, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, key_prefix, scopes, expires_at, created_at`,
      [userId, body.name, prefix, keyHash, body.scopes, expiresAt]
    );

    const apiKey = result.rows[0];

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, 'api_key.created', 'api_key', apiKey.id, request.ip, JSON.stringify({ name: body.name })]
    );

    return {
      success: true,
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: fullKey, // Only returned once at creation!
        keyPrefix: apiKey.key_prefix,
        scopes: apiKey.scopes,
        expiresAt: apiKey.expires_at,
        createdAt: apiKey.created_at,
      },
      message: 'API key created. Save this key securely - it will not be shown again.',
    };
  });

  // ===========================================
  // GET API KEY
  // ===========================================
  app.get('/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await database.query(
      `SELECT id, name, key_prefix, scopes, rate_limit, last_used_at, usage_count, expires_at, is_active, created_at
       FROM api_keys WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'API key not found' },
      });
    }

    const key = result.rows[0];

    return {
      success: true,
      data: {
        id: key.id,
        name: key.name,
        keyPrefix: key.key_prefix,
        scopes: key.scopes,
        rateLimit: key.rate_limit,
        lastUsedAt: key.last_used_at,
        usageCount: key.usage_count,
        expiresAt: key.expires_at,
        isActive: key.is_active,
        createdAt: key.created_at,
      },
    };
  });

  // ===========================================
  // UPDATE API KEY
  // ===========================================
  app.put('/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const { name, scopes, isActive } = request.body as {
      name?: string;
      scopes?: string[];
      isActive?: boolean;
    };

    // Check ownership
    const existing = await database.query(
      'SELECT id FROM api_keys WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existing.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'API key not found' },
      });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (scopes !== undefined) {
      updates.push(`scopes = $${paramIndex++}`);
      values.push(scopes);
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(isActive);
    }

    if (updates.length === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'NO_UPDATES', message: 'No fields to update' },
      });
    }

    values.push(id);

    const result = await database.query(
      `UPDATE api_keys SET ${updates.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, name, key_prefix, scopes, is_active`,
      values
    );

    return {
      success: true,
      data: result.rows[0],
    };
  });

  // ===========================================
  // DELETE API KEY
  // ===========================================
  app.delete('/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await database.query(
      'DELETE FROM api_keys WHERE id = $1 AND user_id = $2 RETURNING id, name',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'API key not found' },
      });
    }

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, 'api_key.deleted', 'api_key', id, request.ip, JSON.stringify({ name: result.rows[0].name })]
    );

    return {
      success: true,
      message: 'API key deleted successfully',
    };
  });

  // ===========================================
  // VERIFY API KEY (Internal endpoint)
  // ===========================================
  app.post('/verify', async (request, reply) => {
    const { apiKey } = request.body as { apiKey: string };

    if (!apiKey) {
      return reply.status(400).send({
        success: false,
        error: { code: 'MISSING_KEY', message: 'API key is required' },
      });
    }

    // Extract prefix
    const parts = apiKey.split('_');
    if (parts.length < 3) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_KEY', message: 'Invalid API key format' },
      });
    }

    const prefix = `${parts[0]}_${parts[1]}`;

    // Find keys with matching prefix
    const result = await database.query(
      `SELECT id, user_id, key_hash, scopes, rate_limit, expires_at, is_active
       FROM api_keys WHERE key_prefix = $1`,
      [prefix]
    );

    if (result.rows.length === 0) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_KEY', message: 'Invalid API key' },
      });
    }

    // Verify the key hash
    const keyRecord = result.rows[0];
    const isValid = await bcrypt.compare(apiKey, keyRecord.key_hash);

    if (!isValid) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_KEY', message: 'Invalid API key' },
      });
    }

    // Check if active
    if (!keyRecord.is_active) {
      return reply.status(401).send({
        success: false,
        error: { code: 'KEY_DISABLED', message: 'API key is disabled' },
      });
    }

    // Check expiration
    if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
      return reply.status(401).send({
        success: false,
        error: { code: 'KEY_EXPIRED', message: 'API key has expired' },
      });
    }

    // Update usage stats
    await database.query(
      `UPDATE api_keys SET last_used_at = NOW(), last_used_ip = $1, usage_count = usage_count + 1 WHERE id = $2`,
      [request.ip, keyRecord.id]
    );

    return {
      success: true,
      data: {
        userId: keyRecord.user_id,
        scopes: keyRecord.scopes,
        rateLimit: keyRecord.rate_limit,
      },
    };
  });
}
