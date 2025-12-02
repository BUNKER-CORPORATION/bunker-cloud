// Compute Documentation Content

import { DocPage } from '../types';

export const computeDocs: Record<string, DocPage> = {
  'compute-overview': {
    id: 'compute-overview',
    title: 'Compute Overview',
    description: 'Introduction to Bunker Cloud compute services including instances, containers, and serverless.',
    difficulty: 'beginner',
    timeToRead: '8 min',
    lastUpdated: '2024-12-01',
    content: `
## Introduction

Bunker Cloud Compute provides flexible, secure compute resources for any workload. From simple web applications to complex distributed systems, our compute services scale to meet your needs.

## Compute Services

### Vault Instances

Virtual machines with dedicated resources:

- **Full isolation**: Each instance runs in its own secure environment
- **Flexible sizing**: Choose from various CPU and memory configurations
- **Persistent storage**: Attach block volumes for data persistence
- **Root access**: Full control over the operating system

### Container Deployments

Run containerized applications with ease:

- **Docker support**: Deploy any Docker container
- **Auto-scaling**: Scale based on traffic and resource usage
- **Zero-downtime deploys**: Rolling updates by default
- **Built-in load balancing**: Automatic traffic distribution

### Managed Kubernetes

Enterprise-grade Kubernetes clusters:

- **Fully managed control plane**: We handle the complexity
- **Node auto-scaling**: Automatically adjust cluster size
- **Integrated monitoring**: Built-in metrics and logging
- **Multi-region support**: Deploy across regions

### Serverless Functions

Event-driven compute without server management:

- **Pay per execution**: Only pay when code runs
- **Auto-scaling to zero**: No cost when idle
- **Multiple runtimes**: Node.js, Python, Go, Rust
- **Sub-second cold starts**: Fast function invocation

## Choosing the Right Service

| Service | Best For | Scaling | Management |
|---------|----------|---------|------------|
| **Vault Instances** | Legacy apps, custom stacks | Manual/Auto | Full control |
| **Containers** | Microservices, web apps | Auto | Managed |
| **Kubernetes** | Complex orchestration | Auto | Semi-managed |
| **Serverless** | Event-driven, APIs | Auto | Fully managed |

## Key Features

### Global Deployment

Deploy to any of our 25+ regions:

\`\`\`bash
bunker deploy --region us-east-1
bunker deploy --region eu-west-1
bunker deploy --region ap-northeast-1
\`\`\`

### High Availability

Built-in redundancy and failover:

- Automatic health checks
- Self-healing infrastructure
- Multi-zone distribution
- 99.99% uptime SLA

### Security

Enterprise-grade security:

- Isolated network environments
- Encrypted data at rest and in transit
- DDoS protection included
- SOC 2 and ISO 27001 certified

### Performance

Optimized for speed:

- NVMe SSD storage
- Up to 25 Gbps network
- Low-latency global backbone
- Edge caching available

## Pricing

### Vault Instances

| Type | vCPU | Memory | Price/hour |
|------|------|--------|------------|
| standard-1x | 1 | 1 GB | $0.007 |
| standard-2x | 2 | 2 GB | $0.014 |
| standard-4x | 4 | 4 GB | $0.028 |
| performance-8x | 8 | 16 GB | $0.112 |

### Containers

- $0.00001 per vCPU-second
- $0.000001 per MB-second
- Bandwidth: $0.01/GB after 100GB

### Serverless

- $0.20 per million invocations
- $0.000016 per GB-second
- Free tier: 1M invocations/month

## Getting Started

1. **Choose your service**: Based on workload requirements
2. **Configure resources**: Size, region, scaling
3. **Deploy**: Via CLI, console, or API
4. **Monitor**: Track performance and costs
    `,
    codeExamples: [
      {
        language: 'bash',
        title: 'Deploy a container',
        code: `# Deploy from Docker image
bunker compute deploy \\
  --image myapp:latest \\
  --type standard-2x \\
  --region us-east-1 \\
  --port 3000 \\
  --scale min=2,max=10

# Check deployment status
bunker compute status

# View logs
bunker compute logs --follow`
      }
    ],
    relatedDocs: ['vault-instances', 'containers', 'serverless-functions']
  },

  'vault-instances': {
    id: 'vault-instances',
    title: 'Vault Instances',
    description: 'Create and manage virtual machines on Bunker Cloud.',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Vault Instances are virtual machines that provide dedicated compute resources. They offer full control over the operating system and are ideal for applications requiring custom configurations.

## Creating an Instance

### Using the Console

1. Navigate to **Compute → Vault Instances**
2. Click **Create Instance**
3. Configure:
   - Name and region
   - Instance type
   - Operating system
   - Storage
   - Network settings
4. Review and create

### Using the CLI

\`\`\`bash
bunker instances create \\
  --name my-server \\
  --type standard-2x \\
  --region us-east-1 \\
  --image ubuntu-22.04 \\
  --ssh-key my-key
\`\`\`

### Using the API

\`\`\`bash
curl -X POST https://api.bunkercloud.com/v1/instances \\
  -H "Authorization: Bearer $BUNKER_API_KEY" \\
  -d '{
    "name": "my-server",
    "type": "standard-2x",
    "region": "us-east-1",
    "image": "ubuntu-22.04",
    "ssh_keys": ["key-abc123"]
  }'
\`\`\`

## Instance Types

### Standard Instances

Balanced CPU and memory for general workloads:

| Type | vCPU | Memory | Storage | Network | Price/hr |
|------|------|--------|---------|---------|----------|
| standard-1x | 1 | 1 GB | 25 GB | 1 Gbps | $0.007 |
| standard-2x | 2 | 2 GB | 50 GB | 2 Gbps | $0.014 |
| standard-4x | 4 | 4 GB | 80 GB | 4 Gbps | $0.028 |
| standard-8x | 8 | 8 GB | 160 GB | 8 Gbps | $0.056 |

### Performance Instances

High CPU and memory for demanding workloads:

| Type | vCPU | Memory | Storage | Network | Price/hr |
|------|------|--------|---------|---------|----------|
| performance-4x | 4 | 8 GB | 100 GB | 10 Gbps | $0.056 |
| performance-8x | 8 | 16 GB | 200 GB | 15 Gbps | $0.112 |
| performance-16x | 16 | 32 GB | 400 GB | 25 Gbps | $0.224 |
| performance-32x | 32 | 64 GB | 800 GB | 25 Gbps | $0.448 |

### Memory-Optimized Instances

High memory-to-CPU ratio for caching and analytics:

| Type | vCPU | Memory | Storage | Network | Price/hr |
|------|------|--------|---------|---------|----------|
| memory-2x | 2 | 8 GB | 50 GB | 4 Gbps | $0.028 |
| memory-4x | 4 | 16 GB | 100 GB | 8 Gbps | $0.056 |
| memory-8x | 8 | 32 GB | 200 GB | 15 Gbps | $0.112 |
| memory-16x | 16 | 64 GB | 400 GB | 25 Gbps | $0.224 |

### Compute-Optimized Instances

High CPU for compute-intensive workloads:

| Type | vCPU | Memory | Storage | Network | Price/hr |
|------|------|--------|---------|---------|----------|
| compute-4x | 4 | 4 GB | 100 GB | 10 Gbps | $0.040 |
| compute-8x | 8 | 8 GB | 200 GB | 15 Gbps | $0.080 |
| compute-16x | 16 | 16 GB | 400 GB | 25 Gbps | $0.160 |
| compute-32x | 32 | 32 GB | 800 GB | 25 Gbps | $0.320 |

### GPU Instances

For machine learning and graphics workloads:

| Type | GPU | vCPU | Memory | Price/hr |
|------|-----|------|--------|----------|
| gpu-t4 | 1x T4 | 4 | 16 GB | $0.50 |
| gpu-a10 | 1x A10 | 8 | 32 GB | $1.00 |
| gpu-a100 | 1x A100 | 12 | 80 GB | $3.00 |

## Operating System Images

### Linux Distributions

- Ubuntu 22.04 LTS, 20.04 LTS
- Debian 12, 11
- CentOS Stream 9
- Rocky Linux 9
- Fedora 39
- Alpine Linux 3.19

### Application Images

- Docker CE
- Node.js (18, 20)
- Python (3.10, 3.11, 3.12)
- Go (1.21, 1.22)
- PostgreSQL (14, 15, 16)
- MySQL (8.0)
- Redis (7.x)

### Custom Images

Create custom images from running instances:

\`\`\`bash
bunker instances snapshot my-server --name my-custom-image
\`\`\`

## SSH Access

### Add SSH Key

\`\`\`bash
# Add existing key
bunker ssh-keys add --name my-key --public-key ~/.ssh/id_rsa.pub

# Generate new key
bunker ssh-keys create --name new-key
\`\`\`

### Connect to Instance

\`\`\`bash
# Using Bunker CLI
bunker ssh my-server

# Using standard SSH
ssh root@203.0.113.50
\`\`\`

### SSH Configuration

Add to \`~/.ssh/config\`:

\`\`\`
Host bunker-*
  User root
  IdentityFile ~/.ssh/bunker_key
  StrictHostKeyChecking no
\`\`\`

## Storage

### Root Volume

Every instance includes a root volume:

- SSD-backed storage
- Automatic encryption
- Included in instance price

### Additional Volumes

Attach block volumes for additional storage:

\`\`\`bash
# Create volume
bunker volumes create --name data-vol --size 100 --region us-east-1

# Attach to instance
bunker volumes attach data-vol --instance my-server --device /dev/sdb
\`\`\`

## Networking

### Public IP

Instances can have public IPv4 addresses:

\`\`\`bash
bunker instances create --name my-server --public-ip
\`\`\`

### Private Networking

Connect instances in a VPC:

\`\`\`bash
bunker instances create --name my-server --vpc my-vpc --subnet private-1
\`\`\`

### Firewalls

Control traffic with security groups:

\`\`\`bash
bunker firewall create web-server \\
  --rule "allow tcp 80 0.0.0.0/0" \\
  --rule "allow tcp 443 0.0.0.0/0" \\
  --rule "allow tcp 22 10.0.0.0/8"
\`\`\`

## Instance Lifecycle

### States

| State | Description |
|-------|-------------|
| \`pending\` | Being created |
| \`running\` | Active and billed |
| \`stopping\` | Shutting down |
| \`stopped\` | Powered off (storage billed) |
| \`terminated\` | Deleted |

### Actions

\`\`\`bash
# Stop instance
bunker instances stop my-server

# Start instance
bunker instances start my-server

# Restart instance
bunker instances restart my-server

# Delete instance
bunker instances delete my-server
\`\`\`

## Monitoring

### Metrics

Available metrics:

- CPU utilization
- Memory usage
- Disk I/O
- Network traffic
- Disk space

### View Metrics

\`\`\`bash
bunker instances metrics my-server --metric cpu --period 1h
\`\`\`

### Alerts

Set up alerts for thresholds:

\`\`\`bash
bunker alerts create \\
  --resource my-server \\
  --metric cpu \\
  --threshold 80 \\
  --action email:ops@company.com
\`\`\`
    `,
    codeExamples: [
      {
        language: 'bash',
        title: 'Complete instance setup',
        code: `# Create an instance
bunker instances create \\
  --name web-server \\
  --type standard-4x \\
  --region us-east-1 \\
  --image ubuntu-22.04 \\
  --ssh-key my-key \\
  --vpc production \\
  --firewall web-server

# Create and attach storage
bunker volumes create --name web-data --size 100
bunker volumes attach web-data --instance web-server

# SSH and configure
bunker ssh web-server
# Inside instance:
sudo mkfs.ext4 /dev/sdb
sudo mount /dev/sdb /data`
      }
    ],
    relatedDocs: ['instance-types', 'block-volumes', 'firewalls']
  },

  'instance-types': {
    id: 'instance-types',
    title: 'Instance Types & Sizing',
    description: 'Choose the right instance type for your workload.',
    difficulty: 'intermediate',
    timeToRead: '8 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Choosing the right instance type is crucial for balancing performance and cost. This guide helps you select the optimal configuration for your workload.

## Instance Families

### Standard (Balanced)

**Use cases**: Web servers, development environments, small databases

- Balanced CPU-to-memory ratio (1:1 GB)
- General-purpose workloads
- Most cost-effective for typical applications

### Performance (High-Performance)

**Use cases**: Production applications, APIs, medium databases

- Higher CPU and memory
- Better network performance
- NVMe SSD storage

### Memory-Optimized

**Use cases**: In-memory caching, real-time analytics, large databases

- High memory-to-CPU ratio (4:1 GB)
- Optimized for memory-intensive workloads
- Ideal for Redis, Memcached, Elasticsearch

### Compute-Optimized

**Use cases**: Batch processing, scientific computing, video encoding

- High CPU-to-memory ratio
- Latest generation processors
- Best for CPU-bound tasks

### GPU

**Use cases**: Machine learning, video rendering, scientific simulation

- NVIDIA GPUs (T4, A10, A100)
- CUDA and cuDNN support
- High-bandwidth memory

## Sizing Guidelines

### Web Applications

| Traffic | Instance Type | Quantity |
|---------|--------------|----------|
| < 10k req/day | standard-1x | 1 |
| 10k-100k req/day | standard-2x | 2 |
| 100k-1M req/day | standard-4x | 2-4 |
| > 1M req/day | performance-4x | 4+ |

### Databases

| Database Size | Instance Type | Notes |
|--------------|---------------|-------|
| < 10 GB | standard-2x | Development |
| 10-100 GB | memory-4x | Production |
| 100 GB - 1 TB | memory-8x | High traffic |
| > 1 TB | memory-16x | Enterprise |

### Background Workers

| Job Type | Instance Type | Notes |
|----------|---------------|-------|
| Light processing | standard-1x | Email, notifications |
| Data processing | compute-4x | ETL, reports |
| ML inference | gpu-t4 | Model serving |

## Right-Sizing

### Monitoring Usage

Check current resource utilization:

\`\`\`bash
bunker instances metrics my-server --metric cpu,memory --period 7d
\`\`\`

### Recommendations

Get sizing recommendations:

\`\`\`bash
bunker instances recommend my-server
# Output:
# Current: standard-4x (avg CPU: 15%, avg Memory: 45%)
# Recommended: standard-2x (estimated savings: 50%)
\`\`\`

### Resizing

Change instance type with minimal downtime:

\`\`\`bash
# Resize instance (requires restart)
bunker instances resize my-server --type standard-4x

# Schedule resize during maintenance window
bunker instances resize my-server --type standard-4x --at "2024-12-15 02:00"
\`\`\`

## Cost Optimization

### Reserved Instances

Save up to 60% with commitments:

| Term | Discount |
|------|----------|
| 1 year | 30% |
| 3 years | 60% |

### Spot Instances

Use spare capacity at up to 90% discount:

\`\`\`bash
bunker instances create --name worker --type standard-4x --spot
\`\`\`

### Auto-Scaling

Scale based on demand:

\`\`\`yaml
scaling:
  min: 2
  max: 10
  metrics:
    - type: cpu
      target: 70
    - type: memory
      target: 80
\`\`\`
    `,
    relatedDocs: ['vault-instances', 'auto-scaling', 'cost-optimization']
  },

  'containers': {
    id: 'containers',
    title: 'Container Deployments',
    description: 'Deploy and manage containerized applications on Bunker Cloud.',
    difficulty: 'intermediate',
    timeToRead: '15 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Bunker Cloud Containers provide a fully managed platform for running Docker containers. Focus on your code while we handle scaling, load balancing, and infrastructure.

## Quick Start

### Deploy from Dockerfile

\`\`\`bash
# Initialize project
bunker init --type container

# Deploy
bunker deploy
\`\`\`

### Deploy from Image

\`\`\`bash
bunker deploy --image myregistry/myapp:latest
\`\`\`

## Container Configuration

### bunker.json

\`\`\`json
{
  "name": "my-container-app",
  "type": "container",
  "region": "us-east-1",

  "container": {
    "dockerfile": "Dockerfile",
    "context": ".",
    "target": "production"
  },

  "resources": {
    "cpu": 1,
    "memory": "1Gi"
  },

  "scaling": {
    "min": 2,
    "max": 10,
    "targetCPU": 70
  },

  "healthCheck": {
    "path": "/health",
    "port": 8080,
    "interval": 30
  },

  "ports": [
    { "container": 8080, "public": 443 }
  ]
}
\`\`\`

### Dockerfile Best Practices

\`\`\`dockerfile
# Use specific version
FROM node:20-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /app

# Non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

USER nodejs

EXPOSE 8080
CMD ["node", "dist/index.js"]
\`\`\`

## Resource Allocation

### CPU and Memory

| Preset | CPU | Memory | Use Case |
|--------|-----|--------|----------|
| small | 0.25 | 256Mi | Development |
| medium | 0.5 | 512Mi | Light production |
| large | 1 | 1Gi | Standard production |
| xlarge | 2 | 2Gi | High traffic |
| 2xlarge | 4 | 4Gi | Heavy workloads |

### Custom Resources

\`\`\`json
{
  "resources": {
    "cpu": 1.5,
    "memory": "2Gi",
    "ephemeralStorage": "10Gi"
  }
}
\`\`\`

## Scaling

### Horizontal Scaling

Scale based on metrics:

\`\`\`json
{
  "scaling": {
    "min": 2,
    "max": 20,
    "metrics": [
      { "type": "cpu", "target": 70 },
      { "type": "memory", "target": 80 },
      { "type": "requests", "target": 1000 }
    ],
    "scaleUpCooldown": 60,
    "scaleDownCooldown": 300
  }
}
\`\`\`

### Manual Scaling

\`\`\`bash
bunker scale my-app --replicas 5
\`\`\`

## Networking

### Ports

Expose container ports:

\`\`\`json
{
  "ports": [
    { "container": 8080, "public": 443, "protocol": "https" },
    { "container": 9090, "public": null, "name": "metrics" }
  ]
}
\`\`\`

### Service Discovery

Containers can discover each other:

\`\`\`
# Internal DNS
http://my-service.my-project.internal:8080
\`\`\`

### Load Balancing

Automatic load balancing:

- Round-robin distribution
- Health check integration
- Session affinity (optional)
- WebSocket support

## Environment Variables

### Configuration

\`\`\`bash
# Set variables
bunker env set DATABASE_URL="postgresql://..."
bunker env set REDIS_URL="redis://..."

# From file
bunker env import .env.production
\`\`\`

### Secrets

\`\`\`bash
# Create secret
bunker secrets set API_KEY="sk_live_..."

# Reference in config
{
  "env": {
    "API_KEY": { "secret": "API_KEY" }
  }
}
\`\`\`

## Storage

### Ephemeral Storage

Default temporary storage (cleared on restart):

\`\`\`json
{
  "resources": {
    "ephemeralStorage": "10Gi"
  }
}
\`\`\`

### Persistent Volumes

Attach persistent storage:

\`\`\`json
{
  "volumes": [
    {
      "name": "data",
      "mountPath": "/data",
      "size": "50Gi",
      "class": "ssd"
    }
  ]
}
\`\`\`

## Health Checks

### Configuration

\`\`\`json
{
  "healthCheck": {
    "type": "http",
    "path": "/health",
    "port": 8080,
    "interval": 30,
    "timeout": 10,
    "healthyThreshold": 2,
    "unhealthyThreshold": 3
  }
}
\`\`\`

### Health Check Types

| Type | Description |
|------|-------------|
| \`http\` | HTTP GET request |
| \`tcp\` | TCP connection |
| \`exec\` | Run command in container |

## Deployments

### Deployment Strategies

**Rolling (default)**
\`\`\`json
{
  "deployment": {
    "strategy": "rolling",
    "maxSurge": 1,
    "maxUnavailable": 0
  }
}
\`\`\`

**Blue-Green**
\`\`\`json
{
  "deployment": {
    "strategy": "blue-green"
  }
}
\`\`\`

**Canary**
\`\`\`json
{
  "deployment": {
    "strategy": "canary",
    "steps": [
      { "weight": 10, "pause": "5m" },
      { "weight": 50, "pause": "10m" },
      { "weight": 100 }
    ]
  }
}
\`\`\`

### Rollbacks

\`\`\`bash
# Rollback to previous
bunker rollback my-app

# Rollback to specific version
bunker rollback my-app --revision 5
\`\`\`

## Logging

### View Logs

\`\`\`bash
# All logs
bunker logs my-app

# Follow logs
bunker logs my-app --follow

# Filter by container
bunker logs my-app --container web

# Search
bunker logs my-app --search "error"
\`\`\`

### Log Shipping

Send logs to external services:

\`\`\`json
{
  "logging": {
    "driver": "datadog",
    "options": {
      "apiKey": { "secret": "DATADOG_API_KEY" }
    }
  }
}
\`\`\`

## Private Registry

### Authentication

\`\`\`bash
bunker registry login myregistry.com
\`\`\`

### Configuration

\`\`\`json
{
  "container": {
    "image": "myregistry.com/myapp:latest",
    "registry": {
      "server": "myregistry.com",
      "secret": "registry-credentials"
    }
  }
}
\`\`\`
    `,
    codeExamples: [
      {
        language: 'json',
        title: 'Complete container configuration',
        code: `{
  "name": "api-service",
  "type": "container",
  "region": "us-east-1",

  "container": {
    "dockerfile": "Dockerfile",
    "context": ".",
    "target": "production",
    "args": {
      "NODE_ENV": "production"
    }
  },

  "resources": {
    "cpu": 2,
    "memory": "2Gi"
  },

  "scaling": {
    "min": 3,
    "max": 20,
    "metrics": [
      { "type": "cpu", "target": 70 },
      { "type": "requests", "target": 500 }
    ]
  },

  "healthCheck": {
    "path": "/api/health",
    "port": 8080,
    "interval": 15,
    "timeout": 5
  },

  "deployment": {
    "strategy": "rolling",
    "maxSurge": 2,
    "maxUnavailable": 0
  },

  "env": {
    "NODE_ENV": "production",
    "LOG_LEVEL": "info"
  }
}`
      }
    ],
    relatedDocs: ['kubernetes', 'auto-scaling', 'health-checks']
  },

  'kubernetes': {
    id: 'kubernetes',
    title: 'Managed Kubernetes',
    description: 'Deploy and manage Kubernetes clusters on Bunker Cloud.',
    difficulty: 'advanced',
    timeToRead: '20 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Bunker Kubernetes Service (BKS) provides fully managed Kubernetes clusters. We handle the control plane, upgrades, and scaling while you focus on your applications.

## Creating a Cluster

### Using the Console

1. Navigate to **Compute → Kubernetes**
2. Click **Create Cluster**
3. Configure:
   - Cluster name
   - Kubernetes version
   - Region
   - Node pools
4. Create cluster

### Using the CLI

\`\`\`bash
bunker kubernetes create my-cluster \\
  --version 1.29 \\
  --region us-east-1 \\
  --node-pool "default:standard-4x:3"
\`\`\`

### Using Terraform

\`\`\`hcl
resource "bunker_kubernetes_cluster" "main" {
  name    = "production"
  region  = "us-east-1"
  version = "1.29"

  node_pool {
    name          = "default"
    instance_type = "standard-4x"
    min_nodes     = 3
    max_nodes     = 10
    auto_scale    = true
  }
}
\`\`\`

## Cluster Configuration

### Kubernetes Versions

| Version | Status | End of Support |
|---------|--------|----------------|
| 1.29 | Current | Dec 2025 |
| 1.28 | Supported | Aug 2025 |
| 1.27 | Supported | Apr 2025 |

### Control Plane

- Fully managed by Bunker Cloud
- Multi-AZ high availability
- Automatic upgrades available
- 99.95% SLA

## Node Pools

### Creating Node Pools

\`\`\`bash
bunker kubernetes node-pools create my-cluster \\
  --name gpu-nodes \\
  --type gpu-t4 \\
  --min 0 \\
  --max 5 \\
  --labels "workload=ml"
\`\`\`

### Node Pool Configuration

\`\`\`yaml
nodePools:
  - name: default
    instanceType: standard-4x
    minNodes: 3
    maxNodes: 10
    autoScale: true
    labels:
      role: worker
    taints: []

  - name: gpu
    instanceType: gpu-t4
    minNodes: 0
    maxNodes: 5
    autoScale: true
    labels:
      role: ml
    taints:
      - key: nvidia.com/gpu
        value: "true"
        effect: NoSchedule
\`\`\`

### Auto-Scaling

Node pools automatically scale based on pending pods:

\`\`\`yaml
autoScale:
  enabled: true
  minNodes: 2
  maxNodes: 20
  scaleDownDelay: 10m
  scaleDownUnneededTime: 5m
\`\`\`

## Connecting to Cluster

### Get Kubeconfig

\`\`\`bash
bunker kubernetes kubeconfig my-cluster > ~/.kube/config

# Or merge with existing
bunker kubernetes kubeconfig my-cluster --merge
\`\`\`

### Verify Connection

\`\`\`bash
kubectl cluster-info
kubectl get nodes
\`\`\`

## Deploying Applications

### Using kubectl

\`\`\`yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: web
          image: myapp:latest
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
\`\`\`

\`\`\`bash
kubectl apply -f deployment.yaml
\`\`\`

### Using Helm

\`\`\`bash
# Add Bunker Helm repo
helm repo add bunker https://charts.bunkercloud.com

# Install an application
helm install my-app bunker/web-app \\
  --set image.repository=myapp \\
  --set image.tag=latest \\
  --set replicaCount=3
\`\`\`

## Load Balancing

### Service Type: LoadBalancer

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app
  annotations:
    bunker.cloud/load-balancer-type: "external"
spec:
  type: LoadBalancer
  ports:
    - port: 443
      targetPort: 8080
  selector:
    app: my-app
\`\`\`

### Ingress Controller

BKS includes the Bunker Ingress Controller:

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app
  annotations:
    bunker.cloud/ssl: "true"
spec:
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app
                port:
                  number: 8080
\`\`\`

## Storage

### StorageClasses

| Class | Type | Use Case |
|-------|------|----------|
| \`bunker-ssd\` | SSD | General purpose |
| \`bunker-ssd-fast\` | NVMe | High IOPS |
| \`bunker-hdd\` | HDD | Bulk storage |

### PersistentVolumeClaim

\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: bunker-ssd
  resources:
    requests:
      storage: 100Gi
\`\`\`

## Networking

### Network Policies

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - port: 8080
\`\`\`

### VPC Integration

Connect to your VPC:

\`\`\`bash
bunker kubernetes update my-cluster --vpc my-vpc
\`\`\`

## Monitoring

### Built-in Metrics

- Node metrics (CPU, memory, disk)
- Pod metrics
- Container metrics
- Kubernetes events

### Prometheus Integration

\`\`\`bash
# Enable managed Prometheus
bunker kubernetes addons enable my-cluster prometheus
\`\`\`

### Grafana Dashboards

Pre-built dashboards for:
- Cluster overview
- Node metrics
- Pod metrics
- Network traffic

## Upgrades

### Upgrade Control Plane

\`\`\`bash
bunker kubernetes upgrade my-cluster --version 1.29
\`\`\`

### Upgrade Node Pools

\`\`\`bash
bunker kubernetes node-pools upgrade my-cluster default --version 1.29
\`\`\`

### Rolling Upgrades

Node pools upgrade with zero downtime using rolling updates.
    `,
    codeExamples: [
      {
        language: 'bash',
        title: 'Complete cluster setup',
        code: `# Create cluster
bunker kubernetes create production \\
  --version 1.29 \\
  --region us-east-1 \\
  --node-pool "default:standard-4x:3-10"

# Get kubeconfig
bunker kubernetes kubeconfig production > ~/.kube/config

# Verify
kubectl get nodes

# Deploy application
kubectl apply -f https://raw.githubusercontent.com/bunkercloud/examples/main/kubernetes/hello-world.yaml

# Check status
kubectl get pods
kubectl get services`
      }
    ],
    relatedDocs: ['containers', 'load-balancers-network', 'vpc']
  },

  'serverless-functions': {
    id: 'serverless-functions',
    title: 'Serverless Functions',
    description: 'Deploy event-driven functions that scale automatically.',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Bunker Functions lets you run code without managing servers. Functions automatically scale from zero to handle any load, and you only pay for actual execution time.

## Quick Start

### Create a Function

\`\`\`bash
bunker functions init my-function --runtime nodejs20
cd my-function
\`\`\`

### Function Code

\`\`\`javascript
// index.js
export async function handler(event, context) {
  const name = event.queryStringParameters?.name || 'World';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: \`Hello, \${name}!\`,
      timestamp: new Date().toISOString()
    })
  };
}
\`\`\`

### Deploy

\`\`\`bash
bunker functions deploy
\`\`\`

## Supported Runtimes

| Runtime | Versions | Cold Start |
|---------|----------|------------|
| Node.js | 18, 20 | ~100ms |
| Python | 3.10, 3.11, 3.12 | ~150ms |
| Go | 1.21, 1.22 | ~50ms |
| Rust | stable | ~30ms |
| Java | 17, 21 | ~500ms |
| .NET | 7, 8 | ~300ms |

## Configuration

### bunker.json

\`\`\`json
{
  "name": "my-function",
  "type": "function",
  "runtime": "nodejs20",
  "handler": "index.handler",
  "region": "us-east-1",

  "memory": 256,
  "timeout": 30,

  "env": {
    "NODE_ENV": "production"
  },

  "triggers": [
    { "type": "http", "path": "/api/hello" }
  ]
}
\`\`\`

### Resources

| Memory | CPU | Max Timeout |
|--------|-----|-------------|
| 128 MB | 0.1 vCPU | 60s |
| 256 MB | 0.25 vCPU | 60s |
| 512 MB | 0.5 vCPU | 300s |
| 1024 MB | 1 vCPU | 900s |
| 2048 MB | 2 vCPU | 900s |

## Triggers

### HTTP Trigger

\`\`\`json
{
  "triggers": [
    {
      "type": "http",
      "path": "/api/users",
      "methods": ["GET", "POST"],
      "cors": true
    }
  ]
}
\`\`\`

### Schedule Trigger (Cron)

\`\`\`json
{
  "triggers": [
    {
      "type": "schedule",
      "schedule": "0 * * * *",
      "timezone": "UTC"
    }
  ]
}
\`\`\`

### Queue Trigger

\`\`\`json
{
  "triggers": [
    {
      "type": "queue",
      "queue": "my-queue",
      "batchSize": 10
    }
  ]
}
\`\`\`

### Event Trigger

\`\`\`json
{
  "triggers": [
    {
      "type": "event",
      "source": "storage",
      "events": ["object.created", "object.deleted"]
    }
  ]
}
\`\`\`

## Event Format

### HTTP Event

\`\`\`javascript
{
  httpMethod: 'POST',
  path: '/api/users',
  headers: { 'content-type': 'application/json' },
  queryStringParameters: { page: '1' },
  body: '{"name": "John"}',
  isBase64Encoded: false
}
\`\`\`

### Response Format

\`\`\`javascript
{
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ success: true }),
  isBase64Encoded: false
}
\`\`\`

## Environment Variables

### Set Variables

\`\`\`bash
bunker functions env set my-function DATABASE_URL="postgresql://..."
\`\`\`

### Secrets

\`\`\`bash
bunker secrets set API_KEY="secret-value"

# Reference in config
{
  "env": {
    "API_KEY": { "secret": "API_KEY" }
  }
}
\`\`\`

## Dependencies

### Node.js

\`\`\`json
// package.json
{
  "dependencies": {
    "axios": "^1.6.0",
    "lodash": "^4.17.21"
  }
}
\`\`\`

### Python

\`\`\`
# requirements.txt
requests==2.31.0
boto3==1.33.0
\`\`\`

## Monitoring

### Logs

\`\`\`bash
bunker functions logs my-function --follow
\`\`\`

### Metrics

Available metrics:
- Invocations
- Duration
- Errors
- Cold starts
- Concurrent executions

### Alerts

\`\`\`bash
bunker alerts create \\
  --resource function:my-function \\
  --metric errors \\
  --threshold 10 \\
  --period 5m
\`\`\`

## Best Practices

### Optimize Cold Starts

1. **Minimize dependencies**: Only include what you need
2. **Use smaller runtimes**: Go and Rust have fastest cold starts
3. **Avoid global state**: Initialize resources lazily
4. **Keep functions small**: Split large functions

### Code Organization

\`\`\`javascript
// Initialize outside handler (reused across invocations)
import { createClient } from './db.js';
const db = createClient();

export async function handler(event) {
  // Handler code runs on each invocation
  const result = await db.query('SELECT * FROM users');
  return { statusCode: 200, body: JSON.stringify(result) };
}
\`\`\`

### Error Handling

\`\`\`javascript
export async function handler(event) {
  try {
    const result = await processEvent(event);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
\`\`\`
    `,
    codeExamples: [
      {
        language: 'javascript',
        title: 'Complete function example',
        code: `// index.js
import { DynamoDB } from '@aws-sdk/client-dynamodb';

// Initialize outside handler for connection reuse
const dynamodb = new DynamoDB({ region: process.env.AWS_REGION });

export async function handler(event, context) {
  // Log request
  console.log('Request:', JSON.stringify(event));

  try {
    switch (event.httpMethod) {
      case 'GET':
        return await getUsers(event);
      case 'POST':
        return await createUser(event);
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}

async function getUsers(event) {
  const result = await dynamodb.scan({
    TableName: process.env.USERS_TABLE
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result.Items)
  };
}`
      }
    ],
    relatedDocs: ['compute-overview', 'environment-variables', 'monitoring-overview']
  },

  'auto-scaling': {
    id: 'auto-scaling',
    title: 'Auto Scaling',
    description: 'Automatically scale your applications based on demand.',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Auto Scaling automatically adjusts compute capacity to maintain performance and minimize costs. Configure scaling policies to handle traffic spikes without manual intervention.

## Scaling Types

### Horizontal Scaling

Add or remove instances based on load:

\`\`\`json
{
  "scaling": {
    "type": "horizontal",
    "min": 2,
    "max": 10,
    "metrics": [
      { "type": "cpu", "target": 70 }
    ]
  }
}
\`\`\`

### Vertical Scaling

Resize instances (requires restart):

\`\`\`bash
bunker instances resize my-server --type standard-4x
\`\`\`

## Scaling Metrics

### CPU Utilization

\`\`\`json
{
  "metrics": [
    {
      "type": "cpu",
      "target": 70,
      "scaleUp": 80,
      "scaleDown": 50
    }
  ]
}
\`\`\`

### Memory Utilization

\`\`\`json
{
  "metrics": [
    {
      "type": "memory",
      "target": 80
    }
  ]
}
\`\`\`

### Request Rate

\`\`\`json
{
  "metrics": [
    {
      "type": "requests",
      "target": 1000,
      "unit": "per-instance"
    }
  ]
}
\`\`\`

### Custom Metrics

\`\`\`json
{
  "metrics": [
    {
      "type": "custom",
      "name": "queue_depth",
      "target": 100
    }
  ]
}
\`\`\`

## Configuration

### Complete Example

\`\`\`json
{
  "scaling": {
    "enabled": true,
    "min": 2,
    "max": 20,

    "metrics": [
      { "type": "cpu", "target": 70 },
      { "type": "memory", "target": 80 },
      { "type": "requests", "target": 500 }
    ],

    "behavior": {
      "scaleUp": {
        "stabilizationWindow": 60,
        "policies": [
          { "type": "percent", "value": 100, "period": 60 },
          { "type": "pods", "value": 4, "period": 60 }
        ],
        "selectPolicy": "max"
      },
      "scaleDown": {
        "stabilizationWindow": 300,
        "policies": [
          { "type": "percent", "value": 10, "period": 60 }
        ]
      }
    },

    "cooldown": {
      "scaleUp": 60,
      "scaleDown": 300
    }
  }
}
\`\`\`

## Scaling Behavior

### Scale Up

- **Trigger**: Metric exceeds target
- **Default behavior**: Add 1 instance per evaluation
- **Cooldown**: 60 seconds default

### Scale Down

- **Trigger**: Metric below target
- **Default behavior**: Remove 1 instance per evaluation
- **Cooldown**: 300 seconds default
- **Protection**: Never scale below minimum

## Scheduled Scaling

Scale based on schedule:

\`\`\`json
{
  "scheduledScaling": [
    {
      "name": "business-hours",
      "schedule": "0 9 * * MON-FRI",
      "timezone": "America/New_York",
      "min": 5,
      "max": 20
    },
    {
      "name": "weekend",
      "schedule": "0 0 * * SAT,SUN",
      "timezone": "America/New_York",
      "min": 2,
      "max": 5
    }
  ]
}
\`\`\`

## Monitoring Scaling

### View Scaling Events

\`\`\`bash
bunker scaling events my-app
\`\`\`

### Current Status

\`\`\`bash
bunker scaling status my-app
# Replicas: 5 (min: 2, max: 10)
# CPU: 65% (target: 70%)
# Last scale: 10 minutes ago
\`\`\`

## Best Practices

1. **Set appropriate minimums**: Always run at least 2 instances for HA
2. **Use multiple metrics**: Combine CPU, memory, and requests
3. **Adjust cooldowns**: Longer for scale-down to avoid flapping
4. **Test your configuration**: Use load testing to validate
5. **Monitor costs**: Set alerts for unexpected scaling
    `,
    relatedDocs: ['containers', 'vault-instances', 'metrics-dashboards']
  },

  'load-balancing': {
    id: 'load-balancing',
    title: 'Load Balancing',
    description: 'Distribute traffic across your application instances.',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Bunker Cloud Load Balancers distribute incoming traffic across multiple instances, ensuring high availability and optimal performance.

## Load Balancer Types

### Application Load Balancer (L7)

HTTP/HTTPS traffic with advanced routing:

- Path-based routing
- Host-based routing
- Header-based routing
- WebSocket support
- SSL termination

### Network Load Balancer (L4)

High-performance TCP/UDP load balancing:

- Ultra-low latency
- Static IP addresses
- Preserve source IP
- Millions of requests per second

## Creating a Load Balancer

### Using the Console

1. Navigate to **Networking → Load Balancers**
2. Click **Create Load Balancer**
3. Choose type (Application or Network)
4. Configure listeners and targets
5. Create

### Using the CLI

\`\`\`bash
bunker lb create my-lb \\
  --type application \\
  --region us-east-1 \\
  --listener "https:443->http:8080"
\`\`\`

## Configuration

### Listeners

\`\`\`json
{
  "listeners": [
    {
      "port": 443,
      "protocol": "HTTPS",
      "certificate": "cert-abc123",
      "defaultAction": {
        "type": "forward",
        "targetGroup": "web-servers"
      }
    }
  ]
}
\`\`\`

### Target Groups

\`\`\`json
{
  "targetGroups": [
    {
      "name": "web-servers",
      "port": 8080,
      "protocol": "HTTP",
      "healthCheck": {
        "path": "/health",
        "interval": 30,
        "timeout": 10,
        "healthyThreshold": 2,
        "unhealthyThreshold": 3
      }
    }
  ]
}
\`\`\`

## Routing Rules

### Path-Based Routing

\`\`\`json
{
  "rules": [
    {
      "conditions": [
        { "pathPattern": "/api/*" }
      ],
      "action": {
        "type": "forward",
        "targetGroup": "api-servers"
      }
    },
    {
      "conditions": [
        { "pathPattern": "/static/*" }
      ],
      "action": {
        "type": "forward",
        "targetGroup": "static-servers"
      }
    }
  ]
}
\`\`\`

### Host-Based Routing

\`\`\`json
{
  "rules": [
    {
      "conditions": [
        { "hostHeader": "api.example.com" }
      ],
      "action": {
        "type": "forward",
        "targetGroup": "api-servers"
      }
    }
  ]
}
\`\`\`

## SSL/TLS

### SSL Termination

\`\`\`bash
# Upload certificate
bunker certificates create my-cert \\
  --certificate cert.pem \\
  --private-key key.pem \\
  --chain chain.pem

# Attach to load balancer
bunker lb update my-lb --certificate my-cert
\`\`\`

### SSL Policies

| Policy | TLS Versions | Use Case |
|--------|--------------|----------|
| \`modern\` | TLS 1.3 only | Maximum security |
| \`balanced\` | TLS 1.2, 1.3 | Recommended |
| \`compatible\` | TLS 1.1, 1.2, 1.3 | Legacy support |

## Health Checks

### Configuration

\`\`\`json
{
  "healthCheck": {
    "protocol": "HTTP",
    "path": "/health",
    "port": 8080,
    "interval": 30,
    "timeout": 10,
    "healthyThreshold": 2,
    "unhealthyThreshold": 3,
    "matcher": {
      "httpCode": "200-299"
    }
  }
}
\`\`\`

### Health Check Types

| Type | Description |
|------|-------------|
| HTTP | HTTP request to path |
| HTTPS | HTTPS request to path |
| TCP | TCP connection check |

## Algorithms

### Round Robin (Default)

Distributes requests evenly:

\`\`\`json
{
  "algorithm": "round-robin"
}
\`\`\`

### Least Connections

Routes to instance with fewest connections:

\`\`\`json
{
  "algorithm": "least-connections"
}
\`\`\`

### IP Hash

Consistent routing based on client IP:

\`\`\`json
{
  "algorithm": "ip-hash"
}
\`\`\`

## Sticky Sessions

Maintain session affinity:

\`\`\`json
{
  "stickiness": {
    "enabled": true,
    "type": "app-cookie",
    "cookieName": "SERVERID",
    "duration": 3600
  }
}
\`\`\`
    `,
    relatedDocs: ['auto-scaling', 'ssl-certificates', 'health-checks']
  },

  'health-checks': {
    id: 'health-checks',
    title: 'Health Checks',
    description: 'Configure health checks for your applications.',
    difficulty: 'beginner',
    timeToRead: '6 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Health checks monitor your application instances and automatically remove unhealthy instances from service.

## Health Check Types

### HTTP Health Check

\`\`\`json
{
  "healthCheck": {
    "type": "http",
    "path": "/health",
    "port": 8080,
    "expectedStatus": 200
  }
}
\`\`\`

### TCP Health Check

\`\`\`json
{
  "healthCheck": {
    "type": "tcp",
    "port": 5432
  }
}
\`\`\`

### Command Health Check

\`\`\`json
{
  "healthCheck": {
    "type": "exec",
    "command": ["pg_isready", "-h", "localhost"]
  }
}
\`\`\`

## Configuration

### Complete Example

\`\`\`json
{
  "healthCheck": {
    "type": "http",
    "path": "/health",
    "port": 8080,
    "interval": 30,
    "timeout": 10,
    "healthyThreshold": 2,
    "unhealthyThreshold": 3,
    "headers": {
      "X-Health-Check": "true"
    }
  }
}
\`\`\`

### Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| \`interval\` | Time between checks | 30s |
| \`timeout\` | Request timeout | 10s |
| \`healthyThreshold\` | Checks to become healthy | 2 |
| \`unhealthyThreshold\` | Checks to become unhealthy | 3 |

## Implementing Health Endpoints

### Node.js

\`\`\`javascript
app.get('/health', async (req, res) => {
  try {
    // Check database
    await db.query('SELECT 1');

    // Check Redis
    await redis.ping();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
\`\`\`

### Python

\`\`\`python
@app.route('/health')
def health():
    try:
        # Check dependencies
        db.execute('SELECT 1')
        redis_client.ping()

        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 503
\`\`\`

## Best Practices

1. **Dedicated endpoint**: Use \`/health\` or \`/healthz\`
2. **Check dependencies**: Verify database, cache, external services
3. **Fast response**: Keep health checks under 1 second
4. **Meaningful status**: Return 200 for healthy, 503 for unhealthy
5. **Include details**: Return diagnostic information for debugging
    `,
    relatedDocs: ['load-balancing', 'monitoring-overview', 'auto-scaling']
  }
};
