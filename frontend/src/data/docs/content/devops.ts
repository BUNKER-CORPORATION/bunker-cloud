// DevOps Documentation Content for Bunker Cloud

import { DocPage } from '../types';

export const devopsDocs: Record<string, DocPage> = {
  'devops-overview': {
    id: 'devops-overview',
    title: 'DevOps Overview',
    description: 'Introduction to CI/CD and deployment automation on Bunker Cloud',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# DevOps Overview

Bunker Cloud provides comprehensive CI/CD and DevOps tools to streamline your development workflow, from code push to production deployment.

## DevOps Pipeline

\`\`\`
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Code   │───►│  Build  │───►│  Test   │───►│ Deploy  │───►│ Monitor │
│  Push   │    │         │    │         │    │         │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
  GitHub        Docker         Unit &        Rolling        Metrics
  GitLab        Build         Integration   Blue/Green      Logs
  Bitbucket     Artifacts      E2E Tests    Canary         Alerts
\`\`\`

## Key Features

| Feature | Description |
|---------|-------------|
| **Git Integration** | GitHub, GitLab, Bitbucket support |
| **Automated Builds** | Docker builds, artifact management |
| **Deployment Strategies** | Rolling, blue/green, canary |
| **Preview Deployments** | Branch-based preview environments |
| **Rollbacks** | One-click rollback to any version |
| **Environment Variables** | Secure configuration management |
| **Infrastructure as Code** | Terraform, Pulumi support |

## Deployment Methods

### Git-Based Deployment

Automatic deployment on git push:

\`\`\`yaml
# bunker.yaml
name: my-app
build:
  dockerfile: Dockerfile
deploy:
  type: container
  instances: 3
  strategy: rolling
triggers:
  - branch: main
    environment: production
  - branch: develop
    environment: staging
\`\`\`

### CLI Deployment

Deploy from command line:

\`\`\`bash
# Deploy application
bunker deploy --app my-app --env production

# Deploy with specific image
bunker deploy --app my-app --image myregistry/app:v1.2.3
\`\`\`

### API Deployment

Trigger deployments programmatically:

\`\`\`bash
curl -X POST "https://api.bunkercloud.com/v1/deployments" \\
  -H "Authorization: Bunker {KEY}:{SECRET}" \\
  -d '{"app": "my-app", "environment": "production", "version": "v1.2.3"}'
\`\`\`

## Deployment Strategies

### Rolling Deployment

Gradual replacement of instances:

\`\`\`yaml
deploy:
  strategy: rolling
  rollingUpdate:
    maxSurge: 25%
    maxUnavailable: 0
\`\`\`

### Blue/Green Deployment

Zero-downtime deployment with instant switchover:

\`\`\`yaml
deploy:
  strategy: blue-green
  blueGreen:
    previewService: true
    autoPromote: false
    scaleDownDelay: 30m
\`\`\`

### Canary Deployment

Gradual traffic shifting:

\`\`\`yaml
deploy:
  strategy: canary
  canary:
    steps:
      - weight: 10
        pause: { duration: 5m }
      - weight: 50
        pause: { duration: 10m }
      - weight: 100
\`\`\`

## Quick Start

### 1. Connect Repository

\`\`\`bash
bunker git connect \\
  --provider github \\
  --repo myorg/myrepo
\`\`\`

### 2. Create Application

\`\`\`bash
bunker app create \\
  --name my-app \\
  --repo myorg/myrepo \\
  --branch main
\`\`\`

### 3. Configure Deployment

\`\`\`bash
bunker app config set \\
  --app my-app \\
  --env production \\
  --file bunker.yaml
\`\`\`

### 4. Deploy

\`\`\`bash
bunker deploy --app my-app --env production
\`\`\`

## Environment Management

### Environments

| Environment | Purpose | Auto-Deploy |
|-------------|---------|-------------|
| Development | Testing changes | On push |
| Staging | Pre-production testing | On merge to develop |
| Production | Live traffic | Manual approval |

### Environment Variables

\`\`\`bash
# Set environment variable
bunker env set DATABASE_URL="postgres://..." --app my-app --env production

# Set from file
bunker env import --file .env.production --app my-app --env production

# Use secrets
bunker env set API_KEY=@secrets/api-key --app my-app --env production
\`\`\`

## Best Practices

1. **Use infrastructure as code** - Version control your infrastructure
2. **Implement CI/CD** - Automate testing and deployment
3. **Use preview deployments** - Test changes before merging
4. **Implement health checks** - Ensure reliable deployments
5. **Enable rollbacks** - Quick recovery from issues
6. **Monitor deployments** - Track deployment success metrics
    `,
    codeExamples: [
      {
        title: 'bunker.yaml Configuration',
        language: 'yaml',
        code: `# bunker.yaml - Full configuration example
name: my-web-app
description: Production web application

# Build configuration
build:
  dockerfile: Dockerfile
  context: .
  args:
    NODE_ENV: production
  cache: true

# Deployment configuration
deploy:
  type: container
  instances:
    min: 2
    max: 10
  resources:
    cpu: 1
    memory: 2Gi
  strategy: rolling
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
  healthCheck:
    path: /health
    interval: 30s
    timeout: 5s

# Environment-specific overrides
environments:
  production:
    instances:
      min: 5
      max: 20
    domain: app.example.com
  staging:
    instances:
      min: 1
      max: 3
    domain: staging.example.com

# Triggers
triggers:
  - branch: main
    environment: production
    approval: required
  - branch: develop
    environment: staging
  - branch: feature/*
    environment: preview`
      }
    ],
    relatedDocs: ['deployment-methods', 'github-integration', 'deployment-pipelines']
  },

  'deployment-methods': {
    id: 'deployment-methods',
    title: 'Deployment Methods',
    description: 'Different ways to deploy applications to Bunker Cloud',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Deployment Methods

Bunker Cloud supports multiple deployment methods to fit your workflow and application requirements.

## Container Deployment

### From Dockerfile

\`\`\`bash
# Deploy from Dockerfile in repo
bunker deploy \\
  --app my-app \\
  --dockerfile ./Dockerfile \\
  --build-context .
\`\`\`

### From Container Registry

\`\`\`bash
# Deploy existing image
bunker deploy \\
  --app my-app \\
  --image ghcr.io/myorg/myapp:v1.2.3
\`\`\`

### Container Configuration

\`\`\`yaml
# bunker.yaml
deploy:
  type: container
  image: myregistry/app:latest
  command: ["node", "server.js"]
  ports:
    - port: 8080
      protocol: HTTP
  resources:
    cpu: 1
    memory: 2Gi
  env:
    - name: NODE_ENV
      value: production
    - name: DATABASE_URL
      valueFrom:
        secretRef: database-credentials
\`\`\`

## Serverless Functions

### Deploy Function

\`\`\`bash
bunker functions deploy \\
  --name my-function \\
  --runtime nodejs18 \\
  --handler index.handler \\
  --source ./src
\`\`\`

### Function Configuration

\`\`\`yaml
# bunker.yaml
deploy:
  type: function
  runtime: nodejs18
  handler: index.handler
  memory: 256
  timeout: 30
  triggers:
    - type: http
      path: /api/*
    - type: schedule
      cron: "0 * * * *"
    - type: queue
      queue: my-queue
\`\`\`

## Static Sites

### Deploy Static Site

\`\`\`bash
bunker sites deploy \\
  --name my-site \\
  --source ./build \\
  --domain example.com
\`\`\`

### Static Site Configuration

\`\`\`yaml
# bunker.yaml
deploy:
  type: static
  source: ./build
  buildCommand: npm run build
  outputDirectory: build
  domain: example.com
  cdn: true
  headers:
    - source: "**/*.js"
      headers:
        Cache-Control: "public, max-age=31536000"
\`\`\`

## Kubernetes Workloads

### Deploy to Managed K8s

\`\`\`bash
# Deploy with kubectl
kubectl apply -f deployment.yaml --context bunker-prod

# Or using Bunker CLI
bunker k8s deploy \\
  --cluster prod-cluster \\
  --manifest deployment.yaml
\`\`\`

### Helm Deployments

\`\`\`bash
bunker k8s helm install my-app ./chart \\
  --cluster prod-cluster \\
  --namespace production \\
  --values values-prod.yaml
\`\`\`

## Infrastructure as Code

### Terraform

\`\`\`hcl
# main.tf
provider "bunker" {
  region = "us-east-1"
}

resource "bunker_app" "web" {
  name = "web-app"

  container {
    image = "myregistry/app:latest"

    resources {
      cpu    = 1
      memory = "2Gi"
    }
  }

  scaling {
    min_instances = 2
    max_instances = 10
  }

  domain {
    name = "app.example.com"
  }
}
\`\`\`

### Pulumi

\`\`\`typescript
import * as bunker from "@pulumi/bunker";

const app = new bunker.App("web-app", {
  container: {
    image: "myregistry/app:latest",
    resources: {
      cpu: 1,
      memory: "2Gi",
    },
  },
  scaling: {
    minInstances: 2,
    maxInstances: 10,
  },
});
\`\`\`

## Deployment Commands

### Deploy

\`\`\`bash
# Deploy latest
bunker deploy --app my-app

# Deploy specific version
bunker deploy --app my-app --version v1.2.3

# Deploy to specific environment
bunker deploy --app my-app --env staging

# Deploy with variables
bunker deploy --app my-app --set IMAGE_TAG=latest
\`\`\`

### Rollback

\`\`\`bash
# Rollback to previous version
bunker rollback --app my-app

# Rollback to specific version
bunker rollback --app my-app --version v1.2.0
\`\`\`

### Status

\`\`\`bash
# Check deployment status
bunker deploy status --app my-app

# Watch deployment
bunker deploy status --app my-app --watch
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Multi-Environment Deployment',
        language: 'bash',
        code: `#!/bin/bash
# deploy.sh - Multi-environment deployment script

set -e

APP_NAME="my-app"
VERSION="\${1:-latest}"
ENV="\${2:-staging}"

echo "Deploying $APP_NAME version $VERSION to $ENV"

# Build if needed
if [ "$VERSION" = "latest" ]; then
  bunker build --app $APP_NAME --tag $VERSION
fi

# Deploy to environment
bunker deploy \\
  --app $APP_NAME \\
  --env $ENV \\
  --version $VERSION \\
  --wait

# Run smoke tests
echo "Running smoke tests..."
bunker test smoke --app $APP_NAME --env $ENV

# Check health
bunker health check --app $APP_NAME --env $ENV

echo "Deployment complete!"

# If production, notify
if [ "$ENV" = "production" ]; then
  bunker notify slack \\
    --message "Deployed $APP_NAME $VERSION to production" \\
    --channel deployments
fi`
      }
    ],
    relatedDocs: ['devops-overview', 'deployment-pipelines', 'rollbacks']
  },

  'github-integration': {
    id: 'github-integration',
    title: 'GitHub Integration',
    description: 'Connect and deploy from GitHub repositories',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '10 min',
    content: `
# GitHub Integration

Connect your GitHub repositories for automated builds and deployments.

## Connecting GitHub

### Via Console

1. Go to **Settings** > **Integrations** > **GitHub**
2. Click **Connect GitHub**
3. Authorize Bunker Cloud
4. Select repositories to connect

### Via CLI

\`\`\`bash
bunker git connect --provider github
\`\`\`

## GitHub Actions

### Basic Workflow

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Bunker Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Bunker Cloud
        uses: bunkercloud/deploy-action@v2
        with:
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
          app: my-app
          environment: production
\`\`\`

### With Build Step

\`\`\`yaml
name: Build and Deploy

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image: \${{ steps.build.outputs.image }}
    steps:
      - uses: actions/checkout@v4

      - name: Build and push image
        id: build
        uses: bunkercloud/build-action@v2
        with:
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
          dockerfile: ./Dockerfile
          tags: |
            \${{ github.sha }}
            latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Bunker Cloud
        uses: bunkercloud/deploy-action@v2
        with:
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
          app: my-app
          image: \${{ needs.build.outputs.image }}
          environment: \${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
\`\`\`

### Preview Deployments

\`\`\`yaml
name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy Preview
        id: preview
        uses: bunkercloud/deploy-action@v2
        with:
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
          app: my-app
          environment: preview
          preview-name: pr-\${{ github.event.number }}

      - name: Comment PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Preview deployed: \${{ steps.preview.outputs.url }}'
            })
\`\`\`

## GitHub App Integration

### Status Checks

Bunker Cloud reports deployment status back to GitHub:

- **Pending** - Deployment in progress
- **Success** - Deployment succeeded
- **Failure** - Deployment failed

### Deployment Environments

Link GitHub environments to Bunker Cloud:

\`\`\`yaml
# Repository settings -> Environments
production:
  deployment_branch_policy:
    protected_branches: true
  reviewers:
    - team-leads
  wait_timer: 5
\`\`\`

### Environment Secrets

\`\`\`yaml
# Use GitHub environment secrets
jobs:
  deploy:
    environment: production
    steps:
      - uses: bunkercloud/deploy-action@v2
        with:
          # Secrets from 'production' environment
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
\`\`\`

## Webhooks

Configure webhooks for deployment events:

\`\`\`bash
bunker webhooks create \\
  --url https://api.github.com/repos/myorg/myrepo/dispatches \\
  --events deployment.completed,deployment.failed \\
  --secret \$GITHUB_WEBHOOK_SECRET
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Complete CI/CD Pipeline',
        language: 'yaml',
        code: `# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  APP_NAME: my-app

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      image: \${{ steps.build.outputs.image }}
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        id: build
        uses: bunkercloud/build-action@v2
        with:
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
          dockerfile: ./Dockerfile
          tags: \${{ github.sha }}

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        uses: bunkercloud/deploy-action@v2
        with:
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
          app: \${{ env.APP_NAME }}
          image: \${{ needs.build.outputs.image }}
          environment: staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        uses: bunkercloud/deploy-action@v2
        with:
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
          app: \${{ env.APP_NAME }}
          image: \${{ needs.build.outputs.image }}
          environment: production
          strategy: canary`
      }
    ],
    relatedDocs: ['devops-overview', 'gitlab-integration', 'deployment-pipelines']
  },

  'gitlab-integration': {
    id: 'gitlab-integration',
    title: 'GitLab Integration',
    description: 'Connect and deploy from GitLab repositories',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# GitLab Integration

Connect GitLab for automated CI/CD pipelines with Bunker Cloud.

## Connecting GitLab

\`\`\`bash
bunker git connect --provider gitlab --url https://gitlab.com
\`\`\`

## GitLab CI Configuration

### Basic Pipeline

\`\`\`yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  BUNKER_APP: my-app

build:
  stage: build
  image: bunkercloud/cli:latest
  script:
    - bunker build --app $BUNKER_APP --tag $CI_COMMIT_SHA
  only:
    - main
    - develop

test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm test

deploy:
  stage: deploy
  image: bunkercloud/cli:latest
  script:
    - bunker deploy --app $BUNKER_APP --version $CI_COMMIT_SHA --env production
  only:
    - main
  environment:
    name: production
    url: https://app.example.com
\`\`\`

### With Review Apps

\`\`\`yaml
deploy-review:
  stage: deploy
  image: bunkercloud/cli:latest
  script:
    - bunker deploy --app $BUNKER_APP --env preview --preview-name mr-$CI_MERGE_REQUEST_IID
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    url: https://$CI_COMMIT_REF_SLUG.preview.example.com
    on_stop: stop-review
  only:
    - merge_requests

stop-review:
  stage: deploy
  image: bunkercloud/cli:latest
  script:
    - bunker preview delete --app $BUNKER_APP --name mr-$CI_MERGE_REQUEST_IID
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    action: stop
  when: manual
  only:
    - merge_requests
\`\`\`
    `,
    codeExamples: [
      {
        title: 'GitLab CI Pipeline',
        language: 'yaml',
        code: `# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy-staging
  - deploy-production

variables:
  BUNKER_APP: my-app
  DOCKER_TLS_CERTDIR: ""

.bunker-auth: &bunker-auth
  before_script:
    - bunker configure --api-key-id $BUNKER_API_KEY_ID --secret-key $BUNKER_SECRET_KEY

build:
  stage: build
  image: bunkercloud/cli:latest
  <<: *bunker-auth
  script:
    - bunker build --app $BUNKER_APP --tag $CI_COMMIT_SHA
  artifacts:
    reports:
      dotenv: build.env

test:
  stage: test
  image: node:20
  script:
    - npm ci
    - npm run test:coverage
  coverage: '/Lines\\s*:\\s*(\\d+\\.?\\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

deploy-staging:
  stage: deploy-staging
  image: bunkercloud/cli:latest
  <<: *bunker-auth
  script:
    - bunker deploy --app $BUNKER_APP --version $CI_COMMIT_SHA --env staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy-production:
  stage: deploy-production
  image: bunkercloud/cli:latest
  <<: *bunker-auth
  script:
    - bunker deploy --app $BUNKER_APP --version $CI_COMMIT_SHA --env production --strategy canary
  environment:
    name: production
    url: https://app.example.com
  only:
    - main
  when: manual`
      }
    ],
    relatedDocs: ['devops-overview', 'github-integration', 'deployment-pipelines']
  },

  'bitbucket-integration': {
    id: 'bitbucket-integration',
    title: 'Bitbucket Integration',
    description: 'Connect and deploy from Bitbucket repositories',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# Bitbucket Integration

Connect Bitbucket Pipelines for automated deployments to Bunker Cloud.

## Connecting Bitbucket

\`\`\`bash
bunker git connect --provider bitbucket
\`\`\`

## Bitbucket Pipelines

### Basic Configuration

\`\`\`yaml
# bitbucket-pipelines.yml
image: bunkercloud/cli:latest

pipelines:
  default:
    - step:
        name: Test
        image: node:20
        caches:
          - node
        script:
          - npm ci
          - npm test

  branches:
    main:
      - step:
          name: Build
          script:
            - bunker build --app my-app --tag $BITBUCKET_COMMIT
          artifacts:
            - build/**
      - step:
          name: Deploy Production
          deployment: production
          script:
            - bunker deploy --app my-app --version $BITBUCKET_COMMIT --env production

    develop:
      - step:
          name: Deploy Staging
          deployment: staging
          script:
            - bunker deploy --app my-app --version $BITBUCKET_COMMIT --env staging

  pull-requests:
    '**':
      - step:
          name: Deploy Preview
          script:
            - bunker deploy --app my-app --env preview --preview-name pr-$BITBUCKET_PR_ID
\`\`\`

### Environment Variables

Set in Bitbucket repository settings:

- \`BUNKER_API_KEY_ID\`
- \`BUNKER_SECRET_KEY\`
    `,
    codeExamples: [
      {
        title: 'Bitbucket Pipeline',
        language: 'yaml',
        code: `# bitbucket-pipelines.yml
image: node:20

definitions:
  caches:
    bunker: ~/.bunker
  steps:
    - step: &test
        name: Test
        caches:
          - node
        script:
          - npm ci
          - npm test
    - step: &build
        name: Build
        image: bunkercloud/cli:latest
        caches:
          - bunker
        script:
          - bunker build --app $APP_NAME --tag $BITBUCKET_COMMIT
    - step: &deploy
        name: Deploy
        image: bunkercloud/cli:latest
        caches:
          - bunker
        script:
          - bunker deploy --app $APP_NAME --version $BITBUCKET_COMMIT --env $DEPLOY_ENV

pipelines:
  branches:
    main:
      - step: *test
      - step: *build
      - step:
          <<: *deploy
          deployment: production
          trigger: manual
    develop:
      - step: *test
      - step: *build
      - step:
          <<: *deploy
          deployment: staging`
      }
    ],
    relatedDocs: ['devops-overview', 'github-integration', 'deployment-pipelines']
  },

  'deployment-pipelines': {
    id: 'deployment-pipelines',
    title: 'Deployment Pipelines',
    description: 'Build and configure deployment pipelines',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Deployment Pipelines

Create sophisticated deployment pipelines with stages, approvals, and automated testing.

## Pipeline Stages

\`\`\`yaml
# bunker-pipeline.yaml
name: production-pipeline

stages:
  - name: build
    steps:
      - build:
          dockerfile: Dockerfile
          context: .

  - name: test
    steps:
      - run:
          command: npm test
      - run:
          command: npm run e2e

  - name: security-scan
    steps:
      - scan:
          type: container
          fail-on: high

  - name: deploy-staging
    steps:
      - deploy:
          environment: staging
          wait: true
      - test:
          type: smoke
          url: https://staging.example.com

  - name: approval
    type: manual
    approvers:
      - team-leads
    timeout: 24h

  - name: deploy-production
    steps:
      - deploy:
          environment: production
          strategy: canary
          canary:
            steps: [10, 50, 100]
            interval: 10m
\`\`\`

## Pipeline Triggers

### Git Triggers

\`\`\`yaml
triggers:
  - type: git
    branch: main
    events: [push]
  - type: git
    branch: develop
    events: [push]
    target-stage: deploy-staging
  - type: git
    pattern: release/*
    events: [push]
\`\`\`

### Schedule Triggers

\`\`\`yaml
triggers:
  - type: schedule
    cron: "0 2 * * *"  # Daily at 2 AM
    branch: main
\`\`\`

### API Triggers

\`\`\`bash
curl -X POST "https://api.bunkercloud.com/v1/pipelines/my-pipeline/trigger" \\
  -H "Authorization: Bunker {KEY}:{SECRET}" \\
  -d '{"branch": "main", "variables": {"VERSION": "1.2.3"}}'
\`\`\`

## Pipeline Variables

\`\`\`yaml
variables:
  global:
    APP_NAME: my-app
    REGISTRY: registry.bunkercloud.com

  per-environment:
    staging:
      REPLICAS: 2
      LOG_LEVEL: debug
    production:
      REPLICAS: 5
      LOG_LEVEL: info

  secrets:
    - DATABASE_URL
    - API_KEY
\`\`\`

## Conditional Execution

\`\`\`yaml
stages:
  - name: deploy-production
    condition:
      branch: main
      files-changed:
        - src/**
        - package.json
    steps:
      - deploy:
          environment: production
\`\`\`

## Parallel Execution

\`\`\`yaml
stages:
  - name: test
    parallel:
      - run:
          name: unit-tests
          command: npm run test:unit
      - run:
          name: integration-tests
          command: npm run test:integration
      - run:
          name: e2e-tests
          command: npm run test:e2e
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Advanced Pipeline Configuration',
        language: 'yaml',
        code: `# bunker-pipeline.yaml
name: production-release

variables:
  APP_NAME: web-app
  NOTIFY_CHANNEL: "#deployments"

stages:
  - name: validate
    steps:
      - run:
          name: lint
          command: npm run lint
      - run:
          name: type-check
          command: npm run type-check

  - name: test
    parallel:
      - run:
          name: unit-tests
          command: npm run test:unit
          coverage: true
      - run:
          name: integration
          command: npm run test:integration

  - name: build
    steps:
      - build:
          dockerfile: Dockerfile
          tags:
            - "\${COMMIT_SHA}"
            - "\${BRANCH_NAME}"
      - scan:
          type: vulnerability
          fail-on: critical

  - name: deploy-staging
    steps:
      - deploy:
          environment: staging
          wait: true
      - test:
          type: smoke
          timeout: 5m
      - test:
          type: load
          duration: 10m
          concurrent-users: 100

  - name: approval
    type: manual
    approvers:
      groups: [release-managers]
    message: "Approve deployment to production?"
    timeout: 4h

  - name: deploy-production
    steps:
      - notify:
          channel: \${NOTIFY_CHANNEL}
          message: "Starting production deployment"
      - deploy:
          environment: production
          strategy: canary
          canary:
            steps:
              - weight: 10
                duration: 5m
                metrics:
                  - error_rate < 1%
                  - latency_p99 < 500ms
              - weight: 50
                duration: 10m
              - weight: 100
      - notify:
          channel: \${NOTIFY_CHANNEL}
          message: "Production deployment complete"

on-failure:
  - notify:
      channel: \${NOTIFY_CHANNEL}
      message: "Pipeline failed: \${STAGE_NAME}"
  - rollback:
      if: stage == "deploy-production"`
      }
    ],
    relatedDocs: ['devops-overview', 'deployment-methods', 'rollbacks']
  },

  'environment-variables': {
    id: 'environment-variables',
    title: 'Environment Variables',
    description: 'Manage configuration and secrets across environments',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# Environment Variables

Manage application configuration securely across environments.

## Setting Variables

### CLI

\`\`\`bash
# Set single variable
bunker env set DATABASE_URL="postgres://..." --app my-app --env production

# Set multiple variables
bunker env set \\
  DATABASE_URL="postgres://..." \\
  REDIS_URL="redis://..." \\
  --app my-app --env production

# Import from file
bunker env import --file .env.production --app my-app --env production
\`\`\`

### Configuration File

\`\`\`yaml
# bunker.yaml
environments:
  production:
    env:
      NODE_ENV: production
      LOG_LEVEL: info
      API_URL: https://api.example.com
  staging:
    env:
      NODE_ENV: staging
      LOG_LEVEL: debug
      API_URL: https://staging-api.example.com
\`\`\`

## Secret Variables

### Creating Secrets

\`\`\`bash
# Create secret
bunker secrets create database-password --value "super-secret"

# Reference in env
bunker env set DATABASE_PASSWORD=@secrets/database-password --app my-app
\`\`\`

### From External Secrets

\`\`\`yaml
env:
  - name: DATABASE_PASSWORD
    valueFrom:
      secretRef:
        name: database-credentials
        key: password
  - name: API_KEY
    valueFrom:
      secretRef:
        name: external-api-key
\`\`\`

## Variable Scopes

| Scope | Description |
|-------|-------------|
| Organization | Available to all apps |
| Application | Available to all environments |
| Environment | Specific to one environment |

### Inheritance

\`\`\`
Organization: LOG_FORMAT=json
    │
    └── Application: my-app
            │   APP_NAME=my-app
            │
            ├── staging
            │   NODE_ENV=staging
            │   LOG_LEVEL=debug
            │
            └── production
                NODE_ENV=production
                LOG_LEVEL=info

# Production gets: LOG_FORMAT, APP_NAME, NODE_ENV=production, LOG_LEVEL=info
\`\`\`

## Runtime Injection

Variables are injected at runtime:

\`\`\`javascript
// Access in application
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;
\`\`\`

### Build-time vs Runtime

\`\`\`yaml
env:
  build:
    - NODE_ENV=production
    - NEXT_PUBLIC_API_URL=https://api.example.com
  runtime:
    - DATABASE_URL=@secrets/db-url
    - API_KEY=@secrets/api-key
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Environment Configuration',
        language: 'yaml',
        code: `# bunker.yaml
name: my-app

# Global variables (all environments)
env:
  global:
    APP_NAME: my-app
    LOG_FORMAT: json

# Environment-specific
environments:
  development:
    env:
      NODE_ENV: development
      LOG_LEVEL: debug
      DATABASE_URL: postgres://localhost/dev
      CACHE_ENABLED: "false"

  staging:
    env:
      NODE_ENV: staging
      LOG_LEVEL: debug
      DATABASE_URL:
        valueFrom:
          secretRef: staging-db-url
      CACHE_ENABLED: "true"

  production:
    env:
      NODE_ENV: production
      LOG_LEVEL: info
      DATABASE_URL:
        valueFrom:
          secretRef: production-db-url
      REDIS_URL:
        valueFrom:
          secretRef: production-redis-url
      CACHE_ENABLED: "true"
      CACHE_TTL: "3600"`
      }
    ],
    relatedDocs: ['devops-overview', 'secrets-management', 'deployment-pipelines']
  },

  'preview-deployments': {
    id: 'preview-deployments',
    title: 'Preview Deployments',
    description: 'Create preview environments for pull requests',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# Preview Deployments

Automatically create isolated preview environments for each pull request.

## Overview

Preview deployments provide:
- Unique URL per pull request
- Isolated environment
- Automatic cleanup on merge/close
- Easy testing and review

## Enabling Previews

### Configuration

\`\`\`yaml
# bunker.yaml
preview:
  enabled: true
  domain: preview.example.com  # pr-123.preview.example.com
  expiration: 7d
  resources:
    cpu: 0.5
    memory: 512Mi
\`\`\`

### GitHub Actions

\`\`\`yaml
name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy Preview
        id: preview
        uses: bunkercloud/deploy-action@v2
        with:
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
          app: my-app
          preview: true
          preview-name: pr-\${{ github.event.number }}

      - name: Comment URL
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🔗 Preview: \${{ steps.preview.outputs.url }}'
            })
\`\`\`

## Preview Features

### Seeded Databases

\`\`\`yaml
preview:
  database:
    seed: true
    source: staging  # Clone from staging
    # Or use seed script
    seed-script: ./scripts/seed.sql
\`\`\`

### Feature Flags

\`\`\`yaml
preview:
  env:
    FEATURE_FLAGS: "new-ui,beta-api"
    DEBUG: "true"
\`\`\`

### Branch Isolation

\`\`\`yaml
preview:
  isolation:
    database: true   # Separate DB per preview
    storage: true    # Separate storage bucket
    queue: true      # Separate message queue
\`\`\`

## Managing Previews

\`\`\`bash
# List active previews
bunker preview list --app my-app

# Delete preview
bunker preview delete --app my-app --name pr-123

# Extend expiration
bunker preview extend --app my-app --name pr-123 --days 7
\`\`\`

## Automatic Cleanup

Previews are automatically deleted when:
- Pull request is merged
- Pull request is closed
- Expiration time is reached

\`\`\`yaml
preview:
  cleanup:
    on-merge: true
    on-close: true
    expiration: 7d
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Preview Deployment Workflow',
        language: 'yaml',
        code: `# .github/workflows/preview.yml
name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize, reopened, closed]

jobs:
  deploy-preview:
    if: github.event.action != 'closed'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy Preview
        id: deploy
        uses: bunkercloud/deploy-action@v2
        with:
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
          app: my-app
          preview: true
          preview-name: pr-\${{ github.event.number }}
          env-vars: |
            PREVIEW_MODE=true
            DATABASE_URL=\${{ secrets.PREVIEW_DATABASE_URL }}

      - name: Update PR
        uses: actions/github-script@v6
        with:
          script: |
            const body = \`## 🚀 Preview Deployment

            | Resource | URL |
            |----------|-----|
            | App | \${{ steps.deploy.outputs.url }} |
            | Logs | \${{ steps.deploy.outputs.logs-url }} |

            _Last updated: \${new Date().toISOString()}_\`;

            // Find existing comment
            const comments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });

            const existing = comments.data.find(c =>
              c.body.includes('Preview Deployment')
            );

            if (existing) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: existing.id,
                body
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body
              });
            }

  cleanup-preview:
    if: github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Delete Preview
        uses: bunkercloud/deploy-action@v2
        with:
          api-key-id: \${{ secrets.BUNKER_API_KEY_ID }}
          secret-key: \${{ secrets.BUNKER_SECRET_KEY }}
          app: my-app
          preview-name: pr-\${{ github.event.number }}
          action: delete`
      }
    ],
    relatedDocs: ['devops-overview', 'github-integration', 'deployment-pipelines']
  },

  'rollbacks': {
    id: 'rollbacks',
    title: 'Rollbacks & Versioning',
    description: 'Roll back deployments and manage versions',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    content: `
# Rollbacks & Versioning

Quickly recover from failed deployments with rollbacks and version management.

## Deployment History

\`\`\`bash
# View deployment history
bunker deployments list --app my-app --env production

# Output:
# VERSION    STATUS     DEPLOYED AT           DURATION
# v1.5.0     current    2024-01-15 10:30:00   2m 15s
# v1.4.2     previous   2024-01-14 15:00:00   1m 45s
# v1.4.1     -          2024-01-13 09:00:00   2m 00s
# v1.4.0     -          2024-01-12 14:00:00   1m 30s
\`\`\`

## Rolling Back

### To Previous Version

\`\`\`bash
bunker rollback --app my-app --env production
\`\`\`

### To Specific Version

\`\`\`bash
bunker rollback --app my-app --env production --version v1.4.0
\`\`\`

### To Specific Deployment

\`\`\`bash
bunker rollback --app my-app --env production --deployment-id dep-abc123
\`\`\`

## Automatic Rollbacks

### On Health Check Failure

\`\`\`yaml
deploy:
  healthCheck:
    path: /health
    interval: 10s
    timeout: 5s
    failureThreshold: 3
  rollback:
    automatic: true
    on-failure: true
\`\`\`

### On Metrics Threshold

\`\`\`yaml
deploy:
  rollback:
    automatic: true
    conditions:
      - metric: error_rate
        threshold: 5%
        duration: 5m
      - metric: latency_p99
        threshold: 1000ms
        duration: 5m
\`\`\`

## Version Retention

\`\`\`yaml
# bunker.yaml
versioning:
  retain: 10           # Keep last 10 versions
  retain-days: 30      # Or keep for 30 days
  protect:
    - v1.0.0          # Never delete these
    - v2.0.0
\`\`\`

## Release Tags

\`\`\`bash
# Tag a release
bunker release tag --app my-app --version v1.5.0 --notes "New feature release"

# List releases
bunker release list --app my-app

# Promote release
bunker release promote --app my-app --version v1.5.0 --from staging --to production
\`\`\`

## Deployment Diff

\`\`\`bash
# Compare versions
bunker deployments diff --app my-app --from v1.4.0 --to v1.5.0

# Output:
# Changes between v1.4.0 and v1.5.0:
# + Added endpoint /api/v2/users
# ~ Modified src/handlers/user.js
# - Removed deprecated /api/v1/legacy
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Automated Rollback Configuration',
        language: 'yaml',
        code: `# bunker.yaml
name: production-app

deploy:
  strategy: canary
  canary:
    steps:
      - weight: 10
        duration: 5m
      - weight: 50
        duration: 10m
      - weight: 100

  healthCheck:
    path: /health
    interval: 10s
    timeout: 5s
    successThreshold: 2
    failureThreshold: 3

  rollback:
    automatic: true
    conditions:
      # Rollback if error rate exceeds 5%
      - metric: error_rate
        operator: ">"
        threshold: 0.05
        duration: 2m

      # Rollback if P99 latency exceeds 500ms
      - metric: latency_p99
        operator: ">"
        threshold: 500
        duration: 2m

      # Rollback if CPU usage spikes
      - metric: cpu_usage
        operator: ">"
        threshold: 0.9
        duration: 5m

    # Notification on rollback
    notify:
      slack:
        channel: "#alerts"
        message: "Automatic rollback triggered for {app} in {environment}"

versioning:
  retain: 10
  retain-days: 90
  immutable-tags:
    - "v*.*.*"  # Semantic version tags are immutable`
      }
    ],
    relatedDocs: ['devops-overview', 'deployment-pipelines', 'monitoring-overview']
  },

  'infrastructure-as-code': {
    id: 'infrastructure-as-code',
    title: 'Infrastructure as Code',
    description: 'Manage infrastructure with Terraform and Pulumi',
    lastUpdated: '2024-12-01',
    difficulty: 'advanced',
    timeToRead: '15 min',
    content: `
# Infrastructure as Code

Define and manage Bunker Cloud infrastructure using code.

## Terraform Provider

### Installation

\`\`\`hcl
terraform {
  required_providers {
    bunker = {
      source  = "bunkercloud/bunker"
      version = "~> 2.0"
    }
  }
}

provider "bunker" {
  region = "us-east-1"
  # Credentials from environment or config file
}
\`\`\`

### Resources

\`\`\`hcl
# VPC
resource "bunker_vpc" "main" {
  name       = "production-vpc"
  cidr_block = "10.0.0.0/16"

  tags = {
    Environment = "production"
  }
}

# Subnet
resource "bunker_subnet" "public" {
  vpc_id            = bunker_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  public            = true
}

# Instance
resource "bunker_instance" "web" {
  name          = "web-server"
  instance_type = "vault.medium"
  image_id      = "img-ubuntu-22.04"
  subnet_id     = bunker_subnet.public.id

  tags = {
    Role = "web"
  }
}

# Database
resource "bunker_database_cluster" "main" {
  name           = "production-db"
  engine         = "postgresql"
  engine_version = "15"
  instance_class = "db.vault.medium"

  storage {
    size      = 100
    encrypted = true
  }
}
\`\`\`

## Pulumi

### TypeScript

\`\`\`typescript
import * as bunker from "@pulumi/bunker";

// VPC
const vpc = new bunker.Vpc("production-vpc", {
  cidrBlock: "10.0.0.0/16",
});

// Subnet
const subnet = new bunker.Subnet("public-subnet", {
  vpcId: vpc.id,
  cidrBlock: "10.0.1.0/24",
  availabilityZone: "us-east-1a",
  public: true,
});

// Instance
const instance = new bunker.Instance("web-server", {
  instanceType: "vault.medium",
  imageId: "img-ubuntu-22.04",
  subnetId: subnet.id,
});

// Export outputs
export const instanceIp = instance.publicIp;
\`\`\`

### Python

\`\`\`python
import pulumi
import pulumi_bunker as bunker

vpc = bunker.Vpc("production-vpc",
    cidr_block="10.0.0.0/16"
)

subnet = bunker.Subnet("public-subnet",
    vpc_id=vpc.id,
    cidr_block="10.0.1.0/24",
    availability_zone="us-east-1a",
    public=True
)

instance = bunker.Instance("web-server",
    instance_type="vault.medium",
    image_id="img-ubuntu-22.04",
    subnet_id=subnet.id
)

pulumi.export("instance_ip", instance.public_ip)
\`\`\`

## State Management

### Remote State

\`\`\`hcl
terraform {
  backend "bunker" {
    bucket = "terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
  }
}
\`\`\`

### State Locking

State locking prevents concurrent modifications:

\`\`\`hcl
terraform {
  backend "bunker" {
    bucket         = "terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
  }
}
\`\`\`

## Modules

### Creating Modules

\`\`\`hcl
# modules/web-app/main.tf
variable "app_name" {}
variable "environment" {}
variable "instance_count" { default = 2 }

resource "bunker_instance" "app" {
  count         = var.instance_count
  name          = "\${var.app_name}-\${count.index}"
  instance_type = "vault.medium"
  # ...
}

output "instance_ids" {
  value = bunker_instance.app[*].id
}
\`\`\`

### Using Modules

\`\`\`hcl
module "web_app" {
  source = "./modules/web-app"

  app_name       = "my-app"
  environment    = "production"
  instance_count = 3
}
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Complete Infrastructure',
        language: 'hcl',
        code: `# main.tf - Production Infrastructure

terraform {
  required_providers {
    bunker = {
      source  = "bunkercloud/bunker"
      version = "~> 2.0"
    }
  }

  backend "bunker" {
    bucket = "terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "bunker" {
  region = var.region
}

# VPC
module "vpc" {
  source = "./modules/vpc"

  name       = "production"
  cidr_block = "10.0.0.0/16"
  azs        = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

# Database
resource "bunker_database_cluster" "main" {
  name           = "production-db"
  engine         = "postgresql"
  engine_version = "15"
  instance_class = "db.vault.large"

  vpc_id            = module.vpc.vpc_id
  subnet_group_name = module.vpc.database_subnet_group

  storage {
    size      = 500
    type      = "gp3"
    encrypted = true
    kms_key_id = bunker_kms_key.db.arn
  }

  backup {
    retention_period = 30
    window          = "03:00-04:00"
  }
}

# Application
resource "bunker_app" "web" {
  name = "web-app"

  container {
    image = var.app_image

    resources {
      cpu    = 2
      memory = "4Gi"
    }

    env {
      name  = "DATABASE_URL"
      value = bunker_database_cluster.main.connection_string
    }
  }

  scaling {
    min_instances = 3
    max_instances = 20

    target_cpu_utilization = 70
  }

  load_balancer {
    type = "application"

    listener {
      port     = 443
      protocol = "HTTPS"
      certificate_arn = bunker_certificate.main.arn
    }

    health_check {
      path     = "/health"
      interval = 30
    }
  }
}

# Outputs
output "app_url" {
  value = bunker_app.web.url
}

output "database_endpoint" {
  value     = bunker_database_cluster.main.endpoint
  sensitive = true
}`
      }
    ],
    relatedDocs: ['devops-overview', 'deployment-pipelines', 'compute-overview']
  }
};

// Export all devops doc IDs for validation
export const devopsDocIds = Object.keys(devopsDocs);
