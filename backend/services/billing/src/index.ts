import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config.js';
import { database } from './lib/database.js';
import { redis } from './lib/redis.js';
import { healthRoutes } from './routes/health.js';
import { plansRoutes } from './routes/plans.js';
import { subscriptionRoutes } from './routes/subscriptions.js';
import { invoiceRoutes } from './routes/invoices.js';
import { usageRoutes } from './routes/usage.js';
import { webhookRoutes } from './routes/webhooks.js';
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

// Decorate with database and redis
app.decorate('db', database);
app.decorate('redis', redis);

// Register routes
await app.register(healthRoutes, { prefix: '/health' });
await app.register(plansRoutes, { prefix: '/billing/plans' });
await app.register(subscriptionRoutes, { prefix: '/billing/subscription' });
await app.register(invoiceRoutes, { prefix: '/billing/invoices' });
await app.register(usageRoutes, { prefix: '/billing/usage' });
await app.register(webhookRoutes, { prefix: '/billing/webhooks' });

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
    await database.connect();
    await redis.connect();

    await app.listen({
      port: config.port,
      host: config.host,
    });

    app.log.info(`Billing service running on ${config.host}:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
