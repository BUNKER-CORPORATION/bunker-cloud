import Fastify from 'fastify';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import { ensureBucket } from './lib/storage.js';
import { healthRoutes } from './routes/health.js';
import { repositoryRoutes } from './routes/repositories.js';
import { dockerRoutes } from './routes/docker.js';

const fastify = Fastify({
  logger: true,
  bodyLimit: config.registry.maxImageSize,
});

// Auth middleware - extract user from JWT or registry token
fastify.addHook('preHandler', async (request, reply) => {
  // Skip auth for health check and Docker v2 check
  if (request.url === '/health' || request.url === '/v2/') return;

  // Docker registry endpoints use their own auth
  if (request.url.startsWith('/v2/')) return;

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
fastify.register(repositoryRoutes);
fastify.register(dockerRoutes);

// Start server
async function start() {
  try {
    // Ensure storage bucket exists
    await ensureBucket();

    await fastify.listen({ port: config.port, host: config.host });
    logger.info(`Registry service running on port ${config.port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

start();
