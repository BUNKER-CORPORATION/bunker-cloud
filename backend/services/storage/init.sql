-- =============================================
-- BUNKER CLOUD - Storage Service Schema
-- =============================================

-- Storage buckets table
CREATE TABLE IF NOT EXISTS storage_buckets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(64) NOT NULL,
    minio_bucket VARCHAR(128) NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT false,
    size_bytes BIGINT DEFAULT 0,
    object_count INTEGER DEFAULT 0,
    region VARCHAR(32) DEFAULT 'default',
    versioning_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, name)
);

-- Storage access logs
CREATE TABLE IF NOT EXISTS storage_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_id UUID NOT NULL REFERENCES storage_buckets(id),
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('GET', 'PUT', 'DELETE', 'LIST', 'COPY')),
    object_key TEXT,
    bytes_transferred BIGINT DEFAULT 0,
    source_ip VARCHAR(45),
    user_agent TEXT,
    status_code INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Storage bandwidth usage (daily aggregates)
CREATE TABLE IF NOT EXISTS storage_bandwidth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    bucket_id UUID REFERENCES storage_buckets(id),
    date DATE NOT NULL,
    bytes_in BIGINT DEFAULT 0,
    bytes_out BIGINT DEFAULT 0,
    requests_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, bucket_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_storage_buckets_user ON storage_buckets(user_id);
CREATE INDEX IF NOT EXISTS idx_storage_buckets_minio ON storage_buckets(minio_bucket);
CREATE INDEX IF NOT EXISTS idx_storage_access_logs_bucket ON storage_access_logs(bucket_id);
CREATE INDEX IF NOT EXISTS idx_storage_access_logs_created ON storage_access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_storage_bandwidth_user_date ON storage_bandwidth(user_id, date DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_storage_bucket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_storage_bucket_updated ON storage_buckets;
CREATE TRIGGER trigger_storage_bucket_updated
    BEFORE UPDATE ON storage_buckets
    FOR EACH ROW
    EXECUTE FUNCTION update_storage_bucket_timestamp();

-- View for active buckets with usage
CREATE OR REPLACE VIEW v_storage_buckets_active AS
SELECT
    sb.*,
    u.email as owner_email,
    (SELECT COALESCE(SUM(bytes_out), 0) FROM storage_bandwidth bw
     WHERE bw.bucket_id = sb.id AND bw.date >= CURRENT_DATE - INTERVAL '30 days') as bandwidth_30d
FROM storage_buckets sb
JOIN users u ON sb.user_id = u.id
WHERE sb.deleted_at IS NULL;

-- Function to get user's total storage usage
CREATE OR REPLACE FUNCTION get_user_storage_usage(p_user_id UUID)
RETURNS TABLE (
    total_buckets BIGINT,
    total_size_bytes BIGINT,
    total_objects BIGINT,
    bandwidth_30d_bytes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_buckets,
        COALESCE(SUM(size_bytes), 0)::BIGINT as total_size_bytes,
        COALESCE(SUM(object_count), 0)::BIGINT as total_objects,
        COALESCE((SELECT SUM(bytes_out) FROM storage_bandwidth
                  WHERE user_id = p_user_id AND date >= CURRENT_DATE - INTERVAL '30 days'), 0)::BIGINT as bandwidth_30d_bytes
    FROM storage_buckets
    WHERE user_id = p_user_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;
