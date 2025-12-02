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

export async function invoiceRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await verifyAuth(app, request, reply);
  });

  // ===========================================
  // LIST INVOICES
  // ===========================================
  app.get('/', async (request, reply) => {
    const userId = (request as any).userId;
    const { limit = 20, offset = 0, status } = request.query as {
      limit?: number;
      offset?: number;
      status?: string;
    };

    let query = `
      SELECT id, invoice_number, status, currency, subtotal, tax, total, amount_paid, amount_due,
             due_date, paid_at, period_start, period_end, invoice_pdf_url, created_at
      FROM invoices
      WHERE user_id = $1
    `;
    const params: any[] = [userId];

    if (status) {
      query += ` AND status = $2`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Math.min(limit, 100), offset);

    const result = await database.query(query, params);

    const countResult = await database.query(
      'SELECT COUNT(*) FROM invoices WHERE user_id = $1',
      [userId]
    );

    return {
      success: true,
      data: result.rows.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        status: inv.status,
        currency: inv.currency,
        subtotal: inv.subtotal,
        tax: inv.tax,
        total: inv.total,
        amountPaid: inv.amount_paid,
        amountDue: inv.amount_due,
        dueDate: inv.due_date,
        paidAt: inv.paid_at,
        period: {
          start: inv.period_start,
          end: inv.period_end,
        },
        pdfUrl: inv.invoice_pdf_url,
        createdAt: inv.created_at,
      })),
      pagination: {
        total: parseInt(countResult.rows[0].count, 10),
        limit,
        offset,
      },
    };
  });

  // ===========================================
  // GET SINGLE INVOICE
  // ===========================================
  app.get('/:invoiceId', async (request, reply) => {
    const userId = (request as any).userId;
    const { invoiceId } = request.params as { invoiceId: string };

    const result = await database.query(
      `SELECT * FROM invoices WHERE id = $1 AND user_id = $2`,
      [invoiceId, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Invoice not found' },
      });
    }

    const inv = result.rows[0];

    return {
      success: true,
      data: {
        id: inv.id,
        invoiceNumber: inv.invoice_number,
        status: inv.status,
        currency: inv.currency,
        subtotal: inv.subtotal,
        tax: inv.tax,
        total: inv.total,
        amountPaid: inv.amount_paid,
        amountDue: inv.amount_due,
        dueDate: inv.due_date,
        paidAt: inv.paid_at,
        period: {
          start: inv.period_start,
          end: inv.period_end,
        },
        lineItems: inv.line_items,
        pdfUrl: inv.invoice_pdf_url,
        hostedUrl: inv.hosted_invoice_url,
        metadata: inv.metadata,
        createdAt: inv.created_at,
      },
    };
  });

  // ===========================================
  // DOWNLOAD INVOICE PDF
  // ===========================================
  app.get('/:invoiceId/pdf', async (request, reply) => {
    const userId = (request as any).userId;
    const { invoiceId } = request.params as { invoiceId: string };

    const result = await database.query(
      `SELECT invoice_pdf_url FROM invoices WHERE id = $1 AND user_id = $2`,
      [invoiceId, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Invoice not found' },
      });
    }

    const pdfUrl = result.rows[0].invoice_pdf_url;

    if (!pdfUrl) {
      return reply.status(404).send({
        success: false,
        error: { code: 'PDF_NOT_AVAILABLE', message: 'PDF not available for this invoice' },
      });
    }

    // Redirect to PDF URL
    return reply.redirect(pdfUrl);
  });

  // ===========================================
  // GET UPCOMING INVOICE (Preview)
  // ===========================================
  app.get('/upcoming', async (request, reply) => {
    const userId = (request as any).userId;

    // Get current subscription
    const subResult = await database.query(
      `SELECT s.*, p.name as plan_name, p.price_monthly, p.price_yearly
       FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'`,
      [userId]
    );

    if (subResult.rows.length === 0) {
      return {
        success: true,
        data: null,
        message: 'No active subscription',
      };
    }

    const sub = subResult.rows[0];
    const price = sub.billing_cycle === 'yearly' ? sub.price_yearly : sub.price_monthly;

    // Get current period usage
    const usageResult = await database.query(
      `SELECT resource_type, SUM(total_cost) as cost
       FROM usage_records
       WHERE user_id = $1 AND period_start >= $2
       GROUP BY resource_type`,
      [userId, sub.current_period_start]
    );

    const usageCost = usageResult.rows.reduce((acc, row) => acc + parseFloat(row.cost || 0), 0);

    return {
      success: true,
      data: {
        periodEnd: sub.current_period_end,
        subscription: {
          plan: sub.plan_name,
          price: price,
        },
        usageCharges: usageCost,
        subtotal: price + usageCost,
        estimatedTotal: price + usageCost,
        currency: 'USD',
      },
    };
  });

  // ===========================================
  // PAY INVOICE (for unpaid invoices)
  // ===========================================
  app.post('/:invoiceId/pay', async (request, reply) => {
    const userId = (request as any).userId;
    const { invoiceId } = request.params as { invoiceId: string };

    const result = await database.query(
      `SELECT * FROM invoices WHERE id = $1 AND user_id = $2 AND status IN ('open', 'past_due')`,
      [invoiceId, userId]
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Invoice not found or already paid' },
      });
    }

    // In production, this would trigger Stripe payment
    // For now, just return info about payment

    return {
      success: true,
      data: {
        invoiceId,
        amountDue: result.rows[0].amount_due,
        currency: result.rows[0].currency,
        // paymentUrl: 'https://checkout.stripe.com/...',
        message: 'Payment integration pending. Invoice marked for payment.',
      },
    };
  });
}
