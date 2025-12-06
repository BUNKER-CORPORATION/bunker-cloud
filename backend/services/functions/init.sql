-- =============================================
-- BUNKER CLOUD - Serverless Functions Schema
-- =============================================

-- Functions table
CREATE TABLE IF NOT EXISTS functions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(63) NOT NULL,
    runtime VARCHAR(20) NOT NULL CHECK (runtime IN ('nodejs20', 'nodejs18', 'python311', 'python310', 'go121', 'rust')),
    code TEXT NOT NULL,
    handler VARCHAR(128) DEFAULT 'handler',
    description VARCHAR(500),
    env_vars JSONB DEFAULT '{}',
    memory INTEGER DEFAULT 128 CHECK (memory >= 128 AND memory <= 1024),
    timeout INTEGER DEFAULT 30000 CHECK (timeout >= 1000 AND timeout <= 300000),
    version INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'deleted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, name)
);

-- Function invocations
CREATE TABLE IF NOT EXISTS function_invocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_id UUID NOT NULL REFERENCES functions(id),
    status VARCHAR(20) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'success', 'error', 'timeout')),
    request_payload JSONB,
    response_payload JSONB,
    logs TEXT,
    error_message TEXT,
    duration_ms INTEGER,
    billed_duration_ms INTEGER,
    memory_used_mb INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Function versions (for rollback support)
CREATE TABLE IF NOT EXISTS function_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_id UUID NOT NULL REFERENCES functions(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    code TEXT NOT NULL,
    handler VARCHAR(128),
    env_vars JSONB,
    memory INTEGER,
    timeout INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(function_id, version)
);

-- Function triggers (scheduled, HTTP, events)
CREATE TABLE IF NOT EXISTS function_triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_id UUID NOT NULL REFERENCES functions(id) ON DELETE CASCADE,
    trigger_type VARCHAR(20) NOT NULL CHECK (trigger_type IN ('http', 'schedule', 'event', 'queue')),
    config JSONB NOT NULL DEFAULT '{}',
    enabled BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function environment secrets (encrypted)
CREATE TABLE IF NOT EXISTS function_secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_id UUID NOT NULL REFERENCES functions(id) ON DELETE CASCADE,
    key VARCHAR(128) NOT NULL,
    encrypted_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(function_id, key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_functions_user ON functions(user_id);
CREATE INDEX IF NOT EXISTS idx_functions_name ON functions(name);
CREATE INDEX IF NOT EXISTS idx_functions_status ON functions(status);
CREATE INDEX IF NOT EXISTS idx_function_invocations_function ON function_invocations(function_id);
CREATE INDEX IF NOT EXISTS idx_function_invocations_created ON function_invocations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_function_invocations_status ON function_invocations(status);
CREATE INDEX IF NOT EXISTS idx_function_triggers_function ON function_triggers(function_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_function_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_function_updated ON functions;
CREATE TRIGGER trigger_function_updated
    BEFORE UPDATE ON functions
    FOR EACH ROW
    EXECUTE FUNCTION update_function_timestamp();

-- Trigger to save version on code update
CREATE OR REPLACE FUNCTION save_function_version()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.code IS DISTINCT FROM NEW.code THEN
        INSERT INTO function_versions (function_id, version, code, handler, env_vars, memory, timeout)
        VALUES (OLD.id, OLD.version, OLD.code, OLD.handler, OLD.env_vars, OLD.memory, OLD.timeout);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_save_function_version ON functions;
CREATE TRIGGER trigger_save_function_version
    BEFORE UPDATE ON functions
    FOR EACH ROW
    EXECUTE FUNCTION save_function_version();

-- View for function stats
CREATE OR REPLACE VIEW v_function_stats AS
SELECT
    f.id,
    f.name,
    f.user_id,
    f.runtime,
    f.status,
    COUNT(i.id) as total_invocations,
    COUNT(i.id) FILTER (WHERE i.status = 'success') as successful_invocations,
    COUNT(i.id) FILTER (WHERE i.status = 'error') as failed_invocations,
    AVG(i.duration_ms) as avg_duration_ms,
    SUM(i.billed_duration_ms) as total_billed_ms,
    MAX(i.created_at) as last_invocation
FROM functions f
LEFT JOIN function_invocations i ON f.id = i.function_id
WHERE f.deleted_at IS NULL
GROUP BY f.id, f.name, f.user_id, f.runtime, f.status;

-- Function to get user's function usage
CREATE OR REPLACE FUNCTION get_user_function_usage(p_user_id UUID)
RETURNS TABLE (
    total_functions BIGINT,
    active_functions BIGINT,
    total_invocations_month BIGINT,
    total_billed_ms_month BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_functions,
        COUNT(*) FILTER (WHERE status = 'active')::BIGINT as active_functions,
        COALESCE((
            SELECT COUNT(*) FROM function_invocations i
            JOIN functions f ON i.function_id = f.id
            WHERE f.user_id = p_user_id AND i.created_at > date_trunc('month', NOW())
        ), 0)::BIGINT as total_invocations_month,
        COALESCE((
            SELECT SUM(i.billed_duration_ms) FROM function_invocations i
            JOIN functions f ON i.function_id = f.id
            WHERE f.user_id = p_user_id AND i.created_at > date_trunc('month', NOW())
        ), 0)::BIGINT as total_billed_ms_month
    FROM functions
    WHERE user_id = p_user_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Cleanup old invocations (keep 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_invocations()
RETURNS void AS $$
BEGIN
    DELETE FROM function_invocations WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
