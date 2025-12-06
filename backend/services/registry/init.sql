-- =============================================
-- BUNKER CLOUD - Container Registry Schema
-- =============================================

-- Repositories
CREATE TABLE IF NOT EXISTS registry_repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    namespace VARCHAR(100) NOT NULL,
    name VARCHAR(128) NOT NULL,
    description VARCHAR(500),
    visibility VARCHAR(10) DEFAULT 'private' CHECK (visibility IN ('public', 'private')),
    pull_count INTEGER DEFAULT 0,
    push_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(namespace, name)
);

-- Manifests (image metadata)
CREATE TABLE IF NOT EXISTS registry_manifests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id UUID NOT NULL REFERENCES registry_repositories(id) ON DELETE CASCADE,
    digest VARCHAR(128) NOT NULL,
    content_type VARCHAR(128) NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(repository_id, digest)
);

-- Tags (named references to manifests)
CREATE TABLE IF NOT EXISTS registry_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id UUID NOT NULL REFERENCES registry_repositories(id) ON DELETE CASCADE,
    manifest_id UUID NOT NULL REFERENCES registry_manifests(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(repository_id, name)
);

-- Layers (blob references)
CREATE TABLE IF NOT EXISTS registry_layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    digest VARCHAR(128) NOT NULL UNIQUE,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    repository_id UUID REFERENCES registry_repositories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Manifest to layer mapping
CREATE TABLE IF NOT EXISTS registry_manifest_layers (
    manifest_id UUID NOT NULL REFERENCES registry_manifests(id) ON DELETE CASCADE,
    layer_id UUID NOT NULL REFERENCES registry_layers(id) ON DELETE CASCADE,
    layer_order INTEGER NOT NULL,
    PRIMARY KEY (manifest_id, layer_id)
);

-- Upload sessions
CREATE TABLE IF NOT EXISTS registry_uploads (
    id UUID PRIMARY KEY,
    repository_id UUID NOT NULL REFERENCES registry_repositories(id) ON DELETE CASCADE,
    state VARCHAR(20) DEFAULT 'uploading',
    size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Access tokens
CREATE TABLE IF NOT EXISTS registry_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repository_id UUID REFERENCES registry_repositories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(64) NOT NULL,
    token_hash VARCHAR(128) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '["pull"]',
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vulnerability scans
CREATE TABLE IF NOT EXISTS registry_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manifest_id UUID NOT NULL REFERENCES registry_manifests(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scanning', 'completed', 'failed')),
    critical_count INTEGER DEFAULT 0,
    high_count INTEGER DEFAULT 0,
    medium_count INTEGER DEFAULT 0,
    low_count INTEGER DEFAULT 0,
    vulnerabilities JSONB,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registry_repos_user ON registry_repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_registry_repos_namespace ON registry_repositories(namespace);
CREATE INDEX IF NOT EXISTS idx_registry_repos_visibility ON registry_repositories(visibility);
CREATE INDEX IF NOT EXISTS idx_registry_manifests_repo ON registry_manifests(repository_id);
CREATE INDEX IF NOT EXISTS idx_registry_manifests_digest ON registry_manifests(digest);
CREATE INDEX IF NOT EXISTS idx_registry_tags_repo ON registry_tags(repository_id);
CREATE INDEX IF NOT EXISTS idx_registry_tags_manifest ON registry_tags(manifest_id);
CREATE INDEX IF NOT EXISTS idx_registry_layers_digest ON registry_layers(digest);
CREATE INDEX IF NOT EXISTS idx_registry_tokens_repo ON registry_tokens(repository_id);
CREATE INDEX IF NOT EXISTS idx_registry_tokens_hash ON registry_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_registry_scans_manifest ON registry_scans(manifest_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_registry_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_registry_repo_updated ON registry_repositories;
CREATE TRIGGER trigger_registry_repo_updated
    BEFORE UPDATE ON registry_repositories
    FOR EACH ROW
    EXECUTE FUNCTION update_registry_timestamp();

DROP TRIGGER IF EXISTS trigger_registry_manifest_updated ON registry_manifests;
CREATE TRIGGER trigger_registry_manifest_updated
    BEFORE UPDATE ON registry_manifests
    FOR EACH ROW
    EXECUTE FUNCTION update_registry_timestamp();

DROP TRIGGER IF EXISTS trigger_registry_tag_updated ON registry_tags;
CREATE TRIGGER trigger_registry_tag_updated
    BEFORE UPDATE ON registry_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_registry_timestamp();

-- View for repository stats
CREATE OR REPLACE VIEW v_registry_stats AS
SELECT
    r.id,
    r.namespace,
    r.name,
    r.user_id,
    r.visibility,
    r.pull_count,
    r.push_count,
    COUNT(DISTINCT t.id) as tag_count,
    COUNT(DISTINCT m.id) as manifest_count,
    COALESCE(SUM(m.size_bytes), 0) as total_size_bytes
FROM registry_repositories r
LEFT JOIN registry_tags t ON t.repository_id = r.id
LEFT JOIN registry_manifests m ON m.repository_id = r.id
WHERE r.deleted_at IS NULL
GROUP BY r.id, r.namespace, r.name, r.user_id, r.visibility, r.pull_count, r.push_count;

-- Function to get user's registry usage
CREATE OR REPLACE FUNCTION get_user_registry_usage(p_user_id UUID)
RETURNS TABLE (
    total_repositories BIGINT,
    total_images BIGINT,
    total_pulls BIGINT,
    total_size_bytes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT r.id)::BIGINT as total_repositories,
        COUNT(DISTINCT m.id)::BIGINT as total_images,
        COALESCE(SUM(r.pull_count), 0)::BIGINT as total_pulls,
        COALESCE(SUM(m.size_bytes), 0)::BIGINT as total_size_bytes
    FROM registry_repositories r
    LEFT JOIN registry_manifests m ON m.repository_id = r.id
    WHERE r.user_id = p_user_id AND r.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Cleanup stale uploads (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_stale_uploads()
RETURNS void AS $$
BEGIN
    DELETE FROM registry_uploads WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Cleanup unreferenced layers (garbage collection)
CREATE OR REPLACE FUNCTION cleanup_unreferenced_layers()
RETURNS void AS $$
BEGIN
    DELETE FROM registry_layers
    WHERE id NOT IN (SELECT layer_id FROM registry_manifest_layers);
END;
$$ LANGUAGE plpgsql;
