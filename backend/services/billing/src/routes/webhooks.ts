import { FastifyInstance } from 'fastify';
import { database } from '../lib/database.js';
import { config } from '../config.js';

export async function webhookRoutes(app: FastifyInstance) {
  // ===========================================
  // STRIPE WEBHOOK
  // ===========================================
  app.post('/stripe', {
    config: {
      rawBody: true, // Need raw body for signature verification
    },
  }, async (request, reply) => {
    const sig = request.headers['stripe-signature'];

    if (!sig) {
      return reply.status(400).send({
        success: false,
        error: { code: 'MISSING_SIGNATURE', message: 'Missing Stripe signature' },
      });
    }

    // In production, verify signature with Stripe
    // const stripe = new Stripe(config.stripe.secretKey);
    // const event = stripe.webhooks.constructEvent(request.rawBody, sig, config.stripe.webhookSecret);

    // For now, parse the body directly
    const event = request.body as {
      id: string;
      type: string;
      data: { object: any };
    };

    // Check for duplicate events
    const existingEvent = await database.query(
      'SELECT id FROM webhook_events WHERE stripe_event_id = $1',
      [event.id]
    );

    if (existingEvent.rows.length > 0) {
      return { success: true, message: 'Event already processed' };
    }

    // Store event
    await database.query(
      `INSERT INTO webhook_events (stripe_event_id, event_type, payload)
       VALUES ($1, $2, $3)`,
      [event.id, event.type, JSON.stringify(event)]
    );

    try {
      // Handle different event types
      switch (event.type) {
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object);
          break;

        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;

        case 'invoice.paid':
          await handleInvoicePaid(event.data.object);
          break;

        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object);
          break;

        case 'customer.created':
          await handleCustomerCreated(event.data.object);
          break;

        default:
          app.log.info(`Unhandled webhook event: ${event.type}`);
      }

      // Mark as processed
      await database.query(
        `UPDATE webhook_events SET processed = TRUE, processed_at = NOW()
         WHERE stripe_event_id = $1`,
        [event.id]
      );

    } catch (error: any) {
      // Log error but still return 200 to prevent retries for known issues
      await database.query(
        `UPDATE webhook_events SET error = $1 WHERE stripe_event_id = $2`,
        [error.message, event.id]
      );
      app.log.error(`Webhook processing error: ${error.message}`);
    }

    return { success: true, received: true };
  });
}

// ===========================================
// WEBHOOK HANDLERS
// ===========================================

async function handleSubscriptionCreated(subscription: any) {
  // Update or create subscription record
  await database.query(
    `UPDATE subscriptions SET
       stripe_subscription_id = $1,
       status = $2,
       current_period_start = to_timestamp($3),
       current_period_end = to_timestamp($4),
       updated_at = NOW()
     WHERE stripe_customer_id = $5`,
    [
      subscription.id,
      mapStripeStatus(subscription.status),
      subscription.current_period_start,
      subscription.current_period_end,
      subscription.customer,
    ]
  );
}

async function handleSubscriptionUpdated(subscription: any) {
  await database.query(
    `UPDATE subscriptions SET
       status = $1,
       current_period_start = to_timestamp($2),
       current_period_end = to_timestamp($3),
       cancel_at_period_end = $4,
       updated_at = NOW()
     WHERE stripe_subscription_id = $5`,
    [
      mapStripeStatus(subscription.status),
      subscription.current_period_start,
      subscription.current_period_end,
      subscription.cancel_at_period_end,
      subscription.id,
    ]
  );
}

async function handleSubscriptionDeleted(subscription: any) {
  await database.query(
    `UPDATE subscriptions SET
       status = 'canceled',
       canceled_at = NOW(),
       updated_at = NOW()
     WHERE stripe_subscription_id = $1`,
    [subscription.id]
  );
}

async function handleInvoicePaid(invoice: any) {
  // Update or create invoice record
  const result = await database.query(
    `SELECT id FROM invoices WHERE stripe_invoice_id = $1`,
    [invoice.id]
  );

  if (result.rows.length > 0) {
    // Update existing
    await database.query(
      `UPDATE invoices SET
         status = 'paid',
         amount_paid = $1,
         paid_at = NOW(),
         invoice_pdf_url = $2,
         hosted_invoice_url = $3
       WHERE stripe_invoice_id = $4`,
      [invoice.amount_paid, invoice.invoice_pdf, invoice.hosted_invoice_url, invoice.id]
    );
  } else {
    // Create new invoice record
    await database.query(
      `INSERT INTO invoices
       (stripe_invoice_id, status, currency, subtotal, tax, total, amount_paid, amount_due,
        invoice_pdf_url, hosted_invoice_url, paid_at)
       VALUES ($1, 'paid', $2, $3, $4, $5, $6, 0, $7, $8, NOW())`,
      [
        invoice.id,
        invoice.currency,
        invoice.subtotal,
        invoice.tax || 0,
        invoice.total,
        invoice.amount_paid,
        invoice.invoice_pdf,
        invoice.hosted_invoice_url,
      ]
    );
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  await database.query(
    `UPDATE invoices SET status = 'open', amount_due = $1
     WHERE stripe_invoice_id = $2`,
    [invoice.amount_due, invoice.id]
  );

  // Update subscription status
  if (invoice.subscription) {
    await database.query(
      `UPDATE subscriptions SET status = 'past_due', updated_at = NOW()
       WHERE stripe_subscription_id = $1`,
      [invoice.subscription]
    );
  }

  // TODO: Send notification to user about failed payment
}

async function handleCustomerCreated(customer: any) {
  // Link Stripe customer to user if email matches
  if (customer.email) {
    await database.query(
      `UPDATE subscriptions SET stripe_customer_id = $1
       WHERE user_id = (SELECT id FROM users WHERE email = $2)
       AND stripe_customer_id IS NULL`,
      [customer.id, customer.email]
    );
  }
}

// Map Stripe status to our status
function mapStripeStatus(stripeStatus: string): string {
  const statusMap: Record<string, string> = {
    active: 'active',
    past_due: 'past_due',
    unpaid: 'unpaid',
    canceled: 'canceled',
    incomplete: 'unpaid',
    incomplete_expired: 'canceled',
    trialing: 'trialing',
    paused: 'paused',
  };
  return statusMap[stripeStatus] || 'active';
}
