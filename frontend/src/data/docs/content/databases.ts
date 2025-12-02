// Database Documentation Content

import { DocPage } from '../types';

export const databasesDocs: Record<string, DocPage> = {
  'databases-overview': {
    id: 'databases-overview',
    title: 'Databases Overview',
    description: 'Introduction to Bunker Cloud managed database services.',
    difficulty: 'beginner',
    timeToRead: '8 min',
    lastUpdated: '2024-12-01',
    content: `
## Introduction

Bunker Cloud Managed Databases provide fully managed database services with automatic backups, scaling, and high availability. Focus on your application while we handle the operational complexity.

## Available Databases

### PostgreSQL

The world's most advanced open-source relational database:

- **Versions**: 14, 15, 16
- **Use cases**: Web apps, analytics, geospatial
- **Features**: Full SQL support, extensions, JSON

### MySQL

Popular relational database:

- **Versions**: 8.0
- **Use cases**: Web apps, e-commerce, CMS
- **Features**: InnoDB engine, replication

### MongoDB

Document database for modern applications:

- **Versions**: 6.0, 7.0
- **Use cases**: Content management, IoT, mobile
- **Features**: Flexible schemas, aggregation

### Redis

In-memory data store:

- **Versions**: 7.x
- **Use cases**: Caching, sessions, real-time
- **Features**: Pub/sub, streams, clustering

## Key Features

### High Availability

All databases include:

- **Multi-AZ deployment**: Automatic failover
- **99.99% uptime SLA**: Enterprise reliability
- **Automatic failover**: Sub-minute recovery

### Automatic Backups

- **Daily automated backups**: Retained for 7-35 days
- **Point-in-time recovery**: Restore to any second
- **Cross-region backups**: Disaster recovery

### Security

- **Encryption at rest**: AES-256
- **Encryption in transit**: TLS 1.3
- **VPC isolation**: Private networking
- **IAM integration**: Fine-grained access

### Scaling

- **Vertical scaling**: Resize with minimal downtime
- **Read replicas**: Scale read workloads
- **Storage auto-scaling**: Grow automatically

## Pricing

### PostgreSQL / MySQL

| Instance | vCPU | Memory | Price/hour |
|----------|------|--------|------------|
| db.small | 1 | 2 GB | $0.025 |
| db.medium | 2 | 4 GB | $0.05 |
| db.large | 4 | 8 GB | $0.10 |
| db.xlarge | 8 | 16 GB | $0.20 |
| db.2xlarge | 16 | 32 GB | $0.40 |

Storage: $0.115/GB/month

### MongoDB

| Cluster | vCPU | Memory | Price/hour |
|---------|------|--------|------------|
| M10 | 2 | 2 GB | $0.08 |
| M20 | 2 | 4 GB | $0.14 |
| M30 | 4 | 8 GB | $0.28 |
| M40 | 8 | 16 GB | $0.56 |

Storage: $0.25/GB/month

### Redis

| Instance | Memory | Price/hour |
|----------|--------|------------|
| cache.small | 1.5 GB | $0.025 |
| cache.medium | 3 GB | $0.05 |
| cache.large | 6 GB | $0.10 |
| cache.xlarge | 13 GB | $0.20 |

## Getting Started

1. **Choose your database** type
2. **Select instance size** based on workload
3. **Configure networking** (VPC, security groups)
4. **Create database** via console, CLI, or API
5. **Connect your application**
    `,
    codeExamples: [
      {
        language: 'bash',
        title: 'Quick database creation',
        code: `# Create PostgreSQL database
bunker databases create my-postgres \\
  --engine postgresql \\
  --version 16 \\
  --type db.medium \\
  --storage 100 \\
  --region us-east-1

# Create Redis cache
bunker databases create my-redis \\
  --engine redis \\
  --version 7 \\
  --type cache.medium

# Get connection string
bunker databases connection-string my-postgres`
      }
    ],
    relatedDocs: ['postgresql', 'mysql', 'mongodb', 'redis']
  },

  'postgresql': {
    id: 'postgresql',
    title: 'PostgreSQL',
    description: 'Managed PostgreSQL database service.',
    difficulty: 'intermediate',
    timeToRead: '15 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Bunker PostgreSQL provides a fully managed PostgreSQL database with automatic backups, high availability, and seamless scaling.

## Creating a Database

### Using the Console

1. Navigate to **Databases → Create Database**
2. Select **PostgreSQL**
3. Configure:
   - Instance name
   - PostgreSQL version (14, 15, 16)
   - Instance type
   - Storage size
   - VPC and subnet
4. Set credentials
5. Create

### Using the CLI

\`\`\`bash
bunker databases create my-postgres \\
  --engine postgresql \\
  --version 16 \\
  --type db.large \\
  --storage 100 \\
  --vpc my-vpc \\
  --username admin \\
  --password-secret db-password
\`\`\`

## Configuration

### Instance Types

| Type | vCPU | Memory | Max Connections | Max IOPS |
|------|------|--------|-----------------|----------|
| db.small | 1 | 2 GB | 100 | 3,000 |
| db.medium | 2 | 4 GB | 200 | 6,000 |
| db.large | 4 | 8 GB | 400 | 12,000 |
| db.xlarge | 8 | 16 GB | 800 | 20,000 |
| db.2xlarge | 16 | 32 GB | 1,600 | 40,000 |

### Storage

- **Type**: SSD (default) or Provisioned IOPS
- **Size**: 20 GB - 16 TB
- **Auto-scaling**: Automatically grow storage
- **IOPS**: 3,000 - 64,000 (provisioned)

### Parameters

Customize PostgreSQL parameters:

\`\`\`bash
bunker databases parameters set my-postgres \\
  --parameter "max_connections=500" \\
  --parameter "shared_buffers=2GB" \\
  --parameter "work_mem=256MB"
\`\`\`

Common parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| max_connections | 100 | Maximum client connections |
| shared_buffers | 25% RAM | Shared memory for caching |
| work_mem | 4MB | Memory for query operations |
| maintenance_work_mem | 64MB | Memory for maintenance |
| effective_cache_size | 75% RAM | Planner's cache estimate |

## Connecting

### Connection String

\`\`\`bash
bunker databases connection-string my-postgres
# postgresql://admin:****@my-postgres.db.bunkercloud.com:5432/postgres
\`\`\`

### Connection Parameters

| Parameter | Value |
|-----------|-------|
| Host | my-postgres.db.bunkercloud.com |
| Port | 5432 |
| Database | postgres |
| SSL | required |

### Application Connection

**Node.js (pg)**
\`\`\`javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true }
});

const result = await pool.query('SELECT NOW()');
\`\`\`

**Python (psycopg2)**
\`\`\`python
import psycopg2

conn = psycopg2.connect(
    host="my-postgres.db.bunkercloud.com",
    database="postgres",
    user="admin",
    password=os.environ["DB_PASSWORD"],
    sslmode="require"
)
\`\`\`

## High Availability

### Multi-AZ Deployment

Enable automatic failover:

\`\`\`bash
bunker databases create my-postgres \\
  --engine postgresql \\
  --multi-az \\
  --type db.large
\`\`\`

Features:
- Synchronous replication to standby
- Automatic failover (< 60 seconds)
- No connection string changes

### Manual Failover

\`\`\`bash
bunker databases failover my-postgres
\`\`\`

## Read Replicas

### Create Replica

\`\`\`bash
bunker databases replicas create my-postgres \\
  --name my-postgres-replica \\
  --region us-east-1
\`\`\`

### Cross-Region Replica

\`\`\`bash
bunker databases replicas create my-postgres \\
  --name my-postgres-eu \\
  --region eu-west-1
\`\`\`

### Connection Pooling with Replicas

\`\`\`javascript
const primary = new Pool({ connectionString: PRIMARY_URL });
const replica = new Pool({ connectionString: REPLICA_URL });

// Write to primary
await primary.query('INSERT INTO users ...');

// Read from replica
const users = await replica.query('SELECT * FROM users');
\`\`\`

## Backups

### Automated Backups

- Daily snapshots
- Transaction log backups every 5 minutes
- Retained for 7-35 days

### Manual Snapshot

\`\`\`bash
bunker databases snapshot my-postgres --name pre-migration
\`\`\`

### Point-in-Time Recovery

\`\`\`bash
bunker databases restore my-postgres \\
  --target-time "2024-12-14T10:30:00Z" \\
  --new-instance my-postgres-restored
\`\`\`

## Extensions

### Available Extensions

- PostGIS (geospatial)
- pgvector (AI embeddings)
- pg_stat_statements
- uuid-ossp
- hstore
- pg_trgm
- And 50+ more

### Enable Extension

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";
\`\`\`

## Monitoring

### Metrics

- CPU utilization
- Memory usage
- Disk I/O
- Connections
- Query performance
- Replication lag

### Query Insights

\`\`\`bash
bunker databases insights my-postgres
\`\`\`

View:
- Slowest queries
- Most frequent queries
- Lock contention
- Index recommendations

## Maintenance

### Updates

- Minor version updates: Automatic
- Major version upgrades: Manual

\`\`\`bash
bunker databases upgrade my-postgres --version 16
\`\`\`

### Maintenance Window

\`\`\`bash
bunker databases update my-postgres \\
  --maintenance-window "sun:02:00-sun:04:00"
\`\`\`
    `,
    codeExamples: [
      {
        language: 'javascript',
        title: 'Complete PostgreSQL setup',
        code: `// Node.js application with connection pooling
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await pool.end();
});

// Query helper
export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Query executed', { text, duration, rows: res.rowCount });
  return res;
}

// Transaction helper
export async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}`
      }
    ],
    relatedDocs: ['connection-pooling', 'read-replicas', 'database-backups']
  },

  'mysql': {
    id: 'mysql',
    title: 'MySQL',
    description: 'Managed MySQL database service.',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Bunker MySQL provides a fully managed MySQL database compatible with MySQL 8.0. Perfect for web applications, e-commerce, and content management systems.

## Creating a Database

\`\`\`bash
bunker databases create my-mysql \\
  --engine mysql \\
  --version 8.0 \\
  --type db.large \\
  --storage 100 \\
  --username admin
\`\`\`

## Configuration

### Instance Types

Same as PostgreSQL instances (db.small through db.2xlarge).

### Parameters

\`\`\`bash
bunker databases parameters set my-mysql \\
  --parameter "max_connections=500" \\
  --parameter "innodb_buffer_pool_size=4G"
\`\`\`

Key parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| max_connections | 151 | Maximum connections |
| innodb_buffer_pool_size | 75% RAM | InnoDB cache |
| query_cache_size | 0 | Query cache (deprecated in 8.0) |
| max_allowed_packet | 64MB | Max packet size |

## Connecting

### Connection String

\`\`\`bash
bunker databases connection-string my-mysql
# mysql://admin:****@my-mysql.db.bunkercloud.com:3306/mysql
\`\`\`

### Application Connection

**Node.js (mysql2)**
\`\`\`javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true }
});

const [rows] = await pool.query('SELECT * FROM users');
\`\`\`

**Python (mysql-connector)**
\`\`\`python
import mysql.connector

conn = mysql.connector.connect(
    host="my-mysql.db.bunkercloud.com",
    user="admin",
    password=os.environ["DB_PASSWORD"],
    database="myapp",
    ssl_ca="/path/to/ca-cert.pem"
)
\`\`\`

## High Availability

### Multi-AZ

\`\`\`bash
bunker databases create my-mysql \\
  --engine mysql \\
  --multi-az
\`\`\`

### Read Replicas

\`\`\`bash
bunker databases replicas create my-mysql --name my-mysql-replica
\`\`\`

## Backups

### Automated Backups

- Daily full backups
- Binary log backups every 5 minutes
- 7-35 day retention

### Restore

\`\`\`bash
bunker databases restore my-mysql \\
  --target-time "2024-12-14T10:00:00Z" \\
  --new-instance my-mysql-restored
\`\`\`

## Monitoring

View metrics:

\`\`\`bash
bunker databases metrics my-mysql
\`\`\`

Slow query log:

\`\`\`bash
bunker databases logs my-mysql --type slowquery
\`\`\`
    `,
    relatedDocs: ['databases-overview', 'connection-pooling', 'database-backups']
  },

  'mongodb': {
    id: 'mongodb',
    title: 'MongoDB',
    description: 'Managed MongoDB database service.',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Bunker MongoDB provides a fully managed MongoDB cluster with automatic sharding, replication, and backups.

## Creating a Cluster

\`\`\`bash
bunker databases create my-mongo \\
  --engine mongodb \\
  --version 7.0 \\
  --type M30 \\
  --region us-east-1
\`\`\`

## Cluster Types

| Type | vCPU | Memory | Storage | Price/hour |
|------|------|--------|---------|------------|
| M10 | 2 | 2 GB | 10 GB | $0.08 |
| M20 | 2 | 4 GB | 20 GB | $0.14 |
| M30 | 4 | 8 GB | 40 GB | $0.28 |
| M40 | 8 | 16 GB | 80 GB | $0.56 |
| M50 | 16 | 32 GB | 160 GB | $1.12 |

## Connecting

### Connection String

\`\`\`bash
bunker databases connection-string my-mongo
# mongodb+srv://admin:****@my-mongo.mongodb.bunkercloud.com/mydb
\`\`\`

### Application Connection

**Node.js**
\`\`\`javascript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const db = client.db('myapp');
const users = await db.collection('users').find({}).toArray();
\`\`\`

**Python**
\`\`\`python
from pymongo import MongoClient

client = MongoClient(os.environ["MONGODB_URI"])
db = client.myapp
users = list(db.users.find({}))
\`\`\`

## Replica Sets

All clusters include a 3-node replica set:
- 1 Primary
- 2 Secondaries
- Automatic failover

### Read Preferences

\`\`\`javascript
const client = new MongoClient(uri, {
  readPreference: 'secondaryPreferred'
});
\`\`\`

Options:
- \`primary\`: All reads from primary
- \`primaryPreferred\`: Primary, fallback to secondary
- \`secondary\`: All reads from secondaries
- \`secondaryPreferred\`: Secondary, fallback to primary
- \`nearest\`: Lowest latency node

## Sharding

Enable sharding for large datasets:

\`\`\`bash
bunker databases update my-mongo --sharding enabled
\`\`\`

Shard a collection:

\`\`\`javascript
db.adminCommand({
  shardCollection: "mydb.users",
  key: { user_id: "hashed" }
});
\`\`\`

## Indexes

Create indexes for performance:

\`\`\`javascript
// Single field index
db.users.createIndex({ email: 1 }, { unique: true });

// Compound index
db.orders.createIndex({ user_id: 1, created_at: -1 });

// Text index
db.articles.createIndex({ title: "text", content: "text" });
\`\`\`

## Backups

### Automated

- Continuous backups with point-in-time recovery
- Daily snapshots retained for 7 days

### Restore

\`\`\`bash
bunker databases restore my-mongo \\
  --target-time "2024-12-14T10:00:00Z"
\`\`\`

## Monitoring

### Metrics

- Operations/second
- Connections
- Memory usage
- Disk I/O
- Replication lag

### Performance Advisor

\`\`\`bash
bunker databases insights my-mongo
\`\`\`

Get index recommendations and slow query analysis.
    `,
    relatedDocs: ['databases-overview', 'database-backups', 'database-migration']
  },

  'redis': {
    id: 'redis',
    title: 'Redis',
    description: 'Managed Redis for caching and real-time data.',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Bunker Redis provides a fully managed Redis service for caching, session storage, real-time analytics, and message queues.

## Creating a Redis Instance

\`\`\`bash
bunker databases create my-redis \\
  --engine redis \\
  --version 7 \\
  --type cache.large \\
  --region us-east-1
\`\`\`

## Instance Types

| Type | Memory | Network | Price/hour |
|------|--------|---------|------------|
| cache.small | 1.5 GB | 1 Gbps | $0.025 |
| cache.medium | 3 GB | 2 Gbps | $0.05 |
| cache.large | 6 GB | 4 Gbps | $0.10 |
| cache.xlarge | 13 GB | 8 Gbps | $0.20 |
| cache.2xlarge | 26 GB | 10 Gbps | $0.40 |

## Cluster Mode

### Standard (Single Node)

\`\`\`bash
bunker databases create my-redis --engine redis
\`\`\`

### Cluster Mode

For larger datasets and higher throughput:

\`\`\`bash
bunker databases create my-redis \\
  --engine redis \\
  --cluster \\
  --shards 3 \\
  --replicas 2
\`\`\`

## Connecting

### Connection String

\`\`\`bash
bunker databases connection-string my-redis
# redis://default:****@my-redis.cache.bunkercloud.com:6379
\`\`\`

### Application Connection

**Node.js (ioredis)**
\`\`\`javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Set with expiration
await redis.set('user:1', JSON.stringify(user), 'EX', 3600);

// Get
const user = JSON.parse(await redis.get('user:1'));
\`\`\`

**Python (redis-py)**
\`\`\`python
import redis

r = redis.from_url(os.environ["REDIS_URL"])

# Set with expiration
r.setex('user:1', 3600, json.dumps(user))

# Get
user = json.loads(r.get('user:1'))
\`\`\`

## Common Use Cases

### Caching

\`\`\`javascript
async function getUser(id) {
  // Check cache first
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  // Fetch from database
  const user = await db.users.findById(id);

  // Cache for 1 hour
  await redis.setex(\`user:\${id}\`, 3600, JSON.stringify(user));

  return user;
}
\`\`\`

### Session Storage

\`\`\`javascript
import session from 'express-session';
import RedisStore from 'connect-redis';

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, maxAge: 86400000 }
}));
\`\`\`

### Rate Limiting

\`\`\`javascript
async function rateLimit(ip, limit = 100, window = 60) {
  const key = \`ratelimit:\${ip}\`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  return current <= limit;
}
\`\`\`

### Pub/Sub

\`\`\`javascript
// Publisher
await redis.publish('notifications', JSON.stringify({
  type: 'new_message',
  data: { userId: 1, message: 'Hello' }
}));

// Subscriber
const sub = new Redis(process.env.REDIS_URL);
sub.subscribe('notifications');
sub.on('message', (channel, message) => {
  console.log('Received:', JSON.parse(message));
});
\`\`\`

### Leaderboards

\`\`\`javascript
// Add scores
await redis.zadd('leaderboard', score, oduserId);

// Get top 10
const topPlayers = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// Get user rank
const rank = await redis.zrevrank('leaderboard', oduserId);
\`\`\`

## High Availability

### Automatic Failover

- Standby replica in different AZ
- < 30 second failover
- No endpoint changes

### Multi-AZ

\`\`\`bash
bunker databases create my-redis \\
  --engine redis \\
  --multi-az
\`\`\`

## Data Persistence

### RDB Snapshots

Periodic point-in-time snapshots:

\`\`\`bash
bunker databases update my-redis \\
  --snapshot-window "03:00-04:00"
\`\`\`

### AOF (Append Only File)

Write-ahead logging for durability:

\`\`\`bash
bunker databases update my-redis \\
  --aof enabled
\`\`\`

## Monitoring

### Metrics

- Memory usage
- Cache hit rate
- Connected clients
- Operations/second
- Network bandwidth

### Slow Log

\`\`\`bash
bunker databases logs my-redis --type slowlog
\`\`\`
    `,
    codeExamples: [
      {
        language: 'javascript',
        title: 'Complete Redis caching pattern',
        code: `import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache-aside pattern with automatic refresh
async function cachedQuery(key, ttl, fetchFn) {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) {
    // Refresh in background if TTL < 20%
    const remainingTtl = await redis.ttl(key);
    if (remainingTtl < ttl * 0.2) {
      fetchFn().then(data =>
        redis.setex(key, ttl, JSON.stringify(data))
      );
    }
    return JSON.parse(cached);
  }

  // Fetch and cache
  const data = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// Usage
const user = await cachedQuery(
  \`user:\${userId}\`,
  3600,
  () => db.users.findById(userId)
);`
      }
    ],
    relatedDocs: ['databases-overview', 'connection-pooling', 'auto-scaling']
  },

  'connection-pooling': {
    id: 'connection-pooling',
    title: 'Connection Pooling',
    description: 'Optimize database connections with connection pooling.',
    difficulty: 'intermediate',
    timeToRead: '8 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Connection pooling reduces database connection overhead by reusing existing connections instead of creating new ones for each request.

## Built-in Connection Pooler

Bunker databases include a built-in connection pooler (PgBouncer for PostgreSQL).

### Enable Connection Pooling

\`\`\`bash
bunker databases update my-postgres \\
  --connection-pooling enabled \\
  --pool-size 200
\`\`\`

### Pool Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| Transaction | Connection per transaction | Most apps |
| Session | Connection per session | Prepared statements |
| Statement | Connection per query | Simple queries |

## Connection String

### Direct Connection

\`\`\`
postgresql://user:pass@db.bunkercloud.com:5432/mydb
\`\`\`

### Pooled Connection

\`\`\`
postgresql://user:pass@db.bunkercloud.com:6432/mydb?pgbouncer=true
\`\`\`

## Application-Level Pooling

### Node.js (pg)

\`\`\`javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Close idle connections
  connectionTimeoutMillis: 2000
});
\`\`\`

### Python (psycopg2)

\`\`\`python
from psycopg2 import pool

connection_pool = pool.ThreadedConnectionPool(
    minconn=5,
    maxconn=20,
    dsn=os.environ["DATABASE_URL"]
)
\`\`\`

### Java (HikariCP)

\`\`\`java
HikariConfig config = new HikariConfig();
config.setJdbcUrl(System.getenv("DATABASE_URL"));
config.setMaximumPoolSize(20);
config.setMinimumIdle(5);
config.setIdleTimeout(30000);
config.setConnectionTimeout(2000);

HikariDataSource ds = new HikariDataSource(config);
\`\`\`

## Best Practices

### Pool Size Formula

\`\`\`
connections = ((core_count * 2) + effective_spindle_count)
\`\`\`

For most cloud databases:
- Small app: 5-10 connections
- Medium app: 20-50 connections
- Large app: 50-100 connections

### Connection Limits

| Instance | Max Connections |
|----------|-----------------|
| db.small | 100 |
| db.medium | 200 |
| db.large | 400 |
| db.xlarge | 800 |

### Monitoring

\`\`\`bash
bunker databases metrics my-postgres --metric connections
\`\`\`

Watch for:
- Connection count near max
- Connection wait time
- Idle connection count
    `,
    relatedDocs: ['postgresql', 'mysql', 'databases-overview']
  },

  'read-replicas': {
    id: 'read-replicas',
    title: 'Read Replicas',
    description: 'Scale read workloads with database replicas.',
    difficulty: 'intermediate',
    timeToRead: '8 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Read replicas allow you to scale read-heavy workloads by distributing queries across multiple database instances.

## Creating Read Replicas

### Same Region

\`\`\`bash
bunker databases replicas create my-postgres \\
  --name my-postgres-replica \\
  --type db.large
\`\`\`

### Cross-Region

\`\`\`bash
bunker databases replicas create my-postgres \\
  --name my-postgres-eu \\
  --region eu-west-1
\`\`\`

## Replication

### How It Works

1. Write operations go to primary
2. Changes replicated to replicas
3. Replicas serve read queries

### Replication Lag

Monitor replica lag:

\`\`\`bash
bunker databases metrics my-postgres-replica --metric replication_lag
\`\`\`

Typical lag: < 1 second

## Using Read Replicas

### Separate Connections

\`\`\`javascript
const primary = new Pool({ connectionString: PRIMARY_URL });
const replica = new Pool({ connectionString: REPLICA_URL });

// Writes to primary
await primary.query('INSERT INTO orders ...');

// Reads from replica
const orders = await replica.query('SELECT * FROM orders');
\`\`\`

### Connection Routing

\`\`\`javascript
class DatabaseRouter {
  constructor(primaryUrl, replicaUrls) {
    this.primary = new Pool({ connectionString: primaryUrl });
    this.replicas = replicaUrls.map(url =>
      new Pool({ connectionString: url })
    );
    this.replicaIndex = 0;
  }

  write() {
    return this.primary;
  }

  read() {
    // Round-robin across replicas
    const replica = this.replicas[this.replicaIndex];
    this.replicaIndex = (this.replicaIndex + 1) % this.replicas.length;
    return replica;
  }
}
\`\`\`

## Promotion

Promote a replica to primary:

\`\`\`bash
bunker databases replicas promote my-postgres-replica
\`\`\`

Use cases:
- Disaster recovery
- Region migration
- Blue-green deployments

## Best Practices

1. **Use for read scaling**: Reports, analytics, searches
2. **Account for lag**: Don't read immediately after write
3. **Monitor lag**: Alert on excessive replication lag
4. **Right-size replicas**: Match workload, not primary
    `,
    relatedDocs: ['postgresql', 'mysql', 'database-backups']
  },

  'database-backups': {
    id: 'database-backups',
    title: 'Backups & Recovery',
    description: 'Database backup strategies and point-in-time recovery.',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Bunker databases include automated backups with point-in-time recovery, ensuring your data is always protected.

## Automated Backups

### Configuration

\`\`\`bash
bunker databases update my-postgres \\
  --backup-retention 14 \\
  --backup-window "02:00-03:00"
\`\`\`

### Backup Types

| Type | Frequency | Retention |
|------|-----------|-----------|
| Daily snapshot | Once daily | 7-35 days |
| Transaction logs | Every 5 min | Same as snapshot |
| Cross-region | Optional | Same as source |

## Manual Snapshots

### Create Snapshot

\`\`\`bash
bunker databases snapshot my-postgres \\
  --name pre-migration-backup
\`\`\`

### List Snapshots

\`\`\`bash
bunker databases snapshots list --database my-postgres
\`\`\`

### Delete Snapshot

\`\`\`bash
bunker databases snapshots delete snap-abc123
\`\`\`

## Point-in-Time Recovery

Restore to any point within the retention period:

\`\`\`bash
bunker databases restore my-postgres \\
  --target-time "2024-12-14T10:30:00Z" \\
  --new-instance my-postgres-restored
\`\`\`

### Recovery Time

| Database Size | Estimated Time |
|---------------|----------------|
| < 100 GB | 15-30 minutes |
| 100-500 GB | 30-60 minutes |
| > 500 GB | 1-3 hours |

## Cross-Region Backups

### Enable

\`\`\`bash
bunker databases update my-postgres \\
  --cross-region-backup eu-west-1
\`\`\`

### Restore in Different Region

\`\`\`bash
bunker databases restore my-postgres \\
  --snapshot snap-abc123 \\
  --region eu-west-1 \\
  --new-instance my-postgres-eu
\`\`\`

## Export Data

### Export to Object Storage

\`\`\`bash
bunker databases export my-postgres \\
  --format sql \\
  --bucket my-backups \\
  --path exports/
\`\`\`

### Formats

- SQL (pg_dump format)
- CSV
- Parquet (for analytics)

## Best Practices

1. **Test restores regularly**: Verify backups work
2. **Use cross-region**: For disaster recovery
3. **Extend retention**: For compliance requirements
4. **Export critical data**: Additional safety layer
5. **Document RTO/RPO**: Know your recovery objectives
    `,
    relatedDocs: ['databases-overview', 'snapshots', 'read-replicas']
  },

  'database-migration': {
    id: 'database-migration',
    title: 'Database Migration',
    description: 'Migrate databases to Bunker Cloud.',
    difficulty: 'advanced',
    timeToRead: '12 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Migrate your existing databases to Bunker Cloud with minimal downtime using our migration tools.

## Migration Methods

### 1. pg_dump / mysqldump

For smaller databases (< 100GB):

\`\`\`bash
# Export from source
pg_dump -h source-host -U user -d mydb > backup.sql

# Import to Bunker
psql -h my-postgres.db.bunkercloud.com -U admin -d mydb < backup.sql
\`\`\`

### 2. Database Migration Service

For larger databases with minimal downtime:

\`\`\`bash
bunker migration create my-migration \\
  --source "postgresql://user:pass@source:5432/db" \\
  --target my-postgres \\
  --type continuous
\`\`\`

### 3. Logical Replication

For zero-downtime migrations:

\`\`\`sql
-- On source
CREATE PUBLICATION my_pub FOR ALL TABLES;

-- On target (Bunker)
CREATE SUBSCRIPTION my_sub
  CONNECTION 'host=source port=5432 dbname=mydb'
  PUBLICATION my_pub;
\`\`\`

## Migration Steps

### Pre-Migration

1. **Assess source database**
   \`\`\`bash
   bunker migration assess \\
     --source "postgresql://..." \\
     --target-engine postgresql
   \`\`\`

2. **Create target database** with appropriate size

3. **Configure networking** (VPN/peering if needed)

### Migration

1. **Start initial sync**
   \`\`\`bash
   bunker migration start my-migration
   \`\`\`

2. **Monitor progress**
   \`\`\`bash
   bunker migration status my-migration
   \`\`\`

3. **Verify data**
   \`\`\`bash
   bunker migration validate my-migration
   \`\`\`

### Cutover

1. **Stop writes to source**
2. **Wait for replication to catch up**
3. **Update application connection strings**
4. **Verify application functionality**
5. **Stop migration**
   \`\`\`bash
   bunker migration complete my-migration
   \`\`\`

## Schema Compatibility

### PostgreSQL

| Feature | Supported |
|---------|-----------|
| Standard SQL | Yes |
| Extensions | Most |
| Stored procedures | Yes |
| Foreign keys | Yes |
| Triggers | Yes |

### MySQL

| Feature | Supported |
|---------|-----------|
| InnoDB tables | Yes |
| Views | Yes |
| Stored procedures | Yes |
| Events | Limited |
| MyISAM | Converted to InnoDB |

## Troubleshooting

### Connection Issues

\`\`\`bash
# Test connectivity
bunker migration test-connection \\
  --source "postgresql://..."
\`\`\`

### Slow Migration

- Increase migration instance size
- Disable indexes during initial load
- Use parallel migration for large tables

### Data Validation

\`\`\`bash
bunker migration validate my-migration \\
  --full-table-compare
\`\`\`
    `,
    relatedDocs: ['databases-overview', 'postgresql', 'mysql']
  }
};
