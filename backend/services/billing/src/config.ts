import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.API_PORT || '3000', 10),
  host: process.env.API_HOST || '0.0.0.0',
  isDev: process.env.NODE_ENV !== 'production',

  // Database
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'bunker_admin',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DB || 'bunker_system',
    ssl: process.env.POSTGRES_SSL === 'true',
    poolSize: parseInt(process.env.POSTGRES_POOL_SIZE || '10', 10),
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET || 'change-me-in-production',
  },

  // Bcrypt
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // CORS
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  },

  // Email
  email: {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: {
      name: process.env.SMTP_FROM_NAME || 'Bunker Cloud',
      email: process.env.SMTP_FROM_EMAIL || 'noreply@bunkercorpo.com',
    },
  },

  // URLs
  urls: {
    api: process.env.API_URL || 'http://localhost:3000',
    frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
  },

  // Encryption
  encryption: {
    key: process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'change-me',
  },
};
