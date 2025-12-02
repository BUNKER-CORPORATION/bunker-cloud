// Storage Documentation Content

import { DocPage } from '../types';

export const storageDocs: Record<string, DocPage> = {
  'storage-overview': {
    id: 'storage-overview',
    title: 'Storage Overview',
    description: 'Introduction to Bunker Cloud storage services including object, block, and file storage.',
    difficulty: 'beginner',
    timeToRead: '8 min',
    lastUpdated: '2024-12-01',
    content: `
## Introduction

Bunker Cloud provides a comprehensive suite of storage services to meet any data storage requirement. From object storage for unstructured data to high-performance block storage for databases.

## Storage Services

### Fortress Object Storage

Scalable object storage for any amount of data:

- **Unlimited capacity**: Store petabytes of data
- **99.999999999% durability**: 11 nines of data durability
- **Global CDN integration**: Fast content delivery worldwide
- **S3-compatible API**: Works with existing tools

### Block Volumes

High-performance block storage for instances:

- **SSD and NVMe options**: Up to 64,000 IOPS
- **Resizable volumes**: Expand without downtime
- **Snapshots**: Point-in-time backups
- **Encryption**: AES-256 at rest

### File Storage (NFS)

Shared file storage for multiple instances:

- **NFS v4.1 support**: Standard protocol
- **Multi-attach**: Share across instances
- **Automatic scaling**: Grows with your data
- **High throughput**: Up to 10 GB/s

## Choosing the Right Storage

| Use Case | Recommended Service |
|----------|-------------------|
| Static assets (images, videos) | Fortress Object Storage |
| Database storage | Block Volumes (SSD) |
| Application data | Block Volumes |
| Shared files | File Storage |
| Backups | Fortress Object Storage |
| Logs | Fortress Object Storage |
| Media streaming | Fortress + CDN |

## Storage Classes

### Object Storage Classes

| Class | Durability | Availability | Use Case | Price/GB |
|-------|------------|--------------|----------|----------|
| Standard | 11 nines | 99.99% | Frequent access | $0.023 |
| Infrequent | 11 nines | 99.9% | Monthly access | $0.0125 |
| Archive | 11 nines | 99.9% | Yearly access | $0.004 |
| Deep Archive | 11 nines | 99.9% | Compliance | $0.00099 |

### Block Storage Classes

| Class | IOPS | Throughput | Use Case | Price/GB |
|-------|------|------------|----------|----------|
| Standard SSD | 3,000 | 125 MB/s | General | $0.10 |
| Performance SSD | 16,000 | 250 MB/s | Databases | $0.17 |
| Ultra SSD | 64,000 | 1,000 MB/s | High IOPS | $0.30 |
| HDD | 500 | 60 MB/s | Throughput | $0.05 |

## Key Features

### Encryption

All storage is encrypted by default:

- **At rest**: AES-256 encryption
- **In transit**: TLS 1.3
- **Customer managed keys**: Bring your own keys (BYOK)

### Replication

Automatic data protection:

- **Same-region**: 3 copies across availability zones
- **Cross-region**: Optional replication to other regions
- **Versioning**: Keep previous versions of objects

### Lifecycle Management

Automate data management:

\`\`\`json
{
  "rules": [
    {
      "name": "archive-old-logs",
      "filter": { "prefix": "logs/" },
      "transitions": [
        { "days": 30, "storageClass": "infrequent" },
        { "days": 90, "storageClass": "archive" }
      ],
      "expiration": { "days": 365 }
    }
  ]
}
\`\`\`

## Getting Started

1. **Create a bucket or volume** in the console or via CLI
2. **Configure access** using IAM policies
3. **Upload data** via API, CLI, or console
4. **Set up lifecycle rules** for cost optimization
    `,
    codeExamples: [
      {
        language: 'bash',
        title: 'Quick storage commands',
        code: `# Create object storage bucket
bunker storage buckets create my-bucket --region us-east-1

# Create block volume
bunker volumes create my-volume --size 100 --type ssd

# Upload file to bucket
bunker storage cp ./file.txt s3://my-bucket/

# Attach volume to instance
bunker volumes attach my-volume --instance my-server`
      }
    ],
    relatedDocs: ['fortress-object-storage', 'block-volumes', 'file-storage']
  },

  'fortress-object-storage': {
    id: 'fortress-object-storage',
    title: 'Fortress Object Storage',
    description: 'Store and retrieve any amount of data with S3-compatible object storage.',
    difficulty: 'intermediate',
    timeToRead: '15 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Fortress Object Storage is a highly scalable, durable storage service for any type of data. It provides an S3-compatible API, making it easy to use with existing applications and tools.

## Creating a Bucket

### Using the Console

1. Navigate to **Storage → Object Storage**
2. Click **Create Bucket**
3. Enter bucket name (globally unique)
4. Select region
5. Configure options (versioning, encryption)
6. Create

### Using the CLI

\`\`\`bash
bunker storage buckets create my-bucket \\
  --region us-east-1 \\
  --versioning \\
  --encryption aes256
\`\`\`

### Using the API

\`\`\`bash
curl -X PUT "https://storage.bunkercloud.com/my-bucket" \\
  -H "Authorization: Bearer $BUNKER_API_KEY" \\
  -H "x-bunker-region: us-east-1"
\`\`\`

## Uploading Objects

### Using the CLI

\`\`\`bash
# Upload single file
bunker storage cp ./image.png s3://my-bucket/images/

# Upload directory
bunker storage cp ./assets/ s3://my-bucket/assets/ --recursive

# Upload with metadata
bunker storage cp ./file.pdf s3://my-bucket/ \\
  --content-type "application/pdf" \\
  --metadata "author=john,version=1.0"
\`\`\`

### Using the SDK

\`\`\`javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'us-east-1',
  endpoint: 'https://storage.bunkercloud.com',
  credentials: {
    accessKeyId: process.env.BUNKER_ACCESS_KEY,
    secretAccessKey: process.env.BUNKER_SECRET_KEY
  }
});

await client.send(new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'images/photo.jpg',
  Body: fileBuffer,
  ContentType: 'image/jpeg'
}));
\`\`\`

## Downloading Objects

### Using the CLI

\`\`\`bash
# Download single file
bunker storage cp s3://my-bucket/images/photo.jpg ./

# Download directory
bunker storage cp s3://my-bucket/assets/ ./assets/ --recursive

# Stream to stdout
bunker storage cp s3://my-bucket/data.json - | jq .
\`\`\`

### Presigned URLs

Generate temporary download links:

\`\`\`bash
bunker storage presign s3://my-bucket/file.pdf --expires 3600
# https://storage.bunkercloud.com/my-bucket/file.pdf?X-Amz-...
\`\`\`

## Bucket Policies

### Public Read Access

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:bunker:s3:::my-bucket/public/*"
    }
  ]
}
\`\`\`

### Restrict by IP

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": "arn:bunker:s3:::my-bucket/*",
      "Condition": {
        "NotIpAddress": {
          "aws:SourceIp": ["203.0.113.0/24"]
        }
      }
    }
  ]
}
\`\`\`

## Versioning

### Enable Versioning

\`\`\`bash
bunker storage buckets update my-bucket --versioning enabled
\`\`\`

### List Versions

\`\`\`bash
bunker storage ls s3://my-bucket/file.txt --versions
\`\`\`

### Restore Previous Version

\`\`\`bash
bunker storage cp s3://my-bucket/file.txt?versionId=abc123 s3://my-bucket/file.txt
\`\`\`

## Lifecycle Rules

### Configure via CLI

\`\`\`bash
bunker storage lifecycle set my-bucket --config lifecycle.json
\`\`\`

### Lifecycle Configuration

\`\`\`json
{
  "rules": [
    {
      "id": "archive-logs",
      "status": "enabled",
      "filter": {
        "prefix": "logs/"
      },
      "transitions": [
        {
          "days": 30,
          "storageClass": "INFREQUENT_ACCESS"
        },
        {
          "days": 90,
          "storageClass": "ARCHIVE"
        }
      ],
      "expiration": {
        "days": 365
      }
    },
    {
      "id": "delete-temp",
      "status": "enabled",
      "filter": {
        "prefix": "temp/"
      },
      "expiration": {
        "days": 7
      }
    }
  ]
}
\`\`\`

## CORS Configuration

Enable cross-origin requests:

\`\`\`json
{
  "corsRules": [
    {
      "allowedOrigins": ["https://myapp.com"],
      "allowedMethods": ["GET", "PUT", "POST"],
      "allowedHeaders": ["*"],
      "exposeHeaders": ["ETag"],
      "maxAgeSeconds": 3600
    }
  ]
}
\`\`\`

## Static Website Hosting

Host a static website from a bucket:

\`\`\`bash
bunker storage website enable my-bucket \\
  --index index.html \\
  --error error.html
\`\`\`

Access at: \`https://my-bucket.storage.bunkercloud.com\`

## CDN Integration

Enable CDN for faster global delivery:

\`\`\`bash
bunker cdn create my-cdn \\
  --origin s3://my-bucket \\
  --domain cdn.myapp.com
\`\`\`

## Multipart Uploads

For large files (>100MB):

\`\`\`javascript
import { Upload } from '@aws-sdk/lib-storage';

const upload = new Upload({
  client,
  params: {
    Bucket: 'my-bucket',
    Key: 'large-file.zip',
    Body: fileStream
  },
  partSize: 100 * 1024 * 1024, // 100MB parts
  queueSize: 4 // Parallel uploads
});

upload.on('httpUploadProgress', (progress) => {
  console.log(\`Progress: \${progress.loaded}/\${progress.total}\`);
});

await upload.done();
\`\`\`

## Monitoring

### Storage Metrics

- Total storage used
- Number of objects
- Requests per second
- Bandwidth usage

### Access Logs

Enable access logging:

\`\`\`bash
bunker storage buckets update my-bucket \\
  --logging-bucket logs-bucket \\
  --logging-prefix access-logs/
\`\`\`
    `,
    codeExamples: [
      {
        language: 'javascript',
        title: 'Complete S3 SDK example',
        code: `import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({
  region: 'us-east-1',
  endpoint: 'https://storage.bunkercloud.com',
  credentials: {
    accessKeyId: process.env.BUNKER_ACCESS_KEY,
    secretAccessKey: process.env.BUNKER_SECRET_KEY
  }
});

// Upload
await client.send(new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'data.json',
  Body: JSON.stringify({ hello: 'world' }),
  ContentType: 'application/json'
}));

// Download
const response = await client.send(new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'data.json'
}));
const data = await response.Body.transformToString();

// List objects
const list = await client.send(new ListObjectsV2Command({
  Bucket: 'my-bucket',
  Prefix: 'images/'
}));

// Generate presigned URL
const url = await getSignedUrl(client, new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'file.pdf'
}), { expiresIn: 3600 });`
      }
    ],
    relatedDocs: ['storage-overview', 'lifecycle-policies', 'cdn']
  },

  'block-volumes': {
    id: 'block-volumes',
    title: 'Block Volumes',
    description: 'High-performance block storage for compute instances.',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Block Volumes provide persistent, high-performance storage that can be attached to Vault Instances. They are ideal for databases, file systems, and applications requiring low-latency access.

## Creating a Volume

### Using the Console

1. Navigate to **Storage → Block Volumes**
2. Click **Create Volume**
3. Configure:
   - Name
   - Size (1 GB - 16 TB)
   - Type (SSD, Performance SSD, HDD)
   - Region/Zone
4. Create

### Using the CLI

\`\`\`bash
bunker volumes create my-volume \\
  --size 100 \\
  --type ssd \\
  --region us-east-1 \\
  --zone us-east-1a
\`\`\`

## Volume Types

### Standard SSD

General-purpose SSD storage:

- **IOPS**: Up to 3,000
- **Throughput**: Up to 125 MB/s
- **Use case**: Most workloads
- **Price**: $0.10/GB/month

### Performance SSD

High-performance SSD storage:

- **IOPS**: Up to 16,000
- **Throughput**: Up to 250 MB/s
- **Use case**: Databases, analytics
- **Price**: $0.17/GB/month

### Ultra SSD

Maximum performance:

- **IOPS**: Up to 64,000
- **Throughput**: Up to 1,000 MB/s
- **Use case**: High-IOPS workloads
- **Price**: $0.30/GB/month

### HDD

Cost-effective storage:

- **IOPS**: Up to 500
- **Throughput**: Up to 60 MB/s
- **Use case**: Sequential I/O, backups
- **Price**: $0.05/GB/month

## Attaching Volumes

### Attach to Instance

\`\`\`bash
bunker volumes attach my-volume \\
  --instance my-server \\
  --device /dev/sdb
\`\`\`

### Configure in Instance

\`\`\`bash
# SSH into instance
bunker ssh my-server

# Format the volume (first time only)
sudo mkfs.ext4 /dev/sdb

# Create mount point
sudo mkdir /data

# Mount the volume
sudo mount /dev/sdb /data

# Add to fstab for persistence
echo '/dev/sdb /data ext4 defaults,nofail 0 2' | sudo tee -a /etc/fstab
\`\`\`

## Resizing Volumes

### Expand Volume

\`\`\`bash
# Expand volume (no downtime)
bunker volumes resize my-volume --size 200

# Extend filesystem inside instance
sudo resize2fs /dev/sdb
\`\`\`

### Performance Scaling

IOPS and throughput scale with volume size:

| Size | Standard IOPS | Performance IOPS |
|------|---------------|------------------|
| 100 GB | 3,000 | 6,000 |
| 500 GB | 3,000 | 16,000 |
| 1 TB | 3,000 | 16,000 |
| 4 TB | 3,000 | 16,000 |

## Snapshots

### Create Snapshot

\`\`\`bash
bunker volumes snapshot my-volume --name my-snapshot
\`\`\`

### Scheduled Snapshots

\`\`\`bash
bunker volumes snapshot-schedule my-volume \\
  --frequency daily \\
  --time "02:00" \\
  --retention 7
\`\`\`

### Restore from Snapshot

\`\`\`bash
bunker volumes create restored-volume \\
  --from-snapshot my-snapshot \\
  --size 200
\`\`\`

## Encryption

### Default Encryption

All volumes are encrypted at rest with AES-256.

### Customer Managed Keys

Use your own encryption keys:

\`\`\`bash
bunker volumes create secure-volume \\
  --size 100 \\
  --encryption-key my-kms-key
\`\`\`

## Multi-Attach

Attach a volume to multiple instances (shared storage):

\`\`\`bash
bunker volumes create shared-volume \\
  --size 100 \\
  --multi-attach

bunker volumes attach shared-volume --instance server-1
bunker volumes attach shared-volume --instance server-2
\`\`\`

**Note**: Use a cluster-aware filesystem (GFS2, OCFS2) for multi-attach.

## Monitoring

### Volume Metrics

\`\`\`bash
bunker volumes metrics my-volume
\`\`\`

Available metrics:
- Read/Write IOPS
- Read/Write throughput
- Queue depth
- Latency

### Alerts

\`\`\`bash
bunker alerts create \\
  --resource volume:my-volume \\
  --metric disk_usage \\
  --threshold 80 \\
  --action email:ops@company.com
\`\`\`
    `,
    codeExamples: [
      {
        language: 'bash',
        title: 'Complete volume setup',
        code: `# Create and attach volume
bunker volumes create db-storage \\
  --size 500 \\
  --type performance-ssd \\
  --region us-east-1

bunker volumes attach db-storage \\
  --instance db-server \\
  --device /dev/sdb

# Configure inside instance
bunker ssh db-server << 'EOF'
sudo mkfs.ext4 /dev/sdb
sudo mkdir /var/lib/postgresql
sudo mount /dev/sdb /var/lib/postgresql
echo '/dev/sdb /var/lib/postgresql ext4 defaults,nofail 0 2' | sudo tee -a /etc/fstab
sudo chown postgres:postgres /var/lib/postgresql
EOF

# Set up daily snapshots
bunker volumes snapshot-schedule db-storage \\
  --frequency daily \\
  --time "03:00" \\
  --retention 14`
      }
    ],
    relatedDocs: ['vault-instances', 'snapshots', 'storage-classes']
  },

  'file-storage': {
    id: 'file-storage',
    title: 'File Storage (NFS)',
    description: 'Shared file storage accessible from multiple instances.',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

File Storage provides fully managed NFS file systems that can be mounted on multiple instances simultaneously. Ideal for shared application data, content management, and development environments.

## Creating a File System

### Using the Console

1. Navigate to **Storage → File Storage**
2. Click **Create File System**
3. Configure:
   - Name
   - Performance mode
   - VPC and subnet
4. Create

### Using the CLI

\`\`\`bash
bunker fs create my-filesystem \\
  --performance general \\
  --vpc my-vpc \\
  --subnet private-1
\`\`\`

## Performance Modes

| Mode | Throughput | Latency | Use Case |
|------|------------|---------|----------|
| General | 100 MB/s/TB | Low | Most workloads |
| Max I/O | 500 MB/s/TB | Higher | Big data, media |
| Provisioned | Custom | Lowest | Predictable workloads |

## Mounting the File System

### Get Mount Target

\`\`\`bash
bunker fs describe my-filesystem
# Mount target: fs-abc123.efs.us-east-1.bunkercloud.com
\`\`\`

### Mount on Linux

\`\`\`bash
# Install NFS client
sudo apt-get install nfs-common

# Create mount point
sudo mkdir /mnt/shared

# Mount file system
sudo mount -t nfs4 \\
  fs-abc123.efs.us-east-1.bunkercloud.com:/ \\
  /mnt/shared

# Add to fstab
echo 'fs-abc123.efs.us-east-1.bunkercloud.com:/ /mnt/shared nfs4 defaults,_netdev 0 0' \\
  | sudo tee -a /etc/fstab
\`\`\`

### Mount with TLS

\`\`\`bash
sudo mount -t nfs4 \\
  -o tls \\
  fs-abc123.efs.us-east-1.bunkercloud.com:/ \\
  /mnt/shared
\`\`\`

## Access Points

Create access points for different applications:

\`\`\`bash
bunker fs access-points create my-filesystem \\
  --name app-data \\
  --path /app \\
  --uid 1000 \\
  --gid 1000 \\
  --permissions 755
\`\`\`

Mount using access point:

\`\`\`bash
sudo mount -t nfs4 \\
  -o accesspoint=fsap-abc123 \\
  fs-abc123.efs.us-east-1.bunkercloud.com:/ \\
  /mnt/app-data
\`\`\`

## Security

### Security Groups

Control network access:

\`\`\`bash
bunker fs update my-filesystem \\
  --security-group nfs-access
\`\`\`

### IAM Policies

Control file system access:

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "elasticfilesystem:ClientMount",
        "elasticfilesystem:ClientWrite"
      ],
      "Resource": "arn:bunker:efs:*:*:file-system/fs-abc123",
      "Condition": {
        "Bool": {
          "elasticfilesystem:AccessedViaMountTarget": "true"
        }
      }
    }
  ]
}
\`\`\`

## Lifecycle Management

Move infrequently accessed files to cheaper storage:

\`\`\`bash
bunker fs lifecycle set my-filesystem \\
  --transition-to-ia 30 \\
  --transition-to-archive 90
\`\`\`

## Backups

### Automatic Backups

\`\`\`bash
bunker fs backup enable my-filesystem \\
  --schedule daily \\
  --retention 35
\`\`\`

### Manual Backup

\`\`\`bash
bunker fs backup create my-filesystem --name manual-backup
\`\`\`

### Restore

\`\`\`bash
bunker fs restore my-filesystem \\
  --backup backup-abc123 \\
  --target restored-fs
\`\`\`

## Monitoring

### Metrics

- Storage used
- Throughput
- IOPS
- Connected clients
- Burst credits

### Alerts

\`\`\`bash
bunker alerts create \\
  --resource fs:my-filesystem \\
  --metric burst_credits \\
  --threshold 1000000000 \\
  --comparison lt
\`\`\`
    `,
    relatedDocs: ['storage-overview', 'vpc', 'block-volumes']
  },

  'storage-classes': {
    id: 'storage-classes',
    title: 'Storage Classes',
    description: 'Understanding and choosing the right storage class for your data.',
    difficulty: 'beginner',
    timeToRead: '6 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Storage classes determine the performance, durability, and cost of your storage. Choose the right class based on access patterns and requirements.

## Object Storage Classes

### Standard

For frequently accessed data:

- **Durability**: 99.999999999% (11 nines)
- **Availability**: 99.99%
- **Retrieval**: Immediate
- **Price**: $0.023/GB/month
- **Use cases**: Active data, websites, mobile apps

### Infrequent Access

For data accessed less than once per month:

- **Durability**: 99.999999999%
- **Availability**: 99.9%
- **Retrieval**: Immediate
- **Price**: $0.0125/GB/month
- **Retrieval fee**: $0.01/GB
- **Use cases**: Backups, disaster recovery

### Archive

For rarely accessed data:

- **Durability**: 99.999999999%
- **Availability**: 99.9%
- **Retrieval**: 1-5 hours
- **Price**: $0.004/GB/month
- **Retrieval fee**: $0.03/GB
- **Use cases**: Compliance archives, historical data

### Deep Archive

For long-term preservation:

- **Durability**: 99.999999999%
- **Availability**: 99.9%
- **Retrieval**: 12-48 hours
- **Price**: $0.00099/GB/month
- **Retrieval fee**: $0.05/GB
- **Use cases**: Regulatory compliance, digital preservation

## Block Storage Classes

### Standard SSD

General-purpose SSD:

- **IOPS**: 3,000 baseline
- **Throughput**: 125 MB/s
- **Price**: $0.10/GB/month
- **Use cases**: Boot volumes, development

### Performance SSD

High-performance SSD:

- **IOPS**: Up to 16,000
- **Throughput**: Up to 250 MB/s
- **Price**: $0.17/GB/month
- **Use cases**: Production databases

### Ultra SSD

Maximum performance:

- **IOPS**: Up to 64,000
- **Throughput**: Up to 1,000 MB/s
- **Price**: $0.30/GB/month
- **Use cases**: High-performance databases

### HDD

Cost-optimized:

- **IOPS**: 500
- **Throughput**: 60 MB/s
- **Price**: $0.05/GB/month
- **Use cases**: Sequential workloads, backups

## Choosing a Storage Class

### Decision Matrix

| Factor | Standard | Infrequent | Archive |
|--------|----------|------------|---------|
| Access frequency | Daily | Monthly | Yearly |
| Retrieval time | Immediate | Immediate | Hours |
| Cost per GB | Higher | Medium | Lowest |
| Retrieval cost | None | Low | Higher |

### Cost Optimization Tips

1. Use lifecycle policies to automatically transition data
2. Monitor access patterns with storage analytics
3. Right-size volumes to match actual usage
4. Delete unused snapshots and old versions
    `,
    relatedDocs: ['storage-overview', 'lifecycle-policies', 'cost-optimization']
  },

  'snapshots': {
    id: 'snapshots',
    title: 'Snapshots & Backups',
    description: 'Create point-in-time backups of your volumes and data.',
    difficulty: 'beginner',
    timeToRead: '8 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Snapshots provide point-in-time backups of your block volumes. They are incremental, storing only changed blocks since the last snapshot.

## Creating Snapshots

### Manual Snapshot

\`\`\`bash
bunker volumes snapshot my-volume --name pre-upgrade-backup
\`\`\`

### Automated Snapshots

\`\`\`bash
bunker volumes snapshot-schedule my-volume \\
  --frequency daily \\
  --time "02:00" \\
  --retention 7
\`\`\`

### Schedule Options

| Frequency | Description |
|-----------|-------------|
| hourly | Every hour |
| daily | Once per day |
| weekly | Once per week |
| monthly | Once per month |
| custom | Cron expression |

## Managing Snapshots

### List Snapshots

\`\`\`bash
bunker snapshots list --volume my-volume
\`\`\`

### Delete Snapshot

\`\`\`bash
bunker snapshots delete snap-abc123
\`\`\`

### Copy to Another Region

\`\`\`bash
bunker snapshots copy snap-abc123 --destination-region eu-west-1
\`\`\`

## Restoring from Snapshots

### Create Volume from Snapshot

\`\`\`bash
bunker volumes create restored-volume \\
  --from-snapshot snap-abc123 \\
  --size 200
\`\`\`

### Replace Existing Volume

\`\`\`bash
# Detach current volume
bunker volumes detach my-volume

# Create new volume from snapshot
bunker volumes create new-volume --from-snapshot snap-abc123

# Attach new volume
bunker volumes attach new-volume --instance my-server --device /dev/sdb
\`\`\`

## Snapshot Policies

### Create Policy

\`\`\`json
{
  "name": "production-backup",
  "schedule": {
    "frequency": "daily",
    "time": "02:00",
    "timezone": "UTC"
  },
  "retention": {
    "count": 7,
    "days": 30
  },
  "targets": {
    "tags": {
      "environment": "production"
    }
  },
  "copyToRegions": ["eu-west-1"]
}
\`\`\`

### Apply Policy

\`\`\`bash
bunker snapshot-policies apply production-backup --volume my-volume
\`\`\`

## Pricing

- **Snapshot storage**: $0.05/GB/month
- **Cross-region copy**: $0.02/GB
- Snapshots are incremental (only changed blocks)

## Best Practices

1. **Regular snapshots**: Daily for production, weekly for dev
2. **Test restores**: Periodically verify snapshot integrity
3. **Cross-region copies**: For disaster recovery
4. **Lifecycle policies**: Auto-delete old snapshots
5. **Tag snapshots**: For easy identification
    `,
    relatedDocs: ['block-volumes', 'database-backups', 'lifecycle-policies']
  },

  'data-transfer': {
    id: 'data-transfer',
    title: 'Data Transfer',
    description: 'Move data into, out of, and within Bunker Cloud.',
    difficulty: 'intermediate',
    timeToRead: '8 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Bunker Cloud provides multiple methods for transferring data, from simple uploads to large-scale migrations.

## Transfer Methods

### CLI Upload/Download

\`\`\`bash
# Upload
bunker storage cp ./data/ s3://my-bucket/data/ --recursive

# Download
bunker storage cp s3://my-bucket/data/ ./data/ --recursive

# Sync (only changed files)
bunker storage sync ./data/ s3://my-bucket/data/
\`\`\`

### Parallel Transfer

For large transfers:

\`\`\`bash
bunker storage cp ./large-file.zip s3://my-bucket/ \\
  --parallel 10 \\
  --part-size 100MB
\`\`\`

### Transfer Acceleration

Enable for faster global transfers:

\`\`\`bash
bunker storage buckets update my-bucket --acceleration enabled

# Use accelerated endpoint
bunker storage cp ./file s3://my-bucket-accelerated/
\`\`\`

## Large-Scale Migrations

### Data Migration Service

For migrating large datasets:

\`\`\`bash
bunker migration create my-migration \\
  --source "s3://source-bucket" \\
  --destination "s3://my-bucket" \\
  --schedule "2024-12-15T02:00:00Z"
\`\`\`

### Physical Data Transfer

For very large datasets (>10TB):

1. Request a Bunker Transfer Device
2. Load data onto the device
3. Ship to Bunker Cloud
4. Data imported to your bucket

## Cross-Region Transfer

### Replication

\`\`\`bash
bunker storage replication enable my-bucket \\
  --destination us-west-1 \\
  --prefix "important/"
\`\`\`

### One-Time Copy

\`\`\`bash
bunker storage cp s3://my-bucket/ s3://my-bucket-west/ \\
  --region us-west-1 \\
  --recursive
\`\`\`

## Transfer Costs

| Type | Cost |
|------|------|
| Data in | Free |
| Data out (first 100GB/month) | Free |
| Data out (over 100GB) | $0.09/GB |
| Cross-region transfer | $0.02/GB |
| Transfer acceleration | +$0.04/GB |

## Monitoring Transfers

\`\`\`bash
# View transfer progress
bunker storage cp ./large.zip s3://my-bucket/ --progress

# Monitor migration
bunker migration status my-migration
\`\`\`
    `,
    relatedDocs: ['fortress-object-storage', 'storage-overview', 'cdn']
  },

  'lifecycle-policies': {
    id: 'lifecycle-policies',
    title: 'Lifecycle Policies',
    description: 'Automate data management with lifecycle rules.',
    difficulty: 'intermediate',
    timeToRead: '8 min',
    lastUpdated: '2024-12-01',
    content: `
## Overview

Lifecycle policies automate the management of your data by transitioning objects between storage classes and deleting expired data.

## Creating Lifecycle Rules

### Using the Console

1. Navigate to **Storage → Object Storage → Bucket**
2. Click **Lifecycle Rules**
3. Click **Add Rule**
4. Configure transitions and expirations
5. Save

### Using the CLI

\`\`\`bash
bunker storage lifecycle set my-bucket --config lifecycle.json
\`\`\`

## Rule Configuration

### Basic Transition Rule

\`\`\`json
{
  "rules": [
    {
      "id": "transition-old-data",
      "status": "enabled",
      "filter": {},
      "transitions": [
        {
          "days": 30,
          "storageClass": "INFREQUENT_ACCESS"
        },
        {
          "days": 90,
          "storageClass": "ARCHIVE"
        }
      ]
    }
  ]
}
\`\`\`

### Filter by Prefix

\`\`\`json
{
  "rules": [
    {
      "id": "archive-logs",
      "status": "enabled",
      "filter": {
        "prefix": "logs/"
      },
      "transitions": [
        {
          "days": 7,
          "storageClass": "INFREQUENT_ACCESS"
        }
      ],
      "expiration": {
        "days": 365
      }
    }
  ]
}
\`\`\`

### Filter by Tags

\`\`\`json
{
  "rules": [
    {
      "id": "temp-files",
      "status": "enabled",
      "filter": {
        "tag": {
          "key": "type",
          "value": "temporary"
        }
      },
      "expiration": {
        "days": 7
      }
    }
  ]
}
\`\`\`

### Delete Incomplete Uploads

\`\`\`json
{
  "rules": [
    {
      "id": "cleanup-uploads",
      "status": "enabled",
      "filter": {},
      "abortIncompleteMultipartUpload": {
        "daysAfterInitiation": 7
      }
    }
  ]
}
\`\`\`

### Version Management

\`\`\`json
{
  "rules": [
    {
      "id": "version-cleanup",
      "status": "enabled",
      "filter": {},
      "noncurrentVersionTransitions": [
        {
          "noncurrentDays": 30,
          "storageClass": "INFREQUENT_ACCESS"
        }
      ],
      "noncurrentVersionExpiration": {
        "noncurrentDays": 90
      }
    }
  ]
}
\`\`\`

## Common Patterns

### Log Retention

\`\`\`json
{
  "rules": [
    {
      "id": "log-lifecycle",
      "filter": { "prefix": "logs/" },
      "transitions": [
        { "days": 30, "storageClass": "INFREQUENT_ACCESS" },
        { "days": 90, "storageClass": "ARCHIVE" }
      ],
      "expiration": { "days": 365 }
    }
  ]
}
\`\`\`

### Backup Retention

\`\`\`json
{
  "rules": [
    {
      "id": "backup-lifecycle",
      "filter": { "prefix": "backups/" },
      "transitions": [
        { "days": 7, "storageClass": "INFREQUENT_ACCESS" },
        { "days": 30, "storageClass": "ARCHIVE" }
      ],
      "expiration": { "days": 180 }
    }
  ]
}
\`\`\`

## Monitoring

### View Applied Rules

\`\`\`bash
bunker storage lifecycle get my-bucket
\`\`\`

### Lifecycle Metrics

- Objects transitioned
- Objects expired
- Storage savings
- Pending transitions
    `,
    relatedDocs: ['storage-classes', 'fortress-object-storage', 'cost-optimization']
  }
};
