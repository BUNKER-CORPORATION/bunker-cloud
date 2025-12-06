import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/database.js';
import { config } from '../config.js';

const createRepoSchema = z.object({
  name: z.string().min(2).max(128).regex(/^[a-z0-9][a-z0-9._-]*[a-z0-9]$/),
  description: z.string().max(500).optional(),
  visibility: z.enum(['public', 'private']).default('private'),
});

const updateRepoSchema = z.object({
  description: z.string().max(500).optional(),
  visibility: z.enum(['public', 'private']).optional(),
});

export async function repositoryRoutes(fastify: FastifyInstance) {
  // List repositories
  fastify.get('/repositories', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await query(
      `SELECT r.*,
              (SELECT COUNT(*) FROM registry_tags t WHERE t.repository_id = r.id) as tag_count,
              (SELECT SUM(size_bytes) FROM registry_layers l
               JOIN registry_manifest_layers ml ON l.id = ml.layer_id
               JOIN registry_manifests m ON ml.manifest_id = m.id
               WHERE m.repository_id = r.id) as total_size
       FROM registry_repositories r
       WHERE r.user_id = $1 AND r.deleted_at IS NULL
       ORDER BY r.updated_at DESC`,
      [userId]
    );

    return {
      success: true,
      data: result.rows.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: `${repo.namespace}/${repo.name}`,
        description: repo.description,
        visibility: repo.visibility,
        tag_count: parseInt(repo.tag_count) || 0,
        size_bytes: parseInt(repo.total_size) || 0,
        pull_count: repo.pull_count,
        push_count: repo.push_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
      })),
    };
  });

  // Get repository details
  fastify.get('/repositories/:name', async (request, reply) => {
    const userId = (request as any).userId;
    const { name } = request.params as { name: string };

    const result = await query(
      `SELECT * FROM registry_repositories
       WHERE (user_id = $1 OR visibility = 'public') AND name = $2 AND deleted_at IS NULL`,
      [userId, name]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Repository not found' });
    }

    const repo = result.rows[0];

    // Get tags
    const tags = await query(
      `SELECT t.*, m.digest, m.size_bytes
       FROM registry_tags t
       JOIN registry_manifests m ON t.manifest_id = m.id
       WHERE t.repository_id = $1
       ORDER BY t.updated_at DESC`,
      [repo.id]
    );

    return {
      success: true,
      data: {
        id: repo.id,
        name: repo.name,
        full_name: `${repo.namespace}/${repo.name}`,
        description: repo.description,
        visibility: repo.visibility,
        pull_count: repo.pull_count,
        push_count: repo.push_count,
        tags: tags.rows.map((tag) => ({
          name: tag.name,
          digest: tag.digest,
          size_bytes: parseInt(tag.size_bytes),
          created_at: tag.created_at,
          updated_at: tag.updated_at,
        })),
        created_at: repo.created_at,
        updated_at: repo.updated_at,
      },
    };
  });

  // Create repository
  fastify.post('/repositories', async (request, reply) => {
    const userId = (request as any).userId;
    const body = createRepoSchema.parse(request.body);

    // Check plan limits
    const limits = await getUserLimits(userId);

    if (!limits.private_repos && body.visibility === 'private') {
      return reply.status(403).send({
        success: false,
        error: 'Private repositories are not available on your plan',
      });
    }

    const count = await query(
      `SELECT COUNT(*) FROM registry_repositories WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    );

    if (limits.max_repositories !== -1 && parseInt(count.rows[0].count) >= limits.max_repositories) {
      return reply.status(403).send({
        success: false,
        error: `Repository limit reached. Your plan allows ${limits.max_repositories} repositories.`,
      });
    }

    // Get user namespace
    const userResult = await query(`SELECT email FROM users WHERE id = $1`, [userId]);
    const namespace = userResult.rows[0].email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check uniqueness
    const existing = await query(
      `SELECT id FROM registry_repositories WHERE namespace = $1 AND name = $2 AND deleted_at IS NULL`,
      [namespace, body.name]
    );

    if (existing.rows.length > 0) {
      return reply.status(409).send({
        success: false,
        error: 'A repository with this name already exists',
      });
    }

    const result = await query(
      `INSERT INTO registry_repositories (user_id, namespace, name, description, visibility)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, namespace, body.name, body.description, body.visibility]
    );

    const repo = result.rows[0];

    return {
      success: true,
      data: {
        id: repo.id,
        name: repo.name,
        full_name: `${repo.namespace}/${repo.name}`,
        registry_url: `${config.baseDomain}/${repo.namespace}/${repo.name}`,
        visibility: repo.visibility,
        created_at: repo.created_at,
      },
    };
  });

  // Update repository
  fastify.put('/repositories/:name', async (request, reply) => {
    const userId = (request as any).userId;
    const { name } = request.params as { name: string };
    const body = updateRepoSchema.parse(request.body);

    // Check private repo permission
    if (body.visibility === 'private') {
      const limits = await getUserLimits(userId);
      if (!limits.private_repos) {
        return reply.status(403).send({
          success: false,
          error: 'Private repositories are not available on your plan',
        });
      }
    }

    const result = await query(
      `UPDATE registry_repositories
       SET description = COALESCE($1, description),
           visibility = COALESCE($2, visibility),
           updated_at = NOW()
       WHERE user_id = $3 AND name = $4 AND deleted_at IS NULL
       RETURNING *`,
      [body.description, body.visibility, userId, name]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Repository not found' });
    }

    return {
      success: true,
      data: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        description: result.rows[0].description,
        visibility: result.rows[0].visibility,
        updated_at: result.rows[0].updated_at,
      },
    };
  });

  // Delete repository
  fastify.delete('/repositories/:name', async (request, reply) => {
    const userId = (request as any).userId;
    const { name } = request.params as { name: string };

    const result = await query(
      `UPDATE registry_repositories
       SET deleted_at = NOW()
       WHERE user_id = $1 AND name = $2 AND deleted_at IS NULL
       RETURNING id`,
      [userId, name]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Repository not found' });
    }

    // Note: In production, schedule background job to clean up blobs

    return { success: true, message: 'Repository deleted' };
  });

  // Delete tag
  fastify.delete('/repositories/:name/tags/:tag', async (request, reply) => {
    const userId = (request as any).userId;
    const { name, tag } = request.params as { name: string; tag: string };

    // Find repository
    const repoResult = await query(
      `SELECT id FROM registry_repositories WHERE user_id = $1 AND name = $2 AND deleted_at IS NULL`,
      [userId, name]
    );

    if (repoResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Repository not found' });
    }

    const repoId = repoResult.rows[0].id;

    const result = await query(
      `DELETE FROM registry_tags WHERE repository_id = $1 AND name = $2 RETURNING id`,
      [repoId, tag]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Tag not found' });
    }

    return { success: true, message: 'Tag deleted' };
  });

  // Get repository access tokens
  fastify.get('/repositories/:name/tokens', async (request, reply) => {
    const userId = (request as any).userId;
    const { name } = request.params as { name: string };

    // Find repository
    const repoResult = await query(
      `SELECT id FROM registry_repositories WHERE user_id = $1 AND name = $2 AND deleted_at IS NULL`,
      [userId, name]
    );

    if (repoResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Repository not found' });
    }

    const tokens = await query(
      `SELECT id, name, permissions, last_used_at, expires_at, created_at
       FROM registry_tokens
       WHERE repository_id = $1 AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC`,
      [repoResult.rows[0].id]
    );

    return {
      success: true,
      data: tokens.rows,
    };
  });

  // Create repository access token
  fastify.post('/repositories/:name/tokens', async (request, reply) => {
    const userId = (request as any).userId;
    const { name } = request.params as { name: string };
    const body = z.object({
      name: z.string().min(1).max(64),
      permissions: z.array(z.enum(['pull', 'push'])).min(1),
      expires_in_days: z.number().min(1).max(365).optional(),
    }).parse(request.body);

    // Find repository
    const repoResult = await query(
      `SELECT id FROM registry_repositories WHERE user_id = $1 AND name = $2 AND deleted_at IS NULL`,
      [userId, name]
    );

    if (repoResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Repository not found' });
    }

    const repoId = repoResult.rows[0].id;
    const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '');
    const expiresAt = body.expires_in_days
      ? new Date(Date.now() + body.expires_in_days * 24 * 60 * 60 * 1000)
      : null;

    const result = await query(
      `INSERT INTO registry_tokens (repository_id, user_id, name, token_hash, permissions, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, permissions, expires_at, created_at`,
      [repoId, userId, body.name, hashToken(token), JSON.stringify(body.permissions), expiresAt]
    );

    return {
      success: true,
      data: {
        ...result.rows[0],
        token, // Only returned once
      },
    };
  });

  // Revoke token
  fastify.delete('/repositories/:name/tokens/:tokenId', async (request, reply) => {
    const userId = (request as any).userId;
    const { name, tokenId } = request.params as { name: string; tokenId: string };

    // Find repository
    const repoResult = await query(
      `SELECT id FROM registry_repositories WHERE user_id = $1 AND name = $2 AND deleted_at IS NULL`,
      [userId, name]
    );

    if (repoResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Repository not found' });
    }

    await query(`DELETE FROM registry_tokens WHERE id = $1 AND repository_id = $2`, [
      tokenId,
      repoResult.rows[0].id,
    ]);

    return { success: true, message: 'Token revoked' };
  });
}

// Hash token for storage
import crypto from 'crypto';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Helper function
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
