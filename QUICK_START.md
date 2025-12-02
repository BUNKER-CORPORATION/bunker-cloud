# Bunker Cloud - Quick Start Guide

## Phase-by-Phase Checklist

### PHASE 1: Foundation (Week 1-2)
```
□ Install Docker & Docker Compose
□ Create directory structure
□ Setup environment variables (.env)
□ Deploy Traefik reverse proxy
□ Deploy PostgreSQL (system database)
□ Deploy Redis (caching/sessions)
□ Build & deploy Auth Service
□ Build & deploy Billing Service
□ Configure DNS records for api.bunkercorpo.com
□ Test authentication endpoints
```

### PHASE 2: Database Services (Week 3-4)
```
□ Build Database Provisioning Service
□ PostgreSQL provisioning logic
□ MySQL provisioning logic
□ Redis provisioning logic
□ MongoDB provisioning logic
□ Automated backup system
□ Connection pooling (PgBouncer)
□ Database metrics collection
□ API integration with frontend
□ Test database creation flow
```

### PHASE 3: Object Storage (Week 5)
```
□ Deploy MinIO
□ Configure storage.bunkercorpo.com
□ Build Storage Service API
□ Bucket management
□ Access policy management
□ Presigned URL generation
□ Usage metering
□ API integration with frontend
□ Test file upload/download
```

### PHASE 4: App Platform (Week 6-7)
```
□ Build App Deployment Service
□ Git webhook integration (GitHub)
□ Docker image builder
□ Container orchestration
□ Environment variable management
□ Custom domain support
□ Auto-SSL for customer domains
□ Health checks & restart policies
□ Deployment logs
□ Configure *.apps.bunkercorpo.com wildcard
□ Test app deployment from Git
```

### PHASE 5: Developer Tools (Week 8-9)
```
□ Deploy Gitea (git.bunkercorpo.com)
□ Deploy Docker Registry (registry.bunkercorpo.com)
□ Deploy Drone CI (ci.bunkercorpo.com)
□ Build Git Service API
□ Build Registry Service API
□ Build CI/CD Service API
□ Webhook integrations
□ API integration with frontend
□ Test Git push → CI → Deploy flow
```

### PHASE 6: Networking (Week 10)
```
□ Deploy PowerDNS
□ Configure DNS API
□ Build DNS Service
□ Integrate domain reseller API (OpenSRS)
□ Build Domain Service
□ Deploy WireGuard
□ Build VPN Service
□ API integration with frontend
□ Test domain registration
□ Test DNS zone management
```

### PHASE 7: Email (Week 11)
```
□ Deploy Mailcow (mail.bunkercorpo.com)
□ Configure MX, SPF, DKIM, DMARC
□ Build Email Service API
□ Domain verification system
□ Mailbox provisioning
□ Alias management
□ API integration with frontend
□ Test email sending/receiving
```

### PHASE 8: Monitoring (Week 12)
```
□ Deploy Prometheus
□ Deploy Grafana (monitoring.bunkercorpo.com)
□ Deploy Loki (logs)
□ Deploy Alertmanager
□ Deploy Uptime Kuma (status.bunkercorpo.com)
□ Build Monitoring Service API
□ Configure dashboards
□ Configure alerts
□ API integration with frontend
□ Test metrics and alerting
```

### PHASE 9: AI Services (Week 13)
```
□ Deploy Ollama
□ Pull base models (llama2, codellama)
□ Build AI Service API
□ Rate limiting for AI endpoints
□ Usage metering
□ API integration with frontend
□ Test completions API
```

### PHASE 10: Hosting (Week 14)
```
□ Build Static Site Service
□ Build WordPress Service
□ One-click app templates
□ API integration with frontend
□ Test static site deployment
□ Test WordPress provisioning
```

---

## Service URLs After Deployment

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | https://cloud.bunkercorpo.com | Main frontend |
| API | https://api.bunkercorpo.com | Backend API |
| Auth | https://api.bunkercorpo.com/auth | Authentication |
| Storage | https://storage.bunkercorpo.com | S3 API |
| Storage Console | https://storage-console.bunkercorpo.com | MinIO UI |
| Git | https://git.bunkercorpo.com | Gitea |
| Registry | https://registry.bunkercorpo.com | Docker Registry |
| CI/CD | https://ci.bunkercorpo.com | Drone CI |
| Email | https://mail.bunkercorpo.com | Mailcow |
| Monitoring | https://monitoring.bunkercorpo.com | Grafana |
| Status | https://status.bunkercorpo.com | Uptime Kuma |
| Customer Apps | https://*.apps.bunkercorpo.com | User deployments |

---

## DNS Records to Create

```
# A Records (point to VPS IP: 46.224.81.23)
api.bunkercorpo.com          A    46.224.81.23
storage.bunkercorpo.com      A    46.224.81.23
storage-console.bunkercorpo.com  A    46.224.81.23
git.bunkercorpo.com          A    46.224.81.23
registry.bunkercorpo.com     A    46.224.81.23
ci.bunkercorpo.com           A    46.224.81.23
mail.bunkercorpo.com         A    46.224.81.23
monitoring.bunkercorpo.com   A    46.224.81.23
status.bunkercorpo.com       A    46.224.81.23
ai.bunkercorpo.com           A    46.224.81.23

# Wildcard for customer apps
*.apps.bunkercorpo.com       A    46.224.81.23

# MX Record (for email)
bunkercorpo.com              MX   10 mail.bunkercorpo.com

# SPF Record
bunkercorpo.com              TXT  "v=spf1 mx a:mail.bunkercorpo.com ~all"
```

---

## Technology Stack Summary

| Layer | Technology |
|-------|------------|
| **Reverse Proxy** | Traefik v3 |
| **API Framework** | Node.js + Fastify + TypeScript |
| **System Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Object Storage** | MinIO |
| **Managed DBs** | PostgreSQL, MySQL, Redis, MongoDB |
| **Git Hosting** | Gitea |
| **Container Registry** | Docker Registry v2 |
| **CI/CD** | Drone CI |
| **DNS** | PowerDNS |
| **Email** | Mailcow |
| **Monitoring** | Prometheus + Grafana + Loki |
| **Status Page** | Uptime Kuma |
| **AI Inference** | Ollama |
| **Containers** | Docker + Docker Compose |
| **SSL** | Let's Encrypt (via Traefik) |

---

## Estimated Resource Usage

```
┌─────────────────────────────────────────────────────────────┐
│                    RESOURCE ALLOCATION                       │
├─────────────────────────────────────────────────────────────┤
│  TOTAL AVAILABLE                                            │
│  CPU: 16 cores    RAM: 30 GB    Disk: 573 GB               │
├─────────────────────────────────────────────────────────────┤
│  SYSTEM SERVICES (~5 GB RAM)                                │
│  ├─ Traefik           0.5 CPU    512 MB                    │
│  ├─ PostgreSQL (sys)  1.0 CPU    2 GB                      │
│  ├─ Redis             0.5 CPU    1 GB                      │
│  ├─ Auth Service      0.5 CPU    512 MB                    │
│  ├─ Billing Service   0.5 CPU    512 MB                    │
│  └─ API Gateway       0.5 CPU    512 MB                    │
├─────────────────────────────────────────────────────────────┤
│  PLATFORM SERVICES (~19 GB RAM)                             │
│  ├─ MinIO             1.0 CPU    2 GB                      │
│  ├─ Prometheus/Graf   1.0 CPU    2 GB                      │
│  ├─ Loki              0.5 CPU    1 GB                      │
│  ├─ Gitea             1.0 CPU    1 GB                      │
│  ├─ Drone CI          2.0 CPU    2 GB                      │
│  ├─ Docker Registry   0.5 CPU    512 MB                    │
│  ├─ PowerDNS          0.5 CPU    512 MB                    │
│  ├─ Mailcow           2.0 CPU    4 GB                      │
│  ├─ Uptime Kuma       0.5 CPU    512 MB                    │
│  └─ Ollama            4.0 CPU    8 GB                      │
├─────────────────────────────────────────────────────────────┤
│  REMAINING FOR CUSTOMERS                                    │
│  CPU: ~1-2 cores    RAM: ~5-6 GB    Disk: ~500 GB          │
│  (Customer databases, apps, storage)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## First Commands to Run

```bash
# Step 1: Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Step 2: Install Docker Compose plugin
apt update && apt install -y docker-compose-plugin

# Step 3: Verify installation
docker --version
docker compose version

# Step 4: Create project structure
cd /root/bunker-cloud
mkdir -p backend/services/{auth,billing,databases,storage,apps,functions,domains,email,git,cicd,monitoring,vpn,ai}
mkdir -p backend/shared/{database,queue,utils}
mkdir -p infrastructure/{docker,traefik,prometheus,alertmanager,nginx}
mkdir -p data/{postgres,mysql,redis,mongodb,minio,gitea,drone,registry,mailcow,prometheus,grafana,loki}

# Step 5: Create .env file
cat > .env << 'EOF'
# System
NODE_ENV=production
API_URL=https://api.bunkercorpo.com

# PostgreSQL
POSTGRES_PASSWORD=<generate-secure-password>
POSTGRES_USER=bunker_admin
POSTGRES_DB=bunker_system

# Redis
REDIS_PASSWORD=<generate-secure-password>

# JWT
JWT_SECRET=<generate-secure-256bit-key>
JWT_EXPIRES_IN=7d

# MinIO
MINIO_ROOT_USER=bunker_admin
MINIO_ROOT_PASSWORD=<generate-secure-password>

# Grafana
GRAFANA_PASSWORD=<generate-secure-password>

# Stripe (for billing)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
SMTP_HOST=mail.bunkercorpo.com
SMTP_PORT=587
SMTP_USER=noreply@bunkercorpo.com
SMTP_PASS=<password>

# Domain Reseller (OpenSRS)
OPENSRS_API_KEY=<api-key>
OPENSRS_RESELLER_USERNAME=<username>
EOF

# Step 6: Generate secure passwords
# Use: openssl rand -base64 32
```

---

## Ready to Start?

Once you approve, I'll begin with **Phase 1**:
1. Install Docker
2. Create the directory structure
3. Setup Traefik
4. Deploy PostgreSQL & Redis
5. Build the Auth Service
6. Build the Billing Service

**Estimated time for Phase 1: 2-4 hours of implementation**

Would you like me to proceed?
