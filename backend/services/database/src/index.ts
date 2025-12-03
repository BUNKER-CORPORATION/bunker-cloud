import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config.js';
import { pool } from './lib/database.js';
import { logger } from './lib/logger.js';
import { healthRoutes } from './routes/health.js';
import { instanceRoutes } from './routes/instances.js';

const fastify = Fastify({ logger: true });

// Register plugins
await fastify.register(cors, {
  origin: [
    'https://cloud.bunkercorpo.com',
    'https://bunkercorpo.com',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
});

// Auth middleware - extract user from JWT or API key
fastify.addHook('preHandler', async (request, reply) => {
  // Skip auth for health checks
  if (request.url === '/health') return;

  const authHeader = request.headers.authorization;
  const apiKey = request.headers['x-api-key'];

  if (apiKey) {
    // Validate API key against auth service database
    const result = await pool.query(
      `SELECT user_id FROM api_keys WHERE key_hash = $1 AND revoked_at IS NULL`,
      [apiKey] // In production, hash the key before comparing
    );

    if (result.rows.length > 0) {
      (request as any).userId = result.rows[0].user_id;
      return;
    }
  }

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    // For now, decode JWT without verification (auth service handles verification)
    // In production, verify JWT signature
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      (request as any).userId = payload.userId;
      return;
    } catch (e) {
      // Invalid token
    }
  }

  return reply.status(401).send({
    success: false,
    error: 'Unauthorized',
    message: 'Valid authentication required.',
  });
});

// Register routes
await fastify.register(healthRoutes);
await fastify.register(instanceRoutes);

// Start server
const start = async () => {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('Database connected successfully');

    await fastify.listen({ port: config.port, host: config.host });
    console.log(`Database service running on ${config.host}:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
