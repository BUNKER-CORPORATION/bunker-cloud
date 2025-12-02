import { FastifyInstance } from 'fastify';
import { database } from '../lib/database.js';

export async function plansRoutes(app: FastifyInstance) {
  // ===========================================
  // LIST ALL PLANS
  // ===========================================
  app.get('/', async (request, reply) => {
    const result = await database.query(
      `SELECT id, name, description, type, price_monthly, price_yearly, currency, features, limits, sort_order
       FROM plans
       WHERE is_active = TRUE
       ORDER BY sort_order ASC`
    );

    return {
      success: true,
      data: result.rows.map((plan) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        type: plan.type,
        pricing: {
          monthly: plan.price_monthly,
          yearly: plan.price_yearly,
          currency: plan.currency,
        },
        features: plan.features,
        limits: plan.limits,
      })),
    };
  });

  // ===========================================
  // GET SINGLE PLAN
  // ===========================================
  app.get('/:planId', async (request, reply) => {
    const { planId } = request.params as { planId: string };

    const result = await database.query(
      `SELECT id, name, description, type, price_monthly, price_yearly, currency, features, limits
       FROM plans
       WHERE id = $1 AND is_active = TRUE`,
      [planId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Plan not found' },
      });
    }

    const plan = result.rows[0];

    return {
      success: true,
      data: {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        type: plan.type,
        pricing: {
          monthly: plan.price_monthly,
          yearly: plan.price_yearly,
          currency: plan.currency,
        },
        features: plan.features,
        limits: plan.limits,
      },
    };
  });

  // ===========================================
  // COMPARE PLANS
  // ===========================================
  app.get('/compare', async (request, reply) => {
    const result = await database.query(
      `SELECT id, name, price_monthly, features, limits
       FROM plans
       WHERE is_active = TRUE
       ORDER BY sort_order ASC`
    );

    // Build comparison matrix
    const features = new Set<string>();
    result.rows.forEach((plan) => {
      Object.keys(plan.features || {}).forEach((f) => features.add(f));
    });

    const comparison = {
      features: Array.from(features),
      plans: result.rows.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price_monthly,
        featureValues: plan.features,
        limits: plan.limits,
      })),
    };

    return {
      success: true,
      data: comparison,
    };
  });
}
