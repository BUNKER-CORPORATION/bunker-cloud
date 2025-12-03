-- =============================================
-- BUNKER CLOUD - Apps Service Schema
-- =============================================

-- Apps table
CREATE TABLE IF NOT EXISTS apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(63) NOT NULL,
    image VARCHAR(512) NOT NULL,
    port INTEGER NOT NULL DEFAULT 3000,
    env_vars JSONB DEFAULT '{}',
    memory VARCHAR(16) DEFAULT '256m',
    cpus VARCHAR(8) DEFAULT '0.25',
    replicas INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'deploying', 'running', 'stopped', 'failed', 'deleted')),
    health_check_path VARCHAR(256) DEFAULT '/health',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, name)
);

-- App deployments history
CREATE TABLE IF NOT EXISTS app_deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID NOT NULL REFERENCES apps(id),
    image VARCHAR(512) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'building', 'deploying', 'success', 'failed', 'rolled_back')),
    container_id VARCHAR(128),
    error_message TEXT,
    build_logs TEXT,
    deploy_duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- App custom domains
CREATE TABLE IF NOT EXISTS app_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID NOT NULL REFERENCES apps(id),
    domain VARCHAR(253) NOT NULL UNIQUE,
    is_primary BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(128),
    ssl_status VARCHAR(20) DEFAULT 'none' CHECK (ssl_status IN ('none', 'pending', 'active', 'expired', 'failed')),
    ssl_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- App environment variables (encrypted in production)
CREATE TABLE IF NOT EXISTS app_env_vars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID NOT NULL REFERENCES apps(id),
    key VARCHAR(256) NOT NULL,
    value TEXT NOT NULL,
    is_secret BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(app_id, key)
);

-- App metrics (for autoscaling and monitoring)
CREATE TABLE IF NOT EXISTS app_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID NOT NULL REFERENCES apps(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cpu_percent DECIMAL(5,2),
    memory_bytes BIGINT,
    memory_percent DECIMAL(5,2),
    network_rx_bytes BIGINT,
    network_tx_bytes BIGINT,
    request_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    avg_response_time_ms DECIMAL(10,2)
);

-- App access logs
CREATE TABLE IF NOT EXISTS app_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID NOT NULL REFERENCES apps(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    method VARCHAR(10),
    path TEXT,
    status_code INTEGER,
    response_time_ms INTEGER,
    client_ip VARCHAR(45),
    user_agent TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_apps_user ON apps(user_id);
CREATE INDEX IF NOT EXISTS idx_apps_status ON apps(status);
CREATE INDEX IF NOT EXISTS idx_app_deployments_app ON app_deployments(app_id);
CREATE INDEX IF NOT EXISTS idx_app_deployments_created ON app_deployments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_domains_app ON app_domains(app_id);
CREATE INDEX IF NOT EXISTS idx_app_domains_domain ON app_domains(domain);
CREATE INDEX IF NOT EXISTS idx_app_metrics_app_time ON app_metrics(app_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_app_access_logs_app_time ON app_access_logs(app_id, timestamp DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_app_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_app_updated ON apps;
CREATE TRIGGER trigger_app_updated
    BEFORE UPDATE ON apps
    FOR EACH ROW
    EXECUTE FUNCTION update_app_timestamp();

DROP TRIGGER IF EXISTS trigger_app_domain_updated ON app_domains;
CREATE TRIGGER trigger_app_domain_updated
    BEFORE UPDATE ON app_domains
    FOR EACH ROW
    EXECUTE FUNCTION update_app_timestamp();

-- View for active apps with stats
CREATE OR REPLACE VIEW v_apps_active AS
SELECT
    a.*,
    u.email as owner_email,
    (SELECT COUNT(*) FROM app_deployments d WHERE d.app_id = a.id) as deployment_count,
    (SELECT d.created_at FROM app_deployments d WHERE d.app_id = a.id ORDER BY d.created_at DESC LIMIT 1) as last_deployed_at,
    (SELECT COUNT(*) FROM app_domains dom WHERE dom.app_id = a.id) as domain_count
FROM apps a
JOIN users u ON a.user_id = u.id
WHERE a.deleted_at IS NULL;

-- Function to get user's app usage
CREATE OR REPLACE FUNCTION get_user_app_usage(p_user_id UUID)
RETURNS TABLE (
    total_apps BIGINT,
    running_apps BIGINT,
    total_deployments BIGINT,
    total_domains BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_apps,
        COUNT(*) FILTER (WHERE status = 'running')::BIGINT as running_apps,
        COALESCE((SELECT COUNT(*) FROM app_deployments d JOIN apps a ON d.app_id = a.id WHERE a.user_id = p_user_id), 0)::BIGINT as total_deployments,
        COALESCE((SELECT COUNT(*) FROM app_domains dom JOIN apps a ON dom.app_id = a.id WHERE a.user_id = p_user_id), 0)::BIGINT as total_domains
    FROM apps
    WHERE user_id = p_user_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Cleanup old metrics (keep 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_app_metrics()
RETURNS void AS $$
BEGIN
    DELETE FROM app_metrics WHERE timestamp < NOW() - INTERVAL '7 days';
    DELETE FROM app_access_logs WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
