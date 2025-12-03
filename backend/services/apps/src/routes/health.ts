import { FastifyInstance } from 'fastify';
import { testConnection } from '../lib/database.js';
import { checkDockerHealth } from '../lib/docker.js';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    const dbHealthy = await testConnection();
    const dockerHealthy = await checkDockerHealth();

    const status = dbHealthy && dockerHealthy ? 'ok' : 'degraded';

    return {
      status,
      service: 'apps-service',
      database: dbHealthy ? 'ok' : 'error',
      docker: dockerHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
    };
  });
}
