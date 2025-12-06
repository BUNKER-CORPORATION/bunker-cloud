import { FastifyInstance } from 'fastify';
import { testConnection } from '../lib/database.js';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    const dbHealthy = await testConnection();

    const status = dbHealthy ? 'healthy' : 'unhealthy';
    const statusCode = dbHealthy ? 200 : 503;

    return reply.status(statusCode).send({
      status,
      service: 'functions',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbHealthy ? 'connected' : 'disconnected',
      },
    });
  });
}
