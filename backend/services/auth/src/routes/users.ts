import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { database } from '../lib/database.js';
import { config } from '../config.js';

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  avatarUrl: z.string().url().max(500).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8).max(128),
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

export async function userRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await verifyAuth(app, request, reply);
  });

  // ===========================================
  // GET USER PROFILE
  // ===========================================
  app.get('/me', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await database.query(
      `SELECT id, email, name, avatar_url, email_verified, two_factor_enabled, status, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }

    const user = result.rows[0];

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        emailVerified: user.email_verified,
        twoFactorEnabled: user.two_factor_enabled,
        status: user.status,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    };
  });

  // ===========================================
  // UPDATE USER PROFILE
  // ===========================================
  app.put('/me', async (request, reply) => {
    const userId = (request as any).userId;
    const body = updateProfileSchema.parse(request.body);

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (body.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(body.name);
    }
    if (body.avatarUrl !== undefined) {
      updates.push(`avatar_url = $${paramIndex++}`);
      values.push(body.avatarUrl);
    }

    if (updates.length === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'NO_UPDATES', message: 'No fields to update' },
      });
    }

    values.push(userId);

    const result = await database.query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING id, email, name, avatar_url, updated_at`,
      values
    );

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, ip_address, details)
       VALUES ($1, $2, $3, $4)`,
      [userId, 'user.profile_updated', request.ip, JSON.stringify(body)]
    );

    return {
      success: true,
      data: result.rows[0],
    };
  });

  // ===========================================
  // CHANGE PASSWORD
  // ===========================================
  app.post('/me/change-password', async (request, reply) => {
    const userId = (request as any).userId;
    const body = changePasswordSchema.parse(request.body);

    // Get current password hash
    const result = await database.query('SELECT password_hash FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(body.currentPassword, result.rows[0].password_hash);

    if (!passwordValid) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_PASSWORD', message: 'Current password is incorrect' },
      });
    }

    // Check new password is different
    const samePassword = await bcrypt.compare(body.newPassword, result.rows[0].password_hash);
    if (samePassword) {
      return reply.status(400).send({
        success: false,
        error: { code: 'SAME_PASSWORD', message: 'New password must be different from current password' },
      });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(body.newPassword, config.bcrypt.rounds);

    // Update password
    await database.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      newPasswordHash,
      userId,
    ]);

    // Invalidate all other sessions
    await database.query(
      `UPDATE sessions SET is_valid = FALSE
       WHERE user_id = $1 AND id != (SELECT id FROM sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1)`,
      [userId]
    );

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, ip_address)
       VALUES ($1, $2, $3)`,
      [userId, 'user.password_changed', request.ip]
    );

    return {
      success: true,
      message: 'Password changed successfully',
    };
  });

  // ===========================================
  // GET SESSIONS
  // ===========================================
  app.get('/me/sessions', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await database.query(
      `SELECT id, ip_address, user_agent, device_info, last_activity_at, created_at
       FROM sessions
       WHERE user_id = $1 AND is_valid = TRUE AND expires_at > NOW()
       ORDER BY last_activity_at DESC`,
      [userId]
    );

    return {
      success: true,
      data: result.rows.map((s) => ({
        id: s.id,
        ipAddress: s.ip_address,
        userAgent: s.user_agent,
        deviceInfo: s.device_info,
        lastActivityAt: s.last_activity_at,
        createdAt: s.created_at,
      })),
    };
  });

  // ===========================================
  // REVOKE SESSION
  // ===========================================
  app.delete('/me/sessions/:sessionId', async (request, reply) => {
    const userId = (request as any).userId;
    const { sessionId } = request.params as { sessionId: string };

    const result = await database.query(
      'UPDATE sessions SET is_valid = FALSE WHERE id = $1 AND user_id = $2 RETURNING id',
      [sessionId, userId]
    );

    if (result.rowCount === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Session not found' },
      });
    }

    return {
      success: true,
      message: 'Session revoked successfully',
    };
  });

  // ===========================================
  // REVOKE ALL OTHER SESSIONS
  // ===========================================
  app.post('/me/sessions/revoke-all', async (request, reply) => {
    const userId = (request as any).userId;

    // Keep only the most recent session (current one)
    await database.query(
      `UPDATE sessions SET is_valid = FALSE
       WHERE user_id = $1 AND id != (SELECT id FROM sessions WHERE user_id = $1 AND is_valid = TRUE ORDER BY created_at DESC LIMIT 1)`,
      [userId]
    );

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, ip_address)
       VALUES ($1, $2, $3)`,
      [userId, 'user.sessions_revoked', request.ip]
    );

    return {
      success: true,
      message: 'All other sessions revoked successfully',
    };
  });

  // ===========================================
  // GET AUDIT LOG
  // ===========================================
  app.get('/me/audit-log', async (request, reply) => {
    const userId = (request as any).userId;
    const { limit = 50, offset = 0 } = request.query as { limit?: number; offset?: number };

    const result = await database.query(
      `SELECT id, action, resource_type, resource_id, ip_address, details, created_at
       FROM audit_logs
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, Math.min(limit, 100), offset]
    );

    const countResult = await database.query('SELECT COUNT(*) FROM audit_logs WHERE user_id = $1', [userId]);

    return {
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count, 10),
        limit,
        offset,
      },
    };
  });

  // ===========================================
  // DELETE ACCOUNT
  // ===========================================
  app.delete('/me', async (request, reply) => {
    const userId = (request as any).userId;
    const { password } = request.body as { password: string };

    if (!password) {
      return reply.status(400).send({
        success: false,
        error: { code: 'MISSING_PASSWORD', message: 'Password is required to delete account' },
      });
    }

    // Verify password
    const result = await database.query('SELECT password_hash FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }

    const passwordValid = await bcrypt.compare(password, result.rows[0].password_hash);

    if (!passwordValid) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_PASSWORD', message: 'Password is incorrect' },
      });
    }

    // Check if user owns any organizations
    const orgCheck = await database.query('SELECT COUNT(*) FROM organizations WHERE owner_id = $1', [userId]);

    if (parseInt(orgCheck.rows[0].count, 10) > 0) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'OWNS_ORGANIZATIONS',
          message: 'Please transfer ownership of your organizations before deleting your account',
        },
      });
    }

    // Soft delete - mark as deleted instead of removing
    await database.query(
      `UPDATE users SET status = 'deleted', email = CONCAT('deleted_', id, '_', email), updated_at = NOW()
       WHERE id = $1`,
      [userId]
    );

    // Invalidate all sessions
    await database.query('UPDATE sessions SET is_valid = FALSE WHERE user_id = $1', [userId]);

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, ip_address)
       VALUES ($1, $2, $3)`,
      [userId, 'user.account_deleted', request.ip]
    );

    return {
      success: true,
      message: 'Account deleted successfully',
    };
  });
}
