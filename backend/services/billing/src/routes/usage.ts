import { FastifyInstance } from 'fastify';
import { database } from '../lib/database.js';

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
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as JWTPayload;
    request.userId = decoded.userId;
  } catch {
    return reply.status(401).send({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' },
    });
  }
}

export async function usageRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await verifyAuth(app, request, reply);
  });

  // ===========================================
  // GET CURRENT USAGE
  // ===========================================
  app.get('/', async (request, reply) => {
    const userId = (request as any).userId;

    // Get current billing period
    const subResult = await database.query(
      `SELECT current_period_start, current_period_end, plan_id
       FROM subscriptions
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    const periodStart = subResult.rows[0]?.current_period_start || new Date(new Date().setDate(1));
    const periodEnd = subResult.rows[0]?.current_period_end || new Date();

    // Get usage by resource type
    const usageResult = await database.query(
      `SELECT resource_type, unit, SUM(quantity) as total_quantity, SUM(total_cost) as total_cost
       FROM usage_records
       WHERE user_id = $1 AND period_start >= $2 AND period_end <= $3
       GROUP BY resource_type, unit`,
      [userId, periodStart, periodEnd]
    );

    // Get plan limits
    const planResult = await database.query(
      `SELECT p.limits FROM plans p
       JOIN subscriptions s ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'`,
      [userId]
    );

    const limits = planResult.rows[0]?.limits || {};

    return {
      success: true,
      data: {
        period: {
          start: periodStart,
          end: periodEnd,
        },
        usage: usageResult.rows.map((row) => ({
          resourceType: row.resource_type,
          quantity: parseFloat(row.total_quantity),
          unit: row.unit,
          cost: parseFloat(row.total_cost || 0),
          limit: limits[row.resource_type] || null,
        })),
        totalCost: usageResult.rows.reduce((acc, row) => acc + parseFloat(row.total_cost || 0), 0),
      },
    };
  });

  // ===========================================
  // GET USAGE HISTORY
  // ===========================================
  app.get('/history', async (request, reply) => {
    const userId = (request as any).userId;
    const { months = 6 } = request.query as { months?: number };

    const result = await database.query(
      `SELECT
         date_trunc('month', period_start) as month,
         resource_type,
         SUM(quantity) as total_quantity,
         unit,
         SUM(total_cost) as total_cost
       FROM usage_records
       WHERE user_id = $1 AND period_start >= NOW() - interval '${Math.min(months, 12)} months'
       GROUP BY date_trunc('month', period_start), resource_type, unit
       ORDER BY month DESC, resource_type`,
      [userId]
    );

    // Group by month
    const byMonth: Record<string, any[]> = {};
    result.rows.forEach((row) => {
      const month = new Date(row.month).toISOString().slice(0, 7);
      if (!byMonth[month]) byMonth[month] = [];
      byMonth[month].push({
        resourceType: row.resource_type,
        quantity: parseFloat(row.total_quantity),
        unit: row.unit,
        cost: parseFloat(row.total_cost || 0),
      });
    });

    return {
      success: true,
      data: Object.entries(byMonth).map(([month, usage]) => ({
        month,
        usage,
        totalCost: usage.reduce((acc, u) => acc + u.cost, 0),
      })),
    };
  });

  // ===========================================
  // GET USAGE BY RESOURCE
  // ===========================================
  app.get('/resources/:resourceType', async (request, reply) => {
    const userId = (request as any).userId;
    const { resourceType } = request.params as { resourceType: string };
    const { days = 30 } = request.query as { days?: number };

    const result = await database.query(
      `SELECT
         date_trunc('day', period_start) as date,
         resource_id,
         resource_name,
         SUM(quantity) as quantity,
         unit,
         SUM(total_cost) as cost
       FROM usage_records
       WHERE user_id = $1 AND resource_type = $2 AND period_start >= NOW() - interval '${Math.min(days, 90)} days'
       GROUP BY date_trunc('day', period_start), resource_id, resource_name, unit
       ORDER BY date DESC`,
      [userId, resourceType]
    );

    return {
      success: true,
      data: {
        resourceType,
        records: result.rows.map((row) => ({
          date: row.date,
          resourceId: row.resource_id,
          resourceName: row.resource_name,
          quantity: parseFloat(row.quantity),
          unit: row.unit,
          cost: parseFloat(row.cost || 0),
        })),
      },
    };
  });

  // ===========================================
  // RECORD USAGE (Internal API)
  // ===========================================
  app.post('/record', async (request, reply) => {
    // This would typically be called by internal services
    // Should be protected by API key or internal network

    const {
      userId,
      organizationId,
      subscriptionId,
      resourceType,
      resourceId,
      resourceName,
      quantity,
      unit,
      unitPrice,
      periodStart,
      periodEnd,
      metadata,
    } = request.body as {
      userId: string;
      organizationId?: string;
      subscriptionId?: string;
      resourceType: string;
      resourceId?: string;
      resourceName?: string;
      quantity: number;
      unit: string;
      unitPrice?: number;
      periodStart: string;
      periodEnd: string;
      metadata?: Record<string, any>;
    };

    const totalCost = unitPrice ? quantity * unitPrice : null;

    const result = await database.query(
      `INSERT INTO usage_records
       (user_id, organization_id, subscription_id, resource_type, resource_id, resource_name,
        quantity, unit, unit_price, total_cost, period_start, period_end, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id`,
      [
        userId,
        organizationId || null,
        subscriptionId || null,
        resourceType,
        resourceId || null,
        resourceName || null,
        quantity,
        unit,
        unitPrice || null,
        totalCost,
        periodStart,
        periodEnd,
        JSON.stringify(metadata || {}),
      ]
    );

    return {
      success: true,
      data: { id: result.rows[0].id },
    };
  });

  // ===========================================
  // GET USAGE ALERTS/LIMITS
  // ===========================================
  app.get('/alerts', async (request, reply) => {
    const userId = (request as any).userId;

    // Get current usage and limits
    const result = await database.query(
      `SELECT
         p.limits,
         (SELECT json_object_agg(resource_type, total_quantity)
          FROM (
            SELECT resource_type, SUM(quantity) as total_quantity
            FROM usage_records
            WHERE user_id = $1 AND period_start >= date_trunc('month', CURRENT_DATE)
            GROUP BY resource_type
          ) usage) as current_usage
       FROM plans p
       JOIN subscriptions s ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'`,
      [userId]
    );

    if (result.rows.length === 0) {
      return { success: true, data: { alerts: [] } };
    }

    const { limits, current_usage } = result.rows[0];
    const alerts: any[] = [];

    // Check each limit
    if (limits && current_usage) {
      for (const [resource, limit] of Object.entries(limits)) {
        if (limit === -1) continue; // Unlimited

        const usage = current_usage[resource] || 0;
        const percentage = (usage / (limit as number)) * 100;

        if (percentage >= 90) {
          alerts.push({
            type: 'critical',
            resource,
            usage,
            limit,
            percentage: Math.round(percentage),
            message: `You've used ${Math.round(percentage)}% of your ${resource} limit`,
          });
        } else if (percentage >= 75) {
          alerts.push({
            type: 'warning',
            resource,
            usage,
            limit,
            percentage: Math.round(percentage),
            message: `You've used ${Math.round(percentage)}% of your ${resource} limit`,
          });
        }
      }
    }

    return {
      success: true,
      data: { alerts },
    };
  });
}
