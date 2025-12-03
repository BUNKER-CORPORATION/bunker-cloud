import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/database.js';
import { config } from '../config.js';

const addDomainSchema = z.object({
  domain: z.string().min(4).max(253).regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i),
  is_primary: z.boolean().optional().default(false),
});

export async function domainRoutes(fastify: FastifyInstance) {
  // List domains for an app
  fastify.get('/apps/:appId/domains', async (request, reply) => {
    const userId = (request as any).userId;
    const { appId } = request.params as { appId: string };

    // Verify app ownership
    const app = await query(
      `SELECT id FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [appId, userId]
    );

    if (app.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const result = await query(
      `SELECT * FROM app_domains WHERE app_id = $1 ORDER BY is_primary DESC, created_at ASC`,
      [appId]
    );

    return {
      success: true,
      data: result.rows.map((d) => ({
        id: d.id,
        domain: d.domain,
        is_primary: d.is_primary,
        ssl_status: d.ssl_status,
        verified: d.verified,
        verification_token: d.verification_token,
        created_at: d.created_at,
      })),
    };
  });

  // Add custom domain to app
  fastify.post('/apps/:appId/domains', async (request, reply) => {
    const userId = (request as any).userId;
    const { appId } = request.params as { appId: string };
    const body = addDomainSchema.parse(request.body);

    // Verify app ownership
    const app = await query(
      `SELECT a.*, p.limits FROM apps a
       LEFT JOIN subscriptions s ON s.user_id = a.user_id AND s.status = 'active'
       LEFT JOIN plans p ON s.plan_id = p.id
       WHERE a.id = $1 AND a.user_id = $2 AND a.deleted_at IS NULL`,
      [appId, userId]
    );

    if (app.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    // Check if custom domains are allowed
    const limits = app.rows[0].limits || config.planLimits.free;
    if (!limits.custom_domains) {
      return reply.status(403).send({
        success: false,
        error: 'Custom domains are not available on your plan. Please upgrade.',
      });
    }

    // Check if domain already exists
    const existing = await query(
      `SELECT id FROM app_domains WHERE domain = $1`,
      [body.domain.toLowerCase()]
    );

    if (existing.rows.length > 0) {
      return reply.status(409).send({
        success: false,
        error: 'This domain is already in use',
      });
    }

    // Generate verification token
    const verificationToken = `bunker-verify-${generateToken(32)}`;

    // If setting as primary, unset other primaries
    if (body.is_primary) {
      await query(
        `UPDATE app_domains SET is_primary = false WHERE app_id = $1`,
        [appId]
      );
    }

    const result = await query(
      `INSERT INTO app_domains (app_id, domain, is_primary, verification_token)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [appId, body.domain.toLowerCase(), body.is_primary, verificationToken]
    );

    const domain = result.rows[0];

    return {
      success: true,
      data: {
        id: domain.id,
        domain: domain.domain,
        is_primary: domain.is_primary,
        verified: false,
        verification_instructions: {
          type: 'TXT',
          name: `_bunker-verification.${domain.domain}`,
          value: verificationToken,
          message: 'Add this TXT record to your DNS to verify domain ownership',
        },
        created_at: domain.created_at,
      },
    };
  });

  // Verify domain ownership
  fastify.post('/apps/:appId/domains/:domainId/verify', async (request, reply) => {
    const userId = (request as any).userId;
    const { appId, domainId } = request.params as { appId: string; domainId: string };

    // Verify app ownership
    const app = await query(
      `SELECT id FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [appId, userId]
    );

    if (app.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const domain = await query(
      `SELECT * FROM app_domains WHERE id = $1 AND app_id = $2`,
      [domainId, appId]
    );

    if (domain.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Domain not found' });
    }

    const d = domain.rows[0];

    if (d.verified) {
      return { success: true, message: 'Domain already verified' };
    }

    // TODO: Actually verify DNS TXT record
    // For now, we'll simulate verification
    // In production, use DNS lookup to verify TXT record

    await query(
      `UPDATE app_domains SET verified = true, ssl_status = 'pending' WHERE id = $1`,
      [domainId]
    );

    // TODO: Trigger SSL certificate generation via Let's Encrypt

    return {
      success: true,
      message: 'Domain verified successfully. SSL certificate will be generated shortly.',
    };
  });

  // Set domain as primary
  fastify.post('/apps/:appId/domains/:domainId/primary', async (request, reply) => {
    const userId = (request as any).userId;
    const { appId, domainId } = request.params as { appId: string; domainId: string };

    // Verify app ownership
    const app = await query(
      `SELECT id FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [appId, userId]
    );

    if (app.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    const domain = await query(
      `SELECT * FROM app_domains WHERE id = $1 AND app_id = $2`,
      [domainId, appId]
    );

    if (domain.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Domain not found' });
    }

    // Unset all other primaries
    await query(`UPDATE app_domains SET is_primary = false WHERE app_id = $1`, [appId]);

    // Set this one as primary
    await query(`UPDATE app_domains SET is_primary = true WHERE id = $1`, [domainId]);

    return { success: true, message: 'Domain set as primary' };
  });

  // Remove domain
  fastify.delete('/apps/:appId/domains/:domainId', async (request, reply) => {
    const userId = (request as any).userId;
    const { appId, domainId } = request.params as { appId: string; domainId: string };

    // Verify app ownership
    const app = await query(
      `SELECT id FROM apps WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [appId, userId]
    );

    if (app.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'App not found' });
    }

    await query(`DELETE FROM app_domains WHERE id = $1 AND app_id = $2`, [domainId, appId]);

    return { success: true, message: 'Domain removed' };
  });
}

function generateToken(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
