import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from '../lib/database.js';
import crypto from 'crypto';

const createWebhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum([
    'app.created',
    'app.deleted',
    'app.started',
    'app.stopped',
    'app.restarted',
    'deployment.started',
    'deployment.success',
    'deployment.failed',
    'domain.added',
    'domain.removed',
    'domain.verified',
  ])).min(1),
  secret: z.string().min(16).optional(),
  enabled: z.boolean().default(true),
  description: z.string().max(255).optional(),
});

const updateWebhookSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(z.enum([
    'app.created',
    'app.deleted',
    'app.started',
    'app.stopped',
    'app.restarted',
    'deployment.started',
    'deployment.success',
    'deployment.failed',
    'domain.added',
    'domain.removed',
    'domain.verified',
  ])).min(1).optional(),
  enabled: z.boolean().optional(),
  description: z.string().max(255).optional(),
});

// Generate webhook signature
function generateSignature(payload: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  return 'sha256=' + hmac.update(payload).digest('hex');
}

// Generate webhook secret
function generateSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function webhookRoutes(fastify: FastifyInstance) {
  // Create webhook
  fastify.post('/webhooks', async (request, reply) => {
    const userId = (request as any).userId;
    const body = createWebhookSchema.parse(request.body);

    // Check webhook limits (e.g., 10 per user)
    const count = await query(
      `SELECT COUNT(*) FROM webhooks WHERE user_id = $1`,
      [userId]
    );

    if (parseInt(count.rows[0].count) >= 10) {
      return reply.status(403).send({
        success: false,
        error: 'Webhook limit reached (10 maximum)',
      });
    }

    const secret = body.secret || generateSecret();

    const result = await query(
      `INSERT INTO webhooks (user_id, url, events, secret, enabled, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, body.url, JSON.stringify(body.events), secret, body.enabled, body.description]
    );

    const webhook = result.rows[0];

    return {
      success: true,
      data: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        secret: secret, // Only returned on creation
        enabled: webhook.enabled,
        description: webhook.description,
        created_at: webhook.created_at,
      },
    };
  });

  // List webhooks
  fastify.get('/webhooks', async (request, reply) => {
    const userId = (request as any).userId;

    const result = await query(
      `SELECT w.*,
              (SELECT COUNT(*) FROM webhook_deliveries wd WHERE wd.webhook_id = w.id) as delivery_count,
              (SELECT COUNT(*) FROM webhook_deliveries wd WHERE wd.webhook_id = w.id AND wd.status = 'success') as success_count
       FROM webhooks w
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [userId]
    );

    return {
      success: true,
      data: result.rows.map((w) => ({
        id: w.id,
        url: w.url,
        events: w.events,
        enabled: w.enabled,
        description: w.description,
        delivery_count: parseInt(w.delivery_count),
        success_count: parseInt(w.success_count),
        created_at: w.created_at,
        updated_at: w.updated_at,
      })),
    };
  });

  // Get webhook details
  fastify.get('/webhooks/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM webhooks WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Webhook not found' });
    }

    const webhook = result.rows[0];

    // Get recent deliveries
    const deliveries = await query(
      `SELECT * FROM webhook_deliveries WHERE webhook_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [id]
    );

    return {
      success: true,
      data: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        enabled: webhook.enabled,
        description: webhook.description,
        recent_deliveries: deliveries.rows.map((d) => ({
          id: d.id,
          event: d.event,
          status: d.status,
          response_code: d.response_code,
          response_time_ms: d.response_time_ms,
          error: d.error_message,
          created_at: d.created_at,
        })),
        created_at: webhook.created_at,
        updated_at: webhook.updated_at,
      },
    };
  });

  // Update webhook
  fastify.put('/webhooks/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };
    const body = updateWebhookSchema.parse(request.body);

    const result = await query(
      `UPDATE webhooks
       SET url = COALESCE($1, url),
           events = COALESCE($2, events),
           enabled = COALESCE($3, enabled),
           description = COALESCE($4, description),
           updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [body.url, body.events ? JSON.stringify(body.events) : null, body.enabled, body.description, id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Webhook not found' });
    }

    const webhook = result.rows[0];

    return {
      success: true,
      data: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        enabled: webhook.enabled,
        description: webhook.description,
        updated_at: webhook.updated_at,
      },
    };
  });

  // Delete webhook
  fastify.delete('/webhooks/:id', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `DELETE FROM webhooks WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Webhook not found' });
    }

    return { success: true, message: 'Webhook deleted' };
  });

  // Regenerate webhook secret
  fastify.post('/webhooks/:id/secret', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const newSecret = generateSecret();

    const result = await query(
      `UPDATE webhooks SET secret = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING id`,
      [newSecret, id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Webhook not found' });
    }

    return {
      success: true,
      data: {
        secret: newSecret,
      },
    };
  });

  // Test webhook
  fastify.post('/webhooks/:id/test', async (request, reply) => {
    const userId = (request as any).userId;
    const { id } = request.params as { id: string };

    const result = await query(
      `SELECT * FROM webhooks WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Webhook not found' });
    }

    const webhook = result.rows[0];

    // Send test payload
    const testPayload = {
      event: 'webhook.test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook delivery from Bunker Cloud',
        webhook_id: webhook.id,
      },
    };

    const deliveryResult = await deliverWebhook(webhook, 'webhook.test', testPayload);

    return {
      success: deliveryResult.success,
      data: {
        delivery_id: deliveryResult.deliveryId,
        response_code: deliveryResult.responseCode,
        response_time_ms: deliveryResult.responseTimeMs,
        error: deliveryResult.error,
      },
    };
  });

  // Get webhook delivery details
  fastify.get('/webhooks/:id/deliveries/:deliveryId', async (request, reply) => {
    const userId = (request as any).userId;
    const { id, deliveryId } = request.params as { id: string; deliveryId: string };

    // Verify webhook ownership
    const webhookResult = await query(
      `SELECT id FROM webhooks WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (webhookResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Webhook not found' });
    }

    const result = await query(
      `SELECT * FROM webhook_deliveries WHERE id = $1 AND webhook_id = $2`,
      [deliveryId, id]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Delivery not found' });
    }

    const delivery = result.rows[0];

    return {
      success: true,
      data: {
        id: delivery.id,
        webhook_id: delivery.webhook_id,
        event: delivery.event,
        status: delivery.status,
        request_payload: delivery.request_payload,
        response_code: delivery.response_code,
        response_body: delivery.response_body,
        response_time_ms: delivery.response_time_ms,
        error_message: delivery.error_message,
        created_at: delivery.created_at,
      },
    };
  });

  // Retry failed delivery
  fastify.post('/webhooks/:id/deliveries/:deliveryId/retry', async (request, reply) => {
    const userId = (request as any).userId;
    const { id, deliveryId } = request.params as { id: string; deliveryId: string };

    // Verify webhook ownership
    const webhookResult = await query(
      `SELECT * FROM webhooks WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (webhookResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Webhook not found' });
    }

    const deliveryResult = await query(
      `SELECT * FROM webhook_deliveries WHERE id = $1 AND webhook_id = $2`,
      [deliveryId, id]
    );

    if (deliveryResult.rows.length === 0) {
      return reply.status(404).send({ success: false, error: 'Delivery not found' });
    }

    const delivery = deliveryResult.rows[0];
    const webhook = webhookResult.rows[0];

    // Retry delivery
    const retryResult = await deliverWebhook(
      webhook,
      delivery.event,
      delivery.request_payload,
      deliveryId
    );

    return {
      success: retryResult.success,
      data: {
        delivery_id: deliveryId,
        response_code: retryResult.responseCode,
        response_time_ms: retryResult.responseTimeMs,
        error: retryResult.error,
      },
    };
  });
}

// Deliver a webhook
async function deliverWebhook(
  webhook: any,
  event: string,
  payload: any,
  existingDeliveryId?: string
): Promise<{
  success: boolean;
  deliveryId: string;
  responseCode?: number;
  responseTimeMs?: number;
  error?: string;
}> {
  const deliveryId = existingDeliveryId || crypto.randomUUID();
  const payloadString = JSON.stringify(payload);
  const signature = generateSignature(payloadString, webhook.secret);
  const startTime = Date.now();

  // Create or update delivery record
  if (!existingDeliveryId) {
    await query(
      `INSERT INTO webhook_deliveries (id, webhook_id, event, status, request_payload)
       VALUES ($1, $2, $3, 'pending', $4)`,
      [deliveryId, webhook.id, event, payload]
    );
  }

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bunker-Event': event,
        'X-Bunker-Signature': signature,
        'X-Bunker-Delivery': deliveryId,
        'X-Bunker-Timestamp': new Date().toISOString(),
        'User-Agent': 'Bunker-Cloud-Webhooks/1.0',
      },
      body: payloadString,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    const responseTimeMs = Date.now() - startTime;
    const responseBody = await response.text().catch(() => '');

    const success = response.ok;

    await query(
      `UPDATE webhook_deliveries
       SET status = $1, response_code = $2, response_body = $3, response_time_ms = $4
       WHERE id = $5`,
      [success ? 'success' : 'failed', response.status, responseBody.substring(0, 1000), responseTimeMs, deliveryId]
    );

    return {
      success,
      deliveryId,
      responseCode: response.status,
      responseTimeMs,
    };
  } catch (error: any) {
    const responseTimeMs = Date.now() - startTime;
    const errorMessage = error.message || 'Unknown error';

    await query(
      `UPDATE webhook_deliveries
       SET status = 'failed', error_message = $1, response_time_ms = $2
       WHERE id = $3`,
      [errorMessage, responseTimeMs, deliveryId]
    );

    return {
      success: false,
      deliveryId,
      responseTimeMs,
      error: errorMessage,
    };
  }
}

// Export function to dispatch webhooks for an app event
export async function dispatchWebhooks(
  appId: string,
  event: string,
  payload: any
): Promise<void> {
  // Get app owner
  const appResult = await query(
    `SELECT user_id FROM apps WHERE id = $1`,
    [appId]
  );

  if (appResult.rows.length === 0) return;

  const userId = appResult.rows[0].user_id;

  // Find matching webhooks
  const webhooks = await query(
    `SELECT * FROM webhooks
     WHERE user_id = $1 AND enabled = true AND events @> $2`,
    [userId, JSON.stringify([event])]
  );

  // Dispatch to all matching webhooks
  const fullPayload = {
    event,
    timestamp: new Date().toISOString(),
    data: payload,
  };

  for (const webhook of webhooks.rows) {
    // Dispatch asynchronously
    deliverWebhook(webhook, event, fullPayload).catch(console.error);
  }
}

// Helper to generate signature for external use
export function generateWebhookSignature(payload: string, secret: string): string {
  return generateSignature(payload, secret);
}
