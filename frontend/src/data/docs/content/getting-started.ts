// Getting Started Documentation Content

import { DocPage } from '../types';

export const gettingStartedDocs: Record<string, DocPage> = {
  'introduction': {
    id: 'introduction',
    title: 'Introduction to Bunker Cloud',
    description: 'Learn about Bunker Cloud platform, its core services, and how it can help you build and scale applications.',
    difficulty: 'beginner',
    timeToRead: '5 min',
    lastUpdated: '2024-12-01',
    content: `
## What is Bunker Cloud?

Bunker Cloud is an enterprise-grade cloud infrastructure platform designed for developers and businesses who need secure, scalable, and reliable cloud services. Our platform provides everything you need to build, deploy, and manage modern applications.

## Why Choose Bunker Cloud?

### Security-First Architecture

Every service on Bunker Cloud is built with security as the foundation. We provide:

- **End-to-end encryption** for all data in transit and at rest
- **SOC 2 Type II** and **ISO 27001** certified infrastructure
- **Zero-trust security model** with granular access controls
- **DDoS protection** included on all services at no extra cost

### Global Infrastructure

Deploy your applications closer to your users with our worldwide network:

- **25+ regions** across North America, Europe, Asia Pacific, and South America
- **99.99% uptime SLA** for production workloads
- **Low-latency global backbone** connecting all regions
- **Edge locations** for content delivery and edge computing

### Developer Experience

Built by developers, for developers:

- **Intuitive console** for managing all your resources
- **Powerful CLI** for automation and scripting
- **Comprehensive APIs** with SDKs for popular languages
- **Git-based deployments** with automatic CI/CD

## Core Services

Bunker Cloud offers a comprehensive suite of cloud services:

### Vault Compute

Secure, scalable compute instances for any workload. From simple web applications to complex distributed systems.

- Virtual machines with dedicated resources
- Container deployments with Kubernetes
- Serverless functions for event-driven workloads
- Auto-scaling to handle traffic spikes

### Fortress Storage

High-performance storage solutions for all your data needs.

- Object storage for unstructured data
- Block volumes for databases and applications
- File storage (NFS) for shared workloads
- Automatic backups and point-in-time recovery

### Shield Network

Advanced networking and security services.

- Virtual Private Cloud (VPC) for network isolation
- Load balancers for high availability
- CDN for global content delivery
- DDoS protection and Web Application Firewall

### Managed Databases

Fully managed database services with automatic maintenance.

- PostgreSQL, MySQL, and MongoDB
- Redis for caching and real-time data
- Automatic backups and failover
- Read replicas for scaling

## Getting Started

Ready to start building? Here's how to get started:

1. **Create an account** - Sign up at bunkercloud.com
2. **Set up your organization** - Configure your team and billing
3. **Install the CLI** - Get the Bunker CLI for your platform
4. **Deploy your first app** - Follow our quickstart guide

## Pricing

Bunker Cloud offers transparent, pay-as-you-go pricing:

- **No upfront costs** - Pay only for what you use
- **Per-second billing** - No minimum usage requirements
- **Free tier** - Get started with $100 in free credits
- **Volume discounts** - Save more as you scale

## Support

We're here to help you succeed:

- **Documentation** - Comprehensive guides and tutorials
- **Community** - Join thousands of developers on Discord
- **Support** - 24/7 support for all paid plans
- **Enterprise** - Dedicated support and SLAs
    `,
    codeExamples: [
      {
        language: 'bash',
        title: 'Install the Bunker CLI',
        code: `# Install using npm
npm install -g @bunkercloud/cli

# Or using Homebrew (macOS)
brew install bunkercloud/tap/bunker

# Verify installation
bunker --version`
      }
    ],
    relatedDocs: ['quickstart', 'account-setup', 'core-concepts']
  },

  'quickstart': {
    id: 'quickstart',
    title: 'Quickstart Guide',
    description: 'Deploy your first application to Bunker Cloud in under 5 minutes.',
    difficulty: 'beginner',
    timeToRead: '5 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

This quickstart guide will walk you through deploying your first application to Bunker Cloud. By the end, you'll have a live application running on our global infrastructure.

## Prerequisites

Before you begin, make sure you have:

- A Bunker Cloud account (sign up at bunkercloud.com)
- Node.js 18+ installed on your machine
- Git installed

## Step 1: Install the CLI

Install the Bunker Cloud CLI globally:

\`\`\`bash
npm install -g @bunkercloud/cli
\`\`\`

Verify the installation:

\`\`\`bash
bunker --version
\`\`\`

## Step 2: Authenticate

Log in to your Bunker Cloud account:

\`\`\`bash
bunker login
\`\`\`

This will open your browser for authentication. After logging in, your credentials are securely stored locally.

## Step 3: Create a Project

Create a new directory for your project:

\`\`\`bash
mkdir my-first-app
cd my-first-app
\`\`\`

Initialize a new Bunker project:

\`\`\`bash
bunker init
\`\`\`

This creates a \`bunker.json\` configuration file in your project.

## Step 4: Add Your Application

For this quickstart, let's create a simple Node.js application:

\`\`\`bash
npm init -y
npm install express
\`\`\`

Create \`index.js\`:

\`\`\`javascript
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Bunker Cloud!',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
\`\`\`

## Step 5: Configure Your Deployment

Update your \`bunker.json\`:

\`\`\`json
{
  "name": "my-first-app",
  "type": "node",
  "region": "us-east-1",
  "build": {
    "command": "npm install"
  },
  "run": {
    "command": "node index.js"
  },
  "scaling": {
    "min": 1,
    "max": 3
  }
}
\`\`\`

## Step 6: Deploy

Deploy your application with a single command:

\`\`\`bash
bunker deploy
\`\`\`

The CLI will:
1. Upload your code
2. Build your application
3. Deploy to our global infrastructure
4. Provide you with a URL

## Step 7: Access Your Application

Once deployment is complete, you'll see output like:

\`\`\`
✓ Deployment successful!

Your application is live at:
https://my-first-app-abc123.bunkercloud.app

Dashboard: https://console.bunkercloud.com/projects/my-first-app
\`\`\`

Visit your URL to see your application running!

## Next Steps

Congratulations! You've deployed your first application to Bunker Cloud. Here's what to explore next:

- **Add a custom domain** - Configure your own domain name
- **Set up environment variables** - Manage configuration securely
- **Enable auto-scaling** - Handle traffic spikes automatically
- **Connect a database** - Add persistent data storage
- **Set up CI/CD** - Automate deployments from Git
    `,
    codeExamples: [
      {
        language: 'json',
        title: 'bunker.json configuration',
        code: `{
  "name": "my-first-app",
  "type": "node",
  "region": "us-east-1",
  "build": {
    "command": "npm install && npm run build"
  },
  "run": {
    "command": "npm start"
  },
  "env": {
    "NODE_ENV": "production"
  },
  "scaling": {
    "min": 1,
    "max": 10,
    "targetCPU": 70
  },
  "healthCheck": {
    "path": "/health",
    "interval": 30
  }
}`
      }
    ],
    relatedDocs: ['cli-installation', 'first-deployment', 'environment-variables']
  },

  'account-setup': {
    id: 'account-setup',
    title: 'Account Setup',
    description: 'Create and configure your Bunker Cloud account, organization, and team.',
    difficulty: 'beginner',
    timeToRead: '8 min',
    lastUpdated: '2024-12-01',
    content: `
## Creating Your Account

### Sign Up

1. Visit **bunkercloud.com** and click **Get Started**
2. Choose your sign-up method:
   - Email and password
   - GitHub OAuth
   - Google OAuth
   - SSO (Enterprise plans)
3. Verify your email address
4. Complete your profile

### Account Types

Bunker Cloud offers different account types:

| Type | Best For | Features |
|------|----------|----------|
| **Personal** | Individual developers | Single user, personal projects |
| **Team** | Small teams | Up to 10 users, shared billing |
| **Organization** | Companies | Unlimited users, advanced security |
| **Enterprise** | Large enterprises | Custom contracts, dedicated support |

## Setting Up Your Organization

### Create an Organization

Organizations are the top-level container for all your resources:

1. Go to **Console → Settings → Organizations**
2. Click **Create Organization**
3. Enter your organization name
4. Choose your plan
5. Add billing information

### Organization Settings

Configure your organization:

- **General**: Name, URL slug, contact information
- **Security**: SSO, 2FA requirements, session policies
- **Billing**: Payment methods, invoices, spending limits
- **Audit**: Activity logs, compliance reports

## Team Management

### Inviting Team Members

1. Go to **Organization → Team**
2. Click **Invite Member**
3. Enter email addresses
4. Select a role
5. Send invitations

### Roles and Permissions

| Role | Permissions |
|------|-------------|
| **Owner** | Full access, billing, can delete organization |
| **Admin** | Manage members, projects, and resources |
| **Developer** | Create and manage projects, deploy |
| **Viewer** | Read-only access to projects |
| **Billing** | Manage billing and invoices only |

### Custom Roles

Enterprise plans can create custom roles:

\`\`\`json
{
  "name": "Senior Developer",
  "permissions": [
    "projects:create",
    "projects:deploy",
    "databases:manage",
    "secrets:read"
  ]
}
\`\`\`

## Projects

### Creating a Project

Projects contain your applications and resources:

1. Click **New Project** in the console
2. Enter a project name
3. Choose a region
4. Select project type (Web, API, Worker, etc.)
5. Configure initial settings

### Project Structure

Each project includes:

- **Deployments**: Your application instances
- **Domains**: Custom domain configuration
- **Environment Variables**: Configuration and secrets
- **Databases**: Connected database instances
- **Storage**: Associated storage buckets
- **Logs**: Application and access logs
- **Analytics**: Traffic and performance metrics

## Billing Setup

### Adding Payment Methods

1. Go to **Organization → Billing**
2. Click **Add Payment Method**
3. Supported methods:
   - Credit/debit cards (Visa, Mastercard, Amex)
   - PayPal
   - ACH bank transfer (US)
   - Wire transfer (Enterprise)

### Spending Alerts

Set up alerts to monitor costs:

1. Go to **Billing → Alerts**
2. Click **Create Alert**
3. Set threshold amount
4. Choose notification method (email, Slack, webhook)

### Budget Limits

Prevent unexpected charges:

\`\`\`yaml
budget:
  monthly_limit: 1000
  action: notify  # or 'pause' to stop resources
  notify:
    - email: billing@company.com
    - slack: #billing-alerts
\`\`\`

## Security Setup

### Enable Two-Factor Authentication

1. Go to **Account → Security**
2. Click **Enable 2FA**
3. Choose method:
   - Authenticator app (recommended)
   - SMS
   - Hardware key (FIDO2)

### API Keys

Create API keys for programmatic access:

1. Go to **Account → API Keys**
2. Click **Create Key**
3. Set permissions scope
4. Set expiration (optional)
5. Copy and store securely

### SSO Configuration (Enterprise)

Configure SAML SSO:

1. Go to **Organization → Security → SSO**
2. Choose your identity provider
3. Enter IdP metadata
4. Configure attribute mapping
5. Test and enable
    `,
    codeExamples: [
      {
        language: 'bash',
        title: 'CLI Authentication',
        code: `# Login with browser
bunker login

# Login with API key
bunker login --api-key YOUR_API_KEY

# Switch organizations
bunker org switch my-organization

# List available organizations
bunker org list`
      }
    ],
    relatedDocs: ['users-teams', 'roles-permissions', 'api-keys']
  },

  'console-overview': {
    id: 'console-overview',
    title: 'Console Overview',
    description: 'Navigate and use the Bunker Cloud web console effectively.',
    difficulty: 'beginner',
    timeToRead: '6 min',
    lastUpdated: '2024-12-01',
    content: `
## Introduction

The Bunker Cloud Console is your central hub for managing all cloud resources. Access it at **console.bunkercloud.com**.

## Dashboard

The dashboard provides an overview of your infrastructure:

### Key Metrics

- **Active Resources**: Running instances, databases, and services
- **Current Spend**: Month-to-date spending
- **Health Status**: Overall system health
- **Recent Activity**: Latest deployments and changes

### Quick Actions

- **New Project**: Create a new project
- **Deploy**: Quick deploy from the dashboard
- **Support**: Access support chat

## Navigation

### Left Sidebar

The sidebar provides access to all sections:

- **Projects**: All your projects and deployments
- **Compute**: Virtual machines and containers
- **Storage**: Object and block storage
- **Databases**: Managed database instances
- **Networking**: VPC, DNS, and load balancers
- **Monitoring**: Metrics, logs, and alerts
- **Security**: IAM, keys, and audit logs
- **Billing**: Usage, invoices, and payments

### Top Navigation

- **Search**: Global search across all resources (Cmd/Ctrl + K)
- **Notifications**: Alerts and system notifications
- **Organization Switcher**: Switch between organizations
- **Account**: Profile and settings

## Resource Management

### Creating Resources

1. Navigate to the resource type (e.g., Compute)
2. Click **Create** or **New**
3. Fill in the configuration form
4. Review and confirm
5. Resource is provisioned

### Resource Actions

Each resource has common actions:

- **View**: Detailed information and metrics
- **Edit**: Modify configuration
- **Scale**: Adjust capacity
- **Delete**: Remove the resource
- **Clone**: Duplicate configuration

### Bulk Operations

Select multiple resources for bulk actions:

1. Check resources in the list
2. Click **Actions** dropdown
3. Select operation (Start, Stop, Delete, Tag)
4. Confirm

## Project View

### Overview Tab

- Project health and status
- Recent deployments
- Key metrics (requests, errors, latency)
- Quick actions

### Deployments Tab

- Deployment history
- Current and previous versions
- Rollback options
- Deployment logs

### Settings Tab

- General settings
- Environment variables
- Domains and SSL
- Build configuration
- Scaling settings

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Cmd/Ctrl + K\` | Global search |
| \`Cmd/Ctrl + N\` | New resource |
| \`Cmd/Ctrl + /\` | Show shortcuts |
| \`G then P\` | Go to Projects |
| \`G then D\` | Go to Databases |
| \`G then S\` | Go to Settings |

## Customization

### Theme

Switch between light and dark mode:
1. Click your avatar
2. Select **Appearance**
3. Choose theme

### Default Region

Set your preferred region:
1. Go to **Settings → Preferences**
2. Select **Default Region**
3. Save changes

### Notifications

Configure notification preferences:
1. Go to **Settings → Notifications**
2. Toggle notification types
3. Set delivery methods (email, Slack, webhook)
    `,
    relatedDocs: ['account-setup', 'first-deployment', 'cli-installation']
  },

  'cli-installation': {
    id: 'cli-installation',
    title: 'CLI Installation',
    description: 'Install and configure the Bunker Cloud command-line interface.',
    difficulty: 'beginner',
    timeToRead: '5 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

The Bunker CLI is a powerful command-line tool for managing your Bunker Cloud resources. It supports all major operating systems and provides full access to the platform.

## Installation Methods

### npm (Recommended)

Install globally using npm:

\`\`\`bash
npm install -g @bunkercloud/cli
\`\`\`

### Homebrew (macOS)

\`\`\`bash
brew install bunkercloud/tap/bunker
\`\`\`

### Standalone Binary

Download the binary for your platform:

**macOS (Apple Silicon)**
\`\`\`bash
curl -fsSL https://cli.bunkercloud.com/install.sh | bash
\`\`\`

**macOS (Intel)**
\`\`\`bash
curl -fsSL https://cli.bunkercloud.com/install.sh | bash
\`\`\`

**Linux (x64)**
\`\`\`bash
curl -fsSL https://cli.bunkercloud.com/install.sh | bash
\`\`\`

**Windows (PowerShell)**
\`\`\`powershell
iwr https://cli.bunkercloud.com/install.ps1 -useb | iex
\`\`\`

### Docker

Run the CLI in a container:

\`\`\`bash
docker run -it bunkercloud/cli bunker --version
\`\`\`

## Verification

Verify the installation:

\`\`\`bash
bunker --version
# bunker-cli/2.5.0 darwin-arm64 node-v20.10.0
\`\`\`

## Authentication

### Interactive Login

\`\`\`bash
bunker login
\`\`\`

This opens your browser for secure authentication using OAuth.

### API Key Authentication

For CI/CD and automation:

\`\`\`bash
# Set via environment variable
export BUNKER_API_KEY=your-api-key

# Or pass directly
bunker login --api-key your-api-key
\`\`\`

### Verify Authentication

\`\`\`bash
bunker whoami
# Logged in as: john@example.com
# Organization: my-company
\`\`\`

## Configuration

### Config File

The CLI stores configuration in \`~/.bunkercloud/config.json\`:

\`\`\`json
{
  "currentOrg": "my-company",
  "defaultRegion": "us-east-1",
  "apiEndpoint": "https://api.bunkercloud.com",
  "telemetry": true
}
\`\`\`

### Environment Variables

| Variable | Description |
|----------|-------------|
| \`BUNKER_API_KEY\` | API key for authentication |
| \`BUNKER_ORG\` | Default organization |
| \`BUNKER_REGION\` | Default region |
| \`BUNKER_PROJECT\` | Default project |
| \`BUNKER_DEBUG\` | Enable debug logging |

## Basic Commands

\`\`\`bash
# Get help
bunker help

# List projects
bunker projects list

# Deploy current directory
bunker deploy

# View logs
bunker logs --follow

# SSH into instance
bunker ssh instance-id

# Open console in browser
bunker open
\`\`\`

## Shell Completion

Enable command completion for your shell:

**Bash**
\`\`\`bash
bunker completion bash >> ~/.bashrc
\`\`\`

**Zsh**
\`\`\`bash
bunker completion zsh >> ~/.zshrc
\`\`\`

**Fish**
\`\`\`bash
bunker completion fish > ~/.config/fish/completions/bunker.fish
\`\`\`

## Updating

Update to the latest version:

\`\`\`bash
# npm
npm update -g @bunkercloud/cli

# Homebrew
brew upgrade bunkercloud/tap/bunker

# Self-update
bunker update
\`\`\`

## Troubleshooting

### Common Issues

**Authentication failed**
\`\`\`bash
# Clear credentials and re-login
bunker logout
bunker login
\`\`\`

**Command not found**
\`\`\`bash
# Add to PATH (npm global)
export PATH="$PATH:$(npm bin -g)"
\`\`\`

**Permission denied**
\`\`\`bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
\`\`\`
    `,
    codeExamples: [
      {
        language: 'bash',
        title: 'Complete installation and setup',
        code: `# Install CLI
npm install -g @bunkercloud/cli

# Authenticate
bunker login

# Set default organization
bunker org switch my-company

# Set default region
bunker config set region us-east-1

# Verify setup
bunker whoami
bunker projects list`
      }
    ],
    relatedDocs: ['quickstart', 'cli-commands', 'cli-auth']
  },

  'first-deployment': {
    id: 'first-deployment',
    title: 'Your First Deployment',
    description: 'Step-by-step guide to deploying your application to Bunker Cloud.',
    difficulty: 'beginner',
    timeToRead: '10 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

This guide walks you through deploying a complete application to Bunker Cloud, covering configuration, deployment, and verification.

## Supported Application Types

Bunker Cloud supports various application types:

- **Node.js** - Express, Next.js, Nest.js, Fastify
- **Python** - Django, Flask, FastAPI
- **Go** - Standard library, Gin, Echo
- **Ruby** - Rails, Sinatra
- **PHP** - Laravel, Symfony
- **Java** - Spring Boot, Quarkus
- **Rust** - Actix, Rocket
- **Static Sites** - HTML, React, Vue, Angular
- **Docker** - Any containerized application

## Step 1: Prepare Your Application

### Project Structure

Ensure your project has the necessary files:

\`\`\`
my-app/
├── bunker.json        # Bunker configuration
├── package.json       # Dependencies (Node.js)
├── src/
│   └── index.js       # Application entry point
├── public/            # Static files
└── .bunkerignore      # Files to exclude
\`\`\`

### Create bunker.json

\`\`\`json
{
  "$schema": "https://bunkercloud.com/schemas/bunker.json",
  "name": "my-app",
  "type": "web",
  "region": "us-east-1",
  "framework": "express",
  "build": {
    "command": "npm ci && npm run build"
  },
  "run": {
    "command": "npm start"
  },
  "env": {
    "NODE_ENV": "production"
  }
}
\`\`\`

### Create .bunkerignore

\`\`\`
node_modules/
.git/
.env.local
*.log
coverage/
.DS_Store
\`\`\`

## Step 2: Configure Build Settings

### Build Commands

Configure how your application builds:

\`\`\`json
{
  "build": {
    "command": "npm ci && npm run build",
    "output": "dist",
    "env": {
      "NODE_ENV": "production"
    }
  }
}
\`\`\`

### Framework Detection

Bunker Cloud auto-detects common frameworks:

| Framework | Detection | Default Build |
|-----------|-----------|---------------|
| Next.js | \`next.config.js\` | \`next build\` |
| React (CRA) | \`react-scripts\` | \`react-scripts build\` |
| Vue | \`vue.config.js\` | \`vue-cli-service build\` |
| Express | \`express\` in deps | \`npm start\` |

## Step 3: Set Environment Variables

### Using the Console

1. Go to Project → Settings → Environment Variables
2. Click **Add Variable**
3. Enter key and value
4. Choose environment (Production, Preview, Development)

### Using the CLI

\`\`\`bash
# Set a variable
bunker env set DATABASE_URL "postgresql://..."

# Set for specific environment
bunker env set API_KEY "secret" --env production

# Import from .env file
bunker env import .env.production

# List variables
bunker env list
\`\`\`

### Secrets

For sensitive values, use encrypted secrets:

\`\`\`bash
bunker secrets set STRIPE_KEY "sk_live_..."
\`\`\`

## Step 4: Deploy

### Using the CLI

\`\`\`bash
# Deploy current directory
bunker deploy

# Deploy with message
bunker deploy -m "Add user authentication"

# Deploy specific branch
bunker deploy --branch feature/new-feature

# Deploy to preview
bunker deploy --preview
\`\`\`

### Deployment Output

\`\`\`
Deploying my-app to production...

✓ Uploading source (2.3 MB)
✓ Building application
  → Installing dependencies
  → Running build command
  → Optimizing output
✓ Deploying to 3 regions
✓ Running health checks

Deployment successful! (45s)

Production: https://my-app.bunkercloud.app
Dashboard:  https://console.bunkercloud.com/p/my-app
\`\`\`

## Step 5: Verify Deployment

### Check Status

\`\`\`bash
# View deployment status
bunker status

# View recent deployments
bunker deployments list

# View deployment details
bunker deployments show dep_abc123
\`\`\`

### View Logs

\`\`\`bash
# Real-time logs
bunker logs --follow

# Filter by type
bunker logs --type error

# Search logs
bunker logs --search "connection refused"
\`\`\`

### Test Your Application

\`\`\`bash
# Quick health check
curl https://my-app.bunkercloud.app/health

# Full test
bunker test --url https://my-app.bunkercloud.app
\`\`\`

## Step 6: Configure Domain (Optional)

### Add Custom Domain

\`\`\`bash
bunker domains add myapp.com
\`\`\`

### Configure DNS

Add the following DNS records:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.bunkercloud.app |

### Enable SSL

SSL is automatically provisioned via Let's Encrypt:

\`\`\`bash
bunker domains verify myapp.com
# ✓ DNS verified
# ✓ SSL certificate issued
# ✓ Domain active
\`\`\`

## Troubleshooting

### Build Failures

\`\`\`bash
# View build logs
bunker deployments logs dep_abc123 --build

# Test build locally
bunker build --local
\`\`\`

### Runtime Errors

\`\`\`bash
# Check application logs
bunker logs --type error

# SSH into container
bunker ssh --deployment dep_abc123
\`\`\`

### Rollback

\`\`\`bash
# Rollback to previous deployment
bunker rollback

# Rollback to specific version
bunker rollback dep_xyz789
\`\`\`
    `,
    codeExamples: [
      {
        language: 'json',
        title: 'Complete bunker.json example',
        code: `{
  "$schema": "https://bunkercloud.com/schemas/bunker.json",
  "name": "my-production-app",
  "type": "web",
  "region": "us-east-1",
  "framework": "nextjs",

  "build": {
    "command": "npm ci && npm run build",
    "output": ".next",
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },

  "run": {
    "command": "npm start"
  },

  "scaling": {
    "min": 2,
    "max": 10,
    "targetCPU": 70,
    "targetMemory": 80
  },

  "healthCheck": {
    "path": "/api/health",
    "interval": 30,
    "timeout": 10,
    "healthyThreshold": 2,
    "unhealthyThreshold": 3
  },

  "headers": {
    "/*": {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff"
    }
  },

  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}`
      }
    ],
    relatedDocs: ['quickstart', 'environment-variables', 'custom-domains']
  },

  'core-concepts': {
    id: 'core-concepts',
    title: 'Core Concepts',
    description: 'Understand the fundamental concepts and architecture of Bunker Cloud.',
    difficulty: 'beginner',
    timeToRead: '10 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Understanding Bunker Cloud's core concepts will help you build and manage applications effectively. This guide covers the fundamental building blocks of the platform.

## Organizations

An **Organization** is the top-level container for all your resources.

### Key Properties

- Unique namespace for all projects
- Centralized billing and invoicing
- Team member management
- Security policies and compliance
- Audit logging

### Organization Hierarchy

\`\`\`
Organization
├── Team Members & Roles
├── Projects
│   ├── Deployments
│   ├── Databases
│   └── Storage
├── Shared Resources
│   ├── VPCs
│   ├── Secrets
│   └── API Keys
└── Billing & Compliance
\`\`\`

## Projects

A **Project** groups related resources for a single application or service.

### Project Types

| Type | Use Case | Features |
|------|----------|----------|
| **Web** | Websites, web apps | Auto-scaling, CDN, SSL |
| **API** | Backend services | Load balancing, versioning |
| **Worker** | Background jobs | Queue processing, scheduling |
| **Static** | Static sites | Global CDN, instant deploys |
| **Container** | Custom containers | Full Docker support |

### Project Resources

Each project can include:

- **Deployments**: Application instances
- **Databases**: Managed database connections
- **Storage**: File and object storage
- **Domains**: Custom domain configuration
- **Secrets**: Encrypted environment variables

## Regions

Bunker Cloud operates in multiple **Regions** worldwide.

### Available Regions

| Region Code | Location | Features |
|-------------|----------|----------|
| \`us-east-1\` | Virginia, USA | Full services |
| \`us-west-1\` | California, USA | Full services |
| \`eu-west-1\` | Ireland | Full services, GDPR |
| \`eu-central-1\` | Frankfurt | Full services, GDPR |
| \`ap-south-1\` | Mumbai | Full services |
| \`ap-northeast-1\` | Tokyo | Full services |
| \`sa-east-1\` | São Paulo | Core services |

### Region Selection

Consider these factors when choosing a region:

1. **Latency**: Choose regions close to your users
2. **Compliance**: GDPR, data residency requirements
3. **Availability**: Multi-region for high availability
4. **Cost**: Pricing varies by region

## Deployments

A **Deployment** is a running instance of your application.

### Deployment Lifecycle

\`\`\`
Source Code → Build → Deploy → Running
                 ↓
            Build Logs
                 ↓
            Artifacts
                 ↓
            Container Image
                 ↓
            Health Checks
                 ↓
            Traffic Routing
\`\`\`

### Deployment States

| State | Description |
|-------|-------------|
| \`building\` | Building application |
| \`deploying\` | Rolling out to infrastructure |
| \`active\` | Serving traffic |
| \`failed\` | Deployment failed |
| \`cancelled\` | Deployment cancelled |
| \`superseded\` | Replaced by newer deployment |

### Deployment Strategies

- **Rolling**: Gradual replacement (default)
- **Blue-Green**: Instant switchover
- **Canary**: Percentage-based rollout

## Instances

**Instances** are the compute units running your application.

### Instance Types

\`\`\`
┌─────────────────────────────────────────┐
│ Instance Type      vCPU    Memory  Use  │
├─────────────────────────────────────────┤
│ shared-1x          0.5     512MB   Dev  │
│ standard-1x        1       1GB     Prod │
│ standard-2x        2       2GB     Prod │
│ performance-4x     4       8GB     High │
│ performance-8x     8       16GB    High │
│ memory-4x          4       16GB    Cache│
│ compute-8x         8       8GB     CPU  │
└─────────────────────────────────────────┘
\`\`\`

### Instance Scaling

Configure automatic scaling:

\`\`\`json
{
  "scaling": {
    "min": 2,
    "max": 10,
    "metrics": {
      "cpu": 70,
      "memory": 80,
      "requests": 1000
    }
  }
}
\`\`\`

## Networking

### Virtual Private Cloud (VPC)

Isolated network environment for your resources:

- Private IP addressing
- Network segmentation
- Security groups
- VPC peering

### Load Balancing

Automatic traffic distribution:

- Layer 7 (HTTP/HTTPS) load balancing
- Health check integration
- SSL termination
- WebSocket support

### DNS & Domains

- Automatic SSL certificates
- Custom domain support
- DNS management
- Global CDN integration

## Security Model

### Identity & Access Management (IAM)

\`\`\`
User → Role → Permissions → Resources
\`\`\`

### Authentication

- API keys for programmatic access
- OAuth for user authentication
- Service accounts for automation
- SSO for enterprise (SAML, OIDC)

### Encryption

- **At rest**: AES-256 encryption
- **In transit**: TLS 1.3
- **Secrets**: Encrypted environment variables

## Billing Model

### Pay-as-you-go

- Per-second billing for compute
- Per-GB for storage
- Per-request for serverless
- No minimum commitments

### Cost Components

| Resource | Billing Unit |
|----------|--------------|
| Compute | vCPU-hour |
| Memory | GB-hour |
| Storage | GB-month |
| Bandwidth | GB transferred |
| Databases | Instance-hour + storage |
    `,
    relatedDocs: ['introduction', 'account-setup', 'vpc']
  }
};
