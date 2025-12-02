import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { config } from './config.js';
import { database } from './lib/database.js';
import { redis } from './lib/redis.js';
import { authRoutes } from './routes/auth.js';
import { apiKeyRoutes } from './routes/api-keys.js';
import { organizationRoutes } from './routes/organizations.js';
import { userRoutes } from './routes/users.js';
import { healthRoutes } from './routes/health.js';
import { logger } from './lib/logger.js';

const app = Fastify({
  logger: logger,
  trustProxy: true,
});

// Register plugins
await app.register(cors, {
  origin: config.cors.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID'],
});

await app.register(helmet, {
  contentSecurityPolicy: false,
});

await app.register(rateLimit, {
  max: config.rateLimit.max,
  timeWindow: config.rateLimit.windowMs,
  redis: redis.client,
});

await app.register(cookie, {
  secret: config.session.secret,
});

await app.register(jwt, {
  secret: config.jwt.secret,
  sign: {
    expiresIn: config.jwt.accessExpiresIn,
  },
});

// Decorate with database and redis
app.decorate('db', database);
app.decorate('redis', redis);

// Register routes
await app.register(healthRoutes, { prefix: '/health' });
await app.register(authRoutes, { prefix: '/auth' });
await app.register(apiKeyRoutes, { prefix: '/api-keys' });
await app.register(organizationRoutes, { prefix: '/organizations' });
await app.register(userRoutes, { prefix: '/users' });

// Global error handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : error.message;

  reply.status(statusCode).send({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message,
      ...(config.isDev && { stack: error.stack }),
    },
  });
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  app.log.info(`Received ${signal}, shutting down gracefully...`);

  await app.close();
  await database.close();
  await redis.close();

  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start server
const start = async () => {
  try {
    // Initialize connections
    await database.connect();
    await redis.connect();

    // Start server
    await app.listen({
      port: config.port,
      host: config.host,
    });

    app.log.info(`Auth service running on ${config.host}:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
