# Bunker Cloud

**Enterprise-grade cloud platform for modern applications.**

Bunker Cloud is a full-featured cloud infrastructure platform that provides managed databases, object storage, application hosting, and developer tools — all in one place.

![License](https://img.shields.io/badge/license-Proprietary-blue)
![Status](https://img.shields.io/badge/status-In%20Development-yellow)

## Overview

Bunker Cloud empowers developers and businesses with reliable, scalable cloud infrastructure. Built with performance and security in mind, it offers a seamless experience for deploying and managing applications.

**Live Platform:** [cloud.bunkercorpo.com](https://cloud.bunkercorpo.com)

## Features

### Core Services

| Service | Status | Description |
|---------|--------|-------------|
| **Authentication** | ✅ Live | JWT-based auth, user management, organizations, API keys |
| **Billing** | ✅ Live | Subscription plans, usage tracking, invoices |
| **Object Storage** | ✅ Live | S3-compatible storage with presigned URLs, bucket management |
| **Managed Databases** | ✅ Live | PostgreSQL, MySQL, Redis, MongoDB with automated provisioning |
| **App Platform** | ✅ Live | Deploy Docker containers with custom domains and resource limits |
| **Serverless Functions** | ✅ Live | Run code without managing servers (Node.js, Python, Go, Rust) |
| **Container Registry** | ✅ Live | Private Docker image hosting with Docker V2 API |

### Developer Tools

| Tool | Status | Description |
|------|--------|-------------|
| **REST API** | ✅ Live | Full API access to all services |
| **CLI** | ✅ Live | Command-line interface for Bunker Cloud |
| **SDKs** | ✅ Live | Official TypeScript/JavaScript SDK |
| **GitHub Integration** | ✅ Live | Auto-deploy on push, webhook notifications |

### Platform Features

- **Multi-tenant Architecture** — Secure isolation between organizations
- **Role-based Access Control** — Fine-grained permissions
- **Usage-based Billing** — Pay only for what you use
- **Real-time Monitoring** — Metrics, logs, and alerts
- **Auto-SSL** — Free TLS certificates for all services
- **Global CDN** — Fast content delivery worldwide

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                          │
│                  (Nginx + Let's Encrypt)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                     API Gateway                              │
│            https://cloud-api.bunkercorpo.com                 │
└───────┬─────────────┬─────────────┬─────────────┬───────────┘
        │             │             │             │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │  Auth   │   │ Billing │   │Database │   │ Storage │
   │ Service │   │ Service │   │ Service │   │ Service │
   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
        │             │             │             │
   ┌────▼─────────────▼─────────────▼────┐   ┌────▼────┐
   │           PostgreSQL                │   │  MinIO  │
   │        (System Database)            │   │ Storage │
   └─────────────────────────────────────┘   └─────────┘
```

## Tech Stack

**Backend:**
- Node.js 20 + TypeScript
- Fastify (API Framework)
- PostgreSQL 16 (Database)
- Redis 7 (Caching & Sessions)
- MinIO (Object Storage)
- Docker & Docker Compose

**Frontend:**
- React 18 + TypeScript
- Vite (Build Tool)
- Tailwind CSS
- Framer Motion

**Infrastructure:**
- Nginx (Reverse Proxy)
- Traefik (Service Mesh)
- Let's Encrypt (SSL)
- Docker Compose (Orchestration)

## Getting Started

### Prerequisites

- Docker 24+ & Docker Compose 2.20+
- Node.js 20+ (for local development)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/BUNKER-CORPORATION/bunker-cloud.git
   cd bunker-cloud
   ```

2. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your values
   ```

3. **Start services**
   ```bash
   cd backend
   docker compose up -d
   ```

4. **Verify services**
   ```bash
   docker ps
   curl http://localhost:3001/health
   ```

### API Endpoints

**Authentication**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Create new user account |
| `/auth/login` | POST | Authenticate user |
| `/auth/refresh` | POST | Refresh access token |
| `/health` | GET | Service health check |

**Billing**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/billing/plans` | GET | List subscription plans |
| `/billing/subscriptions` | GET | Get user subscriptions |
| `/usage` | GET | Get usage statistics |

**Managed Databases**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/databases` | GET | List database instances |
| `/databases` | POST | Create new database (PostgreSQL, MySQL, Redis, MongoDB) |
| `/databases/:id` | GET | Get database details with connection string |
| `/databases/:id` | DELETE | Delete database instance |
| `/databases/:id/start` | POST | Start database container |
| `/databases/:id/stop` | POST | Stop database container |

**Object Storage**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/buckets` | GET | List storage buckets |
| `/buckets` | POST | Create new bucket |
| `/buckets/:id` | DELETE | Delete bucket |
| `/buckets/:id/objects` | GET | List objects in bucket |
| `/buckets/:id/presigned/upload` | POST | Get presigned upload URL |
| `/buckets/:id/presigned/download` | POST | Get presigned download URL |

**App Platform**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/apps` | GET | List deployed apps |
| `/apps` | POST | Deploy new app (image, port, env vars) |
| `/apps/:id` | GET | Get app details with stats |
| `/apps/:id` | PUT | Update and redeploy app |
| `/apps/:id` | DELETE | Delete app |
| `/apps/:id/start` | POST | Start app |
| `/apps/:id/stop` | POST | Stop app |
| `/apps/:id/logs` | GET | Get app logs |
| `/apps/:id/domains` | POST | Add custom domain |

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for full API documentation.

## CLI & SDK

### CLI Installation

```bash
npm install -g bunker-cli

# Login
bunker auth login

# Deploy an app
bunker apps create --name myapp --image nginx:alpine --port 80

# Create a database
bunker databases create --name mydb --engine postgresql
```

See [cli/README.md](./cli/README.md) for full CLI documentation.

### SDK Installation

```bash
npm install @bunker-cloud/sdk
```

```typescript
import BunkerCloud from '@bunker-cloud/sdk';

const bunker = new BunkerCloud({
  accessToken: 'your-access-token',
});

// List apps
const apps = await bunker.apps.list();

// Create a database
const db = await bunker.databases.create({
  name: 'my-database',
  engine: 'postgresql',
});
```

See [sdk/README.md](./sdk/README.md) for full SDK documentation.

## Pricing Plans

| Plan | Price | Storage | Databases | Apps |
|------|-------|---------|-----------|------|
| **Free** | $0/mo | 1 GB | 1 | 1 |
| **Starter** | $29/mo | 10 GB | 3 | 5 |
| **Pro** | $99/mo | 100 GB | 10 | 20 |
| **Enterprise** | $299/mo | 1 TB | Unlimited | Unlimited |

## Development

### Project Structure

```
bunker-cloud/
├── backend/
│   ├── services/
│   │   ├── auth/          # Authentication & user management
│   │   ├── billing/       # Subscriptions & usage tracking
│   │   ├── database/      # Managed database provisioning
│   │   ├── storage/       # S3-compatible object storage
│   │   └── apps/          # App platform & container deployment
│   ├── docker-compose.yml
│   └── .env.example
├── cli/                   # CLI Tool (bunker-cli)
│   ├── src/
│   │   ├── commands/      # CLI commands
│   │   └── lib/           # Utilities & API client
│   └── package.json
├── sdk/                   # TypeScript/JavaScript SDK
│   ├── src/
│   │   └── index.ts       # SDK implementation
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── data/          # Static data & docs
│   └── package.json
├── infrastructure/
│   └── traefik/           # Traefik configuration
├── IMPLEMENTATION_PLAN.md # Detailed implementation guide
├── QUICK_START.md         # Quick start checklist
└── README.md
```

### Running Locally

**Backend:**
```bash
cd backend/services/auth
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend/services/auth
npm test

# Frontend tests
cd frontend
npm test
```

## Roadmap

### Phase 1 - Core Platform ✅
- [x] Authentication & Authorization
- [x] Billing & Subscriptions
- [x] Frontend Landing Page
- [x] API Gateway (Nginx)

### Phase 2 - Managed Databases ✅
- [x] PostgreSQL Provisioning
- [x] MySQL Support
- [x] Redis Managed Instances
- [x] MongoDB Support
- [x] Automated Container Management

### Phase 3 - Object Storage ✅
- [x] S3-compatible Storage (MinIO)
- [x] Bucket Management
- [x] Presigned URLs for Upload/Download
- [x] Plan-based Storage Limits
- [x] Bandwidth Tracking

### Phase 4 - App Platform ✅
- [x] Docker Container Deployment
- [x] App Lifecycle Management (start/stop/restart)
- [x] Custom Domains with Verification
- [x] Plan-based Resource Limits
- [x] Real-time Logs and Stats

### Phase 5 - Developer Experience ✅
- [x] CLI Tool (bunker-cli)
- [x] Official TypeScript/JavaScript SDK (@bunker-cloud/sdk)
- [x] GitHub Integration (auto-deploy on push)
- [x] Webhooks (event notifications)

### Phase 6 - Advanced Features ✅
- [x] Serverless Functions (Node.js, Python, Go, Rust)
- [x] Container Registry (Docker V2 API compatible)
- [ ] VPN / Private Networking
- [ ] AI Inference API

## Contributing

Bunker Cloud is currently a proprietary project. For inquiries about partnerships or enterprise licensing, please contact us.

## Support

- **Documentation:** [cloud.bunkercorpo.com/docs](https://cloud.bunkercorpo.com/docs)
- **Email:** support@bunkercorpo.com
- **Status Page:** [status.bunkercorpo.com](https://status.bunkercorpo.com)

## License

Copyright © 2025 Bunker Corporation. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

**Built with passion by [Bunker Corporation](https://bunkercorpo.com)**
