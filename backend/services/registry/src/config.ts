export const config = {
  port: parseInt(process.env.API_PORT || '3000'),
  host: process.env.API_HOST || '0.0.0.0',

  // System database
  database: {
    host: process.env.POSTGRES_HOST || 'bunker-postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: process.env.POSTGRES_USER || 'bunkercloud',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DB || 'bunkercloud',
  },

  // Redis for caching
  redis: {
    host: process.env.REDIS_HOST || 'bunker-redis',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
  },

  // MinIO for blob storage
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'bunker-minio',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    useSSL: process.env.MINIO_USE_SSL === 'true',
    bucket: process.env.REGISTRY_BUCKET || 'bunker-registry',
  },

  // Registry settings
  registry: {
    maxImageSize: parseInt(process.env.MAX_IMAGE_SIZE || '5368709120'), // 5GB
    maxTagsPerRepo: parseInt(process.env.MAX_TAGS_PER_REPO || '100'),
    tokenExpiry: parseInt(process.env.REGISTRY_TOKEN_EXPIRY || '3600'), // 1 hour
  },

  // Plan limits
  planLimits: {
    free: {
      max_repositories: 3,
      max_storage_gb: 1,
      max_pulls_per_month: 100,
      private_repos: false,
    },
    starter: {
      max_repositories: 10,
      max_storage_gb: 10,
      max_pulls_per_month: 1000,
      private_repos: true,
    },
    pro: {
      max_repositories: 50,
      max_storage_gb: 100,
      max_pulls_per_month: 10000,
      private_repos: true,
    },
    enterprise: {
      max_repositories: -1, // unlimited
      max_storage_gb: 1000,
      max_pulls_per_month: -1,
      private_repos: true,
    },
  },

  // Base domain for registry
  baseDomain: process.env.REGISTRY_DOMAIN || 'registry.bunkercorpo.com',
};
