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

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'bunker-redis',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
  },

  // MinIO
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'bunker-minio',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ROOT_USER || 'bunkeradmin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || '',
    publicEndpoint: process.env.MINIO_PUBLIC_ENDPOINT || 'https://storage.bunkercorpo.com',
  },

  // Storage limits by plan (in bytes)
  planLimits: {
    free: {
      storage_bytes: 1 * 1024 * 1024 * 1024, // 1 GB
      bandwidth_bytes: 10 * 1024 * 1024 * 1024, // 10 GB
      max_buckets: 3,
      max_file_size: 100 * 1024 * 1024, // 100 MB
    },
    starter: {
      storage_bytes: 10 * 1024 * 1024 * 1024, // 10 GB
      bandwidth_bytes: 100 * 1024 * 1024 * 1024, // 100 GB
      max_buckets: 10,
      max_file_size: 500 * 1024 * 1024, // 500 MB
    },
    pro: {
      storage_bytes: 100 * 1024 * 1024 * 1024, // 100 GB
      bandwidth_bytes: 1024 * 1024 * 1024 * 1024, // 1 TB
      max_buckets: 50,
      max_file_size: 5 * 1024 * 1024 * 1024, // 5 GB
    },
    enterprise: {
      storage_bytes: 1024 * 1024 * 1024 * 1024, // 1 TB
      bandwidth_bytes: 10 * 1024 * 1024 * 1024 * 1024, // 10 TB
      max_buckets: -1, // unlimited
      max_file_size: 50 * 1024 * 1024 * 1024, // 50 GB
    },
  },

  // Presigned URL expiry
  presignedUrlExpiry: 3600, // 1 hour
};
