import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { database } from '../lib/database.js';

// Validation schemas
const createOrgSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(1000).optional(),
});

const updateOrgSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  billingEmail: z.string().email().optional(),
});

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
});

interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

// Middleware to verify JWT
async function verifyAuth(app: FastifyInstance, request: any, reply: any) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing authorization header' },
    });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = app.jwt.verify<JWTPayload>(token);
    request.userId = decoded.userId;
  } catch {
    return reply.status(401).send({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
    });
  }
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50) + '-' + nanoid(6);
}

export async function organizationRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await verifyAuth(app, request, reply);
  });

  // ===========================================
  // LIST ORGANIZATIONS
  // ===========================================
  app.get('/', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await database.query(
      `SELECT o.id, o.name, o.slug, o.description, o.logo_url, o.created_at,
              om.role, u.name as owner_name, u.email as owner_email
       FROM organizations o
       JOIN organization_members om ON o.id = om.organization_id
       JOIN users u ON o.owner_id = u.id
       WHERE om.user_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return {
      success: true,
      data: result.rows.map((org) => ({
        id: org.id,
        name: org.name,
        slug: org.slug,
        description: org.description,
        logoUrl: org.logo_url,
        role: org.role,
        owner: {
          name: org.owner_name,
          email: org.owner_email,
        },
        createdAt: org.created_at,
      })),
    };
  });

  // ===========================================
  // CREATE ORGANIZATION
  // ===========================================
  app.post('/', async (request, reply) => {
    const userId = (request as any).userId;
    const body = createOrgSchema.parse(request.body);

    const slug = body.slug || generateSlug(body.name);

    // Check if slug exists
    const existing = await database.query('SELECT id FROM organizations WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return reply.status(409).send({
        success: false,
        error: { code: 'SLUG_EXISTS', message: 'Organization with this slug already exists' },
      });
    }

    // Create organization and add owner as member in transaction
    const result = await database.transaction(async (client) => {
      const orgResult = await client.query(
        `INSERT INTO organizations (name, slug, description, owner_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, slug, description, created_at`,
        [body.name, slug, body.description || null, userId]
      );

      const org = orgResult.rows[0];

      // Add owner as member with owner role
      await client.query(
        `INSERT INTO organization_members (organization_id, user_id, role, permissions)
         VALUES ($1, $2, 'owner', ARRAY['read', 'write', 'admin', 'billing'])`,
        [org.id, userId]
      );

      return org;
    });

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, organization_id, action, resource_type, resource_id, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, result.id, 'organization.created', 'organization', result.id, request.ip]
    );

    return {
      success: true,
      data: {
        id: result.id,
        name: result.name,
        slug: result.slug,
        description: result.description,
        createdAt: result.created_at,
      },
    };
  });

  // ===========================================
  // GET ORGANIZATION
  // ===========================================
  app.get('/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    // Check membership
    const memberCheck = await database.query(
      'SELECT role FROM organization_members WHERE organization_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You are not a member of this organization' },
      });
    }

    const result = await database.query(
      `SELECT o.*, u.name as owner_name, u.email as owner_email
       FROM organizations o
       JOIN users u ON o.owner_id = u.id
       WHERE o.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Organization not found' },
      });
    }

    const org = result.rows[0];

    return {
      success: true,
      data: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        description: org.description,
        logoUrl: org.logo_url,
        billingEmail: org.billing_email,
        settings: org.settings,
        owner: {
          id: org.owner_id,
          name: org.owner_name,
          email: org.owner_email,
        },
        myRole: memberCheck.rows[0].role,
        createdAt: org.created_at,
        updatedAt: org.updated_at,
      },
    };
  });

  // ===========================================
  // UPDATE ORGANIZATION
  // ===========================================
  app.put('/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const body = updateOrgSchema.parse(request.body);

    // Check if user is admin or owner
    const memberCheck = await database.query(
      'SELECT role FROM organization_members WHERE organization_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (memberCheck.rows.length === 0 || !['owner', 'admin'].includes(memberCheck.rows[0].role)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only admins can update the organization' },
      });
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (body.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(body.name);
    }
    if (body.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(body.description);
    }
    if (body.billingEmail !== undefined) {
      updates.push(`billing_email = $${paramIndex++}`);
      values.push(body.billingEmail);
    }

    if (updates.length === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'NO_UPDATES', message: 'No fields to update' },
      });
    }

    values.push(id);

    const result = await database.query(
      `UPDATE organizations SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING id, name, slug, description, billing_email, updated_at`,
      values
    );

    return {
      success: true,
      data: result.rows[0],
    };
  });

  // ===========================================
  // DELETE ORGANIZATION
  // ===========================================
  app.delete('/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    // Only owner can delete
    const ownerCheck = await database.query(
      'SELECT id FROM organizations WHERE id = $1 AND owner_id = $2',
      [id, userId]
    );

    if (ownerCheck.rows.length === 0) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only the owner can delete the organization' },
      });
    }

    await database.query('DELETE FROM organizations WHERE id = $1', [id]);

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, 'organization.deleted', 'organization', id, request.ip]
    );

    return {
      success: true,
      message: 'Organization deleted successfully',
    };
  });

  // ===========================================
  // LIST MEMBERS
  // ===========================================
  app.get('/:id/members', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    // Check membership
    const memberCheck = await database.query(
      'SELECT role FROM organization_members WHERE organization_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You are not a member of this organization' },
      });
    }

    const result = await database.query(
      `SELECT om.id, om.role, om.permissions, om.joined_at,
              u.id as user_id, u.email, u.name, u.avatar_url
       FROM organization_members om
       JOIN users u ON om.user_id = u.id
       WHERE om.organization_id = $1
       ORDER BY om.joined_at ASC`,
      [id]
    );

    return {
      success: true,
      data: result.rows.map((m) => ({
        id: m.id,
        role: m.role,
        permissions: m.permissions,
        joinedAt: m.joined_at,
        user: {
          id: m.user_id,
          email: m.email,
          name: m.name,
          avatarUrl: m.avatar_url,
        },
      })),
    };
  });

  // ===========================================
  // INVITE MEMBER
  // ===========================================
  app.post('/:id/members', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const body = inviteMemberSchema.parse(request.body);

    // Check if user is admin or owner
    const memberCheck = await database.query(
      'SELECT role FROM organization_members WHERE organization_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (memberCheck.rows.length === 0 || !['owner', 'admin'].includes(memberCheck.rows[0].role)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only admins can invite members' },
      });
    }

    // Check if user exists
    const userCheck = await database.query('SELECT id FROM users WHERE email = $1', [body.email.toLowerCase()]);

    if (userCheck.rows.length > 0) {
      // User exists, add them directly
      const invitedUserId = userCheck.rows[0].id;

      // Check if already a member
      const existingMember = await database.query(
        'SELECT id FROM organization_members WHERE organization_id = $1 AND user_id = $2',
        [id, invitedUserId]
      );

      if (existingMember.rows.length > 0) {
        return reply.status(409).send({
          success: false,
          error: { code: 'ALREADY_MEMBER', message: 'User is already a member of this organization' },
        });
      }

      await database.query(
        `INSERT INTO organization_members (organization_id, user_id, role, invited_by, invited_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [id, invitedUserId, body.role, userId]
      );

      return {
        success: true,
        message: 'Member added successfully',
      };
    } else {
      // User doesn't exist, create invitation
      const token = nanoid(32);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await database.query(
        `INSERT INTO organization_invitations (organization_id, email, role, token, invited_by, expires_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, body.email.toLowerCase(), body.role, token, userId, expiresAt]
      );

      // TODO: Send invitation email
      // await sendInvitationEmail(body.email, token, orgName);

      return {
        success: true,
        message: 'Invitation sent successfully',
      };
    }
  });

  // ===========================================
  // UPDATE MEMBER ROLE
  // ===========================================
  app.put('/:id/members/:memberId', async (request, reply) => {
    const userId = (request as any).userId;
    const { id, memberId } = request.params as { id: string; memberId: string };
    const { role } = request.body as { role: string };

    if (!['admin', 'member', 'viewer'].includes(role)) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_ROLE', message: 'Invalid role' },
      });
    }

    // Check if user is admin or owner
    const memberCheck = await database.query(
      'SELECT role FROM organization_members WHERE organization_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (memberCheck.rows.length === 0 || !['owner', 'admin'].includes(memberCheck.rows[0].role)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only admins can update member roles' },
      });
    }

    // Can't change owner's role
    const targetMember = await database.query(
      'SELECT role FROM organization_members WHERE id = $1 AND organization_id = $2',
      [memberId, id]
    );

    if (targetMember.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Member not found' },
      });
    }

    if (targetMember.rows[0].role === 'owner') {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: "Cannot change owner's role" },
      });
    }

    await database.query('UPDATE organization_members SET role = $1 WHERE id = $2', [role, memberId]);

    return {
      success: true,
      message: 'Member role updated successfully',
    };
  });

  // ===========================================
  // REMOVE MEMBER
  // ===========================================
  app.delete('/:id/members/:memberId', async (request, reply) => {
    const userId = (request as any).userId;
    const { id, memberId } = request.params as { id: string; memberId: string };

    // Check if user is admin or owner
    const memberCheck = await database.query(
      'SELECT role FROM organization_members WHERE organization_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (memberCheck.rows.length === 0 || !['owner', 'admin'].includes(memberCheck.rows[0].role)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only admins can remove members' },
      });
    }

    // Can't remove owner
    const targetMember = await database.query(
      'SELECT role, user_id FROM organization_members WHERE id = $1 AND organization_id = $2',
      [memberId, id]
    );

    if (targetMember.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Member not found' },
      });
    }

    if (targetMember.rows[0].role === 'owner') {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Cannot remove the owner' },
      });
    }

    await database.query('DELETE FROM organization_members WHERE id = $1', [memberId]);

    return {
      success: true,
      message: 'Member removed successfully',
    };
  });
}
