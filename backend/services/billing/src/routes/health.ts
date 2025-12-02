import { FastifyInstance } from 'fastify';
import { database } from '../lib/database.js';
import { redis } from '../lib/redis.js';

export async function healthRoutes(app: FastifyInstance) {
  // Basic health check
  app.get('/', async (request, reply) => {
    return {
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    };
  });

  // Detailed health check
  app.get('/detailed', async (request, reply) => {
    const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

    // Check database
    try {
      const start = Date.now();
      await database.query('SELECT 1');
      checks.database = {
        status: 'healthy',
        latency: Date.now() - start,
      };
    } catch (error: any) {
      checks.database = {
        status: 'unhealthy',
        error: error.message,
      };
    }

    // Check Redis
    try {
      const start = Date.now();
      await redis.set('health-check', 'ok', 10);
      await redis.get('health-check');
      checks.redis = {
        status: 'healthy',
        latency: Date.now() - start,
      };
    } catch (error: any) {
      checks.redis = {
        status: 'unhealthy',
        error: error.message,
      };
    }

    const allHealthy = Object.values(checks).every((c) => c.status === 'healthy');

    return reply.status(allHealthy ? 200 : 503).send({
      status: allHealthy ? 'healthy' : 'unhealthy',
      service: 'auth-service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      checks,
    });
  });

  // Readiness check (for Kubernetes)
  app.get('/ready', async (request, reply) => {
    try {
      await database.query('SELECT 1');
      await redis.get('ready-check');
      return { ready: true };
    } catch {
      return reply.status(503).send({ ready: false });
    }
  });

  // Liveness check (for Kubernetes)
  app.get('/live', async (request, reply) => {
    return { live: true };
  });
}
