import Fastify from 'fastify';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import { healthRoutes } from './routes/health.js';
import { functionRoutes } from './routes/functions.js';

const fastify = Fastify({
  logger: true,
  bodyLimit: config.execution.maxPayloadSize,
});

// Auth middleware - extract user from JWT
fastify.addHook('preHandler', async (request, reply) => {
  // Skip auth for health check and public invoke endpoint
  if (request.url === '/health' || request.url.startsWith('/invoke/')) return;

  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ success: false, error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  try {
    // Decode JWT payload (in production, verify signature with secret)
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    (request as any).userId = payload.userId;
  } catch (error) {
    return reply.status(401).send({ success: false, error: 'Invalid token' });
  }
});

// Register routes
fastify.register(healthRoutes);
fastify.register(functionRoutes);

// Start server
async function start() {
  try {
    await fastify.listen({ port: config.port, host: config.host });
    logger.info(`Functions service running on port ${config.port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

start();
