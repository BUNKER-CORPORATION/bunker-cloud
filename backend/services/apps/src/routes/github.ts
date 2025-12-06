import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/database.js';
import { deployApp, getAppContainer } from '../lib/docker.js';
import { config } from '../config.js';
import crypto from 'crypto';

const connectRepoSchema = z.object({
  repo_url: z.string().url().regex(/github\.com/),
  branch: z.string().default('main'),
  auto_deploy: z.boolean().default(true),
  dockerfile_path: z.string().default('Dockerfile'),
  build_context: z.string().default('.'),
});

const updateConnectionSchema = z.object({
  branch: z.string().optional(),
  auto_deploy: z.boolean().optional(),
  dockerfile_path: z.string().optional(),
  build_context: z.string().optional(),
});

// Parse GitHub repo URL to extract owner and repo
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace('.git', '') };
}

// Generate webhook secret
function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Verify GitHub webhook signature
function verifyGitHubSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function githubRoutes(fastify: FastifyInstance) {
  // Connect GitHub repo to an app
  fastify.post('/apps/:id/github/connect', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const body = connectRepoSchema.parse(request.body);

    // Verify app ownership
    const appResult = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (appResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const app = appResult.rows[0];

    // Parse repo URL
    const repoInfo = parseGitHubUrl(body.repo_url);
    if (!repoInfo) {
      return reply.status(400).send({ success: false, error: 'Invalid GitHub repository URL' });
    }

    // Check if already connected
    const existing = await query(
      `SELECT id FROM github_connections WHERE app_id = $1`,
      [id]
    );

    if (existing.rows.length > 0) {
      return reply.status(409).send({
        success: false,
        error: 'App already has a GitHub connection. Disconnect first.',
      });
    }

    // Generate webhook secret
    const webhookSecret = generateWebhookSecret();

    // Create connection
    const result = await query(
      `INSERT INTO github_connections
       (app_id, user_id, repo_owner, repo_name, repo_url, branch, auto_deploy, dockerfile_path, build_context, webhook_secret)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        id,
        userId,
        repoInfo.owner,
        repoInfo.repo,
        body.repo_url,
        body.branch,
        body.auto_deploy,
        body.dockerfile_path,
        body.build_context,
        webhookSecret,
      ]
    );

    const connection = result.rows[0];

    // Generate webhook URL
    const webhookUrl = `${config.webhookBaseUrl}/github/webhook/${connection.id}`;

    return {
      success: true,
      data: {
        id: connection.id,
        repo_owner: connection.repo_owner,
        repo_name: connection.repo_name,
        branch: connection.branch,
        auto_deploy: connection.auto_deploy,
        webhook_url: webhookUrl,
        webhook_secret: webhookSecret,
        setup_instructions: {
          step1: 'Go to your GitHub repository settings',
          step2: 'Navigate to Webhooks > Add webhook',
          step3: `Set Payload URL to: ${webhookUrl}`,
          step4: 'Set Content type to: application/json',
          step5: `Set Secret to: ${webhookSecret}`,
          step6: 'Select events: Push events (and optionally Pull request events)',
          step7: 'Click Add webhook',
        },
        created_at: connection.created_at,
      },
    };
  });

  // Get GitHub connection for an app
  fastify.get('/apps/:id/github', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    // Verify app ownership
    const appResult = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (appResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const result = await query(
      `SELECT * FROM github_connections WHERE app_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return { success: true, data: null };
    }

    const conn = result.rows[0];

    // Get recent deployments from GitHub
    const deployments = await query(
      `SELECT * FROM github_deployments WHERE connection_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [conn.id]
    );

    return {
      success: true,
      data: {
        id: conn.id,
        repo_owner: conn.repo_owner,
        repo_name: conn.repo_name,
        repo_url: conn.repo_url,
        branch: conn.branch,
        auto_deploy: conn.auto_deploy,
        dockerfile_path: conn.dockerfile_path,
        build_context: conn.build_context,
        webhook_url: `${config.webhookBaseUrl}/github/webhook/${conn.id}`,
        last_deployment: deployments.rows[0] || null,
        recent_deployments: deployments.rows,
        created_at: conn.created_at,
        updated_at: conn.updated_at,
      },
    };
  });

  // Update GitHub connection
  fastify.put('/apps/:id/github', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const body = updateConnectionSchema.parse(request.body);

    // Verify app ownership
    const appResult = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (appResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const result = await query(
      `UPDATE github_connections
       SET branch = COALESCE($1, branch),
           auto_deploy = COALESCE($2, auto_deploy),
           dockerfile_path = COALESCE($3, dockerfile_path),
           build_context = COALESCE($4, build_context),
           updated_at = NOW()
       WHERE app_id = $5
       RETURNING *`,
      [body.branch, body.auto_deploy, body.dockerfile_path, body.build_context, id]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'No GitHub connection found' });
    }

    const conn = result.rows[0];

    return {
      success: true,
      data: {
        id: conn.id,
        branch: conn.branch,
        auto_deploy: conn.auto_deploy,
        dockerfile_path: conn.dockerfile_path,
        build_context: conn.build_context,
        updated_at: conn.updated_at,
      },
    };
  });

  // Disconnect GitHub
  fastify.delete('/apps/:id/github', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    // Verify app ownership
    const appResult = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (appResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    await query(`DELETE FROM github_connections WHERE app_id = $1`, [id]);

    return { success: true, message: 'GitHub connection removed' };
  });

  // Trigger manual deployment from GitHub
  fastify.post('/apps/:id/github/deploy', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    // Verify app ownership
    const appResult = await query(
      `SELECT * FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    );

    if (appResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const app = appResult.rows[0];

    const connResult = await query(
      `SELECT * FROM github_connections WHERE app_id = $1`,
      [id]
    );

    if (connResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'No GitHub connection found' });
    }

    const conn = connResult.rows[0];

    // Start deployment in background
    triggerGitHubDeploy(app, conn, 'manual', null).catch(console.error);

    return {
      success: true,
      message: 'Deployment triggered',
      data: {
        repo: `${conn.repo_owner}/${conn.repo_name}`,
        branch: conn.branch,
      },
    };
  });

  // GitHub webhook endpoint (no auth required, uses signature verification)
  fastify.post('/github/webhook/:connectionId', {
    config: {
      rawBody: true,
    },
  }, async (request, reply) => {
    const { connectionId } = request.params as { connectionId: string };
    const signature = request.headers['x-hub-signature-256'] as string;
    const event = request.headers['x-github-event'] as string;
    const deliveryId = request.headers['x-github-delivery'] as string;

    if (!signature) {
      return reply.status(401).send({ success: false, error: 'Missing signature' });
    }

    // Get connection
    const connResult = await query(
      `SELECT gc.*, a.id as app_id, a.name as app_name, a.port, a.memory, a.cpus, a.health_check_path
       FROM github_connections gc
       JOIN apps a ON gc.app_id = a.id
       WHERE gc.id = $1`,
      [connectionId]
    );

    if (connResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Connection not found' });
    }

    const conn = connResult.rows[0];
    const rawBody = (request as any).rawBody || JSON.stringify(request.body);

    // Verify signature
    if (!verifyGitHubSignature(rawBody, signature, conn.webhook_secret)) {
      return reply.status(401).send({ success: false, error: 'Invalid signature' });
    }

    const payload = request.body as any;

    // Handle push events
    if (event === 'push') {
      const branch = payload.ref?.replace('refs/heads/', '');

      // Only deploy if it's the configured branch
      if (branch !== conn.branch) {
        return {
          success: true,
          message: `Ignored push to ${branch} (watching ${conn.branch})`,
        };
      }

      if (!conn.auto_deploy) {
        return {
          success: true,
          message: 'Auto-deploy is disabled for this connection',
        };
      }

      // Trigger deployment
      const app = {
        id: conn.app_id,
        name: conn.app_name,
        port: conn.port,
        memory: conn.memory,
        cpus: conn.cpus,
        health_check_path: conn.health_check_path,
      };

      triggerGitHubDeploy(app, conn, 'push', {
        commit_sha: payload.after,
        commit_message: payload.head_commit?.message,
        commit_author: payload.head_commit?.author?.name,
        delivery_id: deliveryId,
      }).catch(console.error);

      return {
        success: true,
        message: 'Deployment triggered',
        commit: payload.after?.substring(0, 7),
      };
    }

    // Handle ping events (webhook test)
    if (event === 'ping') {
      // Update connection to mark webhook as verified
      await query(
        `UPDATE github_connections SET webhook_verified = true, updated_at = NOW() WHERE id = $1`,
        [connectionId]
      );

      return {
        success: true,
        message: 'Webhook verified successfully',
        zen: payload.zen,
      };
    }

    return { success: true, message: `Event ${event} received but not processed` };
  });

  // List all GitHub connections for user
  fastify.get('/github/connections', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await query(
      `SELECT gc.*, a.name as app_name, a.status as app_status
       FROM github_connections gc
       JOIN apps a ON gc.app_id = a.id
       WHERE gc.user_id = $1 AND a.deleted_at IS NULL
       ORDER BY gc.created_at DESC`,
      [userId]
    );

    return {
      success: true,
      data: result.rows.map((conn) => ({
        id: conn.id,
        app_id: conn.app_id,
        app_name: conn.app_name,
        app_status: conn.app_status,
        repo_owner: conn.repo_owner,
        repo_name: conn.repo_name,
        branch: conn.branch,
        auto_deploy: conn.auto_deploy,
        webhook_verified: conn.webhook_verified,
        created_at: conn.created_at,
      })),
    };
  });
}

// Deploy from GitHub repository
async function triggerGitHubDeploy(
  app: any,
  conn: any,
  trigger: string,
  commitInfo: any
) {
  const deploymentId = crypto.randomUUID();

  // Record deployment start
  await query(
    `INSERT INTO github_deployments (id, connection_id, app_id, status, trigger, commit_sha, commit_message, commit_author)
     VALUES ($1, $2, $3, 'pending', $4, $5, $6, $7)`,
    [
      deploymentId,
      conn.id,
      app.id,
      trigger,
      commitInfo?.commit_sha,
      commitInfo?.commit_message,
      commitInfo?.commit_author,
    ]
  );

  try {
    // Update status to building
    await query(
      `UPDATE github_deployments SET status = 'building', started_at = NOW() WHERE id = $1`,
      [deploymentId]
    );

    // Build image from GitHub repo
    const imageTag = `bunker-app-${app.id}:${commitInfo?.commit_sha?.substring(0, 7) || Date.now()}`;
    const repoUrl = `https://github.com/${conn.repo_owner}/${conn.repo_name}.git#${conn.branch}`;

    // Use Docker buildx to build from git URL
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    // Build the image
    const buildCmd = `docker build -t ${imageTag} -f ${conn.dockerfile_path} ${repoUrl}`;
    await execAsync(buildCmd, { timeout: 600000 }); // 10 minute timeout

    // Update status to deploying
    await query(
      `UPDATE github_deployments SET status = 'deploying' WHERE id = $1`,
      [deploymentId]
    );

    // Deploy the new image
    const containerId = await deployApp({
      appId: app.id,
      name: app.name,
      image: imageTag,
      port: app.port,
      envVars: {},
      memory: app.memory,
      cpus: app.cpus,
      healthCheck: {
        path: app.health_check_path,
        interval: 30,
        timeout: 10,
      },
    });

    // Update app with new image
    await query(
      `UPDATE apps SET image = $1, status = 'running', updated_at = NOW() WHERE id = $2`,
      [imageTag, app.id]
    );

    // Record success
    await query(
      `UPDATE github_deployments
       SET status = 'success', completed_at = NOW(), container_id = $1, image_tag = $2
       WHERE id = $3`,
      [containerId, imageTag, deploymentId]
    );

    // Record in app_deployments too
    await query(
      `INSERT INTO app_deployments (app_id, image, status, container_id)
       VALUES ($1, $2, 'success', $3)`,
      [app.id, imageTag, containerId]
    );

    // Trigger webhook if configured
    await triggerWebhook(app.id, 'deployment.success', {
      app_id: app.id,
      app_name: app.name,
      deployment_id: deploymentId,
      image: imageTag,
      commit_sha: commitInfo?.commit_sha,
      trigger,
    });

  } catch (error: any) {
    // Record failure
    await query(
      `UPDATE github_deployments
       SET status = 'failed', completed_at = NOW(), error_message = $1
       WHERE id = $2`,
      [error.message, deploymentId]
    );

    await query(`UPDATE apps SET status = 'failed' WHERE id = $1`, [app.id]);

    // Trigger webhook for failure
    await triggerWebhook(app.id, 'deployment.failed', {
      app_id: app.id,
      app_name: app.name,
      deployment_id: deploymentId,
      error: error.message,
      commit_sha: commitInfo?.commit_sha,
      trigger,
    });
  }
}

// Placeholder for webhook trigger (will be implemented in webhooks.ts)
async function triggerWebhook(appId: string, event: string, payload: any) {
  // Import dynamically to avoid circular dependency
  try {
    const { dispatchWebhooks } = await import('./webhooks.js');
    await dispatchWebhooks(appId, event, payload);
  } catch {
    // Webhooks not available yet
  }
}
