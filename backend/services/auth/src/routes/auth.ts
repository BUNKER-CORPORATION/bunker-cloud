import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { database } from '../lib/database.js';
import { redis } from '../lib/redis.js';
import { config } from '../config.js';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(255).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8).max(128),
});

// Types
interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  email_verified: boolean;
  two_factor_enabled: boolean;
  status: string;
  failed_login_attempts: number;
  locked_until: string | null;
}

interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export async function authRoutes(app: FastifyInstance) {
  // ===========================================
  // REGISTER
  // ===========================================
  app.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);

    // Check if user exists
    const existingUser = await database.query<User>(
      'SELECT id FROM users WHERE email = $1',
      [body.email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return reply.status(409).send({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'An account with this email already exists',
        },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(body.password, config.bcrypt.rounds);

    // Generate email verification token
    const verificationToken = nanoid(32);
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const result = await database.query<User>(
      `INSERT INTO users (email, password_hash, name, email_verification_token, email_verification_expires)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, email_verified, status, created_at`,
      [body.email.toLowerCase(), passwordHash, body.name || null, verificationToken, verificationExpires]
    );

    const user = result.rows[0];

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, verificationToken);

    // Generate tokens
    const accessToken = app.jwt.sign(
      { userId: user.id, email: user.email, type: 'access' } as JWTPayload,
      { expiresIn: config.jwt.accessExpiresIn }
    );

    const refreshToken = nanoid(64);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // Store refresh token
    await database.query(
      `INSERT INTO sessions (user_id, refresh_token_hash, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        refreshTokenHash,
        request.ip,
        request.headers['user-agent'] || null,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ]
    );

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, ip_address, user_agent, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, 'user.registered', request.ip, request.headers['user-agent'], '{}']
    );

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.email_verified,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: config.jwt.accessExpiresIn,
        },
      },
    };
  });

  // ===========================================
  // LOGIN
  // ===========================================
  app.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    // Find user
    const result = await database.query<User>(
      `SELECT id, email, password_hash, name, email_verified, two_factor_enabled, status,
              failed_login_attempts, locked_until
       FROM users WHERE email = $1`,
      [body.email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    const user = result.rows[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return reply.status(423).send({
        success: false,
        error: {
          code: 'ACCOUNT_LOCKED',
          message: 'Account is temporarily locked. Please try again later.',
        },
      });
    }

    // Check if account is suspended
    if (user.status !== 'active') {
      return reply.status(403).send({
        success: false,
        error: {
          code: 'ACCOUNT_SUSPENDED',
          message: 'Your account has been suspended',
        },
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(body.password, user.password_hash);

    if (!passwordValid) {
      // Increment failed attempts
      const failedAttempts = (user.failed_login_attempts || 0) + 1;
      const lockUntil = failedAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await database.query(
        `UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3`,
        [failedAttempts, lockUntil, user.id]
      );

      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Reset failed attempts on successful login
    await database.query(
      `UPDATE users SET failed_login_attempts = 0, locked_until = NULL,
       last_login_at = NOW(), last_login_ip = $1 WHERE id = $2`,
      [request.ip, user.id]
    );

    // Check for 2FA
    if (user.two_factor_enabled) {
      // Create temporary session for 2FA verification
      const twoFactorToken = nanoid(32);
      await redis.set(`2fa:${twoFactorToken}`, user.id, 300); // 5 minutes

      return {
        success: true,
        data: {
          requiresTwoFactor: true,
          twoFactorToken,
        },
      };
    }

    // Generate tokens
    const accessToken = app.jwt.sign(
      { userId: user.id, email: user.email, type: 'access' } as JWTPayload,
      { expiresIn: config.jwt.accessExpiresIn }
    );

    const refreshToken = nanoid(64);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // Store session
    await database.query(
      `INSERT INTO sessions (user_id, refresh_token_hash, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        refreshTokenHash,
        request.ip,
        request.headers['user-agent'] || null,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ]
    );

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, ip_address, user_agent)
       VALUES ($1, $2, $3, $4)`,
      [user.id, 'user.login', request.ip, request.headers['user-agent']]
    );

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.email_verified,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: config.jwt.accessExpiresIn,
        },
      },
    };
  });

  // ===========================================
  // REFRESH TOKEN
  // ===========================================
  app.post('/refresh', async (request, reply) => {
    const body = refreshSchema.parse(request.body);

    // Find valid sessions
    const sessions = await database.query(
      `SELECT id, user_id, refresh_token_hash FROM sessions
       WHERE expires_at > NOW() AND is_valid = TRUE`,
      []
    );

    // Find matching session
    let validSession = null;
    for (const session of sessions.rows) {
      const isValid = await bcrypt.compare(body.refreshToken, session.refresh_token_hash);
      if (isValid) {
        validSession = session;
        break;
      }
    }

    if (!validSession) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired refresh token',
        },
      });
    }

    // Get user
    const userResult = await database.query<User>(
      'SELECT id, email, name, status FROM users WHERE id = $1',
      [validSession.user_id]
    );

    if (userResult.rows.length === 0 || userResult.rows[0].status !== 'active') {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found or inactive',
        },
      });
    }

    const user = userResult.rows[0];

    // Generate new tokens
    const accessToken = app.jwt.sign(
      { userId: user.id, email: user.email, type: 'access' } as JWTPayload,
      { expiresIn: config.jwt.accessExpiresIn }
    );

    const newRefreshToken = nanoid(64);
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    // Update session with new refresh token
    await database.query(
      `UPDATE sessions SET refresh_token_hash = $1, last_activity_at = NOW() WHERE id = $2`,
      [newRefreshTokenHash, validSession.id]
    );

    return {
      success: true,
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn: config.jwt.accessExpiresIn,
        },
      },
    };
  });

  // ===========================================
  // LOGOUT
  // ===========================================
  app.post('/logout', async (request, reply) => {
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

      // Invalidate all sessions for this user (optional: could invalidate just current session)
      await database.query(
        'UPDATE sessions SET is_valid = FALSE WHERE user_id = $1',
        [decoded.userId]
      );

      // Log audit event
      await database.query(
        `INSERT INTO audit_logs (user_id, action, ip_address, user_agent)
         VALUES ($1, $2, $3, $4)`,
        [decoded.userId, 'user.logout', request.ip, request.headers['user-agent']]
      );

      return { success: true, message: 'Logged out successfully' };
    } catch {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
      });
    }
  });

  // ===========================================
  // GET CURRENT USER
  // ===========================================
  app.get('/me', async (request, reply) => {
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

      const result = await database.query(
        `SELECT id, email, name, avatar_url, email_verified, two_factor_enabled, status, created_at
         FROM users WHERE id = $1`,
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({
          success: false,
          error: { code: 'USER_NOT_FOUND', message: 'User not found' },
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
        },
      };
    } catch {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
      });
    }
  });

  // ===========================================
  // FORGOT PASSWORD
  // ===========================================
  app.post('/forgot-password', async (request, reply) => {
    const body = forgotPasswordSchema.parse(request.body);

    // Find user
    const result = await database.query<User>(
      'SELECT id, email FROM users WHERE email = $1',
      [body.email.toLowerCase()]
    );

    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      return { success: true, message: 'If the email exists, a reset link has been sent' };
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = nanoid(32);
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await database.query(
      `UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3`,
      [resetToken, resetExpires, user.id]
    );

    // TODO: Send reset email
    // await sendPasswordResetEmail(user.email, resetToken);

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, ip_address, details)
       VALUES ($1, $2, $3, $4)`,
      [user.id, 'user.password_reset_requested', request.ip, '{}']
    );

    return { success: true, message: 'If the email exists, a reset link has been sent' };
  });

  // ===========================================
  // RESET PASSWORD
  // ===========================================
  app.post('/reset-password', async (request, reply) => {
    const body = resetPasswordSchema.parse(request.body);

    // Find user with valid reset token
    const result = await database.query<User>(
      `SELECT id FROM users
       WHERE password_reset_token = $1 AND password_reset_expires > NOW()`,
      [body.token]
    );

    if (result.rows.length === 0) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired reset token',
        },
      });
    }

    const user = result.rows[0];

    // Hash new password
    const passwordHash = await bcrypt.hash(body.password, config.bcrypt.rounds);

    // Update password and clear reset token
    await database.query(
      `UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL
       WHERE id = $2`,
      [passwordHash, user.id]
    );

    // Invalidate all sessions
    await database.query('UPDATE sessions SET is_valid = FALSE WHERE user_id = $1', [user.id]);

    // Log audit event
    await database.query(
      `INSERT INTO audit_logs (user_id, action, ip_address)
       VALUES ($1, $2, $3)`,
      [user.id, 'user.password_reset', request.ip]
    );

    return { success: true, message: 'Password reset successfully' };
  });

  // ===========================================
  // VERIFY EMAIL
  // ===========================================
  app.post('/verify-email', async (request, reply) => {
    const { token } = request.body as { token: string };

    if (!token) {
      return reply.status(400).send({
        success: false,
        error: { code: 'MISSING_TOKEN', message: 'Verification token is required' },
      });
    }

    const result = await database.query(
      `UPDATE users SET email_verified = TRUE, email_verification_token = NULL
       WHERE email_verification_token = $1 AND email_verification_expires > NOW()
       RETURNING id`,
      [token]
    );

    if (result.rowCount === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired verification token' },
      });
    }

    return { success: true, message: 'Email verified successfully' };
  });
}
