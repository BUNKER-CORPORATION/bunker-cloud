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

  // Docker socket for container management
  docker: {
    socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
  },

  // Database instance defaults
  instances: {
    postgres: {
      image: 'postgres:16-alpine',
      defaultPort: 5432,
      maxPerUser: 10,
    },
    mysql: {
      image: 'mysql:8.0',
      defaultPort: 3306,
      maxPerUser: 10,
    },
    redis: {
      image: 'redis:7-alpine',
      defaultPort: 6379,
      maxPerUser: 10,
    },
    mongodb: {
      image: 'mongo:7',
      defaultPort: 27017,
      maxPerUser: 5,
    },
  },

  // Network
  network: {
    name: 'bunker-databases',
    subnet: '172.30.0.0/16',
  },

  // Resource limits by plan
  planLimits: {
    free: { databases: 1, storage_mb: 512, memory_mb: 256 },
    starter: { databases: 3, storage_mb: 5120, memory_mb: 512 },
    pro: { databases: 10, storage_mb: 51200, memory_mb: 1024 },
    enterprise: { databases: -1, storage_mb: 512000, memory_mb: 4096 },
  },
};
