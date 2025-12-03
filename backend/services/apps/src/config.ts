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

  // Docker
  docker: {
    socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
    network: process.env.DOCKER_NETWORK || 'bunker-apps',
  },

  // App defaults
  defaults: {
    memory: '256m',
    cpus: '0.25',
    replicas: 1,
  },

  // Plan limits
  planLimits: {
    free: {
      max_apps: 1,
      max_memory_mb: 256,
      max_cpus: 0.25,
      max_replicas: 1,
      custom_domains: false,
      ssl: false,
    },
    starter: {
      max_apps: 5,
      max_memory_mb: 512,
      max_cpus: 0.5,
      max_replicas: 2,
      custom_domains: true,
      ssl: true,
    },
    pro: {
      max_apps: 20,
      max_memory_mb: 2048,
      max_cpus: 2,
      max_replicas: 5,
      custom_domains: true,
      ssl: true,
    },
    enterprise: {
      max_apps: -1, // unlimited
      max_memory_mb: 8192,
      max_cpus: 8,
      max_replicas: 20,
      custom_domains: true,
      ssl: true,
    },
  },

  // Base domain for apps
  baseDomain: process.env.APPS_BASE_DOMAIN || 'apps.bunkercorpo.com',
};
