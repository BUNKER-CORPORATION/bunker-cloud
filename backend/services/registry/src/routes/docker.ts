import { FastifyInstance } from 'fastify';
import { query } from '../lib/database.js';
import {
  uploadBlob,
  blobExists,
  getBlob,
  getBlobSize,
  uploadManifest,
  getManifest,
} from '../lib/storage.js';
import { config } from '../config.js';
import crypto from 'crypto';

// Docker Registry HTTP API V2
// See: https://docs.docker.com/registry/spec/api/

export async function dockerRoutes(fastify: FastifyInstance) {
  // Check if blob exists (HEAD)
  fastify.head('/v2/:namespace/:name/blobs/:digest', async (request, reply) => {
    const { namespace, name, digest } = request.params as {
      namespace: string;
      name: string;
      digest: string;
    };

    // Verify access
    const repo = await verifyRepoAccess(namespace, name, request, 'pull');
    if (!repo) {
      return reply.status(401).send({ errors: [{ code: 'UNAUTHORIZED' }] });
    }

    const exists = await blobExists(digest);
    if (!exists) {
      return reply.status(404).send({ errors: [{ code: 'BLOB_UNKNOWN' }] });
    }

    const size = await getBlobSize(digest);

    return reply
      .status(200)
      .header('Content-Length', size)
      .header('Docker-Content-Digest', digest)
      .send();
  });

  // Get blob
  fastify.get('/v2/:namespace/:name/blobs/:digest', async (request, reply) => {
    const { namespace, name, digest } = request.params as {
      namespace: string;
      name: string;
      digest: string;
    };

    // Verify access
    const repo = await verifyRepoAccess(namespace, name, request, 'pull');
    if (!repo) {
      return reply.status(401).send({ errors: [{ code: 'UNAUTHORIZED' }] });
    }

    const exists = await blobExists(digest);
    if (!exists) {
      return reply.status(404).send({ errors: [{ code: 'BLOB_UNKNOWN' }] });
    }

    const stream = await getBlob(digest);
    const size = await getBlobSize(digest);

    // Record pull
    await query(
      `UPDATE registry_repositories SET pull_count = pull_count + 1, updated_at = NOW() WHERE id = $1`,
      [repo.id]
    );

    return reply
      .status(200)
      .header('Content-Type', 'application/octet-stream')
      .header('Content-Length', size)
      .header('Docker-Content-Digest', digest)
      .send(stream);
  });

  // Start blob upload (POST)
  fastify.post('/v2/:namespace/:name/blobs/uploads/', async (request, reply) => {
    const { namespace, name } = request.params as { namespace: string; name: string };

    // Verify access
    const repo = await verifyRepoAccess(namespace, name, request, 'push');
    if (!repo) {
      return reply.status(401).send({ errors: [{ code: 'UNAUTHORIZED' }] });
    }

    // Generate upload UUID
    const uuid = crypto.randomUUID();

    // Store upload state
    await query(
      `INSERT INTO registry_uploads (id, repository_id, state)
       VALUES ($1, $2, 'uploading')`,
      [uuid, repo.id]
    );

    return reply
      .status(202)
      .header('Location', `/v2/${namespace}/${name}/blobs/uploads/${uuid}`)
      .header('Docker-Upload-UUID', uuid)
      .header('Range', '0-0')
      .send();
  });

  // Upload blob chunk (PATCH)
  fastify.patch('/v2/:namespace/:name/blobs/uploads/:uuid', async (request, reply) => {
    const { namespace, name, uuid } = request.params as {
      namespace: string;
      name: string;
      uuid: string;
    };

    // Verify access
    const repo = await verifyRepoAccess(namespace, name, request, 'push');
    if (!repo) {
      return reply.status(401).send({ errors: [{ code: 'UNAUTHORIZED' }] });
    }

    // Get upload state
    const upload = await query(`SELECT * FROM registry_uploads WHERE id = $1`, [uuid]);
    if (upload.rows.length === 0) {
      return reply.status(404).send({ errors: [{ code: 'BLOB_UPLOAD_UNKNOWN' }] });
    }

    // For simplicity, we'll accumulate chunks in memory
    // In production, stream directly to MinIO
    const chunks: Buffer[] = [];
    for await (const chunk of request.raw) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks);
    const currentOffset = upload.rows[0].size_bytes || 0;
    const newOffset = currentOffset + data.length;

    // Update upload state with accumulated data
    await query(
      `UPDATE registry_uploads SET size_bytes = $1, updated_at = NOW() WHERE id = $2`,
      [newOffset, uuid]
    );

    // Store chunk temporarily (in production, append to blob in storage)

    return reply
      .status(202)
      .header('Location', `/v2/${namespace}/${name}/blobs/uploads/${uuid}`)
      .header('Docker-Upload-UUID', uuid)
      .header('Range', `0-${newOffset - 1}`)
      .send();
  });

  // Complete blob upload (PUT)
  fastify.put('/v2/:namespace/:name/blobs/uploads/:uuid', async (request, reply) => {
    const { namespace, name, uuid } = request.params as {
      namespace: string;
      name: string;
      uuid: string;
    };
    const { digest } = request.query as { digest: string };

    // Verify access
    const repo = await verifyRepoAccess(namespace, name, request, 'push');
    if (!repo) {
      return reply.status(401).send({ errors: [{ code: 'UNAUTHORIZED' }] });
    }

    // Get final data chunk if any
    const chunks: Buffer[] = [];
    for await (const chunk of request.raw) {
      chunks.push(chunk);
    }
    const finalChunk = Buffer.concat(chunks);

    // Get upload
    const upload = await query(`SELECT * FROM registry_uploads WHERE id = $1`, [uuid]);
    if (upload.rows.length === 0) {
      return reply.status(404).send({ errors: [{ code: 'BLOB_UPLOAD_UNKNOWN' }] });
    }

    // Upload to storage (simplified - in production, finalize the chunked upload)
    await uploadBlob(digest, finalChunk, finalChunk.length);

    // Record layer
    await query(
      `INSERT INTO registry_layers (digest, size_bytes, repository_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (digest) DO NOTHING`,
      [digest, finalChunk.length, repo.id]
    );

    // Clean up upload state
    await query(`DELETE FROM registry_uploads WHERE id = $1`, [uuid]);

    return reply
      .status(201)
      .header('Location', `/v2/${namespace}/${name}/blobs/${digest}`)
      .header('Docker-Content-Digest', digest)
      .send();
  });

  // Check manifest exists (HEAD)
  fastify.head('/v2/:namespace/:name/manifests/:reference', async (request, reply) => {
    const { namespace, name, reference } = request.params as {
      namespace: string;
      name: string;
      reference: string;
    };

    // Verify access
    const repo = await verifyRepoAccess(namespace, name, request, 'pull');
    if (!repo) {
      return reply.status(401).send({ errors: [{ code: 'UNAUTHORIZED' }] });
    }

    const manifest = await getManifest(getRepoPath(repo), reference);
    if (!manifest) {
      return reply.status(404).send({ errors: [{ code: 'MANIFEST_UNKNOWN' }] });
    }

    return reply
      .status(200)
      .header('Content-Type', manifest.contentType)
      .header('Content-Length', manifest.data.length)
      .header('Docker-Content-Digest', manifest.digest)
      .send();
  });

  // Get manifest
  fastify.get('/v2/:namespace/:name/manifests/:reference', async (request, reply) => {
    const { namespace, name, reference } = request.params as {
      namespace: string;
      name: string;
      reference: string;
    };

    // Verify access
    const repo = await verifyRepoAccess(namespace, name, request, 'pull');
    if (!repo) {
      return reply.status(401).send({ errors: [{ code: 'UNAUTHORIZED' }] });
    }

    const manifest = await getManifest(getRepoPath(repo), reference);
    if (!manifest) {
      return reply.status(404).send({ errors: [{ code: 'MANIFEST_UNKNOWN' }] });
    }

    // Record pull
    await query(
      `UPDATE registry_repositories SET pull_count = pull_count + 1, updated_at = NOW() WHERE id = $1`,
      [repo.id]
    );

    return reply
      .status(200)
      .header('Content-Type', manifest.contentType)
      .header('Docker-Content-Digest', manifest.digest)
      .send(manifest.data);
  });

  // Put manifest
  fastify.put('/v2/:namespace/:name/manifests/:reference', async (request, reply) => {
    const { namespace, name, reference } = request.params as {
      namespace: string;
      name: string;
      reference: string;
    };

    // Verify access
    const repo = await verifyRepoAccess(namespace, name, request, 'push');
    if (!repo) {
      return reply.status(401).send({ errors: [{ code: 'UNAUTHORIZED' }] });
    }

    const contentType = request.headers['content-type'] || 'application/vnd.docker.distribution.manifest.v2+json';

    // Get manifest data
    const chunks: Buffer[] = [];
    for await (const chunk of request.raw) {
      chunks.push(chunk);
    }
    const manifestData = Buffer.concat(chunks).toString('utf-8');

    // Parse manifest to get config and layers
    let manifestJson: any;
    try {
      manifestJson = JSON.parse(manifestData);
    } catch {
      return reply.status(400).send({ errors: [{ code: 'MANIFEST_INVALID' }] });
    }

    // Calculate size from layers
    let totalSize = manifestData.length;
    if (manifestJson.layers) {
      for (const layer of manifestJson.layers) {
        totalSize += layer.size || 0;
      }
    }

    // Upload manifest
    const digest = await uploadManifest(getRepoPath(repo), reference, manifestData, contentType);

    // Record manifest in database
    const manifestResult = await query(
      `INSERT INTO registry_manifests (repository_id, digest, content_type, size_bytes)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (repository_id, digest) DO UPDATE SET updated_at = NOW()
       RETURNING id`,
      [repo.id, digest, contentType, totalSize]
    );

    // Create/update tag if reference is a tag (not a digest)
    if (!reference.startsWith('sha256:')) {
      await query(
        `INSERT INTO registry_tags (repository_id, name, manifest_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (repository_id, name) DO UPDATE SET manifest_id = $3, updated_at = NOW()`,
        [repo.id, reference, manifestResult.rows[0].id]
      );
    }

    // Record push
    await query(
      `UPDATE registry_repositories SET push_count = push_count + 1, updated_at = NOW() WHERE id = $1`,
      [repo.id]
    );

    return reply
      .status(201)
      .header('Location', `/v2/${namespace}/${name}/manifests/${reference}`)
      .header('Docker-Content-Digest', digest)
      .send();
  });

  // List tags
  fastify.get('/v2/:namespace/:name/tags/list', async (request, reply) => {
    const { namespace, name } = request.params as { namespace: string; name: string };
    const { n = '100', last } = request.query as { n?: string; last?: string };

    // Verify access
    const repo = await verifyRepoAccess(namespace, name, request, 'pull');
    if (!repo) {
      return reply.status(401).send({ errors: [{ code: 'UNAUTHORIZED' }] });
    }

    let tagsQuery = `SELECT name FROM registry_tags WHERE repository_id = $1`;
    const params: any[] = [repo.id];

    if (last) {
      tagsQuery += ` AND name > $2`;
      params.push(last);
    }

    tagsQuery += ` ORDER BY name LIMIT $${params.length + 1}`;
    params.push(parseInt(n));

    const result = await query(tagsQuery, params);

    return {
      name: `${namespace}/${name}`,
      tags: result.rows.map((r) => r.name),
    };
  });

  // Catalog (list all repositories)
  fastify.get('/v2/_catalog', async (request, reply) => {
    const { n = '100', last } = request.query as { n?: string; last?: string };

    // For catalog, only show public repos or repos the user has access to
    const userId = (request as any).userId;

    let reposQuery = `
      SELECT namespace || '/' || name as full_name
      FROM registry_repositories
      WHERE deleted_at IS NULL AND (visibility = 'public'${userId ? ` OR user_id = '${userId}'` : ''})
    `;

    if (last) {
      reposQuery += ` AND namespace || '/' || name > '${last}'`;
    }

    reposQuery += ` ORDER BY full_name LIMIT ${parseInt(n)}`;

    const result = await query(reposQuery, []);

    return {
      repositories: result.rows.map((r) => r.full_name),
    };
  });
}

// Helper functions
function getRepoPath(repo: any): string {
  return `${repo.namespace}/${repo.name}`;
}

async function verifyRepoAccess(
  namespace: string,
  name: string,
  request: any,
  action: 'pull' | 'push'
): Promise<any | null> {
  // Check for token auth
  const authHeader = request.headers.authorization;

  // Find repository
  const result = await query(
    `SELECT * FROM registry_repositories WHERE namespace = $1 AND name = $2 AND deleted_at IS NULL`,
    [namespace, name]
  );

  if (result.rows.length === 0) {
    // Auto-create repository on first push if authenticated
    if (action === 'push' && authHeader) {
      // Verify user auth
      const userId = (request as any).userId;
      if (!userId) return null;

      // Get user namespace
      const userResult = await query(`SELECT email FROM users WHERE id = $1`, [userId]);
      if (userResult.rows.length === 0) return null;

      const userNamespace = userResult.rows[0].email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      if (userNamespace !== namespace) return null;

      // Create repository
      const newRepo = await query(
        `INSERT INTO registry_repositories (user_id, namespace, name, visibility)
         VALUES ($1, $2, $3, 'private')
         RETURNING *`,
        [userId, namespace, name]
      );

      return newRepo.rows[0];
    }
    return null;
  }

  const repo = result.rows[0];

  // Public repos allow pull without auth
  if (action === 'pull' && repo.visibility === 'public') {
    return repo;
  }

  // Check auth
  if (!authHeader) return null;

  // Check if it's a registry token
  if (authHeader.startsWith('Basic ')) {
    const credentials = Buffer.from(authHeader.substring(6), 'base64').toString();
    const [username, password] = credentials.split(':');

    // Check registry token
    const tokenHash = crypto.createHash('sha256').update(password).digest('hex');
    const tokenResult = await query(
      `SELECT * FROM registry_tokens
       WHERE repository_id = $1 AND token_hash = $2
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [repo.id, tokenHash]
    );

    if (tokenResult.rows.length > 0) {
      const token = tokenResult.rows[0];
      const permissions = token.permissions as string[];

      if (permissions.includes(action)) {
        // Update last used
        await query(`UPDATE registry_tokens SET last_used_at = NOW() WHERE id = $1`, [token.id]);
        return repo;
      }
    }
  }

  // Check JWT auth (from regular API auth)
  const userId = (request as any).userId;
  if (userId && repo.user_id === userId) {
    return repo;
  }

  return null;
}
