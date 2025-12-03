import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/database.js';
import {
  createPostgresInstance,
  createMySQLInstance,
  createRedisInstance,
  createMongoDBInstance,
  getInstanceStatus,
  startInstance,
  stopInstance,
  deleteInstance,
  getInstanceLogs,
  getInstanceStats,
} from '../lib/docker.js';
import { config } from '../config.js';

const createInstanceSchema = z.object({
  name: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  type: z.enum(['postgres', 'mysql', 'redis', 'mongodb']),
  database: z.string().min(1).max(64).regex(/^[a-z0-9_]+$/).optional(),
});

export async function instanceRoutes(fastify: FastifyInstance) {
  // List user's database instances
  fastify.get('/databases', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await query(
      `SELECT id, name, type, container_id, host, port, status, region,
              created_at, updated_at
       FROM database_instances
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC`,
      [userId]
    );

    // Update status from Docker for each instance
    const instances = await Promise.all(
      result.rows.map(async (row) => {
        const status = await getInstanceStatus(row.container_id);
        return {
          id: row.id,
          name: row.name,
          type: row.type,
          host: row.host,
          port: row.port,
          status,
          region: row.region,
          created_at: row.created_at,
        };
      })
    );

    return { success: true, data: instances };
  });

  // Create new database instance
  fastify.post('/databases', async (request, reply) => {
    const userId = (request as any).userId;
    const body = createInstanceSchema.parse(request.body);

    // Check user's plan limits
    const userPlan = await query(
      `SELECT p.limits FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC LIMIT 1`,
      [userId]
    );

    const limits = userPlan.rows[0]?.limits || config.planLimits.free;
    const maxDatabases = limits.databases || 1;

    // Count existing databases
    const countResult = await query(
      `SELECT COUNT(*) FROM database_instances
       WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    );
    const currentCount = parseInt(countResult.rows[0].count);

    if (maxDatabases !== -1 && currentCount >= maxDatabases) {
      return reply.status(403).send({
        success: false,
        error: 'Database limit reached',
        message: `Your plan allows ${maxDatabases} database(s). Please upgrade to create more.`,
      });
    }

    // Check if name is unique for this user
    const existingName = await query(
      `SELECT id FROM database_instances
       WHERE user_id = $1 AND name = $2 AND deleted_at IS NULL`,
      [userId, body.name]
    );

    if (existingName.rows.length > 0) {
      return reply.status(409).send({
        success: false,
        error: 'Name already exists',
        message: 'A database with this name already exists.',
      });
    }

    let instance: any;
    let credentials: any;
    const dbName = body.database || body.name.replace(/-/g, '_');

    try {
      switch (body.type) {
        case 'postgres':
          ({ instance, credentials } = await createPostgresInstance(userId, body.name, dbName));
          break;
        case 'mysql':
          ({ instance, credentials } = await createMySQLInstance(userId, body.name, dbName));
          break;
        case 'redis':
          ({ instance, credentials } = await createRedisInstance(userId, body.name));
          break;
        case 'mongodb':
          ({ instance, credentials } = await createMongoDBInstance(userId, body.name, dbName));
          break;
      }

      // Store in database
      await query(
        `INSERT INTO database_instances
         (id, user_id, name, type, container_id, host, port, status, credentials_encrypted, region)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          instance.id,
          userId,
          body.name,
          body.type,
          instance.containerId,
          instance.host,
          instance.port,
          'running',
          JSON.stringify(credentials), // TODO: Encrypt credentials
          'default',
        ]
      );

      // Build connection string
      let connectionString = '';
      switch (body.type) {
        case 'postgres':
          connectionString = `postgresql://${credentials.username}:${credentials.password}@${instance.host}:${instance.port}/${credentials.database}`;
          break;
        case 'mysql':
          connectionString = `mysql://${credentials.username}:${credentials.password}@${instance.host}:${instance.port}/${credentials.database}`;
          break;
        case 'redis':
          connectionString = `redis://:${credentials.password}@${instance.host}:${instance.port}`;
          break;
        case 'mongodb':
          connectionString = `mongodb://${credentials.username}:${credentials.password}@${instance.host}:${instance.port}/${credentials.database}?authSource=admin`;
          break;
      }

      return reply.status(201).send({
        success: true,
        data: {
          id: instance.id,
          name: body.name,
          type: body.type,
          host: instance.host,
          port: instance.port,
          status: 'running',
          credentials,
          connection_string: connectionString,
        },
        message: 'Database instance created successfully. Save your credentials - they will not be shown again.',
      });
    } catch (error: any) {
      console.error('Failed to create database instance:', error);
      return reply.status(500).send({
        success: false,
        error: 'Creation failed',
        message: error.message,
      });
    }
  });

  // Get single database instance
  fastify.get('/databases/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM database_instances
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: 'Not found',
        message: 'Database instance not found.',
      });
    }

    const row = result.rows[0];
    const status = await getInstanceStatus(row.container_id);

    return {
      success: true,
      data: {
        id: row.id,
        name: row.name,
        type: row.type,
        host: row.host,
        port: row.port,
        status,
        region: row.region,
        created_at: row.created_at,
        updated_at: row.updated_at,
      },
    };
  });

  // Start database instance
  fastify.post('/databases/:id/start', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT container_id FROM database_instances
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Not found' });
    }

    try {
      await startInstance(result.rows[0].container_id);
      await query(
        `UPDATE database_instances SET status = 'running', updated_at = NOW() WHERE id = $1`,
        [id]
      );
      return { success: true, message: 'Database instance started.' };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Stop database instance
  fastify.post('/databases/:id/stop', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT container_id FROM database_instances
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Not found' });
    }

    try {
      await stopInstance(result.rows[0].container_id);
      await query(
        `UPDATE database_instances SET status = 'stopped', updated_at = NOW() WHERE id = $1`,
        [id]
      );
      return { success: true, message: 'Database instance stopped.' };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete database instance
  fastify.delete('/databases/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT container_id FROM database_instances
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Not found' });
    }

    try {
      await deleteInstance(result.rows[0].container_id);
      await query(
        `UPDATE database_instances SET deleted_at = NOW(), status = 'deleted' WHERE id = $1`,
        [id]
      );
      return { success: true, message: 'Database instance deleted.' };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get database logs
  fastify.get('/databases/:id/logs', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const { tail = '100' } = request.query as { tail?: string };

    const result = await query(
      `SELECT container_id FROM database_instances
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Not found' });
    }

    try {
      const logs = await getInstanceLogs(result.rows[0].container_id, parseInt(tail));
      return { success: true, data: { logs } };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get database stats
  fastify.get('/databases/:id/stats', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT container_id FROM database_instances
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Not found' });
    }

    try {
      const stats = await getInstanceStats(result.rows[0].container_id);
      return {
        success: true,
        data: {
          cpu_percent: stats.cpu_percent.toFixed(2),
          memory_usage_mb: (stats.memory_usage / 1024 / 1024).toFixed(2),
          memory_limit_mb: (stats.memory_limit / 1024 / 1024).toFixed(2),
          memory_percent: ((stats.memory_usage / stats.memory_limit) * 100).toFixed(2),
          network_rx_mb: (stats.network_rx / 1024 / 1024).toFixed(2),
          network_tx_mb: (stats.network_tx / 1024 / 1024).toFixed(2),
        },
      };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get connection credentials (requires re-authentication in production)
  fastify.get('/databases/:id/credentials', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT type, host, port, credentials_encrypted FROM database_instances
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Not found' });
    }

    const row = result.rows[0];
    const credentials = JSON.parse(row.credentials_encrypted); // TODO: Decrypt

    let connectionString = '';
    switch (row.type) {
      case 'postgres':
        connectionString = `postgresql://${credentials.username}:${credentials.password}@${row.host}:${row.port}/${credentials.database}`;
        break;
      case 'mysql':
        connectionString = `mysql://${credentials.username}:${credentials.password}@${row.host}:${row.port}/${credentials.database}`;
        break;
      case 'redis':
        connectionString = `redis://:${credentials.password}@${row.host}:${row.port}`;
        break;
      case 'mongodb':
        connectionString = `mongodb://${credentials.username}:${credentials.password}@${row.host}:${row.port}/${credentials.database}?authSource=admin`;
        break;
    }

    return {
      success: true,
      data: {
        ...credentials,
        host: row.host,
        port: row.port,
        connection_string: connectionString,
      },
    };
  });
}
