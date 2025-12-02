import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { database } from '../lib/database.js';
import { config } from '../config.js';

// Validation schemas
const createSubscriptionSchema = z.object({
  planId: z.string(),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
  organizationId: z.string().uuid().optional(),
});

interface JWTPayload {
  userId: string;
  email: string;
}

// Auth middleware
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
    // In production, verify JWT signature properly
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as JWTPayload;
    request.userId = decoded.userId;
  } catch {
    return reply.status(401).send({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
    });
  }
}

export async function subscriptionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await verifyAuth(app, request, reply);
  });

  // ===========================================
  // GET CURRENT SUBSCRIPTION
  // ===========================================
  app.get('/', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await database.query(
      `SELECT s.*, p.name as plan_name, p.features, p.limits
       FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status IN ('active', 'trialing')
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      // Return free plan if no subscription
      const freePlan = await database.query(
        `SELECT id, name, features, limits FROM plans WHERE id = 'free'`
      );

      return {
        success: true,
        data: {
          plan: freePlan.rows[0] || { id: 'free', name: 'Free' },
          status: 'active',
          isFreePlan: true,
        },
      };
    }

    const sub = result.rows[0];

    return {
      success: true,
      data: {
        id: sub.id,
        plan: {
          id: sub.plan_id,
          name: sub.plan_name,
          features: sub.features,
          limits: sub.limits,
        },
        status: sub.status,
        billingCycle: sub.billing_cycle,
        currentPeriod: {
          start: sub.current_period_start,
          end: sub.current_period_end,
        },
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        trial: sub.trial_start
          ? {
              start: sub.trial_start,
              end: sub.trial_end,
            }
          : null,
        createdAt: sub.created_at,
      },
    };
  });

  // ===========================================
  // CREATE/UPGRADE SUBSCRIPTION
  // ===========================================
  app.post('/', async (request, reply) => {
    const userId = (request as any).userId;
    const body = createSubscriptionSchema.parse(request.body);

    // Check if plan exists
    const planResult = await database.query(
      'SELECT * FROM plans WHERE id = $1 AND is_active = TRUE',
      [body.planId]
    );

    if (planResult.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'PLAN_NOT_FOUND', message: 'Plan not found' },
      });
    }

    const plan = planResult.rows[0];

    // Check existing subscription
    const existingSub = await database.query(
      `SELECT id FROM subscriptions WHERE user_id = $1 AND status IN ('active', 'trialing')`,
      [userId]
    );

    if (existingSub.rows.length > 0) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'SUBSCRIPTION_EXISTS',
          message: 'You already have an active subscription. Please cancel or upgrade.',
        },
      });
    }

    // For free plan, create subscription directly
    if (plan.id === 'free') {
      const result = await database.query(
        `INSERT INTO subscriptions (user_id, organization_id, plan_id, status, billing_cycle, current_period_start, current_period_end)
         VALUES ($1, $2, $3, 'active', $4, NOW(), NOW() + interval '1 month')
         RETURNING *`,
        [userId, body.organizationId || null, body.planId, body.billingCycle]
      );

      return {
        success: true,
        data: {
          subscription: result.rows[0],
          requiresPayment: false,
        },
      };
    }

    // For paid plans, we would integrate with Stripe here
    // For now, create a pending subscription
    const periodInterval = body.billingCycle === 'yearly' ? '1 year' : '1 month';

    const result = await database.query(
      `INSERT INTO subscriptions (user_id, organization_id, plan_id, status, billing_cycle, current_period_start, current_period_end)
       VALUES ($1, $2, $3, 'active', $4, NOW(), NOW() + interval '${periodInterval}')
       RETURNING *`,
      [userId, body.organizationId || null, body.planId, body.billingCycle]
    );

    // In production, you would:
    // 1. Create Stripe customer if not exists
    // 2. Create Stripe subscription
    // 3. Return checkout URL or client secret

    return {
      success: true,
      data: {
        subscription: result.rows[0],
        requiresPayment: plan.price_monthly > 0,
        // checkoutUrl: 'https://checkout.stripe.com/...',
        message:
          plan.price_monthly > 0
            ? 'Subscription created. Payment integration pending.'
            : 'Subscription activated.',
      },
    };
  });

  // ===========================================
  // UPDATE SUBSCRIPTION (Change plan)
  // ===========================================
  app.put('/', async (request, reply) => {
    const userId = (request as any).userId;
    const { planId, billingCycle } = request.body as { planId?: string; billingCycle?: string };

    // Get current subscription
    const currentSub = await database.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND status IN ('active', 'trialing')`,
      [userId]
    );

    if (currentSub.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NO_SUBSCRIPTION', message: 'No active subscription found' },
      });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (planId) {
      // Verify plan exists
      const planCheck = await database.query(
        'SELECT id FROM plans WHERE id = $1 AND is_active = TRUE',
        [planId]
      );
      if (planCheck.rows.length === 0) {
        return reply.status(404).send({
          success: false,
          error: { code: 'PLAN_NOT_FOUND', message: 'Plan not found' },
        });
      }
      updates.push(`plan_id = $${paramIndex++}`);
      values.push(planId);
    }

    if (billingCycle && ['monthly', 'yearly'].includes(billingCycle)) {
      updates.push(`billing_cycle = $${paramIndex++}`);
      values.push(billingCycle);
    }

    if (updates.length === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'NO_CHANGES', message: 'No changes specified' },
      });
    }

    values.push(currentSub.rows[0].id);

    const result = await database.query(
      `UPDATE subscriptions SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return {
      success: true,
      data: result.rows[0],
      message: 'Subscription updated. Changes will take effect at next billing period.',
    };
  });

  // ===========================================
  // CANCEL SUBSCRIPTION
  // ===========================================
  app.delete('/', async (request, reply) => {
    const userId = (request as any).userId;
    const { immediate } = request.query as { immediate?: string };

    const currentSub = await database.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND status IN ('active', 'trialing')`,
      [userId]
    );

    if (currentSub.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NO_SUBSCRIPTION', message: 'No active subscription found' },
      });
    }

    const sub = currentSub.rows[0];

    if (immediate === 'true') {
      // Cancel immediately
      await database.query(
        `UPDATE subscriptions SET status = 'canceled', canceled_at = NOW(), updated_at = NOW()
         WHERE id = $1`,
        [sub.id]
      );

      return {
        success: true,
        message: 'Subscription canceled immediately.',
      };
    } else {
      // Cancel at period end
      await database.query(
        `UPDATE subscriptions SET cancel_at_period_end = TRUE, updated_at = NOW()
         WHERE id = $1`,
        [sub.id]
      );

      return {
        success: true,
        message: `Subscription will be canceled at the end of the billing period (${sub.current_period_end}).`,
      };
    }
  });

  // ===========================================
  // REACTIVATE SUBSCRIPTION
  // ===========================================
  app.post('/reactivate', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await database.query(
      `UPDATE subscriptions SET cancel_at_period_end = FALSE, updated_at = NOW()
       WHERE user_id = $1 AND status = 'active' AND cancel_at_period_end = TRUE
       RETURNING *`,
      [userId]
    );

    if (result.rowCount === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'No subscription pending cancellation' },
      });
    }

    return {
      success: true,
      data: result.rows[0],
      message: 'Subscription reactivated.',
    };
  });
}
