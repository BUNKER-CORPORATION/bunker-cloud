import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/database.js';
import {
  generateBucketName,
  bucketExists,
  createBucket,
  deleteBucket,
  listObjects,
  getBucketSize,
  setBucketPolicy,
  getBucketPolicy,
} from '../lib/minio.js';
import { config } from '../config.js';

const createBucketSchema = z.object({
  name: z.string().min(3).max(40).regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/),
  public: z.boolean().optional().default(false),
});

export async function bucketRoutes(fastify: FastifyInstance) {
  // List user's buckets
  fastify.get('/buckets', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await query(
      `SELECT id, name, minio_bucket, is_public, size_bytes, object_count,
              created_at, updated_at
       FROM storage_buckets
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC`,
      [userId]
    );

    const buckets = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      bucket: row.minio_bucket,
      public: row.is_public,
      size_bytes: row.size_bytes,
      size_formatted: formatBytes(row.size_bytes),
      object_count: row.object_count,
      created_at: row.created_at,
    }));

    return { success: true, data: buckets };
  });

  // Create new bucket
  fastify.post('/buckets', async (request, reply) => {
    const userId = (request as any).userId;
    const body = createBucketSchema.parse(request.body);

    // Check user's plan limits
    const userPlan = await query(
      `SELECT p.limits FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC LIMIT 1`,
      [userId]
    );

    const limits = userPlan.rows[0]?.limits || config.planLimits.free;
    const maxBuckets = limits.max_buckets || 3;

    // Count existing buckets
    const countResult = await query(
      `SELECT COUNT(*) FROM storage_buckets
       WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    );
    const currentCount = parseInt(countResult.rows[0].count);

    if (maxBuckets !== -1 && currentCount >= maxBuckets) {
      return reply.status(403).send({
        success: false,
        error: 'Bucket limit reached',
        message: `Your plan allows ${maxBuckets} bucket(s). Please upgrade to create more.`,
      });
    }

    // Check if name is unique for this user
    const existingName = await query(
      `SELECT id FROM storage_buckets
       WHERE user_id = $1 AND name = $2 AND deleted_at IS NULL`,
      [userId, body.name]
    );

    if (existingName.rows.length > 0) {
      return reply.status(409).send({
        success: false,
        error: 'Name already exists',
        message: 'A bucket with this name already exists.',
      });
    }

    // Generate MinIO bucket name
    const minioBucket = generateBucketName(userId, body.name);

    // Check if bucket exists in MinIO
    if (await bucketExists(minioBucket)) {
      return reply.status(409).send({
        success: false,
        error: 'Bucket exists',
        message: 'A bucket with this name already exists in storage.',
      });
    }

    try {
      // Create bucket in MinIO
      await createBucket(minioBucket);

      // Set policy if public
      if (body.public) {
        await setBucketPolicy(minioBucket, 'public-read');
      }

      // Store in database
      const insertResult = await query(
        `INSERT INTO storage_buckets (user_id, name, minio_bucket, is_public)
         VALUES ($1, $2, $3, $4)
         RETURNING id, created_at`,
        [userId, body.name, minioBucket, body.public]
      );

      return reply.status(201).send({
        success: true,
        data: {
          id: insertResult.rows[0].id,
          name: body.name,
          bucket: minioBucket,
          public: body.public,
          endpoint: `https://storage.bunkercorpo.com/${minioBucket}`,
          created_at: insertResult.rows[0].created_at,
        },
      });
    } catch (error: any) {
      console.error('Failed to create bucket:', error);
      return reply.status(500).send({
        success: false,
        error: 'Creation failed',
        message: error.message,
      });
    }
  });

  // Get bucket details
  fastify.get('/buckets/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM storage_buckets
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: 'Not found',
        message: 'Bucket not found.',
      });
    }

    const row = result.rows[0];

    // Get current size from MinIO
    let currentSize = row.size_bytes;
    let objectCount = row.object_count;
    try {
      const objects = await listObjects(row.minio_bucket, '', true);
      currentSize = objects.reduce((total, obj) => total + (obj.size || 0), 0);
      objectCount = objects.length;

      // Update cached values
      await query(
        `UPDATE storage_buckets SET size_bytes = $1, object_count = $2, updated_at = NOW()
         WHERE id = $3`,
        [currentSize, objectCount, id]
      );
    } catch (error) {
      // Use cached values if MinIO fails
    }

    return {
      success: true,
      data: {
        id: row.id,
        name: row.name,
        bucket: row.minio_bucket,
        public: row.is_public,
        size_bytes: currentSize,
        size_formatted: formatBytes(currentSize),
        object_count: objectCount,
        endpoint: `https://storage.bunkercorpo.com/${row.minio_bucket}`,
        created_at: row.created_at,
        updated_at: row.updated_at,
      },
    };
  });

  // Update bucket (change visibility)
  fastify.patch('/buckets/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const { public: isPublic } = request.body as { public?: boolean };

    const result = await query(
      `SELECT minio_bucket FROM storage_buckets
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Not found' });
    }

    try {
      if (isPublic !== undefined) {
        await setBucketPolicy(result.rows[0].minio_bucket, isPublic ? 'public-read' : 'private');
        await query(
          `UPDATE storage_buckets SET is_public = $1, updated_at = NOW() WHERE id = $2`,
          [isPublic, id]
        );
      }

      return { success: true, message: 'Bucket updated.' };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete bucket
  fastify.delete('/buckets/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const { force } = request.query as { force?: string };

    const result = await query(
      `SELECT minio_bucket FROM storage_buckets
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Not found' });
    }

    const minioBucket = result.rows[0].minio_bucket;

    try {
      // Check if bucket has objects
      const objects = await listObjects(minioBucket, '', true);

      if (objects.length > 0 && force !== 'true') {
        return reply.status(400).send({
          success: false,
          error: 'Bucket not empty',
          message: `Bucket contains ${objects.length} object(s). Use ?force=true to delete anyway.`,
        });
      }

      // Delete all objects if force
      if (objects.length > 0) {
        const { deleteObjects } = await import('../lib/minio.js');
        await deleteObjects(minioBucket, objects.map(o => o.name));
      }

      // Delete bucket
      await deleteBucket(minioBucket);

      // Mark as deleted in database
      await query(
        `UPDATE storage_buckets SET deleted_at = NOW() WHERE id = $1`,
        [id]
      );

      return { success: true, message: 'Bucket deleted.' };
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get storage usage summary
  fastify.get('/storage/usage', async (request, reply) => {
    const userId = (request as any).userId;

    // Get user's plan limits
    const userPlan = await query(
      `SELECT p.limits FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC LIMIT 1`,
      [userId]
    );

    const limits = userPlan.rows[0]?.limits || config.planLimits.free;

    // Get total usage
    const usageResult = await query(
      `SELECT
         COUNT(*) as bucket_count,
         COALESCE(SUM(size_bytes), 0) as total_size,
         COALESCE(SUM(object_count), 0) as total_objects
       FROM storage_buckets
       WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    );

    const usage = usageResult.rows[0];

    return {
      success: true,
      data: {
        buckets: {
          used: parseInt(usage.bucket_count),
          limit: limits.max_buckets,
        },
        storage: {
          used_bytes: parseInt(usage.total_size),
          used_formatted: formatBytes(parseInt(usage.total_size)),
          limit_bytes: limits.storage_bytes,
          limit_formatted: formatBytes(limits.storage_bytes),
          percent_used: ((parseInt(usage.total_size) / limits.storage_bytes) * 100).toFixed(2),
        },
        objects: {
          count: parseInt(usage.total_objects),
        },
      },
    };
  });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
