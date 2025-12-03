-- =============================================
-- BUNKER CLOUD - Database Service Schema
-- =============================================

-- Database instances table
CREATE TABLE IF NOT EXISTS database_instances (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(64) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('postgres', 'mysql', 'redis', 'mongodb')),
    container_id VARCHAR(128) NOT NULL,
    host VARCHAR(255) NOT NULL DEFAULT 'localhost',
    port INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'creating', 'running', 'stopped', 'error', 'deleted')),
    credentials_encrypted TEXT,
    region VARCHAR(32) DEFAULT 'default',
    version VARCHAR(32),
    storage_used_mb INTEGER DEFAULT 0,
    backup_enabled BOOLEAN DEFAULT false,
    last_backup_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, name)
);

-- Database backups table
CREATE TABLE IF NOT EXISTS database_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id VARCHAR(64) NOT NULL REFERENCES database_instances(id),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('manual', 'automatic')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    size_bytes BIGINT,
    storage_path TEXT,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Database connection logs (for monitoring)
CREATE TABLE IF NOT EXISTS database_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id VARCHAR(64) NOT NULL REFERENCES database_instances(id),
    source_ip VARCHAR(45),
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    disconnected_at TIMESTAMP WITH TIME ZONE,
    bytes_sent BIGINT DEFAULT 0,
    bytes_received BIGINT DEFAULT 0,
    queries_executed INTEGER DEFAULT 0
);

-- Database metrics (time-series data)
CREATE TABLE IF NOT EXISTS database_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id VARCHAR(64) NOT NULL REFERENCES database_instances(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cpu_percent DECIMAL(5,2),
    memory_used_mb INTEGER,
    memory_limit_mb INTEGER,
    disk_used_mb INTEGER,
    connections_active INTEGER,
    queries_per_second DECIMAL(10,2),
    avg_query_time_ms DECIMAL(10,2)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_db_instances_user ON database_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_db_instances_status ON database_instances(status);
CREATE INDEX IF NOT EXISTS idx_db_backups_instance ON database_backups(instance_id);
CREATE INDEX IF NOT EXISTS idx_db_metrics_instance_time ON database_metrics(instance_id, timestamp DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_database_instance_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_database_instance_updated ON database_instances;
CREATE TRIGGER trigger_database_instance_updated
    BEFORE UPDATE ON database_instances
    FOR EACH ROW
    EXECUTE FUNCTION update_database_instance_timestamp();

-- View for active instances with usage stats
CREATE OR REPLACE VIEW v_database_instances_active AS
SELECT
    di.*,
    u.email as owner_email,
    (SELECT COUNT(*) FROM database_backups db WHERE db.instance_id = di.id AND db.status = 'completed') as backup_count,
    (SELECT MAX(completed_at) FROM database_backups db WHERE db.instance_id = di.id AND db.status = 'completed') as last_successful_backup
FROM database_instances di
JOIN users u ON di.user_id = u.id
WHERE di.deleted_at IS NULL;
