# Bunker Cloud CLI

Command-line interface for managing Bunker Cloud infrastructure.

## Installation

```bash
npm install -g bunker-cli
```

## Quick Start

```bash
# Login to your account
bunker auth login

# Deploy an app
bunker apps create --name myapp --image nginx:alpine --port 80

# Create a database
bunker databases create --name mydb --engine postgresql

# Create a storage bucket
bunker storage create my-bucket
```

## Commands

### Authentication

```bash
bunker auth login              # Login to Bunker Cloud
bunker auth register           # Create a new account
bunker auth logout             # Logout
bunker auth status             # Show login status
bunker auth whoami             # Show current user email
```

### Apps

```bash
bunker apps list               # List all apps
bunker apps create             # Deploy a new app
bunker apps info <name>        # Get app details
bunker apps start <name>       # Start an app
bunker apps stop <name>        # Stop an app
bunker apps restart <name>     # Restart an app
bunker apps delete <name>      # Delete an app
bunker apps logs <name>        # View app logs
bunker apps deploy <name>      # Deploy new version
```

### Databases

```bash
bunker databases list          # List all databases
bunker databases create        # Create a new database
bunker databases info <name>   # Get connection details
bunker databases start <name>  # Start a database
bunker databases stop <name>   # Stop a database
bunker databases delete <name> # Delete a database
```

### Storage

```bash
bunker storage list                        # List buckets
bunker storage create <name>               # Create a bucket
bunker storage delete <name>               # Delete a bucket
bunker storage objects <bucket>            # List objects
bunker storage info <bucket>               # Get bucket info
bunker storage presign-upload <bucket> <key>    # Get upload URL
bunker storage presign-download <bucket> <key>  # Get download URL
```

### Configuration

```bash
bunker config --show           # Show current config
bunker config --api-url <url>  # Set API URL
```

## Examples

### Deploy a Node.js App

```bash
bunker apps create \
  --name my-node-app \
  --image node:20-alpine \
  --port 3000 \
  --env "NODE_ENV=production" \
  --env "API_KEY=secret123" \
  --memory 512m \
  --cpus 0.5
```

### Create a PostgreSQL Database

```bash
bunker databases create \
  --name my-postgres \
  --engine postgresql \
  --version 16
```

### Upload a File

```bash
# Get presigned upload URL
bunker storage presign-upload my-bucket uploads/file.txt

# Use curl to upload
curl -X PUT "<presigned-url>" -d "file contents"
```

## License

MIT License - Bunker Corporation
