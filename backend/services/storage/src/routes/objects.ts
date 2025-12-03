import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import mime from 'mime-types';
import { query } from '../lib/database.js';
import {
  listObjects,
  getObjectStat,
  putObject,
  getObject,
  deleteObject,
  deleteObjects,
  getPresignedDownloadUrl,
  getPresignedUploadUrl,
  copyObject,
} from '../lib/minio.js';
import { config } from '../config.js';

const presignedSchema = z.object({
  key: z.string().min(1).max(1024),
  expires: z.number().min(60).max(86400).optional().default(3600),
});

export async function objectRoutes(fastify: FastifyInstance) {
  // List objects in a bucket
  fastify.get('/buckets/:id/objects', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const { prefix = '', recursive = 'false' } = request.query as { prefix?: string; recursive?: string };

    const bucket = await getBucketForUser(id, userId);
    if (!bucket) {
      return reply.status(404).send({ success: false, error: 'Bucket not found' });
    }

    try {
      const objects = await listObjects(bucket.minio_bucket, prefix, recursive === 'true');

      const formattedObjects = objects.map(obj => ({
        name: obj.name,
        size: obj.size,
        size_formatted: formatBytes(obj.size || 0),
        last_modified: obj.lastModified,
        etag: obj.etag,
        is_folder: obj.name?.endsWith('/'),
      }));

      return {
        success: true,
        data: {
          bucket: bucket.name,
          prefix,
          objects: formattedObjects,
          count: formattedObjects.length,
        },
      };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get object metadata
  fastify.get('/buckets/:id/objects/:key', async (request, reply) => {
    const userId = (request as any).userId;
    const { id, key } = request.params as { id: string; key: string };

    const bucket = await getBucketForUser(id, userId);
    if (!bucket) {
      return reply.status(404).send({ success: false, error: 'Bucket not found' });
    }

    try {
      const stat = await getObjectStat(bucket.minio_bucket, decodeURIComponent(key));

      return {
        success: true,
        data: {
          name: key,
          size: stat.size,
          size_formatted: formatBytes(stat.size),
          content_type: stat.metaData?.['content-type'] || 'application/octet-stream',
          last_modified: stat.lastModified,
          etag: stat.etag,
        },
      };
    } catch (error: any) {
      if (error.code === 'NotFound') {
        return reply.status(404).send({ success: false, error: 'Object not found' });
      }
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Upload object (small files, for large files use presigned URL)
  fastify.post('/buckets/:id/objects', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const bucket = await getBucketForUser(id, userId);
    if (!bucket) {
      return reply.status(404).send({ success: false, error: 'Bucket not found' });
    }

    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ success: false, error: 'No file provided' });
      }

      // Check file size limit
      const limits = await getUserLimits(userId);
      const maxSize = limits.max_file_size || config.planLimits.free.max_file_size;

      // Get content type
      const contentType = data.mimetype || mime.lookup(data.filename) || 'application/octet-stream';

      // Generate object key
      const key = (request.query as any).key || data.filename;

      // Upload to MinIO
      const result = await putObject(
        bucket.minio_bucket,
        key,
        data.file,
        data.file.readableLength || 0,
        contentType
      );

      // Update bucket stats
      await updateBucketStats(bucket.id, bucket.minio_bucket);

      return {
        success: true,
        data: {
          key,
          etag: result.etag,
          size: data.file.readableLength,
          content_type: contentType,
          url: `https://storage.bunkercorpo.com/${bucket.minio_bucket}/${key}`,
        },
      };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Download object
  fastify.get('/buckets/:id/objects/:key/download', async (request, reply) => {
    const userId = (request as any).userId;
    const { id, key } = request.params as { id: string; key: string };

    const bucket = await getBucketForUser(id, userId);
    if (!bucket) {
      return reply.status(404).send({ success: false, error: 'Bucket not found' });
    }

    try {
      const decodedKey = decodeURIComponent(key);
      const stat = await getObjectStat(bucket.minio_bucket, decodedKey);
      const stream = await getObject(bucket.minio_bucket, decodedKey);

      const contentType = stat.metaData?.['content-type'] || 'application/octet-stream';

      reply.header('Content-Type', contentType);
      reply.header('Content-Length', stat.size);
      reply.header('Content-Disposition', `attachment; filename="${decodedKey.split('/').pop()}"`);

      return reply.send(stream);
    } catch (error: any) {
      if (error.code === 'NotFound') {
        return reply.status(404).send({ success: false, error: 'Object not found' });
      }
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete object
  fastify.delete('/buckets/:id/objects/:key', async (request, reply) => {
    const userId = (request as any).userId;
    const { id, key } = request.params as { id: string; key: string };

    const bucket = await getBucketForUser(id, userId);
    if (!bucket) {
      return reply.status(404).send({ success: false, error: 'Bucket not found' });
    }

    try {
      await deleteObject(bucket.minio_bucket, decodeURIComponent(key));

      // Update bucket stats
      await updateBucketStats(bucket.id, bucket.minio_bucket);

      return { success: true, message: 'Object deleted.' };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete multiple objects
  fastify.post('/buckets/:id/objects/delete', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const { keys } = request.body as { keys: string[] };

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return reply.status(400).send({ success: false, error: 'No keys provided' });
    }

    const bucket = await getBucketForUser(id, userId);
    if (!bucket) {
      return reply.status(404).send({ success: false, error: 'Bucket not found' });
    }

    try {
      await deleteObjects(bucket.minio_bucket, keys);

      // Update bucket stats
      await updateBucketStats(bucket.id, bucket.minio_bucket);

      return { success: true, message: `${keys.length} object(s) deleted.` };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get presigned download URL
  fastify.post('/buckets/:id/presigned/download', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const body = presignedSchema.parse(request.body);

    const bucket = await getBucketForUser(id, userId);
    if (!bucket) {
      return reply.status(404).send({ success: false, error: 'Bucket not found' });
    }

    try {
      const internalUrl = await getPresignedDownloadUrl(bucket.minio_bucket, body.key, body.expires);
      // Replace internal MinIO endpoint with public endpoint
      const url = replaceMinioEndpoint(internalUrl);

      return {
        success: true,
        data: {
          url,
          key: body.key,
          expires_in: body.expires,
          expires_at: new Date(Date.now() + body.expires * 1000).toISOString(),
        },
      };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get presigned upload URL
  fastify.post('/buckets/:id/presigned/upload', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const body = presignedSchema.parse(request.body);

    const bucket = await getBucketForUser(id, userId);
    if (!bucket) {
      return reply.status(404).send({ success: false, error: 'Bucket not found' });
    }

    try {
      const internalUrl = await getPresignedUploadUrl(bucket.minio_bucket, body.key, body.expires);
      // Replace internal MinIO endpoint with public endpoint
      const url = replaceMinioEndpoint(internalUrl);

      return {
        success: true,
        data: {
          url,
          key: body.key,
          method: 'PUT',
          expires_in: body.expires,
          expires_at: new Date(Date.now() + body.expires * 1000).toISOString(),
        },
      };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Copy object
  fastify.post('/buckets/:id/objects/:key/copy', async (request, reply) => {
    const userId = (request as any).userId;
    const { id, key } = request.params as { id: string; key: string };
    const { destination_bucket, destination_key } = request.body as {
      destination_bucket?: string;
      destination_key: string;
    };

    const sourceBucket = await getBucketForUser(id, userId);
    if (!sourceBucket) {
      return reply.status(404).send({ success: false, error: 'Source bucket not found' });
    }

    // If destination bucket specified, verify ownership
    let destMinioBucket = sourceBucket.minio_bucket;
    if (destination_bucket) {
      const destBucket = await getBucketForUser(destination_bucket, userId);
      if (!destBucket) {
        return reply.status(404).send({ success: false, error: 'Destination bucket not found' });
      }
      destMinioBucket = destBucket.minio_bucket;
    }

    try {
      await copyObject(
        sourceBucket.minio_bucket,
        decodeURIComponent(key),
        destMinioBucket,
        destination_key
      );

      return {
        success: true,
        data: {
          source: `${sourceBucket.minio_bucket}/${key}`,
          destination: `${destMinioBucket}/${destination_key}`,
        },
      };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

// Helper functions
async function getBucketForUser(bucketId: string, userId: string) {
  const result = await query(
    `SELECT id, name, minio_bucket, is_public FROM storage_buckets
     WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [bucketId, userId]
  );
  return result.rows[0] || null;
}

async function getUserLimits(userId: string) {
  const result = await query(
    `SELECT p.limits FROM subscriptions s
     JOIN plans p ON s.plan_id = p.id
     WHERE s.user_id = $1 AND s.status = 'active'
     ORDER BY s.created_at DESC LIMIT 1`,
    [userId]
  );
  return result.rows[0]?.limits || config.planLimits.free;
}

async function updateBucketStats(bucketId: string, minioBucket: string) {
  try {
    const objects = await listObjects(minioBucket, '', true);
    const size = objects.reduce((total, obj) => total + (obj.size || 0), 0);

    await query(
      `UPDATE storage_buckets SET size_bytes = $1, object_count = $2, updated_at = NOW()
       WHERE id = $3`,
      [size, objects.length, bucketId]
    );
  } catch (error) {
    // Ignore errors updating stats
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function replaceMinioEndpoint(url: string): string {
  // Replace internal MinIO endpoint with public endpoint
  const publicEndpoint = config.minio.publicEndpoint;
  const internalPattern = /^https?:\/\/[^/]+/;
  return url.replace(internalPattern, publicEndpoint);
}
