-- ===========================================
-- BUNKER CLOUD - Billing Schema
-- ===========================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PLANS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'subscription' CHECK (type IN ('subscription', 'pay_as_you_go', 'enterprise')),
    price_monthly INTEGER NOT NULL DEFAULT 0, -- in cents
    price_yearly INTEGER, -- in cents (optional yearly discount)
    currency VARCHAR(3) DEFAULT 'USD',
    features JSONB DEFAULT '{}',
    limits JSONB DEFAULT '{}', -- resource limits
    stripe_price_id_monthly VARCHAR(255),
    stripe_price_id_yearly VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- SUBSCRIPTIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    plan_id VARCHAR(100) REFERENCES plans(id),
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing', 'paused')),
    billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP,
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_org_id ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ===========================================
-- PAYMENT METHODS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_method_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- card, bank_account, etc.
    card_brand VARCHAR(50), -- visa, mastercard, etc.
    card_last4 VARCHAR(4),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    billing_address JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for payment_methods
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);

-- ===========================================
-- INVOICES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    stripe_invoice_id VARCHAR(255),
    invoice_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
    currency VARCHAR(3) DEFAULT 'USD',
    subtotal INTEGER NOT NULL DEFAULT 0, -- in cents
    tax INTEGER DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    amount_paid INTEGER DEFAULT 0,
    amount_due INTEGER NOT NULL DEFAULT 0,
    due_date TIMESTAMP,
    paid_at TIMESTAMP,
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    invoice_pdf_url VARCHAR(500),
    hosted_invoice_url VARCHAR(500),
    line_items JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_org_id ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_id ON invoices(stripe_invoice_id);

-- ===========================================
-- USAGE RECORDS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS usage_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    resource_type VARCHAR(100) NOT NULL, -- compute, storage, database, bandwidth, etc.
    resource_id UUID, -- specific resource ID if applicable
    resource_name VARCHAR(255),
    quantity DECIMAL(20, 6) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- hours, GB, requests, etc.
    unit_price DECIMAL(20, 6), -- price per unit in cents
    total_cost DECIMAL(20, 6), -- calculated cost
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for usage_records
CREATE INDEX IF NOT EXISTS idx_usage_records_subscription_id ON usage_records(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_resource_type ON usage_records(resource_type);
CREATE INDEX IF NOT EXISTS idx_usage_records_period ON usage_records(period_start, period_end);

-- Partition by month for better performance (would be set up separately)

-- ===========================================
-- CREDITS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    amount INTEGER NOT NULL, -- in cents
    currency VARCHAR(3) DEFAULT 'USD',
    type VARCHAR(50) DEFAULT 'promotional' CHECK (type IN ('promotional', 'refund', 'manual', 'referral')),
    description TEXT,
    expires_at TIMESTAMP,
    used_amount INTEGER DEFAULT 0,
    granted_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for credits
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_org_id ON credits(organization_id);

-- ===========================================
-- WEBHOOK EVENTS TABLE (for Stripe webhooks)
-- ===========================================
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    error TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for webhook_events
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_id ON webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);

-- ===========================================
-- INSERT DEFAULT PLANS
-- ===========================================
INSERT INTO plans (id, name, description, price_monthly, price_yearly, features, limits, sort_order)
VALUES
    ('free', 'Free', 'Perfect for getting started', 0, 0,
     '{"databases": 1, "storage": "1GB", "bandwidth": "10GB", "support": "community"}',
     '{"databases": 1, "storage_gb": 1, "bandwidth_gb": 10, "apps": 1}',
     1),
    ('starter', 'Starter', 'For small projects and teams', 2900, 29000,
     '{"databases": 3, "storage": "10GB", "bandwidth": "100GB", "support": "email", "ssl": true}',
     '{"databases": 3, "storage_gb": 10, "bandwidth_gb": 100, "apps": 5}',
     2),
    ('pro', 'Pro', 'For growing businesses', 9900, 99000,
     '{"databases": 10, "storage": "100GB", "bandwidth": "1TB", "support": "priority", "ssl": true, "backups": "daily"}',
     '{"databases": 10, "storage_gb": 100, "bandwidth_gb": 1000, "apps": 20}',
     3),
    ('enterprise', 'Enterprise', 'For large organizations', 29900, 299000,
     '{"databases": "unlimited", "storage": "1TB", "bandwidth": "10TB", "support": "dedicated", "ssl": true, "backups": "hourly", "sla": "99.99%"}',
     '{"databases": -1, "storage_gb": 1000, "bandwidth_gb": 10000, "apps": -1}',
     4)
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_billing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_billing_updated_at();

CREATE TRIGGER update_plans_updated_at
    BEFORE UPDATE ON plans
    FOR EACH ROW
    EXECUTE FUNCTION update_billing_updated_at();

-- ===========================================
-- VIEWS
-- ===========================================

-- Current month usage summary
CREATE OR REPLACE VIEW current_month_usage AS
SELECT
    user_id,
    organization_id,
    resource_type,
    SUM(quantity) as total_quantity,
    unit,
    SUM(total_cost) as total_cost
FROM usage_records
WHERE period_start >= date_trunc('month', CURRENT_DATE)
  AND period_end <= date_trunc('month', CURRENT_DATE) + interval '1 month'
GROUP BY user_id, organization_id, resource_type, unit;

COMMENT ON TABLE plans IS 'Available subscription plans';
COMMENT ON TABLE subscriptions IS 'User/organization subscriptions';
COMMENT ON TABLE invoices IS 'Billing invoices';
COMMENT ON TABLE usage_records IS 'Resource usage tracking for billing';
COMMENT ON TABLE credits IS 'Account credits and promotions';
