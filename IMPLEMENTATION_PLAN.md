# Bunker Cloud - Complete Implementation Plan

## Executive Summary

This document outlines the complete implementation plan for building Bunker Cloud's backend services on the current VPS infrastructure (16 cores, 30GB RAM, 573GB storage).

**Timeline:** 12-16 weeks for full implementation
**Approach:** Incremental, production-ready deployment

---

## Current State

```
✅ Frontend:      React dashboard deployed at cloud.bunkercorpo.com
✅ SSL:           Let's Encrypt certificates active
✅ Web Server:    Nginx configured
✅ Documentation: Complete docs system built
❌ Backend:       Empty (needs full implementation)
❌ Docker:        Not installed
❌ Databases:     Not installed
❌ Services:      None deployed
```

---

## Architecture Overview

```
                                    ┌─────────────────────────────────────────────────────────────┐
                                    │                    BUNKER CLOUD ARCHITECTURE                 │
                                    └─────────────────────────────────────────────────────────────┘
                                                                │
                                                                ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              EDGE LAYER                                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                                          │
│  │   Nginx     │  │  Traefik    │  │ Let's       │  │ Cloudflare  │                                          │
│  │ (Static)    │  │ (Dynamic)   │  │ Encrypt     │  │ (CDN/DDoS)  │                                          │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                                          │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                │
                                                                ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              API GATEWAY                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Kong / Traefik API Gateway                                                                              │ │
│  │  • Rate Limiting  • Authentication  • Request Routing  • Load Balancing  • API Versioning               │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                │
                    ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
                    ▼                                           ▼                                           ▼
┌─────────────────────────────────┐  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│       CORE SERVICES             │  │       PLATFORM SERVICES          │  │       DEVELOPER SERVICES        │
│  ┌───────────────────────────┐  │  │  ┌───────────────────────────┐  │  │  ┌───────────────────────────┐  │
│  │ Auth Service              │  │  │  │ Database Service          │  │  │  │ Git Service (Gitea)       │  │
│  │ • JWT Authentication      │  │  │  │ • PostgreSQL provisioning │  │  │  │ • Repository hosting      │  │
│  │ • API Key Management      │  │  │  │ • MySQL provisioning      │  │  │  │ • Webhooks                │  │
│  │ • OAuth2/OIDC             │  │  │  │ • Redis provisioning      │  │  │  │ • CI/CD triggers          │  │
│  │ • RBAC Permissions        │  │  │  │ • MongoDB provisioning    │  │  │  └───────────────────────────┘  │
│  └───────────────────────────┘  │  │  │ • Connection pooling      │  │  │  ┌───────────────────────────┐  │
│  ┌───────────────────────────┐  │  │  │ • Automated backups       │  │  │  │ CI/CD Service             │  │
│  │ Billing Service           │  │  │  └───────────────────────────┘  │  │  │ • Build pipelines         │  │
│  │ • Usage metering          │  │  │  ┌───────────────────────────┐  │  │  │ • Deployments             │  │
│  │ • Stripe integration      │  │  │  │ Storage Service (MinIO)   │  │  │  │ • Artifact storage        │  │
│  │ • Invoice generation      │  │  │  │ • S3-compatible API       │  │  │  └───────────────────────────┘  │
│  │ • Subscription mgmt       │  │  │  │ • Bucket management       │  │  │  ┌───────────────────────────┐  │
│  └───────────────────────────┘  │  │  │ • Access policies         │  │  │  │ Container Registry        │  │
│  ┌───────────────────────────┐  │  │  └───────────────────────────┘  │  │  │ • Docker images           │  │
│  │ Notification Service      │  │  │  ┌───────────────────────────┐  │  │  │ • Vulnerability scanning  │  │
│  │ • Email (SMTP)            │  │  │  │ App Platform Service      │  │  │  └───────────────────────────┘  │
│  │ • Webhooks                │  │  │  │ • Container deployment    │  │  └─────────────────────────────────┘
│  │ • In-app notifications    │  │  │  │ • Git integration         │  │
│  └───────────────────────────┘  │  │  │ • Auto-scaling            │  │
└─────────────────────────────────┘  │  │ • Custom domains          │  │
                                     │  └───────────────────────────┘  │
                                     │  ┌───────────────────────────┐  │
                                     │  │ Serverless Functions      │  │
                                     │  │ • Function deployment     │  │
                                     │  │ • Event triggers          │  │
                                     │  │ • Auto-scaling            │  │
                                     │  └───────────────────────────┘  │
                                     └─────────────────────────────────┘
                    │                                           │                                           │
                    ▼                                           ▼                                           ▼
┌─────────────────────────────────┐  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│       NETWORKING SERVICES       │  │       SECURITY SERVICES          │  │       OBSERVABILITY             │
│  ┌───────────────────────────┐  │  │  ┌───────────────────────────┐  │  │  ┌───────────────────────────┐  │
│  │ DNS Service (PowerDNS)    │  │  │  │ Secrets Manager (Vault)   │  │  │  │ Metrics (Prometheus)      │  │
│  │ • Zone management         │  │  │  │ • Secret storage          │  │  │  │ • System metrics          │  │
│  │ • DNSSEC                  │  │  │  │ • Dynamic secrets         │  │  │  │ • App metrics             │  │
│  │ • GeoDNS                  │  │  │  │ • PKI management          │  │  │  │ • Custom metrics          │  │
│  └───────────────────────────┘  │  │  └───────────────────────────┘  │  │  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │  │  ┌───────────────────────────┐  │  │  ┌───────────────────────────┐  │
│  │ Domain Registration       │  │  │  │ SSL/TLS Service           │  │  │  │ Logging (Loki)            │  │
│  │ • OpenSRS/Enom API        │  │  │  │ • Auto-provisioning       │  │  │  │ • Log aggregation         │  │
│  │ • Domain search           │  │  │  │ • Certificate renewal     │  │  │  │ • Log search              │  │
│  │ • WHOIS management        │  │  │  │ • Wildcard certs          │  │  │  │ • Retention policies      │  │
│  └───────────────────────────┘  │  │  └───────────────────────────┘  │  │  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │  │  ┌───────────────────────────┐  │  │  ┌───────────────────────────┐  │
│  │ Load Balancer             │  │  │  │ Firewall Service          │  │  │  │ Dashboards (Grafana)      │  │
│  │ • HTTP/HTTPS              │  │  │  │ • Rule management         │  │  │  │ • Visualization           │  │
│  │ • TCP/UDP                 │  │  │  │ • DDoS protection         │  │  │  │ • Alerting                │  │
│  │ • Health checks           │  │  │  │ • IP blocking             │  │  │  │ • SLO tracking            │  │
│  └───────────────────────────┘  │  │  └───────────────────────────┘  │  │  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │  └─────────────────────────────────┘  │  ┌───────────────────────────┐  │
│  │ VPN Service (WireGuard)   │  │                                       │  │ Uptime Monitoring         │  │
│  │ • Peer management         │  │                                       │  │ • Health checks           │  │
│  │ • Network isolation       │  │                                       │  │ • Status pages            │  │
│  └───────────────────────────┘  │                                       │  │ • Incident mgmt           │  │
└─────────────────────────────────┘                                       │  └───────────────────────────┘  │
                                                                          └─────────────────────────────────┘
                    │                                           │                                           │
                    └───────────────────────────────────────────┼───────────────────────────────────────────┘
                                                                ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           DATA LAYER                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    MySQL     │  │    Redis     │  │   MongoDB    │  │    MinIO     │  │   InfluxDB   │  │
│  │  (Primary)   │  │  (Managed)   │  │   (Cache)    │  │  (Managed)   │  │  (Objects)   │  │  (Metrics)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                                │
                                                                ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        ADDITIONAL SERVICES                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Mailcow    │  │    Gitea     │  │   Drone CI   │  │   OpenFaaS   │  │    Ollama    │  │  WordPress   │  │
│  │   (Email)    │  │    (Git)     │  │   (CI/CD)    │  │ (Serverless) │  │    (AI)      │  │  (Managed)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
/root/bunker-cloud/
├── frontend/                    # Existing React frontend
├── backend/
│   ├── api-gateway/            # Kong/Traefik configuration
│   ├── services/
│   │   ├── auth/               # Authentication service
│   │   ├── billing/            # Billing & usage service
│   │   ├── databases/          # Database provisioning service
│   │   ├── storage/            # Object storage service
│   │   ├── apps/               # App platform service
│   │   ├── functions/          # Serverless functions service
│   │   ├── domains/            # Domain & DNS service
│   │   ├── email/              # Email service
│   │   ├── git/                # Git repositories service
│   │   ├── cicd/               # CI/CD service
│   │   ├── monitoring/         # Monitoring service
│   │   ├── vpn/                # VPN service
│   │   └── ai/                 # AI inference service
│   ├── shared/
│   │   ├── database/           # Shared DB utilities
│   │   ├── queue/              # Message queue utilities
│   │   └── utils/              # Common utilities
│   └── docker-compose.yml      # Main orchestration
├── infrastructure/
│   ├── docker/                 # Dockerfiles
│   ├── nginx/                  # Nginx configurations
│   ├── traefik/                # Traefik configurations
│   └── scripts/                # Deployment scripts
├── data/                       # Persistent data volumes
│   ├── postgres/
│   ├── mysql/
│   ├── redis/
│   ├── mongodb/
│   ├── minio/
│   ├── mailcow/
│   └── gitea/
└── docs/                       # Technical documentation
```

---

## Phase 1: Foundation (Week 1-2)

### 1.1 Docker & Container Infrastructure

**Install Docker & Docker Compose:**
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Docker Compose v2
apt install docker-compose-plugin
```

**Create base docker-compose.yml:**
```yaml
version: '3.8'

networks:
  bunker-internal:
    driver: bridge
    internal: true
  bunker-public:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  minio_data:
  traefik_certs:

services:
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./infrastructure/traefik:/etc/traefik
      - traefik_certs:/certs
    networks:
      - bunker-public
      - bunker-internal
    labels:
      - "traefik.enable=true"

  postgres-system:
    image: postgres:16-alpine
    container_name: postgres-system
    restart: unless-stopped
    environment:
      POSTGRES_USER: bunker_admin
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: bunker_system
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - bunker-internal
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bunker_admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - bunker-internal
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### 1.2 Traefik Reverse Proxy

**Configuration (infrastructure/traefik/traefik.yml):**
```yaml
api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"
    http:
      tls:
        certResolver: letsencrypt

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@bunkercorpo.com
      storage: /certs/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: bunker-public
  file:
    directory: /etc/traefik/dynamic
    watch: true

log:
  level: INFO
  filePath: /var/log/traefik/traefik.log

accessLog:
  filePath: /var/log/traefik/access.log
```

### 1.3 Authentication Service

**Technology Stack:**
- Runtime: Node.js 20 + TypeScript
- Framework: Fastify (high performance)
- Database: PostgreSQL
- Cache: Redis
- Auth: JWT + API Keys

**API Endpoints:**
```
POST   /auth/register              # User registration
POST   /auth/login                 # User login
POST   /auth/logout                # User logout
POST   /auth/refresh               # Refresh token
POST   /auth/forgot-password       # Password reset request
POST   /auth/reset-password        # Password reset
GET    /auth/me                    # Get current user
PUT    /auth/me                    # Update profile
POST   /auth/verify-email          # Email verification
POST   /auth/2fa/enable            # Enable 2FA
POST   /auth/2fa/verify            # Verify 2FA code
POST   /auth/2fa/disable           # Disable 2FA

# API Keys
GET    /api-keys                   # List API keys
POST   /api-keys                   # Create API key
DELETE /api-keys/:id               # Revoke API key

# OAuth
GET    /auth/oauth/:provider       # OAuth redirect
GET    /auth/oauth/:provider/callback  # OAuth callback

# Organizations/Teams
GET    /organizations              # List organizations
POST   /organizations              # Create organization
GET    /organizations/:id          # Get organization
PUT    /organizations/:id          # Update organization
DELETE /organizations/:id          # Delete organization
POST   /organizations/:id/members  # Add member
DELETE /organizations/:id/members/:userId  # Remove member
```

**Database Schema:**
```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    avatar_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- API Keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(10) NOT NULL,
    scopes TEXT[],
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Organization Members
CREATE TABLE organization_members (
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (organization_id, user_id)
);

-- Sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.4 Billing Service

**API Endpoints:**
```
# Subscriptions
GET    /billing/subscription       # Get current subscription
POST   /billing/subscription       # Create subscription
PUT    /billing/subscription       # Update subscription
DELETE /billing/subscription       # Cancel subscription

# Payment Methods
GET    /billing/payment-methods    # List payment methods
POST   /billing/payment-methods    # Add payment method
DELETE /billing/payment-methods/:id # Remove payment method
PUT    /billing/payment-methods/:id/default # Set default

# Invoices
GET    /billing/invoices           # List invoices
GET    /billing/invoices/:id       # Get invoice
GET    /billing/invoices/:id/pdf   # Download invoice PDF

# Usage
GET    /billing/usage              # Get current usage
GET    /billing/usage/history      # Usage history

# Credits
GET    /billing/credits            # Get credit balance
POST   /billing/credits/add        # Add credits (admin)
```

**Database Schema:**
```sql
-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    stripe_subscription_id VARCHAR(255),
    plan_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Usage Records
CREATE TABLE usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id),
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    quantity DECIMAL(20, 6) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id),
    stripe_invoice_id VARCHAR(255),
    amount_due INTEGER NOT NULL,
    amount_paid INTEGER DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'draft',
    due_date TIMESTAMP,
    paid_at TIMESTAMP,
    pdf_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Phase 2: Database Services (Week 3-4)

### 2.1 PostgreSQL-as-a-Service

**Features:**
- One-click database provisioning
- Multiple PostgreSQL versions (14, 15, 16)
- Connection pooling via PgBouncer
- Automated daily backups
- Point-in-time recovery
- Read replicas (future)
- Metrics & monitoring

**API Endpoints:**
```
GET    /databases/postgres              # List databases
POST   /databases/postgres              # Create database
GET    /databases/postgres/:id          # Get database details
DELETE /databases/postgres/:id          # Delete database
POST   /databases/postgres/:id/restart  # Restart database
GET    /databases/postgres/:id/credentials  # Get connection string
POST   /databases/postgres/:id/credentials/rotate  # Rotate password
GET    /databases/postgres/:id/backups  # List backups
POST   /databases/postgres/:id/backups  # Create backup
POST   /databases/postgres/:id/restore  # Restore from backup
GET    /databases/postgres/:id/metrics  # Get metrics
GET    /databases/postgres/:id/logs     # Get logs
```

**Implementation:**
```yaml
# Each customer database runs as a separate container
# docker-compose template for customer postgres
services:
  postgres-{customer_id}:
    image: postgres:{version}-alpine
    container_name: pg-{customer_id}
    restart: unless-stopped
    environment:
      POSTGRES_USER: {username}
      POSTGRES_PASSWORD: {password}
      POSTGRES_DB: {database}
    volumes:
      - /data/postgres/{customer_id}:/var/lib/postgresql/data
    networks:
      - bunker-internal
    labels:
      - "bunker.service=postgres"
      - "bunker.customer={customer_id}"
    deploy:
      resources:
        limits:
          cpus: '{cpu_limit}'
          memory: {memory_limit}
```

**Database Schema:**
```sql
-- Managed Databases
CREATE TABLE managed_databases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    engine VARCHAR(50) NOT NULL, -- postgres, mysql, redis, mongodb
    version VARCHAR(20) NOT NULL,
    plan_size VARCHAR(50) NOT NULL, -- starter, basic, pro, enterprise
    status VARCHAR(50) DEFAULT 'provisioning',
    container_id VARCHAR(100),
    host VARCHAR(255),
    port INTEGER,
    database_name VARCHAR(255),
    username VARCHAR(255),
    password_encrypted TEXT,
    cpu_limit VARCHAR(20),
    memory_limit VARCHAR(20),
    storage_limit VARCHAR(20),
    connection_limit INTEGER,
    region VARCHAR(50) DEFAULT 'default',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Database Backups
CREATE TABLE database_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    database_id UUID REFERENCES managed_databases(id) ON DELETE CASCADE,
    type VARCHAR(50) DEFAULT 'manual', -- manual, scheduled, automatic
    status VARCHAR(50) DEFAULT 'pending',
    size_bytes BIGINT,
    storage_path VARCHAR(500),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 MySQL-as-a-Service

Similar to PostgreSQL with MySQL-specific features:
- MySQL 8.0 support
- InnoDB optimization
- Slow query logging
- Performance schema metrics

### 2.3 Redis-as-a-Service

**Features:**
- Redis 7.x
- Persistence options (RDB/AOF)
- Memory management
- Key expiration policies
- Pub/Sub support

### 2.4 MongoDB-as-a-Service

**Features:**
- MongoDB 6.x/7.x
- Document database
- Indexing management
- Aggregation pipelines

---

## Phase 3: Object Storage (Week 5)

### 3.1 MinIO S3-Compatible Storage

**Features:**
- S3-compatible API
- Bucket management
- Access policies (IAM)
- Presigned URLs
- Versioning
- Lifecycle rules
- Multi-part uploads

**Docker Configuration:**
```yaml
minio:
  image: minio/minio:latest
  container_name: minio
  restart: unless-stopped
  command: server /data --console-address ":9001"
  environment:
    MINIO_ROOT_USER: ${MINIO_ROOT_USER}
    MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    MINIO_DOMAIN: storage.bunkercorpo.com
  volumes:
    - /data/minio:/data
  networks:
    - bunker-internal
    - bunker-public
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.minio-api.rule=Host(`storage.bunkercorpo.com`)"
    - "traefik.http.routers.minio-api.service=minio-api"
    - "traefik.http.services.minio-api.loadbalancer.server.port=9000"
    - "traefik.http.routers.minio-console.rule=Host(`storage-console.bunkercorpo.com`)"
    - "traefik.http.routers.minio-console.service=minio-console"
    - "traefik.http.services.minio-console.loadbalancer.server.port=9001"
```

**API Endpoints:**
```
# Buckets
GET    /storage/buckets                 # List buckets
POST   /storage/buckets                 # Create bucket
GET    /storage/buckets/:name           # Get bucket info
DELETE /storage/buckets/:name           # Delete bucket
PUT    /storage/buckets/:name/policy    # Set bucket policy
GET    /storage/buckets/:name/policy    # Get bucket policy

# Objects
GET    /storage/buckets/:name/objects   # List objects
POST   /storage/buckets/:name/objects   # Upload object
GET    /storage/buckets/:name/objects/:key  # Get object
DELETE /storage/buckets/:name/objects/:key  # Delete object
POST   /storage/buckets/:name/objects/:key/presign  # Generate presigned URL

# Usage
GET    /storage/usage                   # Get storage usage
```

---

## Phase 4: App Platform / PaaS (Week 6-7)

### 4.1 Container Deployment Service

**Features:**
- Deploy from Git (GitHub, GitLab, Gitea)
- Deploy from Docker image
- Deploy from Dockerfile
- Environment variables
- Custom domains
- Auto-SSL
- Health checks
- Rolling deployments
- Horizontal scaling
- Resource limits

**API Endpoints:**
```
# Apps
GET    /apps                            # List apps
POST   /apps                            # Create app
GET    /apps/:id                        # Get app details
PUT    /apps/:id                        # Update app
DELETE /apps/:id                        # Delete app

# Deployments
GET    /apps/:id/deployments            # List deployments
POST   /apps/:id/deployments            # Trigger deployment
GET    /apps/:id/deployments/:deployId  # Get deployment
POST   /apps/:id/deployments/:deployId/rollback  # Rollback

# Environment Variables
GET    /apps/:id/env                    # List env vars
PUT    /apps/:id/env                    # Update env vars

# Domains
GET    /apps/:id/domains                # List domains
POST   /apps/:id/domains                # Add domain
DELETE /apps/:id/domains/:domain        # Remove domain

# Scaling
PUT    /apps/:id/scale                  # Scale app
GET    /apps/:id/instances              # List instances

# Logs
GET    /apps/:id/logs                   # Get logs (streaming)

# Metrics
GET    /apps/:id/metrics                # Get metrics
```

**Database Schema:**
```sql
-- Apps
CREATE TABLE apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- git, docker, dockerfile
    source_repo VARCHAR(500),
    source_branch VARCHAR(255) DEFAULT 'main',
    source_image VARCHAR(500),
    dockerfile_path VARCHAR(255) DEFAULT 'Dockerfile',
    build_command TEXT,
    start_command TEXT,
    port INTEGER DEFAULT 8080,
    replicas INTEGER DEFAULT 1,
    cpu_limit VARCHAR(20) DEFAULT '0.5',
    memory_limit VARCHAR(20) DEFAULT '512Mi',
    status VARCHAR(50) DEFAULT 'stopped',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- App Environment Variables
CREATE TABLE app_env_vars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value_encrypted TEXT NOT NULL,
    is_secret BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- App Domains
CREATE TABLE app_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL UNIQUE,
    ssl_status VARCHAR(50) DEFAULT 'pending',
    ssl_certificate_path VARCHAR(500),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Deployments
CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
    version VARCHAR(100),
    commit_sha VARCHAR(40),
    commit_message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    build_logs TEXT,
    deployed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Serverless Functions (OpenFaaS)

**Docker Configuration:**
```yaml
openfaas:
  gateway:
    image: ghcr.io/openfaas/gateway:latest
    # ... configuration
  queue-worker:
    image: ghcr.io/openfaas/queue-worker:latest
    # ... configuration
```

**API Endpoints:**
```
GET    /functions                       # List functions
POST   /functions                       # Deploy function
GET    /functions/:name                 # Get function
DELETE /functions/:name                 # Delete function
PUT    /functions/:name/scale           # Scale function
POST   /functions/:name/invoke          # Invoke function
GET    /functions/:name/logs            # Get logs
```

---

## Phase 5: Developer Tools (Week 8-9)

### 5.1 Git Repositories (Gitea)

**Docker Configuration:**
```yaml
gitea:
  image: gitea/gitea:latest
  container_name: gitea
  restart: unless-stopped
  environment:
    - USER_UID=1000
    - USER_GID=1000
    - GITEA__database__DB_TYPE=postgres
    - GITEA__database__HOST=postgres-system:5432
    - GITEA__database__NAME=gitea
    - GITEA__database__USER=gitea
    - GITEA__database__PASSWD=${GITEA_DB_PASSWORD}
  volumes:
    - /data/gitea:/data
    - /etc/timezone:/etc/timezone:ro
    - /etc/localtime:/etc/localtime:ro
  networks:
    - bunker-internal
    - bunker-public
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.gitea.rule=Host(`git.bunkercorpo.com`)"
```

### 5.2 Container Registry

**Docker Configuration:**
```yaml
registry:
  image: registry:2
  container_name: registry
  restart: unless-stopped
  environment:
    REGISTRY_AUTH: htpasswd
    REGISTRY_AUTH_HTPASSWD_REALM: Bunker Registry
    REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
    REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /data
  volumes:
    - /data/registry:/data
    - /data/registry-auth:/auth
  networks:
    - bunker-internal
    - bunker-public
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.registry.rule=Host(`registry.bunkercorpo.com`)"
```

### 5.3 CI/CD Pipelines (Drone CI)

**Docker Configuration:**
```yaml
drone:
  image: drone/drone:latest
  container_name: drone
  restart: unless-stopped
  environment:
    - DRONE_GITEA_SERVER=https://git.bunkercorpo.com
    - DRONE_GITEA_CLIENT_ID=${DRONE_GITEA_CLIENT_ID}
    - DRONE_GITEA_CLIENT_SECRET=${DRONE_GITEA_CLIENT_SECRET}
    - DRONE_RPC_SECRET=${DRONE_RPC_SECRET}
    - DRONE_SERVER_HOST=ci.bunkercorpo.com
    - DRONE_SERVER_PROTO=https
  volumes:
    - /data/drone:/data
  networks:
    - bunker-internal
    - bunker-public

drone-runner:
  image: drone/drone-runner-docker:latest
  container_name: drone-runner
  restart: unless-stopped
  environment:
    - DRONE_RPC_PROTO=https
    - DRONE_RPC_HOST=ci.bunkercorpo.com
    - DRONE_RPC_SECRET=${DRONE_RPC_SECRET}
    - DRONE_RUNNER_CAPACITY=4
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  networks:
    - bunker-internal
```

---

## Phase 6: Networking Services (Week 10)

### 6.1 DNS Hosting (PowerDNS)

**Docker Configuration:**
```yaml
powerdns:
  image: powerdns/pdns-auth-48:latest
  container_name: powerdns
  restart: unless-stopped
  environment:
    - PDNS_AUTH_API_KEY=${PDNS_API_KEY}
    - PDNS_AUTH_WEBSERVER=yes
    - PDNS_AUTH_WEBSERVER_ADDRESS=0.0.0.0
    - PDNS_AUTH_WEBSERVER_PORT=8081
  ports:
    - "53:53/tcp"
    - "53:53/udp"
  volumes:
    - /data/powerdns:/var/lib/powerdns
  networks:
    - bunker-internal
    - bunker-public
```

**API Endpoints:**
```
# Zones
GET    /dns/zones                       # List zones
POST   /dns/zones                       # Create zone
GET    /dns/zones/:zone                 # Get zone
DELETE /dns/zones/:zone                 # Delete zone

# Records
GET    /dns/zones/:zone/records         # List records
POST   /dns/zones/:zone/records         # Create record
PUT    /dns/zones/:zone/records/:id     # Update record
DELETE /dns/zones/:zone/records/:id     # Delete record
```

### 6.2 Domain Registration (Reseller API)

**Integration with OpenSRS/Enom:**
```
# Domains
GET    /domains/search                  # Search available domains
GET    /domains                         # List registered domains
POST   /domains                         # Register domain
GET    /domains/:domain                 # Get domain details
PUT    /domains/:domain/nameservers     # Update nameservers
PUT    /domains/:domain/contacts        # Update contacts
POST   /domains/:domain/renew           # Renew domain
POST   /domains/:domain/transfer        # Transfer domain
PUT    /domains/:domain/privacy         # Enable/disable WHOIS privacy
```

### 6.3 VPN Service (WireGuard)

**API Endpoints:**
```
GET    /vpn/networks                    # List VPN networks
POST   /vpn/networks                    # Create VPN network
DELETE /vpn/networks/:id                # Delete VPN network
GET    /vpn/networks/:id/peers          # List peers
POST   /vpn/networks/:id/peers          # Add peer
DELETE /vpn/networks/:id/peers/:peerId  # Remove peer
GET    /vpn/networks/:id/config         # Get WireGuard config
```

---

## Phase 7: Email Service (Week 11)

### 7.1 Mailcow Email Platform

**Docker Configuration:**
```yaml
# Mailcow is complex - use their docker-compose
# Clone: https://github.com/mailcow/mailcow-dockerized
# Subdomain: mail.bunkercorpo.com
```

**API Endpoints:**
```
# Domains
GET    /email/domains                   # List email domains
POST   /email/domains                   # Add email domain
DELETE /email/domains/:domain           # Remove domain

# Mailboxes
GET    /email/domains/:domain/mailboxes # List mailboxes
POST   /email/domains/:domain/mailboxes # Create mailbox
DELETE /email/domains/:domain/mailboxes/:email  # Delete mailbox
PUT    /email/domains/:domain/mailboxes/:email  # Update mailbox

# Aliases
GET    /email/domains/:domain/aliases   # List aliases
POST   /email/domains/:domain/aliases   # Create alias
DELETE /email/domains/:domain/aliases/:alias  # Delete alias

# Forwarding
PUT    /email/domains/:domain/mailboxes/:email/forwarding  # Set forwarding
```

---

## Phase 8: Monitoring & Observability (Week 12)

### 8.1 Prometheus + Grafana Stack

**Docker Configuration:**
```yaml
prometheus:
  image: prom/prometheus:latest
  container_name: prometheus
  restart: unless-stopped
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--storage.tsdb.path=/prometheus'
    - '--storage.tsdb.retention.time=30d'
  volumes:
    - ./infrastructure/prometheus:/etc/prometheus
    - /data/prometheus:/prometheus
  networks:
    - bunker-internal

grafana:
  image: grafana/grafana:latest
  container_name: grafana
  restart: unless-stopped
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    - GF_SERVER_ROOT_URL=https://monitoring.bunkercorpo.com
  volumes:
    - /data/grafana:/var/lib/grafana
  networks:
    - bunker-internal
    - bunker-public
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.grafana.rule=Host(`monitoring.bunkercorpo.com`)"

loki:
  image: grafana/loki:latest
  container_name: loki
  restart: unless-stopped
  volumes:
    - /data/loki:/loki
  networks:
    - bunker-internal

alertmanager:
  image: prom/alertmanager:latest
  container_name: alertmanager
  restart: unless-stopped
  volumes:
    - ./infrastructure/alertmanager:/etc/alertmanager
  networks:
    - bunker-internal
```

### 8.2 Uptime Monitoring (Uptime Kuma)

**Docker Configuration:**
```yaml
uptime-kuma:
  image: louislam/uptime-kuma:latest
  container_name: uptime-kuma
  restart: unless-stopped
  volumes:
    - /data/uptime-kuma:/app/data
  networks:
    - bunker-internal
    - bunker-public
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.uptime.rule=Host(`status.bunkercorpo.com`)"
```

---

## Phase 9: AI Services (Week 13)

### 9.1 Ollama (Local LLM Inference)

**Docker Configuration:**
```yaml
ollama:
  image: ollama/ollama:latest
  container_name: ollama
  restart: unless-stopped
  volumes:
    - /data/ollama:/root/.ollama
  networks:
    - bunker-internal
  deploy:
    resources:
      limits:
        cpus: '8'
        memory: 16G
```

**API Endpoints:**
```
GET    /ai/models                       # List available models
POST   /ai/models/pull                  # Pull a model
DELETE /ai/models/:name                 # Delete model
POST   /ai/completions                  # Generate completion
POST   /ai/chat                         # Chat completion
POST   /ai/embeddings                   # Generate embeddings
```

---

## Phase 10: Static & WordPress Hosting (Week 14)

### 10.1 Static Site Hosting

**Features:**
- Deploy from Git
- Deploy from ZIP upload
- Custom domains
- Auto-SSL
- CDN integration

### 10.2 WordPress Managed Hosting

**Docker Configuration Template:**
```yaml
# Per-customer WordPress
wordpress-{customer_id}:
  image: wordpress:latest
  environment:
    WORDPRESS_DB_HOST: mysql-{customer_id}
    WORDPRESS_DB_USER: wordpress
    WORDPRESS_DB_PASSWORD: {password}
    WORDPRESS_DB_NAME: wordpress
  volumes:
    - /data/wordpress/{customer_id}:/var/www/html
  networks:
    - bunker-internal
    - bunker-public
```

---

## Resource Allocation Plan

### System Reservations
```
Traefik:          0.5 CPU,  512 MB RAM
PostgreSQL (sys): 1.0 CPU,  2 GB RAM
Redis (sys):      0.5 CPU,  1 GB RAM
Auth Service:     0.5 CPU,  512 MB RAM
Billing Service:  0.5 CPU,  512 MB RAM
API Gateway:      0.5 CPU,  512 MB RAM
─────────────────────────────────────
System Total:     3.5 CPU,  5 GB RAM
```

### Available for Customer Services
```
Total:            16 CPU,   30 GB RAM
System Reserved:  3.5 CPU,  5 GB RAM
─────────────────────────────────────
Available:        12.5 CPU, 25 GB RAM
```

### Service Allocation Estimates
```
MinIO:            1 CPU,    2 GB RAM
Prometheus/Graf:  1 CPU,    2 GB RAM
Gitea:            1 CPU,    1 GB RAM
Drone CI:         2 CPU,    2 GB RAM
PowerDNS:         0.5 CPU,  512 MB RAM
Mailcow:          2 CPU,    4 GB RAM
Ollama:           4 CPU,    8 GB RAM
─────────────────────────────────────
Platform Total:   11.5 CPU, 19.5 GB RAM
─────────────────────────────────────
Customer DBs:     1 CPU,    5.5 GB RAM
```

---

## Domain & Subdomain Plan

```
cloud.bunkercorpo.com          → Frontend Dashboard
api.bunkercorpo.com            → API Gateway
auth.bunkercorpo.com           → Authentication Service
storage.bunkercorpo.com        → MinIO S3 API
storage-console.bunkercorpo.com → MinIO Console
git.bunkercorpo.com            → Gitea
registry.bunkercorpo.com       → Docker Registry
ci.bunkercorpo.com             → Drone CI
mail.bunkercorpo.com           → Mailcow
monitoring.bunkercorpo.com     → Grafana
status.bunkercorpo.com         → Uptime Kuma
dns.bunkercorpo.com            → PowerDNS Admin
ai.bunkercorpo.com             → AI API
*.apps.bunkercorpo.com         → Customer Apps (wildcard)
```

---

## Security Checklist

- [ ] All services behind Traefik with auto-SSL
- [ ] Internal network isolation (bunker-internal)
- [ ] API authentication on all endpoints
- [ ] Rate limiting configured
- [ ] Secrets in environment variables (not in code)
- [ ] Regular automated backups
- [ ] Log aggregation and monitoring
- [ ] Fail2ban for SSH protection
- [ ] UFW firewall rules
- [ ] Container security scanning
- [ ] Regular security updates

---

## Backup Strategy

### Daily Backups
- PostgreSQL system database
- Customer databases
- MinIO data
- Gitea repositories
- Mailcow data

### Backup Storage
- Local: /backup (encrypted)
- Remote: S3-compatible (Backblaze B2 or similar)

### Retention
- Daily: 7 days
- Weekly: 4 weeks
- Monthly: 12 months

---

## Monitoring & Alerts

### Metrics to Monitor
- CPU/Memory/Disk usage per service
- Request latency
- Error rates
- Database connections
- Storage usage
- SSL certificate expiry
- Container health

### Alert Channels
- Email
- Slack/Discord webhook
- PagerDuty (optional)

---

## Cost Estimates

### Current Infrastructure
- VPS: ~$50-100/month (Hetzner/similar)

### Additional Costs
- Domain reseller deposit: ~$100-500 one-time
- Email deliverability: May need SMTP relay ($10-50/mo)
- Backups storage: ~$5-20/month
- SSL (Let's Encrypt): Free

### Total Estimated: $65-170/month

---

## Getting Started Commands

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sh

# 2. Clone/setup backend structure
cd /root/bunker-cloud
mkdir -p backend/{services,infrastructure,data}

# 3. Create environment file
cp .env.example .env
# Edit .env with secure passwords

# 4. Start core services
docker compose up -d traefik postgres-system redis

# 5. Initialize database
docker compose exec postgres-system psql -U bunker_admin -d bunker_system -f /init.sql

# 6. Start API services
docker compose up -d auth-service billing-service

# 7. Verify
curl https://api.bunkercorpo.com/health
```

---

## Next Steps

1. **Approve this plan**
2. **Start Phase 1**: Install Docker, setup Traefik, deploy core services
3. **Iterate**: Build each service incrementally, test, deploy
4. **Launch**: Soft launch with beta users
5. **Scale**: Monitor and optimize based on usage

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Author: Claude Code*
