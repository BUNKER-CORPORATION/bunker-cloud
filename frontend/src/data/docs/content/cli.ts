// CLI Documentation Content for Bunker Cloud

import { DocPage } from '../types';

export const cliDocs: Record<string, DocPage> = {
  'cli-overview': {
    id: 'cli-overview',
    title: 'CLI Overview',
    description: 'Introduction to the Bunker Cloud command-line interface',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '6 min',
    content: `
# CLI Overview

The Bunker Cloud CLI provides a unified command-line interface to manage all Bunker Cloud services.

## Features

| Feature | Description |
|---------|-------------|
| **Complete API Coverage** | Access all Bunker Cloud services |
| **Interactive Mode** | Guided command building |
| **Output Formats** | JSON, YAML, table, text |
| **Auto-completion** | Shell completions for bash/zsh/fish |
| **Profiles** | Multiple account configurations |
| **Scripting Support** | Machine-readable output |

## Quick Start

\`\`\`bash
# Install CLI
curl -fsSL https://cli.bunkercloud.com/install.sh | sh

# Configure credentials
bunker configure

# Verify setup
bunker account info
\`\`\`

## Command Structure

\`\`\`
bunker <service> <resource> <action> [options]
\`\`\`

### Examples

\`\`\`bash
# List compute instances
bunker compute instance list

# Create storage bucket
bunker storage bucket create --name my-bucket

# Get database info
bunker database cluster get --cluster-id db-12345
\`\`\`

## Global Options

| Option | Description |
|--------|-------------|
| \`--profile\` | Use named profile |
| \`--region\` | Override default region |
| \`--output\` | Output format (json/yaml/table/text) |
| \`--quiet\` | Suppress non-essential output |
| \`--verbose\` | Enable verbose logging |
| \`--no-color\` | Disable colored output |
| \`--help\` | Show command help |

## Services

| Service | Command | Description |
|---------|---------|-------------|
| Compute | \`bunker compute\` | Instances, images, volumes |
| Storage | \`bunker storage\` | Object storage, buckets |
| Database | \`bunker database\` | Managed databases |
| Networking | \`bunker vpc\` | VPCs, subnets, security groups |
| IAM | \`bunker iam\` | Users, roles, policies |
| Secrets | \`bunker secrets\` | Secrets management |

## Help

\`\`\`bash
# General help
bunker help

# Service help
bunker compute help

# Command help
bunker compute instance create --help
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Common CLI Commands',
        language: 'bash',
        code: `# Authentication
bunker configure                    # Interactive setup
bunker configure --profile prod     # Named profile

# Compute
bunker compute instance list        # List instances
bunker compute instance create \\
  --name web-server \\
  --type vault.medium \\
  --image img-ubuntu-22.04

# Storage
bunker storage bucket list          # List buckets
bunker storage cp file.txt s3://my-bucket/

# Database
bunker database cluster list        # List databases
bunker database cluster create \\
  --name prod-db \\
  --engine postgresql

# Networking
bunker vpc list                     # List VPCs
bunker vpc create --name prod-vpc --cidr 10.0.0.0/16

# Output formats
bunker compute instance list --output json
bunker compute instance list --output table
bunker compute instance list --output yaml`
      }
    ],
    relatedDocs: ['cli-install', 'cli-auth', 'cli-commands']
  },

  'cli-install': {
    id: 'cli-install',
    title: 'Installation',
    description: 'Install the Bunker Cloud CLI',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '5 min',
    content: `
# CLI Installation

Install the Bunker Cloud CLI on your system.

## Quick Install

### macOS / Linux

\`\`\`bash
curl -fsSL https://cli.bunkercloud.com/install.sh | sh
\`\`\`

### Windows

\`\`\`powershell
iwr -useb https://cli.bunkercloud.com/install.ps1 | iex
\`\`\`

## Package Managers

### Homebrew (macOS/Linux)

\`\`\`bash
brew tap bunkercloud/tap
brew install bunker-cli
\`\`\`

### apt (Debian/Ubuntu)

\`\`\`bash
curl -fsSL https://apt.bunkercloud.com/gpg | sudo apt-key add -
echo "deb https://apt.bunkercloud.com stable main" | sudo tee /etc/apt/sources.list.d/bunkercloud.list
sudo apt update && sudo apt install bunker-cli
\`\`\`

### yum (RHEL/CentOS)

\`\`\`bash
sudo yum-config-manager --add-repo https://rpm.bunkercloud.com/bunkercloud.repo
sudo yum install bunker-cli
\`\`\`

### npm

\`\`\`bash
npm install -g @bunkercloud/cli
\`\`\`

### pip

\`\`\`bash
pip install bunkercloud-cli
\`\`\`

## Docker

\`\`\`bash
docker run -it --rm \\
  -v ~/.bunker:/root/.bunker \\
  bunkercloud/cli:latest \\
  compute instance list
\`\`\`

## Verify Installation

\`\`\`bash
bunker version

# Output:
# bunker-cli version 2.5.0
# Build: 2024-01-15
# Go: go1.21
\`\`\`

## Shell Completions

### Bash

\`\`\`bash
bunker completion bash > /etc/bash_completion.d/bunker
source /etc/bash_completion.d/bunker
\`\`\`

### Zsh

\`\`\`bash
bunker completion zsh > "\${fpath[1]}/_bunker"
\`\`\`

### Fish

\`\`\`bash
bunker completion fish > ~/.config/fish/completions/bunker.fish
\`\`\`

## Update

\`\`\`bash
# Using installer
curl -fsSL https://cli.bunkercloud.com/install.sh | sh

# Using Homebrew
brew upgrade bunker-cli

# Using npm
npm update -g @bunkercloud/cli
\`\`\`

## Uninstall

\`\`\`bash
# macOS/Linux
rm -rf /usr/local/bin/bunker ~/.bunker

# Homebrew
brew uninstall bunker-cli
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Installation Script',
        language: 'bash',
        code: `#!/bin/bash
# Full CLI setup script

# Install CLI
echo "Installing Bunker CLI..."
curl -fsSL https://cli.bunkercloud.com/install.sh | sh

# Verify installation
bunker version

# Setup completions based on shell
SHELL_NAME=$(basename "$SHELL")
case $SHELL_NAME in
  bash)
    bunker completion bash > /etc/bash_completion.d/bunker
    source /etc/bash_completion.d/bunker
    ;;
  zsh)
    bunker completion zsh > "\${fpath[1]}/_bunker"
    ;;
  fish)
    bunker completion fish > ~/.config/fish/completions/bunker.fish
    ;;
esac

# Configure
echo "Configuring Bunker CLI..."
bunker configure

# Verify setup
bunker account info

echo "Setup complete!"`
      }
    ],
    relatedDocs: ['cli-overview', 'cli-auth', 'cli-config']
  },

  'cli-auth': {
    id: 'cli-auth',
    title: 'Authentication',
    description: 'Configure CLI authentication',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# CLI Authentication

Configure authentication for the Bunker Cloud CLI.

## Interactive Setup

\`\`\`bash
bunker configure

# Prompts:
# API Key ID: BKAK123456789
# Secret Key: ********
# Default region [us-east-1]: us-east-1
# Output format [json]: json
\`\`\`

## Configuration Methods

### Environment Variables

\`\`\`bash
export BUNKER_API_KEY_ID=BKAK123456789
export BUNKER_SECRET_KEY=BKsk987654321
export BUNKER_REGION=us-east-1
\`\`\`

### Configuration File

\`\`\`ini
# ~/.bunker/credentials
[default]
bunker_api_key_id = BKAK123456789
bunker_secret_key = BKsk987654321

[production]
bunker_api_key_id = BKAK_PROD_123
bunker_secret_key = BKsk_PROD_456

# ~/.bunker/config
[default]
region = us-east-1
output = json

[profile production]
region = eu-west-1
output = table
\`\`\`

### Named Profiles

\`\`\`bash
# Configure profile
bunker configure --profile production

# Use profile
bunker compute instance list --profile production

# Set default profile
export BUNKER_PROFILE=production
\`\`\`

## SSO Authentication

\`\`\`bash
# Configure SSO
bunker configure sso \\
  --sso-url https://sso.company.com \\
  --sso-region us-east-1 \\
  --account-id 123456789012 \\
  --role-name AdminRole

# Login via SSO
bunker sso login

# Login with specific profile
bunker sso login --profile production
\`\`\`

## Service Account Keys

\`\`\`bash
# Authenticate with key file
export BUNKER_SERVICE_ACCOUNT_KEY=/path/to/key.json
bunker compute instance list

# Or specify directly
bunker compute instance list --key-file /path/to/key.json
\`\`\`

## Instance Credentials

On Bunker Cloud instances with IAM roles:

\`\`\`bash
# Automatically uses instance role
bunker compute instance list

# Disable instance metadata
export BUNKER_EC2_METADATA_DISABLED=true
\`\`\`

## Verify Authentication

\`\`\`bash
# Check current identity
bunker sts get-caller-identity

# Output:
# Account: 123456789012
# UserId: AIDAXXXXXXXXXX
# Arn: arn:bunker:iam::123456789012:user/admin
\`\`\`

## Credential Precedence

1. Command-line options
2. Environment variables
3. Credentials file (profile)
4. Instance metadata (IAM role)
    `,
    codeExamples: [
      {
        title: 'Multi-Profile Setup',
        language: 'bash',
        code: `#!/bin/bash
# Setup multiple profiles for different environments

# Development profile
bunker configure --profile dev << EOF
BKAK_DEV_123
BKsk_DEV_secret
us-east-1
json
EOF

# Staging profile
bunker configure --profile staging << EOF
BKAK_STAGING_456
BKsk_STAGING_secret
us-west-2
json
EOF

# Production profile (with MFA)
bunker configure --profile prod << EOF
BKAK_PROD_789
BKsk_PROD_secret
eu-west-1
json
EOF

# List profiles
bunker configure list-profiles

# Test each profile
for profile in dev staging prod; do
  echo "Testing $profile..."
  bunker sts get-caller-identity --profile $profile
done

# Create aliases for convenience
echo 'alias bunker-dev="bunker --profile dev"' >> ~/.bashrc
echo 'alias bunker-staging="bunker --profile staging"' >> ~/.bashrc
echo 'alias bunker-prod="bunker --profile prod"' >> ~/.bashrc`
      }
    ],
    relatedDocs: ['cli-overview', 'cli-config', 'api-keys']
  },

  'cli-commands': {
    id: 'cli-commands',
    title: 'Commands Reference',
    description: 'Complete CLI command reference',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '15 min',
    content: `
# Commands Reference

Complete reference for Bunker Cloud CLI commands.

## Compute Commands

### Instances

\`\`\`bash
# List instances
bunker compute instance list [--status running|stopped|all]

# Create instance
bunker compute instance create \\
  --name NAME \\
  --type INSTANCE_TYPE \\
  --image IMAGE_ID \\
  --subnet SUBNET_ID \\
  [--security-groups SG_IDS] \\
  [--key-name KEY_NAME] \\
  [--user-data FILE]

# Get instance details
bunker compute instance get --instance-id ID

# Start/Stop/Reboot
bunker compute instance start --instance-id ID
bunker compute instance stop --instance-id ID
bunker compute instance reboot --instance-id ID

# Terminate
bunker compute instance terminate --instance-id ID

# Connect via SSH
bunker compute instance ssh --instance-id ID

# Get console output
bunker compute instance console --instance-id ID
\`\`\`

### Images

\`\`\`bash
# List images
bunker compute image list [--owner self|bunker|marketplace]

# Create image from instance
bunker compute image create \\
  --instance-id ID \\
  --name NAME \\
  [--description DESC]

# Delete image
bunker compute image delete --image-id ID
\`\`\`

### Volumes

\`\`\`bash
# List volumes
bunker compute volume list

# Create volume
bunker compute volume create \\
  --size SIZE_GB \\
  --type gp3|io2|st1 \\
  --az AVAILABILITY_ZONE

# Attach volume
bunker compute volume attach \\
  --volume-id VOL_ID \\
  --instance-id INST_ID \\
  --device /dev/sdf

# Detach volume
bunker compute volume detach --volume-id VOL_ID
\`\`\`

## Storage Commands

### Buckets

\`\`\`bash
# List buckets
bunker storage bucket list

# Create bucket
bunker storage bucket create --name BUCKET_NAME --region REGION

# Delete bucket
bunker storage bucket delete --name BUCKET_NAME [--force]

# Set bucket policy
bunker storage bucket policy set --name BUCKET_NAME --policy FILE
\`\`\`

### Objects

\`\`\`bash
# List objects
bunker storage ls s3://BUCKET/[PREFIX]

# Copy files
bunker storage cp LOCAL_FILE s3://BUCKET/KEY
bunker storage cp s3://BUCKET/KEY LOCAL_FILE
bunker storage cp s3://BUCKET1/KEY s3://BUCKET2/KEY

# Sync directories
bunker storage sync LOCAL_DIR s3://BUCKET/PREFIX
bunker storage sync s3://BUCKET/PREFIX LOCAL_DIR

# Remove objects
bunker storage rm s3://BUCKET/KEY
bunker storage rm s3://BUCKET/PREFIX --recursive

# Presigned URL
bunker storage presign s3://BUCKET/KEY --expires 3600
\`\`\`

## Database Commands

\`\`\`bash
# List clusters
bunker database cluster list

# Create cluster
bunker database cluster create \\
  --name NAME \\
  --engine postgresql|mysql|mongodb \\
  --version VERSION \\
  --instance-class CLASS \\
  --storage-size SIZE_GB

# Get cluster details
bunker database cluster get --cluster-id ID

# Create snapshot
bunker database snapshot create \\
  --cluster-id ID \\
  --name SNAPSHOT_NAME

# Restore from snapshot
bunker database cluster restore \\
  --snapshot-id SNAP_ID \\
  --name NEW_CLUSTER_NAME
\`\`\`

## Networking Commands

\`\`\`bash
# VPC
bunker vpc create --name NAME --cidr CIDR_BLOCK
bunker vpc list
bunker vpc delete --vpc-id ID

# Subnets
bunker vpc subnet create \\
  --vpc-id ID \\
  --name NAME \\
  --cidr CIDR \\
  --az AVAILABILITY_ZONE

# Security Groups
bunker vpc sg create \\
  --vpc-id ID \\
  --name NAME \\
  --description DESC

bunker vpc sg rule add \\
  --sg-id ID \\
  --direction inbound|outbound \\
  --protocol tcp|udp|icmp|all \\
  --port PORT \\
  --source|--destination CIDR
\`\`\`

## IAM Commands

\`\`\`bash
# Users
bunker iam user create --name NAME
bunker iam user list
bunker iam user delete --name NAME

# Roles
bunker iam role create --name NAME --trust-policy FILE
bunker iam role list

# Policies
bunker iam policy create --name NAME --policy FILE
bunker iam policy attach --policy-arn ARN --user|--role|--group NAME

# API Keys
bunker iam api-key create --name NAME
bunker iam api-key list
bunker iam api-key delete --key-id ID
\`\`\`

## Secrets Commands

\`\`\`bash
# Create secret
bunker secrets create --name NAME --value VALUE
bunker secrets create --name NAME --value-file FILE

# Get secret
bunker secrets get --name NAME

# Update secret
bunker secrets update --name NAME --value NEW_VALUE

# Delete secret
bunker secrets delete --name NAME
\`\`\`
    `,
    codeExamples: [
      {
        title: 'CLI Cheat Sheet',
        language: 'bash',
        code: `# Quick reference for common operations

# === COMPUTE ===
bunker compute instance list                        # List instances
bunker compute instance create -n web -t vault.med  # Create instance
bunker compute instance stop -i i-123               # Stop instance
bunker compute instance ssh -i i-123                # SSH to instance

# === STORAGE ===
bunker storage ls s3://bucket/                      # List objects
bunker storage cp file.txt s3://bucket/             # Upload file
bunker storage sync ./dir s3://bucket/dir           # Sync directory
bunker storage presign s3://bucket/file --expires 3600  # Get presigned URL

# === DATABASE ===
bunker database cluster list                        # List databases
bunker database cluster create -n mydb -e postgresql # Create database
bunker database snapshot create -c db-123 -n snap1  # Create snapshot

# === NETWORKING ===
bunker vpc list                                     # List VPCs
bunker vpc create -n prod-vpc --cidr 10.0.0.0/16   # Create VPC
bunker vpc sg rule add -s sg-123 -p tcp --port 443 --source 0.0.0.0/0

# === SECRETS ===
bunker secrets create -n api-key -v "secret123"    # Create secret
bunker secrets get -n api-key                      # Get secret

# === OUTPUT FORMATS ===
bunker compute instance list --output json         # JSON output
bunker compute instance list --output yaml         # YAML output
bunker compute instance list --output table        # Table output
bunker compute instance list -o json | jq '.[]'    # Pipe to jq`
      }
    ],
    relatedDocs: ['cli-overview', 'cli-scripting', 'api-overview']
  },

  'cli-config': {
    id: 'cli-config',
    title: 'Configuration',
    description: 'Configure CLI settings and preferences',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '8 min',
    content: `
# CLI Configuration

Configure settings, defaults, and preferences for the Bunker Cloud CLI.

## Configuration Files

### Locations

| File | Purpose |
|------|---------|
| \`~/.bunker/credentials\` | API credentials |
| \`~/.bunker/config\` | CLI settings |
| \`~/.bunker/cache\` | Cached data |

### Credentials File

\`\`\`ini
# ~/.bunker/credentials

[default]
bunker_api_key_id = BKAK123456789
bunker_secret_key = BKsk987654321

[production]
bunker_api_key_id = BKAK_PROD_123
bunker_secret_key = BKsk_PROD_456

[development]
bunker_api_key_id = BKAK_DEV_789
bunker_secret_key = BKsk_DEV_012
\`\`\`

### Config File

\`\`\`ini
# ~/.bunker/config

[default]
region = us-east-1
output = json
page_size = 100

[profile production]
region = eu-west-1
output = table
role_arn = arn:bunker:iam::123456:role/AdminRole
source_profile = default

[profile development]
region = us-west-2
output = json
\`\`\`

## Configuration Commands

### View Configuration

\`\`\`bash
# List all settings
bunker configure list

# Get specific setting
bunker configure get region

# Get profile settings
bunker configure list --profile production
\`\`\`

### Set Configuration

\`\`\`bash
# Set default region
bunker configure set region us-west-2

# Set output format
bunker configure set output yaml

# Set for specific profile
bunker configure set region eu-west-1 --profile production
\`\`\`

## Environment Variables

| Variable | Description |
|----------|-------------|
| \`BUNKER_API_KEY_ID\` | API key ID |
| \`BUNKER_SECRET_KEY\` | Secret key |
| \`BUNKER_REGION\` | Default region |
| \`BUNKER_PROFILE\` | Default profile |
| \`BUNKER_OUTPUT\` | Output format |
| \`BUNKER_CONFIG_FILE\` | Config file path |
| \`BUNKER_CREDENTIALS_FILE\` | Credentials file path |

## Output Formats

### JSON

\`\`\`bash
bunker compute instance list --output json

# Output:
[
  {
    "id": "i-12345",
    "name": "web-server",
    "status": "running"
  }
]
\`\`\`

### YAML

\`\`\`bash
bunker compute instance list --output yaml

# Output:
- id: i-12345
  name: web-server
  status: running
\`\`\`

### Table

\`\`\`bash
bunker compute instance list --output table

# Output:
# ID          NAME         STATUS
# i-12345     web-server   running
\`\`\`

### Text

\`\`\`bash
bunker compute instance list --output text

# Output:
# i-12345  web-server  running
\`\`\`

## Pagination

\`\`\`bash
# Set default page size
bunker configure set page_size 50

# Override per command
bunker compute instance list --page-size 100

# Get all results (auto-paginate)
bunker compute instance list --no-paginate
\`\`\`

## Cache

\`\`\`bash
# Clear cache
bunker cache clear

# Disable cache
bunker configure set cache.enabled false

# Set cache TTL
bunker configure set cache.ttl 3600
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Advanced Configuration',
        language: 'ini',
        code: `# ~/.bunker/config - Advanced configuration

[default]
region = us-east-1
output = json
cli_pager = less
cli_timestamp_format = iso8601
page_size = 100

# Retry settings
retry_mode = adaptive
max_attempts = 5

# Timeouts
connect_timeout = 60
read_timeout = 60

# Logging
log_level = warning
log_file = ~/.bunker/logs/cli.log

[profile production]
region = eu-west-1
output = table
role_arn = arn:bunker:iam::123456:role/AdminRole
source_profile = default
mfa_serial = arn:bunker:iam::123456:mfa/admin
duration_seconds = 3600

[profile development]
region = us-west-2
output = json
endpoint_url = https://dev-api.bunkercloud.com

[profile local]
region = us-east-1
endpoint_url = http://localhost:4566
s3 =
    addressing_style = path`
      }
    ],
    relatedDocs: ['cli-overview', 'cli-auth', 'cli-scripting']
  },

  'cli-scripting': {
    id: 'cli-scripting',
    title: 'Scripting & Automation',
    description: 'Use the CLI in scripts and automation',
    lastUpdated: '2024-12-01',
    difficulty: 'advanced',
    timeToRead: '12 min',
    content: `
# Scripting & Automation

Use the Bunker Cloud CLI effectively in scripts and automation workflows.

## Machine-Readable Output

### JSON Output

\`\`\`bash
# Get specific fields with jq
bunker compute instance list --output json | jq '.[].id'

# Filter results
bunker compute instance list --output json | \\
  jq '.[] | select(.status == "running")'

# Transform output
bunker compute instance list --output json | \\
  jq '[.[] | {name: .name, ip: .privateIp}]'
\`\`\`

### Query Option

\`\`\`bash
# Extract specific fields
bunker compute instance list --query '[].{ID:id,Name:name,Status:status}'

# Filter with query
bunker compute instance list --query "[?status=='running'].id"

# Single value
bunker compute instance get --instance-id i-123 --query 'publicIp' --output text
\`\`\`

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid usage |
| 130 | Interrupted (Ctrl+C) |
| 255 | Unknown error |

### Using Exit Codes

\`\`\`bash
#!/bin/bash
bunker compute instance get --instance-id i-12345

if [ $? -eq 0 ]; then
  echo "Instance exists"
else
  echo "Instance not found"
  exit 1
fi
\`\`\`

## Waiters

Wait for resources to reach a state:

\`\`\`bash
# Wait for instance to be running
bunker compute instance wait running --instance-id i-12345

# Wait for database to be available
bunker database cluster wait available --cluster-id db-123

# With timeout
bunker compute instance wait running --instance-id i-12345 --timeout 300
\`\`\`

## Batch Operations

\`\`\`bash
# Stop multiple instances
bunker compute instance stop --instance-ids i-1,i-2,i-3

# Tag multiple resources
bunker tag add \\
  --resources i-1 i-2 vol-1 \\
  --tags "Environment=Production" "Team=Backend"

# Delete with confirmation bypass
bunker compute instance terminate --instance-id i-12345 --force
\`\`\`

## Error Handling

\`\`\`bash
#!/bin/bash
set -e  # Exit on error

# Function with error handling
create_instance() {
  local result
  result=$(bunker compute instance create \\
    --name "$1" \\
    --type vault.medium \\
    --image img-ubuntu-22.04 \\
    --output json 2>&1) || {
      echo "Failed to create instance: $result" >&2
      return 1
    }
  echo "$result" | jq -r '.id'
}

# Use the function
instance_id=$(create_instance "web-server")
if [ -n "$instance_id" ]; then
  echo "Created instance: $instance_id"
fi
\`\`\`

## Dry Run

Test commands without making changes:

\`\`\`bash
bunker compute instance terminate --instance-id i-12345 --dry-run

# Output:
# Would terminate instance i-12345
# Instance type: vault.medium
# Attached volumes: vol-abc, vol-def
\`\`\`

## Scripting Examples

### Backup Script

\`\`\`bash
#!/bin/bash
# Daily backup script

DATE=$(date +%Y%m%d)

# Get all running instances
instances=$(bunker compute instance list \\
  --query "[?status=='running'].id" \\
  --output text)

for instance in $instances; do
  echo "Creating snapshot for $instance..."
  bunker compute snapshot create \\
    --instance-id "$instance" \\
    --name "daily-backup-$DATE" \\
    --description "Automated daily backup"
done
\`\`\`

### Deployment Script

\`\`\`bash
#!/bin/bash
# Blue-green deployment

OLD_INSTANCES=$(bunker compute instance list \\
  --query "[?tags.Deployment=='blue'].id" --output text)

# Create new instances
for i in 1 2 3; do
  bunker compute instance create \\
    --name "app-green-$i" \\
    --type vault.medium \\
    --image img-app-latest \\
    --tags "Deployment=green"
done

# Wait for instances
bunker compute instance wait running \\
  --filter "tag:Deployment=green"

# Switch traffic
bunker lb target-group update \\
  --name app-targets \\
  --instances green

# Terminate old instances
for id in $OLD_INSTANCES; do
  bunker compute instance terminate --instance-id "$id" --force
done
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Complete Automation Script',
        language: 'bash',
        code: `#!/bin/bash
# Infrastructure provisioning script
set -euo pipefail

# Configuration
ENVIRONMENT=\${1:-staging}
REGION=\${2:-us-east-1}
INSTANCE_TYPE="vault.medium"
INSTANCE_COUNT=3

# Logging
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

error() {
  log "ERROR: $*" >&2
  exit 1
}

# Create VPC
create_vpc() {
  log "Creating VPC..."
  vpc_id=$(bunker vpc create \\
    --name "$ENVIRONMENT-vpc" \\
    --cidr "10.0.0.0/16" \\
    --region "$REGION" \\
    --output json | jq -r '.id')

  [ -n "$vpc_id" ] || error "Failed to create VPC"
  echo "$vpc_id"
}

# Create subnet
create_subnet() {
  local vpc_id=$1
  local az=$2
  local cidr=$3

  log "Creating subnet in $az..."
  subnet_id=$(bunker vpc subnet create \\
    --vpc-id "$vpc_id" \\
    --name "$ENVIRONMENT-subnet-$az" \\
    --cidr "$cidr" \\
    --az "$az" \\
    --output json | jq -r '.id')

  echo "$subnet_id"
}

# Create instances
create_instances() {
  local subnet_id=$1
  local count=$2

  for i in $(seq 1 "$count"); do
    log "Creating instance $i of $count..."
    bunker compute instance create \\
      --name "$ENVIRONMENT-app-$i" \\
      --type "$INSTANCE_TYPE" \\
      --image "img-ubuntu-22.04" \\
      --subnet "$subnet_id" \\
      --tags "Environment=$ENVIRONMENT" "App=web"
  done
}

# Main
main() {
  log "Starting infrastructure provisioning for $ENVIRONMENT"

  vpc_id=$(create_vpc)
  log "VPC created: $vpc_id"

  subnet_id=$(create_subnet "$vpc_id" "\${REGION}a" "10.0.1.0/24")
  log "Subnet created: $subnet_id"

  create_instances "$subnet_id" "$INSTANCE_COUNT"

  log "Waiting for instances to be running..."
  bunker compute instance wait running \\
    --filter "tag:Environment=$ENVIRONMENT" \\
    --timeout 300

  log "Infrastructure provisioning complete!"

  # Output summary
  bunker compute instance list \\
    --filter "tag:Environment=$ENVIRONMENT" \\
    --output table
}

main "$@"`
      }
    ],
    relatedDocs: ['cli-overview', 'cli-commands', 'api-overview']
  }
};

// Export all CLI doc IDs for validation
export const cliDocIds = Object.keys(cliDocs);
