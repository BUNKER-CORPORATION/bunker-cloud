import { FastifyInstance } from 'fastify';
import { minioClient } from '../lib/minio.js';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    // Check MinIO connectivity
    let minioStatus = 'ok';
    try {
      await minioClient.listBuckets();
    } catch (error) {
      minioStatus = 'error';
    }

    return {
      status: minioStatus === 'ok' ? 'ok' : 'degraded',
      service: 'storage-service',
      minio: minioStatus,
      timestamp: new Date().toISOString(),
    };
  });
}
