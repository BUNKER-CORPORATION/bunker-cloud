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
| **Object Storage** | ✅ Live | S3-compatible storage powered by MinIO |
| **Managed Databases** | 🚧 Coming Soon | PostgreSQL, MySQL, Redis, MongoDB |
| **App Platform** | 🚧 Coming Soon | Deploy Docker containers with auto-scaling |
| **Serverless Functions** | 📋 Planned | Run code without managing servers |
| **Container Registry** | 📋 Planned | Private Docker image hosting |

### Developer Tools

| Tool | Status | Description |
|------|--------|-------------|
| **REST API** | ✅ Live | Full API access to all services |
| **CLI** | 📋 Planned | Command-line interface for Bunker Cloud |
| **SDKs** | 📋 Planned | Official libraries for popular languages |
| **CI/CD Integration** | 📋 Planned | GitHub Actions, GitLab CI support |

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
│                    (Nginx + Caddy SSL)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                     API Gateway                              │
│            https://cloud-api.bunkercorpo.com                 │
└───────┬─────────────┬─────────────┬─────────────────────────┘
        │             │             │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │  Auth   │   │ Billing │   │ Storage │
   │ Service │   │ Service │   │ (MinIO) │
   └────┬────┘   └────┬────┘   └─────────┘
        │             │
   ┌────▼─────────────▼────┐
   │      PostgreSQL       │
   │    (System Database)  │
   └───────────────────────┘
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

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Create new user account |
| `/auth/login` | POST | Authenticate user |
| `/auth/refresh` | POST | Refresh access token |
| `/billing/plans` | GET | List subscription plans |
| `/billing/subscriptions` | GET | Get user subscriptions |
| `/health` | GET | Service health check |

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for full API documentation.

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
│   │   ├── auth/          # Authentication service
│   │   └── billing/       # Billing service
│   ├── docker-compose.yml
│   └── .env.example
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
- [x] Object Storage (MinIO)
- [x] Frontend Landing Page

### Phase 2 - Database Services 🚧
- [ ] PostgreSQL Provisioning
- [ ] MySQL Support
- [ ] Redis Managed Instances
- [ ] Connection Pooling

### Phase 3 - App Platform
- [ ] Docker Container Deployment
- [ ] Auto-scaling
- [ ] Custom Domains
- [ ] SSL Certificates

### Phase 4 - Developer Experience
- [ ] CLI Tool
- [ ] Official SDKs
- [ ] GitHub Integration
- [ ] Webhooks

### Phase 5 - Advanced Features
- [ ] Serverless Functions
- [ ] Container Registry
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
