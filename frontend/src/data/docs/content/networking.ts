// Networking Documentation Content for Bunker Cloud

import { DocPage } from '../types';

export const networkingDocs: Record<string, DocPage> = {
  'networking-overview': {
    id: 'networking-overview',
    title: 'Networking Overview',
    description: 'Introduction to Bunker Cloud networking services and architecture',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# Networking Overview

Bunker Cloud provides a comprehensive suite of networking services designed to give you complete control over your cloud network architecture while maintaining enterprise-grade security and performance.

## Network Architecture

Our global network infrastructure spans multiple regions and availability zones, connected by a high-speed backbone network:

\`\`\`
┌─────────────────────────────────────────────────────────────────────────┐
│                        Bunker Cloud Global Network                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │  Region: US  │    │ Region: EU   │    │ Region: Asia │               │
│  │    East      │◄──►│   West       │◄──►│   Pacific    │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│         │                   │                   │                        │
│         ▼                   ▼                   ▼                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │    VPC A     │    │    VPC B     │    │    VPC C     │               │
│  │ 10.0.0.0/16  │    │ 10.1.0.0/16  │    │ 10.2.0.0/16  │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
\`\`\`

## Core Networking Services

### Virtual Private Cloud (VPC)

Create isolated virtual networks with complete control over IP addressing, subnets, route tables, and network gateways.

| Feature | Description |
|---------|-------------|
| **IP Range** | Custom CIDR blocks from /16 to /28 |
| **Subnets** | Public and private subnet support |
| **Route Tables** | Custom routing rules |
| **Gateways** | Internet, NAT, and VPN gateways |
| **Peering** | Connect VPCs across regions |

### Load Balancing

Distribute traffic across multiple instances with intelligent load balancing:

- **Application Load Balancer (ALB)** - Layer 7 HTTP/HTTPS routing
- **Network Load Balancer (NLB)** - Layer 4 TCP/UDP high-performance
- **Gateway Load Balancer (GLB)** - Third-party virtual appliances

### DNS Management

Fully managed DNS service with global anycast network:

- **Authoritative DNS** - Host your domains
- **Private DNS** - Internal name resolution
- **Health Checks** - Automatic failover
- **Latency Routing** - Route to nearest endpoint

### Content Delivery Network (CDN)

Global edge network for low-latency content delivery:

- **200+ Edge Locations** worldwide
- **DDoS Protection** included
- **SSL/TLS** termination at edge
- **Real-time Analytics** and logging

## Network Security

### Firewalls & Security Groups

Control inbound and outbound traffic with stateful firewall rules:

\`\`\`yaml
# Example Security Group
name: web-servers
description: Allow web traffic
rules:
  inbound:
    - protocol: tcp
      port: 80
      source: 0.0.0.0/0
    - protocol: tcp
      port: 443
      source: 0.0.0.0/0
    - protocol: tcp
      port: 22
      source: 10.0.0.0/8  # Internal only
  outbound:
    - protocol: all
      destination: 0.0.0.0/0
\`\`\`

### Network ACLs

Stateless subnet-level traffic filtering for additional security layers.

### DDoS Protection

All Bunker Cloud resources include automatic DDoS protection:

| Tier | Protection | Cost |
|------|------------|------|
| **Standard** | Automatic L3/L4 protection | Free |
| **Advanced** | L7 protection + WAF integration | $3,000/mo |
| **Enterprise** | 24/7 DDoS response team | Custom |

## Private Connectivity

### VPC Peering

Connect VPCs within or across regions:

\`\`\`bash
# Create VPC peering connection
bunker vpc peering create \\
  --vpc-id vpc-source-123 \\
  --peer-vpc-id vpc-dest-456 \\
  --peer-region eu-west-1
\`\`\`

### Private Link

Access Bunker Cloud services without traversing the public internet:

- **Service Endpoints** - Connect to managed services privately
- **Endpoint Services** - Expose your services to other VPCs
- **Cross-account Access** - Share services between accounts

### VPN Connectivity

Secure connections to on-premises infrastructure:

| Type | Use Case | Bandwidth |
|------|----------|-----------|
| **Site-to-Site VPN** | Connect office networks | Up to 1.25 Gbps |
| **Client VPN** | Remote user access | Variable |
| **Direct Connect** | Dedicated fiber connection | 1-100 Gbps |

## Network Performance

### Accelerated Networking

Enable enhanced networking for supported instance types:

- **Single Root I/O Virtualization (SR-IOV)** - Up to 100 Gbps
- **Elastic Network Adapter (ENA)** - Low latency, high throughput
- **Placement Groups** - Cluster instances for lowest latency

### Global Accelerator

Improve global application availability and performance:

\`\`\`bash
# Create global accelerator
bunker accelerator create \\
  --name my-accelerator \\
  --endpoint-group region=us-east-1,endpoints=lb-12345
\`\`\`

## Pricing Overview

| Service | Pricing Model | Starting Price |
|---------|---------------|----------------|
| **VPC** | Free (data transfer charges apply) | $0.00 |
| **NAT Gateway** | Per hour + data processed | $0.045/hr |
| **Load Balancer** | Per hour + data processed | $0.025/hr |
| **DNS Queries** | Per million queries | $0.40/million |
| **CDN** | Per GB transferred | $0.085/GB |
| **VPN** | Per connection hour | $0.05/hr |

## Quick Start

### Create Your First VPC

\`\`\`bash
# Create a VPC with public and private subnets
bunker vpc create \\
  --name production-vpc \\
  --cidr 10.0.0.0/16 \\
  --region us-east-1

# Create public subnet
bunker subnet create \\
  --vpc-id vpc-12345 \\
  --name public-subnet \\
  --cidr 10.0.1.0/24 \\
  --availability-zone us-east-1a \\
  --public

# Create private subnet
bunker subnet create \\
  --vpc-id vpc-12345 \\
  --name private-subnet \\
  --cidr 10.0.2.0/24 \\
  --availability-zone us-east-1a
\`\`\`

## Best Practices

1. **Use Multiple Availability Zones** - Deploy resources across AZs for high availability
2. **Implement Least Privilege** - Restrict security group rules to minimum required access
3. **Enable Flow Logs** - Monitor and troubleshoot network traffic
4. **Use Private Subnets** - Keep databases and application servers private
5. **Plan IP Addressing** - Reserve adequate IP space for growth
    `,
    codeExamples: [
      {
        title: 'Create VPC with Terraform',
        language: 'hcl',
        code: `resource "bunker_vpc" "main" {
  name       = "production-vpc"
  cidr_block = "10.0.0.0/16"
  region     = "us-east-1"

  tags = {
    Environment = "production"
  }
}

resource "bunker_subnet" "public" {
  vpc_id            = bunker_vpc.main.id
  name              = "public-subnet"
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  public            = true
}

resource "bunker_subnet" "private" {
  vpc_id            = bunker_vpc.main.id
  name              = "private-subnet"
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
  public            = false
}`
      }
    ],
    relatedDocs: ['vpc', 'firewalls', 'load-balancers-network', 'cdn']
  },

  'vpc': {
    id: 'vpc',
    title: 'Virtual Private Cloud (VPC)',
    description: 'Create and manage isolated virtual networks in Bunker Cloud',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '15 min',
    content: `
# Virtual Private Cloud (VPC)

A Virtual Private Cloud (VPC) is a logically isolated virtual network that you define within Bunker Cloud. You have complete control over your virtual networking environment, including IP address ranges, subnets, route tables, and network gateways.

## VPC Concepts

### CIDR Blocks

Every VPC requires a primary CIDR block that defines the IP address range:

\`\`\`
Recommended CIDR ranges:
├── /16 (65,536 IPs) - Large deployments
├── /20 (4,096 IPs)  - Medium deployments
├── /24 (256 IPs)    - Small deployments
└── /28 (16 IPs)     - Minimum size
\`\`\`

**Important:** Choose your CIDR blocks carefully. They cannot overlap with:
- Other VPCs you want to peer with
- On-premises networks you'll connect via VPN
- Bunker Cloud service ranges (169.254.0.0/16)

### Subnets

Subnets partition your VPC into smaller network segments:

| Subnet Type | Internet Access | Use Case |
|-------------|-----------------|----------|
| **Public** | Direct via Internet Gateway | Load balancers, bastion hosts |
| **Private** | Via NAT Gateway | Application servers, databases |
| **Isolated** | None | Sensitive workloads |

### Availability Zones

Distribute subnets across multiple availability zones for high availability:

\`\`\`
VPC: 10.0.0.0/16
├── us-east-1a
│   ├── public-1a:  10.0.0.0/24
│   └── private-1a: 10.0.10.0/24
├── us-east-1b
│   ├── public-1b:  10.0.1.0/24
│   └── private-1b: 10.0.11.0/24
└── us-east-1c
    ├── public-1c:  10.0.2.0/24
    └── private-1c: 10.0.12.0/24
\`\`\`

## Creating a VPC

### Using the Console

1. Navigate to **Networking** > **VPCs**
2. Click **Create VPC**
3. Configure settings:
   - Name: \`production-vpc\`
   - CIDR block: \`10.0.0.0/16\`
   - Region: Select your preferred region
4. Click **Create**

### Using the CLI

\`\`\`bash
# Create VPC
bunker vpc create \\
  --name production-vpc \\
  --cidr 10.0.0.0/16 \\
  --region us-east-1 \\
  --enable-dns-hostnames \\
  --enable-dns-support

# Output:
# VPC created successfully
# ID: vpc-abc123def456
# CIDR: 10.0.0.0/16
# State: available
\`\`\`

### Using the API

\`\`\`javascript
const { BunkerCloud } = require('@bunkercloud/sdk');

const client = new BunkerCloud({
  apiKey: process.env.BUNKER_API_KEY
});

async function createVPC() {
  const vpc = await client.networking.vpcs.create({
    name: 'production-vpc',
    cidrBlock: '10.0.0.0/16',
    region: 'us-east-1',
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
      Environment: 'production',
      Team: 'platform'
    }
  });

  console.log('VPC created:', vpc.id);
  return vpc;
}
\`\`\`

## Subnets

### Creating Subnets

\`\`\`bash
# Create public subnet
bunker subnet create \\
  --vpc-id vpc-abc123 \\
  --name public-web \\
  --cidr 10.0.1.0/24 \\
  --availability-zone us-east-1a \\
  --map-public-ip-on-launch

# Create private subnet
bunker subnet create \\
  --vpc-id vpc-abc123 \\
  --name private-app \\
  --cidr 10.0.10.0/24 \\
  --availability-zone us-east-1a
\`\`\`

### Subnet Sizing Guide

| CIDR | Usable IPs | Recommended Use |
|------|------------|-----------------|
| /24 | 251 | Standard workloads |
| /25 | 123 | Small services |
| /26 | 59 | Microservices |
| /27 | 27 | Minimal deployments |
| /28 | 11 | Single-purpose |

**Note:** Bunker Cloud reserves 5 IPs in each subnet:
- .0 - Network address
- .1 - VPC router
- .2 - DNS server
- .3 - Future use
- .255 - Broadcast address

## Route Tables

Route tables control traffic flow within and outside your VPC.

### Default Route Table

Every VPC has a main route table with a local route:

| Destination | Target | Description |
|-------------|--------|-------------|
| 10.0.0.0/16 | local | VPC internal traffic |

### Custom Route Tables

\`\`\`bash
# Create route table
bunker route-table create \\
  --vpc-id vpc-abc123 \\
  --name public-routes

# Add internet gateway route
bunker route create \\
  --route-table-id rtb-12345 \\
  --destination 0.0.0.0/0 \\
  --gateway-id igw-67890

# Associate with subnet
bunker route-table associate \\
  --route-table-id rtb-12345 \\
  --subnet-id subnet-abcde
\`\`\`

### Route Priority

Routes are evaluated by most specific match (longest prefix):

\`\`\`
Destination     Target          Priority
10.0.1.0/24     local           1 (most specific)
10.0.0.0/16     local           2
0.0.0.0/0       igw-12345       3 (least specific)
\`\`\`

## Internet Gateway

An Internet Gateway enables communication between your VPC and the internet.

\`\`\`bash
# Create internet gateway
bunker igw create --name production-igw

# Attach to VPC
bunker igw attach \\
  --gateway-id igw-12345 \\
  --vpc-id vpc-abc123
\`\`\`

## NAT Gateway

NAT Gateways allow private subnet resources to access the internet while remaining private.

\`\`\`bash
# Allocate Elastic IP
bunker eip allocate --name nat-eip

# Create NAT Gateway in public subnet
bunker nat-gateway create \\
  --name production-nat \\
  --subnet-id subnet-public \\
  --eip-id eip-12345

# Add route in private subnet route table
bunker route create \\
  --route-table-id rtb-private \\
  --destination 0.0.0.0/0 \\
  --nat-gateway-id nat-67890
\`\`\`

### NAT Gateway Pricing

| Component | Price |
|-----------|-------|
| Per hour | $0.045 |
| Per GB processed | $0.045 |

**Cost optimization tip:** Use NAT Instances for development environments or low-throughput workloads.

## VPC Peering

Connect two VPCs to route traffic using private IP addresses.

### Creating a Peering Connection

\`\`\`bash
# Create peering request
bunker vpc peering create \\
  --vpc-id vpc-requester \\
  --peer-vpc-id vpc-accepter \\
  --peer-region us-west-2

# Accept peering request (if cross-account)
bunker vpc peering accept --peering-id pcx-12345

# Update route tables in both VPCs
bunker route create \\
  --route-table-id rtb-requester \\
  --destination 10.1.0.0/16 \\
  --peering-id pcx-12345

bunker route create \\
  --route-table-id rtb-accepter \\
  --destination 10.0.0.0/16 \\
  --peering-id pcx-12345
\`\`\`

### Peering Limitations

- No transitive peering (A↔B and B↔C doesn't mean A↔C)
- CIDR blocks cannot overlap
- Maximum 125 peering connections per VPC

## VPC Endpoints

Access Bunker Cloud services without traversing the public internet.

### Gateway Endpoints

Free endpoints for S3-compatible storage and other services:

\`\`\`bash
bunker vpc endpoint create \\
  --vpc-id vpc-abc123 \\
  --service bunker-storage \\
  --type gateway \\
  --route-table-ids rtb-12345,rtb-67890
\`\`\`

### Interface Endpoints

Private connectivity to any Bunker Cloud service:

\`\`\`bash
bunker vpc endpoint create \\
  --vpc-id vpc-abc123 \\
  --service bunker-databases \\
  --type interface \\
  --subnet-ids subnet-private-1,subnet-private-2 \\
  --security-group-ids sg-endpoint
\`\`\`

## Flow Logs

Capture information about IP traffic in your VPC.

\`\`\`bash
# Enable flow logs
bunker vpc flow-logs enable \\
  --vpc-id vpc-abc123 \\
  --destination cloud-logs \\
  --traffic-type all \\
  --log-format '\$\{version\} \$\{account-id\} \$\{interface-id\} \$\{srcaddr\} \$\{dstaddr\} \$\{srcport\} \$\{dstport\} \$\{protocol\} \$\{packets\} \$\{bytes\} \$\{start\} \$\{end\} \$\{action\} \$\{log-status\}'
\`\`\`

### Analyzing Flow Logs

\`\`\`sql
-- Find rejected traffic
SELECT srcaddr, dstaddr, dstport, count(*) as requests
FROM vpc_flow_logs
WHERE action = 'REJECT'
  AND start >= NOW() - INTERVAL '1 hour'
GROUP BY srcaddr, dstaddr, dstport
ORDER BY requests DESC
LIMIT 20;
\`\`\`

## Best Practices

### IP Address Planning

1. **Document your IP scheme** before creating resources
2. **Reserve space for growth** - Use /16 for production VPCs
3. **Avoid conflicts** with on-premises and peered networks
4. **Use consistent patterns** across environments

### High Availability

1. **Use multiple AZs** for all critical workloads
2. **Deploy NAT Gateways per AZ** to avoid cross-AZ charges
3. **Use redundant VPN connections** for on-premises connectivity

### Security

1. **Use private subnets** for databases and application servers
2. **Implement security groups** at instance level
3. **Use Network ACLs** for subnet-level filtering
4. **Enable flow logs** for troubleshooting and compliance
    `,
    codeExamples: [
      {
        title: 'Complete VPC Setup with Terraform',
        language: 'hcl',
        code: `# VPC
resource "bunker_vpc" "main" {
  name                 = "production-vpc"
  cidr_block          = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

# Internet Gateway
resource "bunker_internet_gateway" "main" {
  vpc_id = bunker_vpc.main.id
  name   = "production-igw"
}

# Public Subnets
resource "bunker_subnet" "public" {
  count                   = 3
  vpc_id                  = bunker_vpc.main.id
  cidr_block              = "10.0.\${count.index}.0/24"
  availability_zone       = data.bunker_azs.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "public-\${count.index + 1}"
    Type = "public"
  }
}

# Private Subnets
resource "bunker_subnet" "private" {
  count             = 3
  vpc_id            = bunker_vpc.main.id
  cidr_block        = "10.0.\${count.index + 10}.0/24"
  availability_zone = data.bunker_azs.available.names[count.index]

  tags = {
    Name = "private-\${count.index + 1}"
    Type = "private"
  }
}

# NAT Gateway
resource "bunker_eip" "nat" {
  vpc = true
}

resource "bunker_nat_gateway" "main" {
  allocation_id = bunker_eip.nat.id
  subnet_id     = bunker_subnet.public[0].id
}

# Route Tables
resource "bunker_route_table" "public" {
  vpc_id = bunker_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = bunker_internet_gateway.main.id
  }
}

resource "bunker_route_table" "private" {
  vpc_id = bunker_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = bunker_nat_gateway.main.id
  }
}`
      }
    ],
    relatedDocs: ['subnets', 'firewalls', 'private-networking', 'networking-overview']
  },

  'subnets': {
    id: 'subnets',
    title: 'Subnets & IP Addresses',
    description: 'Configure subnets, IP addressing, and network segmentation',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Subnets & IP Addresses

Subnets are subdivisions of your VPC that allow you to segment your network and control traffic flow between different parts of your infrastructure.

## Subnet Types

### Public Subnets

Resources in public subnets can communicate directly with the internet:

- Have a route to an Internet Gateway
- Can be assigned public IP addresses
- Ideal for: Load balancers, bastion hosts, NAT gateways

\`\`\`bash
bunker subnet create \\
  --vpc-id vpc-abc123 \\
  --name web-tier \\
  --cidr 10.0.1.0/24 \\
  --availability-zone us-east-1a \\
  --map-public-ip-on-launch \\
  --type public
\`\`\`

### Private Subnets

Resources in private subnets cannot be directly accessed from the internet:

- No direct route to Internet Gateway
- Outbound internet access via NAT Gateway
- Ideal for: Application servers, databases, internal services

\`\`\`bash
bunker subnet create \\
  --vpc-id vpc-abc123 \\
  --name app-tier \\
  --cidr 10.0.10.0/24 \\
  --availability-zone us-east-1a \\
  --type private
\`\`\`

### Isolated Subnets

Complete network isolation with no internet connectivity:

- No routes to Internet or NAT Gateway
- Can only communicate within VPC
- Ideal for: Sensitive databases, compliance workloads

\`\`\`bash
bunker subnet create \\
  --vpc-id vpc-abc123 \\
  --name database-tier \\
  --cidr 10.0.100.0/24 \\
  --availability-zone us-east-1a \\
  --type isolated
\`\`\`

## IP Address Management

### CIDR Block Planning

Plan your CIDR blocks to accommodate growth and avoid conflicts:

\`\`\`
Production VPC: 10.0.0.0/16 (65,536 IPs)
├── Public Subnets: 10.0.0.0/20 (4,096 IPs)
│   ├── us-east-1a: 10.0.0.0/24 (256 IPs)
│   ├── us-east-1b: 10.0.1.0/24 (256 IPs)
│   └── us-east-1c: 10.0.2.0/24 (256 IPs)
│
├── Private Subnets: 10.0.16.0/20 (4,096 IPs)
│   ├── us-east-1a: 10.0.16.0/24 (256 IPs)
│   ├── us-east-1b: 10.0.17.0/24 (256 IPs)
│   └── us-east-1c: 10.0.18.0/24 (256 IPs)
│
├── Database Subnets: 10.0.32.0/20 (4,096 IPs)
│   ├── us-east-1a: 10.0.32.0/24 (256 IPs)
│   ├── us-east-1b: 10.0.33.0/24 (256 IPs)
│   └── us-east-1c: 10.0.34.0/24 (256 IPs)
│
└── Reserved: 10.0.48.0/20 (4,096 IPs for future use)
\`\`\`

### Elastic IP Addresses

Static public IP addresses that can be assigned to resources:

\`\`\`bash
# Allocate Elastic IP
bunker eip allocate \\
  --name production-ip \\
  --region us-east-1

# Associate with instance
bunker eip associate \\
  --eip-id eip-12345 \\
  --instance-id i-67890

# List Elastic IPs
bunker eip list
\`\`\`

### IP Address Pricing

| Resource | Price |
|----------|-------|
| Elastic IP (attached) | Free |
| Elastic IP (unattached) | $0.005/hour |
| Public IPv4 per instance | $0.005/hour |
| IPv6 addresses | Free |

### Secondary CIDR Blocks

Extend your VPC with additional CIDR blocks:

\`\`\`bash
# Add secondary CIDR
bunker vpc cidr add \\
  --vpc-id vpc-abc123 \\
  --cidr 10.1.0.0/16

# Create subnet in new CIDR range
bunker subnet create \\
  --vpc-id vpc-abc123 \\
  --name expansion-subnet \\
  --cidr 10.1.0.0/24
\`\`\`

## IPv6 Support

Enable IPv6 for dual-stack networking:

\`\`\`bash
# Enable IPv6 on VPC
bunker vpc modify \\
  --vpc-id vpc-abc123 \\
  --assign-ipv6-cidr

# Enable IPv6 on subnet
bunker subnet modify \\
  --subnet-id subnet-12345 \\
  --assign-ipv6-cidr \\
  --map-ipv6-on-launch
\`\`\`

### IPv6 CIDR Allocation

| Level | CIDR Size | Example |
|-------|-----------|---------|
| VPC | /56 | 2600:1f18:abc::/56 |
| Subnet | /64 | 2600:1f18:abc:1::/64 |

## Network Interfaces

### Elastic Network Interfaces (ENI)

Virtual network cards that can be attached to instances:

\`\`\`bash
# Create ENI
bunker eni create \\
  --subnet-id subnet-12345 \\
  --security-group-ids sg-web \\
  --description "Web server interface"

# Attach to instance
bunker eni attach \\
  --eni-id eni-67890 \\
  --instance-id i-abcde \\
  --device-index 1
\`\`\`

### ENI Features

- **Multiple IPs** - Assign multiple private IPs to an ENI
- **Secondary ENIs** - Add additional network interfaces to instances
- **Preserve IP** - Keep IP addresses when replacing instances
- **Traffic Mirroring** - Copy network traffic for analysis

### Multiple IP Addresses

Assign secondary private IPs for hosting multiple services:

\`\`\`bash
# Assign secondary IP
bunker eni ip assign \\
  --eni-id eni-12345 \\
  --private-ip 10.0.1.100

# Assign multiple IPs
bunker eni ip assign \\
  --eni-id eni-12345 \\
  --secondary-ip-count 5
\`\`\`

## Subnet Groups

Group subnets for managed services:

### Database Subnet Groups

\`\`\`bash
bunker db subnet-group create \\
  --name production-db-subnets \\
  --description "Database subnets across AZs" \\
  --subnet-ids subnet-db-1a,subnet-db-1b,subnet-db-1c
\`\`\`

### Cache Subnet Groups

\`\`\`bash
bunker cache subnet-group create \\
  --name production-cache-subnets \\
  --subnet-ids subnet-cache-1a,subnet-cache-1b
\`\`\`

## IP Address Conflicts

### Detecting Conflicts

\`\`\`bash
# Check for CIDR conflicts
bunker vpc cidr check \\
  --cidr 10.0.0.0/16 \\
  --check-peering \\
  --check-vpn

# List all CIDR allocations
bunker vpc cidr list --vpc-id vpc-abc123
\`\`\`

### Resolving Conflicts

If you have overlapping CIDRs:

1. **VPC Peering** - Cannot peer VPCs with overlapping CIDRs
2. **VPN** - Use NAT to translate addresses
3. **Migration** - Create new VPC with non-overlapping CIDR

## Best Practices

### Subnet Design

1. **Use /24 subnets** for most workloads (251 usable IPs)
2. **Plan for growth** - Reserve unused CIDR space
3. **Separate tiers** - Use different subnets for web, app, and data
4. **Multi-AZ** - Create subnets in at least 2 availability zones

### IP Conservation

1. **Right-size subnets** - Don't allocate more IPs than needed
2. **Use private IPs** - Only use public IPs when necessary
3. **Release unused EIPs** - Unattached Elastic IPs incur charges
4. **Consider IPv6** - Use IPv6 for client-facing services

### Documentation

Maintain an IP address management (IPAM) document:

\`\`\`yaml
# ipam.yaml
vpcs:
  production:
    cidr: 10.0.0.0/16
    region: us-east-1
    subnets:
      - name: public-1a
        cidr: 10.0.1.0/24
        az: us-east-1a
        type: public
      - name: private-1a
        cidr: 10.0.10.0/24
        az: us-east-1a
        type: private
    reserved:
      - 10.0.200.0/24  # Future services
      - 10.0.201.0/24  # VPN clients
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Subnet Management with SDK',
        language: 'python',
        code: `import bunkercloud

client = bunkercloud.Client()

# Create multi-AZ subnet architecture
def create_subnet_architecture(vpc_id: str, azs: list[str]):
    subnets = {
        'public': [],
        'private': [],
        'database': []
    }

    for i, az in enumerate(azs):
        # Public subnet
        public = client.networking.subnets.create(
            vpc_id=vpc_id,
            name=f'public-{az[-2:]}',
            cidr_block=f'10.0.{i}.0/24',
            availability_zone=az,
            map_public_ip_on_launch=True,
            tags={'Tier': 'public'}
        )
        subnets['public'].append(public)

        # Private subnet
        private = client.networking.subnets.create(
            vpc_id=vpc_id,
            name=f'private-{az[-2:]}',
            cidr_block=f'10.0.{i + 10}.0/24',
            availability_zone=az,
            tags={'Tier': 'private'}
        )
        subnets['private'].append(private)

        # Database subnet
        database = client.networking.subnets.create(
            vpc_id=vpc_id,
            name=f'database-{az[-2:]}',
            cidr_block=f'10.0.{i + 20}.0/24',
            availability_zone=az,
            tags={'Tier': 'database'}
        )
        subnets['database'].append(database)

    return subnets

# Create database subnet group
def create_db_subnet_group(subnets: list):
    return client.databases.subnet_groups.create(
        name='production-db-subnets',
        description='Database subnets for production',
        subnet_ids=[s.id for s in subnets]
    )`
      }
    ],
    relatedDocs: ['vpc', 'firewalls', 'private-networking']
  },

  'firewalls': {
    id: 'firewalls',
    title: 'Firewalls & Security Groups',
    description: 'Configure network security with firewalls and security groups',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '15 min',
    content: `
# Firewalls & Security Groups

Bunker Cloud provides multiple layers of network security through Security Groups and Network ACLs, giving you fine-grained control over traffic to and from your resources.

## Security Groups

Security Groups act as virtual firewalls at the instance level, controlling inbound and outbound traffic.

### Key Characteristics

| Feature | Behavior |
|---------|----------|
| **Level** | Instance/ENI level |
| **State** | Stateful (return traffic auto-allowed) |
| **Rules** | Allow rules only (implicit deny) |
| **Evaluation** | All rules evaluated |
| **Default** | Deny all inbound, allow all outbound |

### Creating Security Groups

\`\`\`bash
# Create security group
bunker sg create \\
  --vpc-id vpc-abc123 \\
  --name web-servers \\
  --description "Security group for web servers"

# Add inbound rules
bunker sg rule add \\
  --sg-id sg-12345 \\
  --direction inbound \\
  --protocol tcp \\
  --port 443 \\
  --source 0.0.0.0/0 \\
  --description "HTTPS from anywhere"

bunker sg rule add \\
  --sg-id sg-12345 \\
  --direction inbound \\
  --protocol tcp \\
  --port 80 \\
  --source 0.0.0.0/0 \\
  --description "HTTP from anywhere"
\`\`\`

### Common Security Group Patterns

#### Web Server

\`\`\`yaml
name: web-servers
inbound:
  - protocol: tcp
    port: 80
    source: 0.0.0.0/0
    description: HTTP
  - protocol: tcp
    port: 443
    source: 0.0.0.0/0
    description: HTTPS
outbound:
  - protocol: all
    destination: 0.0.0.0/0
\`\`\`

#### Application Server

\`\`\`yaml
name: app-servers
inbound:
  - protocol: tcp
    port: 8080
    source: sg-web-servers  # Reference other SG
    description: From web tier
  - protocol: tcp
    port: 22
    source: sg-bastion
    description: SSH from bastion
outbound:
  - protocol: tcp
    port: 5432
    destination: sg-databases
    description: PostgreSQL
  - protocol: tcp
    port: 443
    destination: 0.0.0.0/0
    description: HTTPS outbound
\`\`\`

#### Database Server

\`\`\`yaml
name: databases
inbound:
  - protocol: tcp
    port: 5432
    source: sg-app-servers
    description: PostgreSQL from app tier
  - protocol: tcp
    port: 5432
    source: 10.0.0.0/8
    description: PostgreSQL from VPN
outbound:
  - protocol: tcp
    port: 443
    destination: pl-bunker-services  # Prefix list
    description: Bunker Cloud services
\`\`\`

### Security Group References

Reference other security groups instead of IP addresses:

\`\`\`bash
# Allow traffic from another security group
bunker sg rule add \\
  --sg-id sg-database \\
  --direction inbound \\
  --protocol tcp \\
  --port 5432 \\
  --source-sg sg-app-servers \\
  --description "PostgreSQL from app servers"
\`\`\`

Benefits:
- Rules automatically apply to new instances
- No need to update IPs when scaling
- Self-referencing for cluster communication

## Network ACLs

Network ACLs provide stateless, subnet-level traffic filtering.

### Key Characteristics

| Feature | Behavior |
|---------|----------|
| **Level** | Subnet level |
| **State** | Stateless (must allow return traffic) |
| **Rules** | Allow and deny rules |
| **Evaluation** | Rules evaluated in order |
| **Default** | Allow all traffic |

### Creating Network ACLs

\`\`\`bash
# Create NACL
bunker nacl create \\
  --vpc-id vpc-abc123 \\
  --name public-nacl

# Add inbound rules (evaluated in order)
bunker nacl rule add \\
  --nacl-id nacl-12345 \\
  --direction inbound \\
  --rule-number 100 \\
  --protocol tcp \\
  --port 443 \\
  --source 0.0.0.0/0 \\
  --action allow

bunker nacl rule add \\
  --nacl-id nacl-12345 \\
  --direction inbound \\
  --rule-number 200 \\
  --protocol tcp \\
  --port-range 1024-65535 \\
  --source 0.0.0.0/0 \\
  --action allow \\
  --description "Ephemeral ports for return traffic"

# Deny specific IP range
bunker nacl rule add \\
  --nacl-id nacl-12345 \\
  --direction inbound \\
  --rule-number 50 \\
  --protocol all \\
  --source 203.0.113.0/24 \\
  --action deny \\
  --description "Block known bad actors"

# Associate with subnet
bunker nacl associate \\
  --nacl-id nacl-12345 \\
  --subnet-id subnet-public-1a
\`\`\`

### NACL Rule Numbering

Rules are evaluated in ascending order. Best practices:

\`\`\`
Rule #  Purpose
------  -------
50      Explicit denies (blocked IPs/ranges)
100     HTTPS inbound
110     HTTP inbound
120     SSH from admin range
200     Ephemeral ports (return traffic)
*       Implicit deny all (default)
\`\`\`

## Security Groups vs Network ACLs

| Aspect | Security Groups | Network ACLs |
|--------|-----------------|--------------|
| Level | Instance | Subnet |
| State | Stateful | Stateless |
| Rule Type | Allow only | Allow & Deny |
| Evaluation | All rules | First match |
| Use Case | Application-level | Subnet-level defense |

### When to Use Each

**Security Groups:**
- Primary firewall mechanism
- Application-specific rules
- Reference-based rules between tiers

**Network ACLs:**
- Block known malicious IPs
- Additional subnet-level defense
- Compliance requirements

## Prefix Lists

Managed lists of CIDR blocks for use in security rules:

\`\`\`bash
# Create prefix list
bunker prefix-list create \\
  --name office-networks \\
  --entries "192.168.1.0/24,10.100.0.0/16,172.16.0.0/12" \\
  --max-entries 20

# Use in security group
bunker sg rule add \\
  --sg-id sg-12345 \\
  --direction inbound \\
  --protocol tcp \\
  --port 22 \\
  --source-prefix-list pl-office-networks
\`\`\`

### Bunker-Managed Prefix Lists

| Prefix List | Description |
|-------------|-------------|
| pl-bunker-services | Bunker Cloud service IPs |
| pl-bunker-cdn | CDN edge locations |
| pl-bunker-monitoring | Monitoring service IPs |

## Web Application Firewall (WAF)

Protect web applications from common exploits:

\`\`\`bash
# Create WAF
bunker waf create \\
  --name production-waf \\
  --scope regional

# Add managed rule set
bunker waf rule-group add \\
  --waf-id waf-12345 \\
  --managed-rule-group bunker-common-vulnerabilities

# Associate with load balancer
bunker waf associate \\
  --waf-id waf-12345 \\
  --resource-arn arn:bunker:alb:us-east-1:123456:lb/production
\`\`\`

### WAF Rule Types

| Rule Type | Protection |
|-----------|------------|
| **SQL Injection** | SQLi attack patterns |
| **XSS** | Cross-site scripting |
| **Rate Limiting** | DDoS and brute force |
| **Geo Blocking** | Block by country |
| **IP Reputation** | Known bad actors |
| **Bot Control** | Malicious bots |

## Security Monitoring

### Flow Log Analysis

\`\`\`bash
# Enable VPC flow logs
bunker vpc flow-logs enable \\
  --vpc-id vpc-abc123 \\
  --destination bunker-logs \\
  --traffic-type all

# Query rejected traffic
bunker logs query \\
  --log-group vpc-flow-logs \\
  --query "fields @timestamp, srcAddr, dstAddr, dstPort
           | filter action = 'REJECT'
           | stats count() by srcAddr, dstPort
           | sort count desc
           | limit 20"
\`\`\`

### Security Group Analysis

\`\`\`bash
# Analyze security group rules
bunker sg analyze \\
  --sg-id sg-12345 \\
  --check-open-ports \\
  --check-unrestricted-access

# Find unused security groups
bunker sg list --unused
\`\`\`

## Best Practices

### Principle of Least Privilege

1. **Start restrictive** - Begin with deny-all, add rules as needed
2. **Specific sources** - Avoid 0.0.0.0/0 where possible
3. **Port specificity** - Don't open port ranges unnecessarily
4. **Regular audits** - Review and remove unused rules

### Defense in Depth

1. **Multiple layers** - Use both Security Groups and NACLs
2. **Tier separation** - Different rules for web, app, and data tiers
3. **WAF for web apps** - Add application-layer protection
4. **Monitoring** - Enable flow logs and alerts

### Naming Conventions

\`\`\`
sg-{environment}-{tier}-{service}
Examples:
- sg-prod-web-nginx
- sg-prod-app-api
- sg-prod-data-postgres
- sg-shared-bastion
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Security Group Management',
        language: 'python',
        code: `import bunkercloud

client = bunkercloud.Client()

def create_three_tier_security_groups(vpc_id: str):
    """Create security groups for a three-tier architecture."""

    # Web tier - public facing
    web_sg = client.networking.security_groups.create(
        vpc_id=vpc_id,
        name='web-tier',
        description='Web servers - public facing'
    )

    # App tier - internal
    app_sg = client.networking.security_groups.create(
        vpc_id=vpc_id,
        name='app-tier',
        description='Application servers - internal'
    )

    # Data tier - restricted
    data_sg = client.networking.security_groups.create(
        vpc_id=vpc_id,
        name='data-tier',
        description='Database servers - restricted'
    )

    # Web tier rules
    client.networking.security_groups.add_rule(
        security_group_id=web_sg.id,
        direction='inbound',
        protocol='tcp',
        port=443,
        source='0.0.0.0/0',
        description='HTTPS from internet'
    )

    # App tier rules - allow from web tier
    client.networking.security_groups.add_rule(
        security_group_id=app_sg.id,
        direction='inbound',
        protocol='tcp',
        port=8080,
        source_security_group_id=web_sg.id,
        description='From web tier'
    )

    # Data tier rules - allow from app tier only
    client.networking.security_groups.add_rule(
        security_group_id=data_sg.id,
        direction='inbound',
        protocol='tcp',
        port=5432,
        source_security_group_id=app_sg.id,
        description='PostgreSQL from app tier'
    )

    return {
        'web': web_sg,
        'app': app_sg,
        'data': data_sg
    }`
      }
    ],
    relatedDocs: ['vpc', 'security-overview', 'networking-overview']
  },

  'load-balancers-network': {
    id: 'load-balancers-network',
    title: 'Load Balancers',
    description: 'Distribute traffic with application and network load balancers',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '15 min',
    content: `
# Load Balancers

Bunker Cloud offers multiple load balancer types to distribute incoming traffic across your resources, improving availability and fault tolerance.

## Load Balancer Types

| Type | Layer | Use Case | Protocol Support |
|------|-------|----------|-----------------|
| **Application (ALB)** | 7 | HTTP/HTTPS apps | HTTP, HTTPS, WebSocket |
| **Network (NLB)** | 4 | High-performance TCP/UDP | TCP, UDP, TLS |
| **Gateway (GLB)** | 3 | Virtual appliances | IP-based |

## Application Load Balancer (ALB)

### Overview

ALB operates at Layer 7 (application layer), providing advanced routing based on content:

\`\`\`
                    ┌─────────────────┐
   Users ──────────►│       ALB       │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
  ┌──────────┐        ┌──────────┐        ┌──────────┐
  │ /api/*   │        │ /static  │        │ /ws      │
  │ API Pool │        │ CDN/S3   │        │ WebSocket│
  └──────────┘        └──────────┘        └──────────┘
\`\`\`

### Creating an ALB

\`\`\`bash
# Create Application Load Balancer
bunker lb create \\
  --type application \\
  --name production-alb \\
  --scheme internet-facing \\
  --subnets subnet-public-1a,subnet-public-1b,subnet-public-1c \\
  --security-groups sg-alb

# Create target group
bunker lb target-group create \\
  --name api-targets \\
  --protocol HTTP \\
  --port 8080 \\
  --vpc-id vpc-abc123 \\
  --health-check-path /health \\
  --health-check-interval 30

# Register targets
bunker lb target-group register \\
  --target-group-arn arn:bunker:tg:api-targets \\
  --targets i-app1:8080,i-app2:8080,i-app3:8080

# Create listener with SSL
bunker lb listener create \\
  --load-balancer-arn arn:bunker:lb:production-alb \\
  --protocol HTTPS \\
  --port 443 \\
  --certificate-arn arn:bunker:cert:example.com \\
  --default-action type=forward,target-group-arn=arn:bunker:tg:api-targets
\`\`\`

### Path-Based Routing

Route requests based on URL path:

\`\`\`bash
# Add rule for API routes
bunker lb rule create \\
  --listener-arn arn:bunker:listener:https-443 \\
  --priority 10 \\
  --conditions "path-pattern=/api/*" \\
  --actions "type=forward,target-group-arn=arn:bunker:tg:api-targets"

# Add rule for static content
bunker lb rule create \\
  --listener-arn arn:bunker:listener:https-443 \\
  --priority 20 \\
  --conditions "path-pattern=/static/*" \\
  --actions "type=redirect,redirect-config={Host=cdn.example.com,Protocol=HTTPS,StatusCode=HTTP_301}"

# Add rule for WebSocket
bunker lb rule create \\
  --listener-arn arn:bunker:listener:https-443 \\
  --priority 30 \\
  --conditions "path-pattern=/ws/*" \\
  --actions "type=forward,target-group-arn=arn:bunker:tg:websocket-targets"
\`\`\`

### Host-Based Routing

Route based on hostname:

\`\`\`bash
# Route api.example.com to API targets
bunker lb rule create \\
  --listener-arn arn:bunker:listener:https-443 \\
  --priority 10 \\
  --conditions "host-header=api.example.com" \\
  --actions "type=forward,target-group-arn=arn:bunker:tg:api-targets"

# Route admin.example.com to admin targets
bunker lb rule create \\
  --listener-arn arn:bunker:listener:https-443 \\
  --priority 20 \\
  --conditions "host-header=admin.example.com" \\
  --actions "type=forward,target-group-arn=arn:bunker:tg:admin-targets"
\`\`\`

### Sticky Sessions

Maintain session affinity:

\`\`\`bash
bunker lb target-group modify \\
  --target-group-arn arn:bunker:tg:api-targets \\
  --stickiness enabled=true,type=lb_cookie,duration=3600
\`\`\`

## Network Load Balancer (NLB)

### Overview

NLB operates at Layer 4, providing ultra-high performance and low latency:

- Millions of requests per second
- Ultra-low latency
- Static IP addresses
- Preserves source IP

### Creating an NLB

\`\`\`bash
# Create Network Load Balancer
bunker lb create \\
  --type network \\
  --name production-nlb \\
  --scheme internet-facing \\
  --subnets subnet-public-1a,subnet-public-1b

# Create TCP target group
bunker lb target-group create \\
  --name tcp-targets \\
  --protocol TCP \\
  --port 9000 \\
  --vpc-id vpc-abc123 \\
  --health-check-protocol TCP

# Create listener
bunker lb listener create \\
  --load-balancer-arn arn:bunker:lb:production-nlb \\
  --protocol TCP \\
  --port 9000 \\
  --default-action type=forward,target-group-arn=arn:bunker:tg:tcp-targets
\`\`\`

### TLS Termination at NLB

\`\`\`bash
bunker lb listener create \\
  --load-balancer-arn arn:bunker:lb:production-nlb \\
  --protocol TLS \\
  --port 443 \\
  --certificate-arn arn:bunker:cert:example.com \\
  --default-action type=forward,target-group-arn=arn:bunker:tg:tcp-targets
\`\`\`

### Static IP Addresses

Allocate static IPs for NLB:

\`\`\`bash
# Create NLB with Elastic IPs
bunker lb create \\
  --type network \\
  --name static-nlb \\
  --subnet-mappings "[
    {SubnetId=subnet-1a,AllocationId=eip-111},
    {SubnetId=subnet-1b,AllocationId=eip-222}
  ]"
\`\`\`

## Health Checks

### ALB Health Checks

\`\`\`bash
bunker lb target-group modify \\
  --target-group-arn arn:bunker:tg:api-targets \\
  --health-check-protocol HTTP \\
  --health-check-path /health \\
  --health-check-port 8080 \\
  --health-check-interval 30 \\
  --health-check-timeout 5 \\
  --healthy-threshold 2 \\
  --unhealthy-threshold 3 \\
  --success-codes 200-299
\`\`\`

### NLB Health Checks

\`\`\`bash
bunker lb target-group modify \\
  --target-group-arn arn:bunker:tg:tcp-targets \\
  --health-check-protocol TCP \\
  --health-check-port 9000 \\
  --health-check-interval 10 \\
  --healthy-threshold 2 \\
  --unhealthy-threshold 2
\`\`\`

### Health Check Strategies

| Strategy | Use Case |
|----------|----------|
| **TCP** | Basic connectivity check |
| **HTTP** | Application health endpoint |
| **HTTPS** | Secure health endpoint |
| **Custom** | Complex health logic |

## SSL/TLS Configuration

### Certificate Management

\`\`\`bash
# Upload certificate
bunker certificate import \\
  --certificate-body file://cert.pem \\
  --private-key file://key.pem \\
  --certificate-chain file://chain.pem

# Or use managed certificates
bunker certificate request \\
  --domain example.com \\
  --validation-method DNS
\`\`\`

### SSL Policy

\`\`\`bash
# Configure TLS policy
bunker lb listener modify \\
  --listener-arn arn:bunker:listener:https-443 \\
  --ssl-policy BunkerTLS13-1-2-2022-01
\`\`\`

| Policy | Min TLS | Ciphers |
|--------|---------|---------|
| BunkerTLS13-1-2-2022-01 | TLS 1.2 | Modern ciphers |
| BunkerTLS12-1-2-2022-01 | TLS 1.2 | Broad compatibility |
| BunkerTLS10-2016-08 | TLS 1.0 | Legacy support |

## Advanced Features

### Connection Draining

\`\`\`bash
bunker lb target-group modify \\
  --target-group-arn arn:bunker:tg:api-targets \\
  --deregistration-delay 300
\`\`\`

### Cross-Zone Load Balancing

\`\`\`bash
bunker lb modify \\
  --load-balancer-arn arn:bunker:lb:production-alb \\
  --cross-zone-load-balancing enabled
\`\`\`

### Access Logs

\`\`\`bash
bunker lb modify \\
  --load-balancer-arn arn:bunker:lb:production-alb \\
  --access-logs "bucket=logs-bucket,prefix=alb/,enabled=true"
\`\`\`

### WAF Integration

\`\`\`bash
bunker waf associate \\
  --web-acl-arn arn:bunker:waf:production \\
  --resource-arn arn:bunker:lb:production-alb
\`\`\`

## Pricing

### Application Load Balancer

| Component | Price |
|-----------|-------|
| Per hour | $0.0225 |
| Per LCU-hour | $0.008 |

*LCU = Load Balancer Capacity Unit (based on connections, bandwidth, rules)*

### Network Load Balancer

| Component | Price |
|-----------|-------|
| Per hour | $0.0225 |
| Per NLCU-hour | $0.006 |

## Best Practices

1. **Use ALB for HTTP/HTTPS** - Better routing, WebSocket support
2. **Use NLB for TCP/UDP** - Lower latency, static IPs
3. **Enable access logs** - Troubleshooting and compliance
4. **Configure proper health checks** - Match application behavior
5. **Use connection draining** - Graceful instance removal
6. **Distribute across AZs** - High availability
    `,
    codeExamples: [
      {
        title: 'ALB with Path-Based Routing',
        language: 'hcl',
        code: `resource "bunker_lb" "main" {
  name               = "production-alb"
  type               = "application"
  scheme             = "internet-facing"
  security_group_ids = [bunker_security_group.alb.id]
  subnet_ids         = bunker_subnet.public[*].id
}

resource "bunker_lb_target_group" "api" {
  name     = "api-targets"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = bunker_vpc.main.id

  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

resource "bunker_lb_listener" "https" {
  load_balancer_arn = bunker_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = bunker_certificate.main.arn
  ssl_policy        = "BunkerTLS13-1-2-2022-01"

  default_action {
    type             = "forward"
    target_group_arn = bunker_lb_target_group.api.arn
  }
}

resource "bunker_lb_listener_rule" "static" {
  listener_arn = bunker_lb_listener.https.arn
  priority     = 10

  condition {
    path_pattern {
      values = ["/static/*"]
    }
  }

  action {
    type = "redirect"
    redirect {
      host        = "cdn.example.com"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}`
      }
    ],
    relatedDocs: ['networking-overview', 'ssl-certificates', 'auto-scaling']
  },

  'cdn': {
    id: 'cdn',
    title: 'Content Delivery Network',
    description: 'Accelerate content delivery with global edge caching',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Content Delivery Network (CDN)

Bunker Cloud CDN accelerates your content delivery by caching assets at edge locations worldwide, reducing latency and improving user experience.

## CDN Overview

\`\`\`
                    ┌─────────────────────────────────────┐
                    │        Bunker Cloud CDN             │
                    │         200+ Edge Locations         │
                    └─────────────────────────────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
   ┌────▼────┐                 ┌────▼────┐                 ┌────▼────┐
   │ Americas │                 │  Europe  │                 │   Asia   │
   │ 50+ PoPs │                 │ 60+ PoPs │                 │ 90+ PoPs │
   └──────────┘                 └──────────┘                 └──────────┘
\`\`\`

### Key Features

| Feature | Description |
|---------|-------------|
| **Global Edge Network** | 200+ points of presence |
| **SSL/TLS** | Free certificates, HTTP/2, HTTP/3 |
| **DDoS Protection** | Built-in L3/L4/L7 protection |
| **Real-time Analytics** | Detailed traffic insights |
| **Edge Computing** | Run code at the edge |
| **WebSocket Support** | Real-time connections |

## Creating a Distribution

### Basic Setup

\`\`\`bash
# Create CDN distribution
bunker cdn create \\
  --name my-website \\
  --origin-domain origin.example.com \\
  --default-ttl 86400

# Output:
# Distribution created
# ID: cdn-abc123
# Domain: d123abc.bunkercdn.net
# Status: Deploying
\`\`\`

### With Custom Domain

\`\`\`bash
bunker cdn create \\
  --name my-website \\
  --origin-domain origin.example.com \\
  --aliases cdn.example.com,static.example.com \\
  --certificate-arn arn:bunker:cert:example.com \\
  --default-ttl 86400
\`\`\`

## Origin Configuration

### Single Origin

\`\`\`bash
bunker cdn origin add \\
  --distribution-id cdn-abc123 \\
  --origin-id main \\
  --domain origin.example.com \\
  --protocol https \\
  --port 443
\`\`\`

### Multiple Origins with Path Routing

\`\`\`bash
# Add API origin
bunker cdn origin add \\
  --distribution-id cdn-abc123 \\
  --origin-id api \\
  --domain api.example.com \\
  --protocol https

# Add S3 origin for static files
bunker cdn origin add \\
  --distribution-id cdn-abc123 \\
  --origin-id static \\
  --domain bucket.fortress.bunkercloud.com \\
  --protocol https

# Create behavior for /api/*
bunker cdn behavior create \\
  --distribution-id cdn-abc123 \\
  --path-pattern "/api/*" \\
  --origin-id api \\
  --cache-policy no-cache \\
  --allowed-methods GET,HEAD,POST,PUT,DELETE

# Create behavior for /static/*
bunker cdn behavior create \\
  --distribution-id cdn-abc123 \\
  --path-pattern "/static/*" \\
  --origin-id static \\
  --cache-policy optimized-static
\`\`\`

### Origin Shield

Add an additional caching layer to reduce origin load:

\`\`\`bash
bunker cdn origin modify \\
  --distribution-id cdn-abc123 \\
  --origin-id main \\
  --origin-shield enabled \\
  --origin-shield-region us-east-1
\`\`\`

## Cache Configuration

### Cache Behaviors

\`\`\`bash
# Static assets - long TTL
bunker cdn behavior create \\
  --distribution-id cdn-abc123 \\
  --path-pattern "*.js,*.css,*.jpg,*.png" \\
  --cache-policy static-assets \\
  --compress true

# API responses - no cache
bunker cdn behavior create \\
  --distribution-id cdn-abc123 \\
  --path-pattern "/api/*" \\
  --cache-policy no-cache \\
  --origin-request-policy all-viewer-headers
\`\`\`

### Cache Policies

| Policy | TTL | Use Case |
|--------|-----|----------|
| **Optimized** | 24 hours | General content |
| **Static Assets** | 1 year | Versioned static files |
| **No Cache** | 0 | Dynamic API responses |
| **Short TTL** | 1 hour | Semi-dynamic content |

### Custom Cache Policy

\`\`\`bash
bunker cdn cache-policy create \\
  --name custom-policy \\
  --default-ttl 3600 \\
  --max-ttl 86400 \\
  --min-ttl 60 \\
  --cache-keys "headers=Authorization,query-strings=page,id"
\`\`\`

### Cache Invalidation

\`\`\`bash
# Invalidate specific paths
bunker cdn invalidate \\
  --distribution-id cdn-abc123 \\
  --paths "/images/*" "/index.html"

# Invalidate everything
bunker cdn invalidate \\
  --distribution-id cdn-abc123 \\
  --paths "/*"
\`\`\`

## Security

### SSL/TLS

\`\`\`bash
# Use managed certificate
bunker cdn modify \\
  --distribution-id cdn-abc123 \\
  --certificate-arn arn:bunker:cert:example.com \\
  --minimum-protocol-version TLSv1.2_2021 \\
  --ssl-support-method sni-only
\`\`\`

### Security Headers

\`\`\`bash
bunker cdn security-headers set \\
  --distribution-id cdn-abc123 \\
  --headers '{
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src https:"
  }'
\`\`\`

### Geo Restrictions

\`\`\`bash
# Allow only specific countries
bunker cdn geo-restriction set \\
  --distribution-id cdn-abc123 \\
  --restriction-type whitelist \\
  --countries US,CA,GB,DE,FR

# Block specific countries
bunker cdn geo-restriction set \\
  --distribution-id cdn-abc123 \\
  --restriction-type blacklist \\
  --countries XX,YY
\`\`\`

### WAF Integration

\`\`\`bash
bunker waf associate \\
  --web-acl-arn arn:bunker:waf:cdn-protection \\
  --resource-arn arn:bunker:cdn:cdn-abc123
\`\`\`

## Edge Functions

Run serverless code at CDN edge locations:

### Request Handler

\`\`\`javascript
// edge-function.js
export async function handler(event) {
  const request = event.request;

  // Add custom header
  request.headers['x-custom-header'] = { value: 'my-value' };

  // URL rewriting
  if (request.uri === '/') {
    request.uri = '/index.html';
  }

  // A/B testing
  const variant = Math.random() < 0.5 ? 'a' : 'b';
  request.headers['x-variant'] = { value: variant };

  return request;
}
\`\`\`

### Deploy Edge Function

\`\`\`bash
bunker cdn function create \\
  --name url-rewriter \\
  --runtime cloudflare-workers \\
  --code file://edge-function.js

bunker cdn function associate \\
  --distribution-id cdn-abc123 \\
  --function-arn arn:bunker:function:url-rewriter \\
  --event-type viewer-request
\`\`\`

## Real-time Analytics

### Built-in Metrics

\`\`\`bash
# View traffic statistics
bunker cdn stats \\
  --distribution-id cdn-abc123 \\
  --start-time "2024-01-01T00:00:00Z" \\
  --end-time "2024-01-02T00:00:00Z" \\
  --metrics requests,bytes,cache-hit-rate
\`\`\`

### Access Logs

\`\`\`bash
bunker cdn logging enable \\
  --distribution-id cdn-abc123 \\
  --bucket logs-bucket \\
  --prefix cdn-logs/ \\
  --include-cookies true
\`\`\`

## Pricing

| Component | Price |
|-----------|-------|
| **Data Transfer Out** | |
| First 10 TB | $0.085/GB |
| Next 40 TB | $0.080/GB |
| Next 100 TB | $0.060/GB |
| **HTTP Requests** | $0.0075/10,000 |
| **HTTPS Requests** | $0.010/10,000 |
| **Invalidations** | First 1,000/month free |
| **Edge Functions** | $0.10/million invocations |

## Best Practices

1. **Version static assets** - Use hashed filenames for long cache TTLs
2. **Set appropriate TTLs** - Balance freshness vs cache hit rate
3. **Use compression** - Enable gzip/brotli for text content
4. **Implement cache headers** - Set Cache-Control in your origin
5. **Monitor cache hit ratio** - Aim for >90% for static content
6. **Use Origin Shield** - Reduce origin load for popular content
    `,
    codeExamples: [
      {
        title: 'CDN with Multiple Origins',
        language: 'hcl',
        code: `resource "bunker_cdn_distribution" "main" {
  name    = "my-website"
  enabled = true

  aliases = ["cdn.example.com"]

  origin {
    id          = "web-origin"
    domain_name = "origin.example.com"
    protocol    = "https"
  }

  origin {
    id          = "s3-origin"
    domain_name = "assets.fortress.bunkercloud.com"
    protocol    = "https"
  }

  default_cache_behavior {
    target_origin_id = "web-origin"
    compress         = true

    cache_policy_id          = bunker_cdn_cache_policy.default.id
    origin_request_policy_id = bunker_cdn_origin_request_policy.default.id
  }

  cache_behavior {
    path_pattern     = "/static/*"
    target_origin_id = "s3-origin"
    compress         = true

    cache_policy_id = bunker_cdn_cache_policy.static.id
  }

  viewer_certificate {
    certificate_arn      = bunker_certificate.main.arn
    ssl_support_method   = "sni-only"
    minimum_protocol     = "TLSv1.2_2021"
  }
}`
      }
    ],
    relatedDocs: ['networking-overview', 'ssl-certificates', 'custom-domains']
  },

  'dns-management': {
    id: 'dns-management',
    title: 'DNS Management',
    description: 'Manage DNS zones and records with Bunker Cloud DNS',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# DNS Management

Bunker Cloud DNS is a scalable, authoritative DNS service that routes users to your applications with high availability and low latency through our global anycast network.

## DNS Overview

### Key Features

| Feature | Description |
|---------|-------------|
| **Global Anycast** | 50+ DNS locations worldwide |
| **Low Latency** | Sub-millisecond query response |
| **100% SLA** | Enterprise-grade reliability |
| **DNSSEC** | Cryptographic DNS security |
| **Health Checks** | Automatic failover |
| **Traffic Policies** | Advanced routing options |

## Creating a Hosted Zone

### Public Zone

\`\`\`bash
# Create hosted zone
bunker dns zone create \\
  --name example.com \\
  --type public

# Output:
# Zone created successfully
# Zone ID: zone-abc123
# Name servers:
#   ns1.bunkercloud.com
#   ns2.bunkercloud.com
#   ns3.bunkercloud.com
#   ns4.bunkercloud.com
\`\`\`

### Private Zone

For internal DNS resolution within your VPC:

\`\`\`bash
bunker dns zone create \\
  --name internal.example.com \\
  --type private \\
  --vpc-ids vpc-abc123,vpc-def456
\`\`\`

## Managing Records

### Record Types

| Type | Description | Example |
|------|-------------|---------|
| **A** | IPv4 address | 192.0.2.1 |
| **AAAA** | IPv6 address | 2001:db8::1 |
| **CNAME** | Canonical name | www → example.com |
| **MX** | Mail exchange | 10 mail.example.com |
| **TXT** | Text record | Verification, SPF |
| **NS** | Name server | ns1.bunkercloud.com |
| **SRV** | Service location | _sip._tcp.example.com |
| **CAA** | Certificate authority | Allow Let's Encrypt |
| **ALIAS** | Root domain alias | example.com → LB |

### Creating Records

\`\`\`bash
# A record
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name www.example.com \\
  --type A \\
  --ttl 300 \\
  --value 192.0.2.1

# CNAME record
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name blog.example.com \\
  --type CNAME \\
  --ttl 3600 \\
  --value www.example.com

# MX records
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name example.com \\
  --type MX \\
  --ttl 3600 \\
  --values "10 mail1.example.com" "20 mail2.example.com"

# TXT record (SPF)
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name example.com \\
  --type TXT \\
  --ttl 3600 \\
  --value "v=spf1 include:_spf.bunkercloud.com ~all"
\`\`\`

### ALIAS Records

Route apex domain to load balancers (without CNAME limitations):

\`\`\`bash
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name example.com \\
  --type ALIAS \\
  --alias-target arn:bunker:lb:production-alb \\
  --evaluate-target-health true
\`\`\`

## Traffic Routing Policies

### Simple Routing

Direct traffic to a single resource:

\`\`\`bash
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name api.example.com \\
  --type A \\
  --routing-policy simple \\
  --value 192.0.2.1
\`\`\`

### Weighted Routing

Distribute traffic based on weights (A/B testing, blue-green):

\`\`\`bash
# 80% to production
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name api.example.com \\
  --type A \\
  --routing-policy weighted \\
  --weight 80 \\
  --set-identifier production \\
  --value 192.0.2.1

# 20% to canary
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name api.example.com \\
  --type A \\
  --routing-policy weighted \\
  --weight 20 \\
  --set-identifier canary \\
  --value 192.0.2.2
\`\`\`

### Latency-Based Routing

Route users to the nearest region:

\`\`\`bash
# US East endpoint
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name api.example.com \\
  --type A \\
  --routing-policy latency \\
  --region us-east-1 \\
  --set-identifier us-east \\
  --value 192.0.2.1

# EU West endpoint
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name api.example.com \\
  --type A \\
  --routing-policy latency \\
  --region eu-west-1 \\
  --set-identifier eu-west \\
  --value 192.0.2.2
\`\`\`

### Geolocation Routing

Route based on user's geographic location:

\`\`\`bash
# US users
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name www.example.com \\
  --type A \\
  --routing-policy geolocation \\
  --geolocation-country US \\
  --set-identifier us-users \\
  --value 192.0.2.1

# EU users
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name www.example.com \\
  --type A \\
  --routing-policy geolocation \\
  --geolocation-continent EU \\
  --set-identifier eu-users \\
  --value 192.0.2.2

# Default (everyone else)
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name www.example.com \\
  --type A \\
  --routing-policy geolocation \\
  --geolocation-default \\
  --set-identifier default \\
  --value 192.0.2.1
\`\`\`

### Failover Routing

Automatic failover to backup resources:

\`\`\`bash
# Primary
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name api.example.com \\
  --type A \\
  --routing-policy failover \\
  --failover-type PRIMARY \\
  --health-check-id hc-primary \\
  --set-identifier primary \\
  --value 192.0.2.1

# Secondary
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name api.example.com \\
  --type A \\
  --routing-policy failover \\
  --failover-type SECONDARY \\
  --set-identifier secondary \\
  --value 192.0.2.2
\`\`\`

## Health Checks

### Creating Health Checks

\`\`\`bash
# HTTP health check
bunker dns health-check create \\
  --name api-health \\
  --type HTTP \\
  --endpoint 192.0.2.1 \\
  --port 80 \\
  --path /health \\
  --interval 30 \\
  --failure-threshold 3

# HTTPS health check with SNI
bunker dns health-check create \\
  --name secure-api-health \\
  --type HTTPS \\
  --endpoint 192.0.2.1 \\
  --port 443 \\
  --path /health \\
  --sni api.example.com \\
  --interval 10 \\
  --failure-threshold 2

# TCP health check
bunker dns health-check create \\
  --name db-health \\
  --type TCP \\
  --endpoint 192.0.2.10 \\
  --port 5432 \\
  --interval 30
\`\`\`

### Health Check Alerts

\`\`\`bash
bunker dns health-check alert create \\
  --health-check-id hc-abc123 \\
  --notification-target arn:bunker:sns:alerts
\`\`\`

## DNSSEC

Enable cryptographic DNS security:

\`\`\`bash
# Enable DNSSEC
bunker dns zone dnssec enable \\
  --zone-id zone-abc123

# Get DS record for registrar
bunker dns zone dnssec get-ds \\
  --zone-id zone-abc123

# Output:
# DS Record:
# example.com. 3600 IN DS 12345 13 2 49FD46E6C4B45C55D4...
\`\`\`

## Query Logging

\`\`\`bash
# Enable query logging
bunker dns zone logging enable \\
  --zone-id zone-abc123 \\
  --log-group dns-queries

# Query logs
bunker logs query \\
  --log-group dns-queries \\
  --query "fields @timestamp, queryName, queryType, responseCode
           | filter responseCode != 'NOERROR'
           | sort @timestamp desc
           | limit 100"
\`\`\`

## Pricing

| Component | Price |
|-----------|-------|
| Hosted Zone | $0.50/month |
| DNS Queries (first 1B) | $0.40/million |
| DNS Queries (over 1B) | $0.20/million |
| Health Checks (basic) | $0.50/month |
| Health Checks (HTTPS) | $0.75/month |
| Latency-based routing | +$0.60/million |
| Geo routing | +$0.70/million |

## Best Practices

1. **Use low TTLs during migrations** - 60-300 seconds for flexibility
2. **Increase TTLs for stable records** - 3600+ seconds to reduce queries
3. **Enable DNSSEC** - Protect against DNS spoofing
4. **Use health checks with failover** - Ensure high availability
5. **Monitor query patterns** - Detect anomalies and attacks
    `,
    codeExamples: [
      {
        title: 'DNS Zone with Records',
        language: 'hcl',
        code: `resource "bunker_dns_zone" "main" {
  name = "example.com"
  type = "public"
}

resource "bunker_dns_record" "www" {
  zone_id = bunker_dns_zone.main.id
  name    = "www.example.com"
  type    = "A"
  ttl     = 300
  records = ["192.0.2.1"]
}

resource "bunker_dns_record" "api" {
  zone_id = bunker_dns_zone.main.id
  name    = "api.example.com"
  type    = "ALIAS"

  alias {
    target                 = bunker_lb.api.dns_name
    zone_id               = bunker_lb.api.zone_id
    evaluate_target_health = true
  }
}

resource "bunker_dns_health_check" "api" {
  name             = "api-health"
  type             = "HTTPS"
  fqdn             = "api.example.com"
  port             = 443
  path             = "/health"
  failure_threshold = 3
}`
      }
    ],
    relatedDocs: ['custom-domains', 'ssl-certificates', 'networking-overview']
  },

  'custom-domains': {
    id: 'custom-domains',
    title: 'Custom Domains',
    description: 'Configure custom domains for your Bunker Cloud services',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# Custom Domains

Connect your own domain names to Bunker Cloud services for a professional, branded experience.

## Overview

Custom domains allow you to:
- Use your own domain (e.g., api.yourcompany.com)
- Maintain brand consistency
- Enable SSL/TLS certificates
- Configure DNS routing

## Supported Services

| Service | Custom Domain Support |
|---------|----------------------|
| Load Balancers | ✓ |
| CDN Distributions | ✓ |
| Container Apps | ✓ |
| Serverless Functions | ✓ |
| Static Sites | ✓ |
| Managed Databases | Via Load Balancer |

## Adding a Custom Domain

### Step 1: Verify Domain Ownership

\`\`\`bash
# Initiate domain verification
bunker domain add \\
  --domain api.example.com \\
  --service lb-production

# Output:
# Domain verification required
# Add the following DNS record:
# _bunker-verify.api.example.com TXT "bunker-verification=abc123xyz"
\`\`\`

### Step 2: Add DNS Record

At your DNS provider, create a TXT record:

| Name | Type | Value |
|------|------|-------|
| _bunker-verify.api.example.com | TXT | bunker-verification=abc123xyz |

### Step 3: Complete Verification

\`\`\`bash
# Check verification status
bunker domain verify --domain api.example.com

# Output:
# Domain verified successfully
# Status: verified
\`\`\`

### Step 4: Configure DNS Routing

Point your domain to the Bunker Cloud service:

\`\`\`bash
# Get service endpoint
bunker service describe lb-production --format json | jq '.endpoint'
# Output: "lb-production.us-east-1.bunkercloud.com"
\`\`\`

Add DNS records:

| Name | Type | Value |
|------|------|-------|
| api.example.com | CNAME | lb-production.us-east-1.bunkercloud.com |

For apex domains (no subdomain), use an ALIAS record:

| Name | Type | Value |
|------|------|-------|
| example.com | ALIAS | lb-production.us-east-1.bunkercloud.com |

## SSL/TLS Certificates

### Automatic Certificates

Bunker Cloud can automatically provision and renew SSL certificates:

\`\`\`bash
bunker domain add \\
  --domain api.example.com \\
  --service lb-production \\
  --auto-ssl
\`\`\`

### Bring Your Own Certificate

\`\`\`bash
# Import certificate
bunker certificate import \\
  --certificate-body file://cert.pem \\
  --private-key file://key.pem \\
  --certificate-chain file://chain.pem \\
  --name my-certificate

# Associate with domain
bunker domain update \\
  --domain api.example.com \\
  --certificate-arn arn:bunker:cert:my-certificate
\`\`\`

## Wildcard Domains

Support multiple subdomains with wildcard certificates:

\`\`\`bash
# Add wildcard domain
bunker domain add \\
  --domain "*.example.com" \\
  --service lb-production \\
  --auto-ssl

# This covers:
# - api.example.com
# - www.example.com
# - app.example.com
# - any.subdomain.example.com
\`\`\`

DNS configuration for wildcard:

| Name | Type | Value |
|------|------|-------|
| *.example.com | CNAME | lb-production.us-east-1.bunkercloud.com |

## Multi-Region Domains

Route traffic to different regions based on user location:

\`\`\`bash
# Add domain to US region
bunker domain add \\
  --domain api.example.com \\
  --service lb-us-east \\
  --region us-east-1

# Add same domain to EU region
bunker domain add \\
  --domain api.example.com \\
  --service lb-eu-west \\
  --region eu-west-1

# Configure latency-based routing in DNS
bunker dns record create \\
  --zone-id zone-abc123 \\
  --name api.example.com \\
  --type CNAME \\
  --routing-policy latency \\
  --region us-east-1 \\
  --value lb-us-east.us-east-1.bunkercloud.com

bunker dns record create \\
  --zone-id zone-abc123 \\
  --name api.example.com \\
  --type CNAME \\
  --routing-policy latency \\
  --region eu-west-1 \\
  --value lb-eu-west.eu-west-1.bunkercloud.com
\`\`\`

## Domain Management

### List Domains

\`\`\`bash
bunker domain list

# Output:
# DOMAIN                SERVICE        STATUS    SSL
# api.example.com       lb-production  active    valid
# www.example.com       cdn-main       active    valid
# staging.example.com   lb-staging     pending   pending
\`\`\`

### Update Domain

\`\`\`bash
# Change associated service
bunker domain update \\
  --domain api.example.com \\
  --service lb-new-production

# Update SSL certificate
bunker domain update \\
  --domain api.example.com \\
  --certificate-arn arn:bunker:cert:new-cert
\`\`\`

### Remove Domain

\`\`\`bash
bunker domain remove --domain api.example.com
\`\`\`

## Troubleshooting

### Domain Not Resolving

\`\`\`bash
# Check DNS propagation
dig api.example.com

# Verify CNAME is correct
dig api.example.com CNAME

# Check from Bunker Cloud perspective
bunker domain diagnose --domain api.example.com
\`\`\`

### SSL Certificate Issues

\`\`\`bash
# Check certificate status
bunker certificate describe \\
  --certificate-arn arn:bunker:cert:my-cert

# Verify domain validation
bunker certificate validate \\
  --certificate-arn arn:bunker:cert:my-cert
\`\`\`

### Common Issues

| Issue | Solution |
|-------|----------|
| Verification failed | Ensure TXT record is correct and propagated |
| SSL not working | Check certificate is valid and associated |
| Mixed content warnings | Ensure all resources use HTTPS |
| DNS not resolving | Wait for propagation (up to 48 hours) |

## Best Practices

1. **Use subdomains for services** - api.example.com, app.example.com
2. **Enable auto-SSL** - Automatic certificate management
3. **Use short TTLs during migration** - 60-300 seconds
4. **Test with staging first** - staging.example.com
5. **Monitor certificate expiry** - Set up alerts
    `,
    codeExamples: [
      {
        title: 'Domain Configuration',
        language: 'javascript',
        code: `const { BunkerCloud } = require('@bunkercloud/sdk');

const client = new BunkerCloud();

async function setupCustomDomain() {
  // Add domain
  const domain = await client.domains.add({
    domain: 'api.example.com',
    serviceId: 'lb-production',
    autoSsl: true
  });

  console.log('Verification record:', domain.verificationRecord);
  // Add this TXT record at your DNS provider

  // Check verification status
  const status = await client.domains.verify('api.example.com');

  if (status.verified) {
    console.log('Domain verified! Configure your DNS:');
    console.log(\`CNAME: api.example.com -> \${status.endpoint}\`);
  }
}

setupCustomDomain();`
      }
    ],
    relatedDocs: ['dns-management', 'ssl-certificates', 'load-balancers-network']
  },

  'ssl-certificates': {
    id: 'ssl-certificates',
    title: 'SSL/TLS Certificates',
    description: 'Manage SSL/TLS certificates for secure connections',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    content: `
# SSL/TLS Certificates

Bunker Cloud Certificate Manager provides easy provisioning, management, and deployment of SSL/TLS certificates for secure connections to your services.

## Certificate Types

| Type | Use Case | Validation |
|------|----------|------------|
| **Managed** | Most applications | Domain validation (DV) |
| **Imported** | Existing certificates | N/A |
| **Private CA** | Internal services | Private PKI |

## Managed Certificates

### Request a Certificate

\`\`\`bash
# Single domain
bunker certificate request \\
  --domain example.com \\
  --validation-method DNS

# Multiple domains (SAN certificate)
bunker certificate request \\
  --domain example.com \\
  --additional-domains www.example.com,api.example.com \\
  --validation-method DNS

# Wildcard certificate
bunker certificate request \\
  --domain "*.example.com" \\
  --validation-method DNS
\`\`\`

### Domain Validation Methods

#### DNS Validation (Recommended)

\`\`\`bash
bunker certificate request \\
  --domain example.com \\
  --validation-method DNS

# Output:
# Certificate requested
# ARN: arn:bunker:cert:abc123
# Status: pending_validation
#
# Add the following DNS record:
# _acme-challenge.example.com CNAME abc123.validation.bunkercloud.com
\`\`\`

#### Email Validation

\`\`\`bash
bunker certificate request \\
  --domain example.com \\
  --validation-method EMAIL

# Validation emails sent to:
# - admin@example.com
# - administrator@example.com
# - hostmaster@example.com
# - postmaster@example.com
# - webmaster@example.com
\`\`\`

### Check Certificate Status

\`\`\`bash
bunker certificate describe \\
  --certificate-arn arn:bunker:cert:abc123

# Output:
# ARN: arn:bunker:cert:abc123
# Domain: example.com
# Status: issued
# Type: managed
# Expires: 2025-03-15T00:00:00Z
# Associated Resources:
#   - arn:bunker:lb:production-alb
#   - arn:bunker:cdn:main-distribution
\`\`\`

## Importing Certificates

### Import from Files

\`\`\`bash
bunker certificate import \\
  --certificate-body file://certificate.pem \\
  --private-key file://private-key.pem \\
  --certificate-chain file://ca-chain.pem \\
  --name my-imported-cert
\`\`\`

### Import from Base64

\`\`\`bash
bunker certificate import \\
  --certificate-body "$(cat certificate.pem | base64)" \\
  --private-key "$(cat private-key.pem | base64)" \\
  --certificate-chain "$(cat ca-chain.pem | base64)" \\
  --encoding base64 \\
  --name my-imported-cert
\`\`\`

### Certificate Requirements

- **Format**: PEM-encoded
- **Key Size**: RSA 2048+ or ECDSA P-256/P-384
- **Validity**: Must not be expired
- **Chain**: Include intermediate certificates

## Certificate Deployment

### Load Balancer

\`\`\`bash
# Associate with ALB listener
bunker lb listener modify \\
  --listener-arn arn:bunker:listener:https-443 \\
  --certificate-arn arn:bunker:cert:abc123

# Add additional certificates (SNI)
bunker lb listener certificate add \\
  --listener-arn arn:bunker:listener:https-443 \\
  --certificate-arn arn:bunker:cert:another-cert
\`\`\`

### CDN Distribution

\`\`\`bash
bunker cdn modify \\
  --distribution-id cdn-main \\
  --certificate-arn arn:bunker:cert:abc123 \\
  --minimum-protocol-version TLSv1.2_2021
\`\`\`

### Container Apps

\`\`\`bash
bunker app domain add \\
  --app-name my-app \\
  --domain api.example.com \\
  --certificate-arn arn:bunker:cert:abc123
\`\`\`

## Certificate Renewal

### Automatic Renewal

Managed certificates are automatically renewed 30 days before expiration:

\`\`\`bash
# Check renewal status
bunker certificate describe \\
  --certificate-arn arn:bunker:cert:abc123 \\
  --show-renewal-status

# Output:
# Renewal Status: pending_auto_renewal
# Renewal Eligible: true
# Days Until Expiry: 28
\`\`\`

### Manual Renewal (Imported Certificates)

\`\`\`bash
# Re-import with new certificate
bunker certificate reimport \\
  --certificate-arn arn:bunker:cert:abc123 \\
  --certificate-body file://new-certificate.pem \\
  --private-key file://new-private-key.pem \\
  --certificate-chain file://new-ca-chain.pem
\`\`\`

## TLS Configuration

### Minimum TLS Version

\`\`\`bash
# Configure minimum TLS version
bunker lb listener modify \\
  --listener-arn arn:bunker:listener:https-443 \\
  --ssl-policy BunkerTLS12-1-2-2022-01
\`\`\`

### Available SSL Policies

| Policy | Min TLS | Security Level |
|--------|---------|----------------|
| BunkerTLS13-1-3-2022-01 | 1.3 | Highest |
| BunkerTLS13-1-2-2022-01 | 1.2 | Recommended |
| BunkerTLS12-1-2-2022-01 | 1.2 | Standard |
| BunkerTLS12-1-0-2016-08 | 1.0 | Legacy (not recommended) |

### Cipher Suites

Modern policies support:
- TLS_AES_128_GCM_SHA256
- TLS_AES_256_GCM_SHA384
- TLS_CHACHA20_POLY1305_SHA256
- ECDHE-RSA-AES128-GCM-SHA256
- ECDHE-RSA-AES256-GCM-SHA384

## Certificate Transparency

All public certificates are logged to Certificate Transparency logs:

\`\`\`bash
bunker certificate describe \\
  --certificate-arn arn:bunker:cert:abc123 \\
  --show-ct-logs

# Output:
# CT Log Entries:
#   - Google Argon: 2024-01-15T10:30:00Z
#   - Cloudflare Nimbus: 2024-01-15T10:30:05Z
\`\`\`

## Monitoring & Alerts

### Expiration Alerts

\`\`\`bash
# Create expiration alert
bunker alert create \\
  --name cert-expiry-warning \\
  --resource-type certificate \\
  --condition "days_until_expiry < 30" \\
  --notification-target arn:bunker:sns:alerts
\`\`\`

### Certificate Metrics

| Metric | Description |
|--------|-------------|
| DaysToExpiry | Days until certificate expires |
| ValidationStatus | Current validation state |
| RenewalEligibility | Whether auto-renewal is possible |

## Private Certificate Authority

For internal services, create a private CA:

\`\`\`bash
# Create private CA
bunker pca create \\
  --name internal-ca \\
  --common-name "Internal CA" \\
  --organization "Example Corp"

# Issue certificate from private CA
bunker pca certificate issue \\
  --ca-arn arn:bunker:pca:internal-ca \\
  --domain internal-api.corp.local \\
  --validity-days 365
\`\`\`

## Best Practices

1. **Use managed certificates** - Automatic renewal, no key management
2. **Prefer DNS validation** - More reliable than email
3. **Use wildcard certificates** - Reduce certificate management overhead
4. **Set TLS 1.2 minimum** - Disable older, insecure protocols
5. **Monitor expiration** - Set alerts for 30+ days before expiry
6. **Use separate certificates** - Different certs for different environments
    `,
    codeExamples: [
      {
        title: 'Certificate Management',
        language: 'python',
        code: `import bunkercloud

client = bunkercloud.Client()

# Request managed certificate
cert = client.certificates.request(
    domain='example.com',
    additional_domains=['www.example.com', 'api.example.com'],
    validation_method='DNS'
)

print(f"Certificate ARN: {cert.arn}")
print(f"Validation records:")
for record in cert.validation_records:
    print(f"  {record.name} -> {record.value}")

# Check certificate status
def wait_for_validation(cert_arn, timeout=300):
    import time
    start = time.time()

    while time.time() - start < timeout:
        cert = client.certificates.describe(cert_arn)
        if cert.status == 'issued':
            return cert
        elif cert.status == 'failed':
            raise Exception(f"Certificate validation failed: {cert.failure_reason}")
        time.sleep(10)

    raise TimeoutError("Certificate validation timed out")

# Associate with load balancer
client.load_balancers.listeners.update(
    listener_arn='arn:bunker:listener:https-443',
    certificate_arn=cert.arn
)`
      }
    ],
    relatedDocs: ['custom-domains', 'load-balancers-network', 'cdn']
  },

  'private-networking': {
    id: 'private-networking',
    title: 'Private Networking',
    description: 'Configure private connectivity and hybrid cloud connections',
    lastUpdated: '2024-12-01',
    difficulty: 'advanced',
    timeToRead: '15 min',
    content: `
# Private Networking

Bunker Cloud provides multiple options for private connectivity between your VPCs, on-premises data centers, and other cloud providers.

## Private Connectivity Options

| Option | Use Case | Bandwidth | Latency |
|--------|----------|-----------|---------|
| **VPC Peering** | VPC-to-VPC | Up to 50 Gbps | ~1ms |
| **Transit Gateway** | Hub-and-spoke | Up to 50 Gbps | ~1ms |
| **VPN** | On-premises | Up to 1.25 Gbps | Variable |
| **Direct Connect** | Dedicated link | 1-100 Gbps | <10ms |
| **Private Link** | Service access | N/A | ~1ms |

## VPC Peering

Connect two VPCs for direct communication using private IPs.

### Create Peering Connection

\`\`\`bash
# Within same account
bunker vpc peering create \\
  --requester-vpc vpc-aaa111 \\
  --accepter-vpc vpc-bbb222 \\
  --name prod-to-shared

# Cross-account peering
bunker vpc peering create \\
  --requester-vpc vpc-aaa111 \\
  --accepter-vpc vpc-ccc333 \\
  --accepter-account 123456789012 \\
  --accepter-region us-west-2
\`\`\`

### Accept Peering Request

\`\`\`bash
# In accepter account
bunker vpc peering accept \\
  --peering-id pcx-12345
\`\`\`

### Configure Routes

\`\`\`bash
# In requester VPC
bunker route create \\
  --route-table rtb-aaa \\
  --destination 10.1.0.0/16 \\
  --peering-id pcx-12345

# In accepter VPC
bunker route create \\
  --route-table rtb-bbb \\
  --destination 10.0.0.0/16 \\
  --peering-id pcx-12345
\`\`\`

### Peering Limitations

- Maximum 125 peering connections per VPC
- No transitive peering
- No overlapping CIDR blocks
- No edge-to-edge routing through peering

## Transit Gateway

Central hub for connecting multiple VPCs and on-premises networks.

### Create Transit Gateway

\`\`\`bash
bunker tgw create \\
  --name central-hub \\
  --amazon-side-asn 64512 \\
  --auto-accept-shared-attachments enable \\
  --default-route-table-association enable \\
  --default-route-table-propagation enable
\`\`\`

### Attach VPCs

\`\`\`bash
# Attach production VPC
bunker tgw attachment create \\
  --transit-gateway-id tgw-12345 \\
  --vpc-id vpc-prod \\
  --subnet-ids subnet-1a,subnet-1b,subnet-1c \\
  --name production

# Attach shared services VPC
bunker tgw attachment create \\
  --transit-gateway-id tgw-12345 \\
  --vpc-id vpc-shared \\
  --subnet-ids subnet-shared-1a,subnet-shared-1b \\
  --name shared-services
\`\`\`

### Configure Route Tables

\`\`\`bash
# Create route table for production
bunker tgw route-table create \\
  --transit-gateway-id tgw-12345 \\
  --name production-routes

# Add route to shared services
bunker tgw route create \\
  --route-table-id tgw-rtb-prod \\
  --destination 10.100.0.0/16 \\
  --attachment-id tgw-attach-shared

# Associate with production attachment
bunker tgw route-table associate \\
  --route-table-id tgw-rtb-prod \\
  --attachment-id tgw-attach-prod
\`\`\`

### Transit Gateway Architecture

\`\`\`
                        ┌─────────────────┐
                        │ Transit Gateway │
                        │    tgw-12345    │
                        └────────┬────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
  ┌─────▼─────┐           ┌─────▼─────┐           ┌─────▼─────┐
  │    VPC    │           │    VPC    │           │    VPN    │
  │ Production│           │  Shared   │           │On-Premises│
  │10.0.0.0/16│           │10.100.0.0 │           │192.168.0.0│
  └───────────┘           └───────────┘           └───────────┘
\`\`\`

## Site-to-Site VPN

Connect on-premises networks to your VPCs.

### Create VPN Gateway

\`\`\`bash
# Create Virtual Private Gateway
bunker vpn gateway create \\
  --name production-vpn \\
  --amazon-side-asn 65000

# Attach to VPC
bunker vpn gateway attach \\
  --gateway-id vgw-12345 \\
  --vpc-id vpc-prod
\`\`\`

### Create Customer Gateway

\`\`\`bash
bunker vpn customer-gateway create \\
  --name office-router \\
  --ip-address 203.0.113.100 \\
  --bgp-asn 65100
\`\`\`

### Create VPN Connection

\`\`\`bash
bunker vpn connection create \\
  --name office-to-cloud \\
  --virtual-private-gateway vgw-12345 \\
  --customer-gateway cgw-67890 \\
  --type ipsec.1 \\
  --static-routes-only false

# Download configuration for your router
bunker vpn connection config download \\
  --vpn-id vpn-abcdef \\
  --vendor cisco \\
  --platform ISR \\
  --software 12.4+
\`\`\`

### VPN Redundancy

\`\`\`bash
# Create second customer gateway (different endpoint)
bunker vpn customer-gateway create \\
  --name office-router-backup \\
  --ip-address 203.0.113.101 \\
  --bgp-asn 65100

# Create second VPN connection
bunker vpn connection create \\
  --name office-to-cloud-backup \\
  --virtual-private-gateway vgw-12345 \\
  --customer-gateway cgw-backup \\
  --type ipsec.1
\`\`\`

## Direct Connect

Dedicated network connection from your premises to Bunker Cloud.

### Order Direct Connect

\`\`\`bash
bunker dx connection create \\
  --name datacenter-link \\
  --location DX-NYC-01 \\
  --bandwidth 10Gbps
\`\`\`

### Create Virtual Interface

\`\`\`bash
# Private virtual interface (VPC access)
bunker dx virtual-interface create \\
  --connection-id dx-12345 \\
  --type private \\
  --name prod-vif \\
  --vlan 100 \\
  --asn 65200 \\
  --virtual-gateway-id vgw-prod

# Public virtual interface (Bunker services)
bunker dx virtual-interface create \\
  --connection-id dx-12345 \\
  --type public \\
  --name public-vif \\
  --vlan 200 \\
  --asn 65200
\`\`\`

### Direct Connect Gateway

Connect multiple VPCs across regions:

\`\`\`bash
# Create Direct Connect Gateway
bunker dx gateway create \\
  --name global-dx-gw \\
  --amazon-side-asn 64512

# Associate with VPCs
bunker dx gateway associate \\
  --gateway-id dx-gw-12345 \\
  --virtual-private-gateway vgw-us-east

bunker dx gateway associate \\
  --gateway-id dx-gw-12345 \\
  --virtual-private-gateway vgw-eu-west
\`\`\`

## Private Link (VPC Endpoints)

Access Bunker Cloud services privately without internet gateway.

### Interface Endpoints

\`\`\`bash
# Create interface endpoint for database service
bunker vpc endpoint create \\
  --vpc-id vpc-prod \\
  --service bunker.databases \\
  --type interface \\
  --subnet-ids subnet-1a,subnet-1b \\
  --security-group-ids sg-endpoint \\
  --private-dns-enabled
\`\`\`

### Gateway Endpoints

\`\`\`bash
# Create gateway endpoint for object storage
bunker vpc endpoint create \\
  --vpc-id vpc-prod \\
  --service bunker.fortress-storage \\
  --type gateway \\
  --route-table-ids rtb-private
\`\`\`

### Endpoint Services

Expose your services to other VPCs:

\`\`\`bash
# Create endpoint service
bunker vpc endpoint-service create \\
  --name my-api-service \\
  --network-load-balancer-arns arn:bunker:nlb:my-api \\
  --acceptance-required true

# Share with specific accounts
bunker vpc endpoint-service permissions add \\
  --service-id vpce-svc-12345 \\
  --principals 123456789012,234567890123
\`\`\`

## Hybrid DNS

Resolve DNS across cloud and on-premises:

### Route 53 Resolver

\`\`\`bash
# Create inbound endpoint (on-prem → cloud)
bunker dns resolver endpoint create \\
  --direction inbound \\
  --name cloud-resolver \\
  --security-group-ids sg-resolver \\
  --ip-addresses subnet-1a=10.0.1.10,subnet-1b=10.0.2.10

# Create outbound endpoint (cloud → on-prem)
bunker dns resolver endpoint create \\
  --direction outbound \\
  --name onprem-resolver \\
  --security-group-ids sg-resolver \\
  --ip-addresses subnet-1a=10.0.1.11,subnet-1b=10.0.2.11

# Create forwarding rule
bunker dns resolver rule create \\
  --name forward-to-onprem \\
  --domain-name corp.local \\
  --rule-type FORWARD \\
  --resolver-endpoint outbound-endpoint \\
  --target-ips 192.168.1.10,192.168.1.11
\`\`\`

## Network Monitoring

### VPC Flow Logs

\`\`\`bash
bunker vpc flow-logs enable \\
  --resource-type VPC \\
  --resource-id vpc-prod \\
  --traffic-type ALL \\
  --destination cloud-watch \\
  --log-group vpc-flow-logs
\`\`\`

### Traffic Mirroring

\`\`\`bash
# Create mirror target
bunker traffic-mirror target create \\
  --network-load-balancer-arn arn:bunker:nlb:ids-nlb \\
  --name ids-target

# Create mirror filter
bunker traffic-mirror filter create \\
  --name all-traffic \\
  --inbound-rules "protocol=6,source=0.0.0.0/0,destination=0.0.0.0/0,action=accept"

# Create mirror session
bunker traffic-mirror session create \\
  --network-interface-id eni-12345 \\
  --target-id tmt-67890 \\
  --filter-id tmf-abcde \\
  --session-number 1
\`\`\`

## Best Practices

1. **Use Transit Gateway** for complex multi-VPC architectures
2. **Enable VPN redundancy** with multiple tunnels
3. **Prefer Direct Connect** for consistent, high-bandwidth needs
4. **Use Private Link** to access services without internet
5. **Implement hybrid DNS** for seamless name resolution
6. **Monitor all connections** with flow logs and metrics
    `,
    codeExamples: [
      {
        title: 'Transit Gateway Setup',
        language: 'hcl',
        code: `resource "bunker_transit_gateway" "main" {
  name                            = "central-hub"
  amazon_side_asn                 = 64512
  auto_accept_shared_attachments  = "enable"
  default_route_table_association = "enable"
  default_route_table_propagation = "enable"
}

resource "bunker_transit_gateway_vpc_attachment" "prod" {
  transit_gateway_id = bunker_transit_gateway.main.id
  vpc_id             = bunker_vpc.prod.id
  subnet_ids         = bunker_subnet.prod_private[*].id

  tags = {
    Name = "production"
  }
}

resource "bunker_transit_gateway_vpc_attachment" "shared" {
  transit_gateway_id = bunker_transit_gateway.main.id
  vpc_id             = bunker_vpc.shared.id
  subnet_ids         = bunker_subnet.shared_private[*].id

  tags = {
    Name = "shared-services"
  }
}

# VPN attachment
resource "bunker_vpn_connection" "office" {
  customer_gateway_id = bunker_customer_gateway.office.id
  transit_gateway_id  = bunker_transit_gateway.main.id
  type                = "ipsec.1"
}`
      }
    ],
    relatedDocs: ['vpc', 'networking-overview', 'security-overview']
  }
};

// Export all networking doc IDs for validation
export const networkingDocIds = Object.keys(networkingDocs);
