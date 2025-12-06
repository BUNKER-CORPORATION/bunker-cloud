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

  // Redis for function invocation queue
  redis: {
    host: process.env.REDIS_HOST || 'bunker-redis',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
  },

  // Docker for function containers
  docker: {
    socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
    network: process.env.DOCKER_NETWORK || 'bunker-functions',
  },

  // Function execution settings
  execution: {
    defaultTimeout: parseInt(process.env.FUNCTION_DEFAULT_TIMEOUT || '30000'), // 30 seconds
    maxTimeout: parseInt(process.env.FUNCTION_MAX_TIMEOUT || '300000'), // 5 minutes
    defaultMemory: parseInt(process.env.FUNCTION_DEFAULT_MEMORY || '128'), // 128 MB
    maxMemory: parseInt(process.env.FUNCTION_MAX_MEMORY || '1024'), // 1 GB
    maxPayloadSize: parseInt(process.env.FUNCTION_MAX_PAYLOAD || '6291456'), // 6 MB
    coldStartTimeout: parseInt(process.env.FUNCTION_COLD_START_TIMEOUT || '10000'), // 10 seconds
  },

  // Runtime images
  runtimes: {
    'nodejs20': {
      image: 'bunker-runtime-nodejs20:latest',
      handler: 'index.handler',
      extension: '.js',
    },
    'nodejs18': {
      image: 'bunker-runtime-nodejs18:latest',
      handler: 'index.handler',
      extension: '.js',
    },
    'python311': {
      image: 'bunker-runtime-python311:latest',
      handler: 'handler.handler',
      extension: '.py',
    },
    'python310': {
      image: 'bunker-runtime-python310:latest',
      handler: 'handler.handler',
      extension: '.py',
    },
    'go121': {
      image: 'bunker-runtime-go121:latest',
      handler: 'main',
      extension: '.go',
    },
    'rust': {
      image: 'bunker-runtime-rust:latest',
      handler: 'bootstrap',
      extension: '.rs',
    },
  } as Record<string, { image: string; handler: string; extension: string }>,

  // Plan limits
  planLimits: {
    free: {
      max_functions: 3,
      max_invocations_per_month: 10000,
      max_memory_mb: 128,
      max_timeout_ms: 10000,
      concurrent_executions: 1,
    },
    starter: {
      max_functions: 10,
      max_invocations_per_month: 100000,
      max_memory_mb: 256,
      max_timeout_ms: 30000,
      concurrent_executions: 5,
    },
    pro: {
      max_functions: 50,
      max_invocations_per_month: 1000000,
      max_memory_mb: 512,
      max_timeout_ms: 60000,
      concurrent_executions: 20,
    },
    enterprise: {
      max_functions: -1, // unlimited
      max_invocations_per_month: -1,
      max_memory_mb: 1024,
      max_timeout_ms: 300000,
      concurrent_executions: 100,
    },
  },

  // Base domain for functions
  baseDomain: process.env.FUNCTIONS_BASE_DOMAIN || 'fn.bunkercorpo.com',
};
