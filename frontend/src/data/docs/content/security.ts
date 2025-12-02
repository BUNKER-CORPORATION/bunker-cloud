// Security Documentation Content for Bunker Cloud

import { DocPage } from '../types';

export const securityDocs: Record<string, DocPage> = {
  'security-overview': {
    id: 'security-overview',
    title: 'Security Overview',
    description: 'Introduction to Bunker Cloud security features and best practices',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '10 min',
    content: `
# Security Overview

Security is foundational to everything we do at Bunker Cloud. Our platform is built with security-first principles, providing multiple layers of protection for your data and infrastructure.

## Security Model

\`\`\`
┌──────────────────────────────────────────────────────────────────────┐
│                     Bunker Cloud Security Layers                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Application Security                         │  │
│  │  WAF • API Gateway • Input Validation • CSRF Protection         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Identity & Access                            │  │
│  │  IAM • MFA • SSO • Service Accounts • API Keys                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Network Security                             │  │
│  │  VPC • Security Groups • NACLs • DDoS Protection • TLS         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Data Security                                │  │
│  │  Encryption at Rest • Encryption in Transit • Key Management    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Physical Security                            │  │
│  │  Data Center Security • Hardware Security Modules • Compliance  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
\`\`\`

## Core Security Features

### Identity & Access Management (IAM)

Control who can access your resources and what actions they can perform:

| Feature | Description |
|---------|-------------|
| **Users & Groups** | Manage individual and team access |
| **Roles** | Define permission sets |
| **Policies** | Fine-grained access control |
| **MFA** | Multi-factor authentication |
| **SSO** | Single sign-on integration |

### Network Security

Protect your infrastructure at the network layer:

| Feature | Description |
|---------|-------------|
| **VPC** | Isolated virtual networks |
| **Security Groups** | Instance-level firewalls |
| **Network ACLs** | Subnet-level filtering |
| **DDoS Protection** | Automatic attack mitigation |
| **WAF** | Web application firewall |

### Data Security

Protect your data at every stage:

| Feature | Description |
|---------|-------------|
| **Encryption at Rest** | AES-256 encryption for stored data |
| **Encryption in Transit** | TLS 1.2+ for all connections |
| **Key Management** | Managed or customer-controlled keys |
| **Secrets Manager** | Secure credential storage |

## Shared Responsibility Model

Security in the cloud is a shared responsibility:

### Bunker Cloud Responsibilities

- Physical data center security
- Hardware and host infrastructure
- Network infrastructure
- Virtualization layer
- Managed service security patches

### Customer Responsibilities

- Account and credential management
- Application security
- Data encryption configuration
- Network access control
- Operating system patches (for VMs)
- Security group configuration

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                                                          │
│          Customer Responsibility                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Customer Data                                       │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Application & Platform                              │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Identity & Access Management                        │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Network & Firewall Configuration                    │ │
│  └────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│          Bunker Cloud Responsibility                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Compute, Storage, Database, Networking Services     │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Hardware / Global Infrastructure                    │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Regions, Availability Zones, Edge Locations         │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
\`\`\`

## Security Best Practices

### Account Security

1. **Enable MFA** on all accounts, especially root
2. **Use strong passwords** (16+ characters)
3. **Rotate credentials** regularly
4. **Use service accounts** for automated processes
5. **Review access** periodically

### Network Security

1. **Use private subnets** for internal resources
2. **Minimize public exposure** - only expose what's needed
3. **Implement least privilege** in security groups
4. **Enable VPC flow logs** for monitoring
5. **Use VPC endpoints** for service access

### Data Security

1. **Enable encryption** at rest and in transit
2. **Use customer-managed keys** for sensitive data
3. **Implement backup strategy** with encryption
4. **Classify data** by sensitivity
5. **Use secrets management** for credentials

### Application Security

1. **Keep systems updated** with security patches
2. **Use WAF** for web applications
3. **Implement input validation**
4. **Use parameterized queries** to prevent SQL injection
5. **Enable security headers** (CSP, HSTS, etc.)

## Security Tools & Services

| Service | Purpose |
|---------|---------|
| **IAM** | Identity and access management |
| **Secrets Manager** | Secure credential storage |
| **Key Management** | Encryption key management |
| **Security Hub** | Security posture dashboard |
| **Guard** | Threat detection |
| **Inspector** | Vulnerability scanning |
| **Audit Logs** | Activity logging |
| **Config** | Configuration compliance |

## Getting Started with Security

### Step 1: Secure Your Account

\`\`\`bash
# Enable MFA
bunker iam mfa enable --user admin

# Set password policy
bunker iam password-policy update \\
  --minimum-length 16 \\
  --require-symbols \\
  --require-numbers \\
  --require-uppercase \\
  --max-age 90
\`\`\`

### Step 2: Configure Network Security

\`\`\`bash
# Create VPC with private subnets
bunker vpc create --name secure-vpc --cidr 10.0.0.0/16

# Create security group with least privilege
bunker sg create \\
  --name web-sg \\
  --vpc-id vpc-123 \\
  --description "Web server security group"

bunker sg rule add \\
  --sg-id sg-web \\
  --direction inbound \\
  --protocol tcp \\
  --port 443 \\
  --source 0.0.0.0/0
\`\`\`

### Step 3: Enable Encryption

\`\`\`bash
# Create encryption key
bunker kms key create --name data-key --description "Data encryption key"

# Enable default encryption for storage
bunker storage default-encryption enable \\
  --key-id key-123 \\
  --bucket my-bucket
\`\`\`

### Step 4: Enable Monitoring

\`\`\`bash
# Enable audit logging
bunker audit-log enable --trail all-events

# Enable threat detection
bunker guard enable --detector-type all
\`\`\`

## Compliance

Bunker Cloud maintains compliance with major security standards:

| Standard | Status |
|----------|--------|
| SOC 2 Type II | Certified |
| ISO 27001 | Certified |
| PCI DSS Level 1 | Certified |
| HIPAA | Eligible |
| GDPR | Compliant |
| FedRAMP | In Progress |

## Security Resources

- **Security Bulletins** - Stay informed about vulnerabilities
- **Security Blog** - Best practices and updates
- **Penetration Testing** - Request approval for testing
- **Bug Bounty** - Report vulnerabilities responsibly
- **Compliance Reports** - Download audit reports
    `,
    codeExamples: [
      {
        title: 'Security Configuration Script',
        language: 'bash',
        code: `#!/bin/bash
# Initial security setup script

# Enable MFA for root account
echo "Enabling MFA..."
bunker iam mfa enable --user root

# Create admin group with MFA requirement
bunker iam group create --name admins
bunker iam group policy attach \\
  --group admins \\
  --policy arn:bunker:iam::policy/AdministratorAccess

# Set strong password policy
bunker iam password-policy update \\
  --minimum-length 16 \\
  --require-symbols true \\
  --require-numbers true \\
  --require-uppercase true \\
  --require-lowercase true \\
  --max-age 90 \\
  --password-reuse-prevention 24

# Enable CloudTrail for all regions
bunker audit-log create \\
  --name organization-trail \\
  --is-organization-trail \\
  --include-global-service-events \\
  --is-multi-region

# Enable GuardDuty threat detection
bunker guard enable

echo "Security setup complete!"`
      }
    ],
    relatedDocs: ['iam', 'encryption', 'audit-logs', 'compliance']
  },

  'iam': {
    id: 'iam',
    title: 'Identity & Access Management',
    description: 'Manage identities, access policies, and permissions',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '15 min',
    content: `
# Identity & Access Management (IAM)

IAM enables you to securely control access to Bunker Cloud services and resources. Create and manage users, groups, roles, and policies to implement the principle of least privilege.

## IAM Concepts

### Principals

Entities that can make requests to Bunker Cloud:

| Principal | Description |
|-----------|-------------|
| **Root User** | Account owner with full access |
| **IAM Users** | Individual identities |
| **IAM Groups** | Collections of users |
| **IAM Roles** | Assumable identities |
| **Service Accounts** | Machine identities |

### Policies

JSON documents that define permissions:

\`\`\`json
{
  "Version": "2024-01-01",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "compute:DescribeInstances",
        "compute:StartInstance",
        "compute:StopInstance"
      ],
      "Resource": "arn:bunker:compute:*:*:instance/*",
      "Condition": {
        "StringEquals": {
          "bunker:ResourceTag/Environment": "development"
        }
      }
    }
  ]
}
\`\`\`

## Managing Users

### Create User

\`\`\`bash
# Create user
bunker iam user create \\
  --name john.doe \\
  --email john.doe@example.com

# Create with console access
bunker iam user create \\
  --name jane.doe \\
  --email jane.doe@example.com \\
  --console-access \\
  --password-reset-required
\`\`\`

### Manage User Access

\`\`\`bash
# Create access key for CLI/API
bunker iam access-key create --user john.doe

# List access keys
bunker iam access-key list --user john.doe

# Disable access key
bunker iam access-key disable \\
  --user john.doe \\
  --access-key-id AKIAXXXXXXXX

# Delete access key
bunker iam access-key delete \\
  --user john.doe \\
  --access-key-id AKIAXXXXXXXX
\`\`\`

### Enable MFA

\`\`\`bash
# Enable virtual MFA
bunker iam mfa enable \\
  --user john.doe \\
  --type virtual

# Enable hardware MFA
bunker iam mfa enable \\
  --user john.doe \\
  --type hardware \\
  --serial-number GAHT12345678
\`\`\`

## Managing Groups

### Create and Manage Groups

\`\`\`bash
# Create group
bunker iam group create --name developers

# Add user to group
bunker iam group add-user \\
  --group developers \\
  --user john.doe

# List group members
bunker iam group list-users --group developers

# Remove user from group
bunker iam group remove-user \\
  --group developers \\
  --user john.doe
\`\`\`

### Attach Policies to Groups

\`\`\`bash
# Attach managed policy
bunker iam group policy attach \\
  --group developers \\
  --policy arn:bunker:iam::policy/DeveloperAccess

# Attach inline policy
bunker iam group policy put \\
  --group developers \\
  --policy-name S3ReadAccess \\
  --policy-document file://s3-read-policy.json
\`\`\`

## IAM Roles

Roles are identities that can be assumed by users, services, or other accounts.

### Create Role

\`\`\`bash
# Create role for EC2 instances
bunker iam role create \\
  --name AppServerRole \\
  --assume-role-policy-document '{
    "Version": "2024-01-01",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {
        "Service": "compute.bunkercloud.com"
      },
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach permissions
bunker iam role policy attach \\
  --role AppServerRole \\
  --policy arn:bunker:iam::policy/S3ReadOnlyAccess
\`\`\`

### Cross-Account Role

\`\`\`bash
# Create role assumable by another account
bunker iam role create \\
  --name CrossAccountAudit \\
  --assume-role-policy-document '{
    "Version": "2024-01-01",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:bunker:iam::123456789012:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "Bool": {
          "bunker:MultiFactorAuthPresent": "true"
        }
      }
    }]
  }'
\`\`\`

### Assume Role

\`\`\`bash
# Assume role
bunker sts assume-role \\
  --role-arn arn:bunker:iam::123456789012:role/AdminRole \\
  --role-session-name MySession

# Assume role with MFA
bunker sts assume-role \\
  --role-arn arn:bunker:iam::123456789012:role/AdminRole \\
  --role-session-name MySession \\
  --serial-number arn:bunker:iam::123456789012:mfa/user \\
  --token-code 123456
\`\`\`

## IAM Policies

### Policy Structure

\`\`\`json
{
  "Version": "2024-01-01",
  "Statement": [
    {
      "Sid": "AllowS3ReadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:bunker:s3:::my-bucket",
        "arn:bunker:s3:::my-bucket/*"
      ]
    },
    {
      "Sid": "DenyDeleteBucket",
      "Effect": "Deny",
      "Action": "s3:DeleteBucket",
      "Resource": "*"
    }
  ]
}
\`\`\`

### Policy Elements

| Element | Description |
|---------|-------------|
| **Version** | Policy language version |
| **Statement** | Array of permission statements |
| **Sid** | Statement identifier (optional) |
| **Effect** | Allow or Deny |
| **Action** | API operations |
| **Resource** | Target resources |
| **Condition** | When statement applies |

### Managed Policies

Pre-built policies for common use cases:

| Policy | Description |
|--------|-------------|
| AdministratorAccess | Full access to all services |
| PowerUserAccess | Full access except IAM |
| ReadOnlyAccess | Read-only access to all services |
| SecurityAudit | Security audit permissions |
| ViewOnlyAccess | View resources without data |

### Create Custom Policy

\`\`\`bash
bunker iam policy create \\
  --name CustomDeveloperPolicy \\
  --description "Custom developer permissions" \\
  --policy-document '{
    "Version": "2024-01-01",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "compute:*",
          "storage:*",
          "database:Describe*"
        ],
        "Resource": "*",
        "Condition": {
          "StringEquals": {
            "bunker:RequestedRegion": ["us-east-1", "us-west-2"]
          }
        }
      }
    ]
  }'
\`\`\`

## Policy Conditions

### Common Condition Keys

| Key | Description |
|-----|-------------|
| bunker:CurrentTime | Current date/time |
| bunker:MultiFactorAuthPresent | MFA was used |
| bunker:PrincipalTag/* | Principal tags |
| bunker:ResourceTag/* | Resource tags |
| bunker:RequestedRegion | Target region |
| bunker:SourceIp | Request source IP |

### Example Conditions

\`\`\`json
{
  "Condition": {
    "IpAddress": {
      "bunker:SourceIp": ["192.168.1.0/24", "10.0.0.0/8"]
    },
    "DateGreaterThan": {
      "bunker:CurrentTime": "2024-01-01T00:00:00Z"
    },
    "Bool": {
      "bunker:MultiFactorAuthPresent": "true"
    }
  }
}
\`\`\`

## Service Control Policies (SCPs)

Organization-level guardrails:

\`\`\`json
{
  "Version": "2024-01-01",
  "Statement": [
    {
      "Sid": "RequireIMDSv2",
      "Effect": "Deny",
      "Action": "compute:RunInstances",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "compute:MetadataHttpTokens": "required"
        }
      }
    },
    {
      "Sid": "DenyRootUser",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "bunker:PrincipalArn": "arn:bunker:iam::*:root"
        }
      }
    }
  ]
}
\`\`\`

## Permission Boundaries

Limit maximum permissions for IAM entities:

\`\`\`bash
# Set permission boundary
bunker iam user update \\
  --name developer \\
  --permission-boundary arn:bunker:iam::policy/DeveloperBoundary

# Create role with boundary
bunker iam role create \\
  --name LimitedRole \\
  --assume-role-policy-document file://trust-policy.json \\
  --permission-boundary arn:bunker:iam::policy/RoleBoundary
\`\`\`

## Best Practices

1. **Don't use root account** - Create IAM users instead
2. **Enable MFA everywhere** - Especially for privileged access
3. **Use groups** - Manage permissions through groups, not users
4. **Apply least privilege** - Grant minimum required permissions
5. **Use roles for applications** - Never embed credentials
6. **Rotate credentials** - Regularly rotate access keys
7. **Review access regularly** - Audit and remove unused access
8. **Use conditions** - Restrict by IP, MFA, time, etc.
    `,
    codeExamples: [
      {
        title: 'IAM Setup with SDK',
        language: 'python',
        code: `import bunkercloud

client = bunkercloud.Client()

# Create group with policies
def setup_developer_access():
    # Create group
    group = client.iam.groups.create(name='developers')

    # Create custom policy
    policy = client.iam.policies.create(
        name='DeveloperPolicy',
        description='Developer access policy',
        policy_document={
            'Version': '2024-01-01',
            'Statement': [
                {
                    'Effect': 'Allow',
                    'Action': [
                        'compute:*',
                        'storage:*',
                        'database:Describe*',
                        'logs:*'
                    ],
                    'Resource': '*',
                    'Condition': {
                        'StringEquals': {
                            'bunker:ResourceTag/Environment': ['dev', 'staging']
                        }
                    }
                }
            ]
        }
    )

    # Attach policy to group
    client.iam.groups.attach_policy(
        group_name='developers',
        policy_arn=policy.arn
    )

    return group, policy

# Create user with MFA requirement
def create_secure_user(username: str, email: str):
    user = client.iam.users.create(
        name=username,
        email=email,
        console_access=True,
        password_reset_required=True
    )

    # Add to developers group
    client.iam.groups.add_user(
        group_name='developers',
        user_name=username
    )

    # Enable MFA
    mfa_device = client.iam.mfa.enable(
        user_name=username,
        device_type='virtual'
    )

    return user, mfa_device`
      }
    ],
    relatedDocs: ['users-teams', 'roles-permissions', 'api-keys', 'security-overview']
  },

  'users-teams': {
    id: 'users-teams',
    title: 'Users & Teams',
    description: 'Manage users, teams, and organizational access',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '10 min',
    content: `
# Users & Teams

Manage individuals and groups within your Bunker Cloud organization to control access and collaboration.

## Organization Structure

\`\`\`
Organization
├── Root Account (owner)
├── Teams
│   ├── Engineering
│   │   ├── Backend Team
│   │   └── Frontend Team
│   ├── DevOps
│   └── Security
└── Users
    ├── alice@company.com (Admin)
    ├── bob@company.com (Developer)
    └── carol@company.com (Viewer)
\`\`\`

## Managing Users

### Invite Users

\`\`\`bash
# Invite user with role
bunker organization user invite \\
  --email john@company.com \\
  --role developer \\
  --teams engineering,backend

# Bulk invite
bunker organization user invite-bulk \\
  --file users.csv \\
  --default-role developer
\`\`\`

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Owner** | Organization owner | Full access + billing |
| **Admin** | Administrator | Full access except billing |
| **Developer** | Development team | Create/manage resources |
| **Operator** | Operations team | Deploy, monitor, troubleshoot |
| **Viewer** | Read-only access | View resources only |
| **Billing** | Billing access | Manage billing and costs |

### Update User

\`\`\`bash
# Change user role
bunker organization user update \\
  --email john@company.com \\
  --role admin

# Add to team
bunker organization user update \\
  --email john@company.com \\
  --add-teams security

# Disable user
bunker organization user disable \\
  --email john@company.com
\`\`\`

### Remove User

\`\`\`bash
bunker organization user remove \\
  --email john@company.com \\
  --transfer-resources admin@company.com
\`\`\`

## Managing Teams

### Create Team

\`\`\`bash
bunker organization team create \\
  --name backend-engineering \\
  --description "Backend engineering team" \\
  --parent engineering
\`\`\`

### Team Permissions

\`\`\`bash
# Grant team access to project
bunker organization team permission add \\
  --team backend-engineering \\
  --project api-services \\
  --role developer

# Grant access to specific resources
bunker organization team permission add \\
  --team backend-engineering \\
  --resource-group production-databases \\
  --role operator
\`\`\`

### Manage Team Members

\`\`\`bash
# Add member
bunker organization team member add \\
  --team backend-engineering \\
  --user john@company.com \\
  --role lead

# List members
bunker organization team member list \\
  --team backend-engineering

# Remove member
bunker organization team member remove \\
  --team backend-engineering \\
  --user john@company.com
\`\`\`

## Single Sign-On (SSO)

### Configure SSO Provider

\`\`\`bash
# Configure SAML SSO
bunker organization sso configure \\
  --provider saml \\
  --metadata-url https://idp.company.com/metadata.xml \\
  --attribute-mapping email=mail,name=displayName,groups=memberOf

# Configure OIDC SSO
bunker organization sso configure \\
  --provider oidc \\
  --issuer https://auth.company.com \\
  --client-id abc123 \\
  --client-secret-file secret.txt
\`\`\`

### Supported Providers

| Provider | Protocol | Status |
|----------|----------|--------|
| Okta | SAML/OIDC | Supported |
| Azure AD | SAML/OIDC | Supported |
| Google Workspace | OIDC | Supported |
| OneLogin | SAML | Supported |
| Auth0 | OIDC | Supported |
| Custom SAML | SAML 2.0 | Supported |

### SSO Group Mapping

\`\`\`bash
bunker organization sso group-mapping add \\
  --idp-group "Engineering" \\
  --bunker-team engineering \\
  --bunker-role developer

bunker organization sso group-mapping add \\
  --idp-group "DevOps" \\
  --bunker-team devops \\
  --bunker-role operator
\`\`\`

## Access Reviews

### Schedule Review

\`\`\`bash
bunker organization access-review create \\
  --name quarterly-review \\
  --scope organization \\
  --frequency quarterly \\
  --reviewers security-team \\
  --notify-before 7d
\`\`\`

### Review Access

\`\`\`bash
# List pending reviews
bunker organization access-review list --status pending

# Review user access
bunker organization access-review decision \\
  --review-id review-123 \\
  --user john@company.com \\
  --action approve \\
  --reason "Active team member"

# Bulk review
bunker organization access-review decision-bulk \\
  --review-id review-123 \\
  --decisions-file decisions.csv
\`\`\`

## User Activity

### View Activity

\`\`\`bash
# User activity log
bunker organization user activity \\
  --email john@company.com \\
  --start-time "2024-01-01" \\
  --end-time "2024-01-31"

# Recent logins
bunker organization user logins \\
  --email john@company.com \\
  --last 30d
\`\`\`

### Inactive Users

\`\`\`bash
# Find inactive users
bunker organization user list \\
  --inactive-for 90d

# Disable inactive users
bunker organization user disable-inactive \\
  --days 90 \\
  --notify-before 7d
\`\`\`

## Best Practices

1. **Use SSO** for centralized authentication
2. **Implement least privilege** through role-based access
3. **Regular access reviews** at least quarterly
4. **Disable inactive accounts** after 90 days
5. **Use teams** for resource access, not individual users
6. **Document team ownership** for resources
7. **Audit user activity** regularly
    `,
    codeExamples: [
      {
        title: 'User Management',
        language: 'javascript',
        code: `const { BunkerCloud } = require('@bunkercloud/sdk');

const client = new BunkerCloud();

// Onboard new team member
async function onboardUser(email, name, team, role) {
  // Invite user
  const user = await client.organization.users.invite({
    email,
    name,
    role,
    teams: [team]
  });

  // Add to appropriate projects
  const teamProjects = await client.organization.teams.getProjects(team);
  for (const project of teamProjects) {
    await client.organization.users.grantProjectAccess({
      email,
      projectId: project.id,
      role: role
    });
  }

  // Send welcome notification
  await client.notifications.send({
    to: email,
    template: 'welcome',
    data: { name, team, role }
  });

  return user;
}

// Offboard user
async function offboardUser(email, transferTo) {
  // Transfer owned resources
  const resources = await client.organization.users.getOwnedResources(email);
  for (const resource of resources) {
    await client.resources.transferOwnership({
      resourceId: resource.id,
      newOwner: transferTo
    });
  }

  // Revoke all access
  await client.organization.users.revokeAllAccess(email);

  // Remove from organization
  await client.organization.users.remove(email);

  // Log offboarding
  await client.audit.log({
    action: 'user.offboarded',
    actor: 'system',
    target: email,
    details: { transferredTo: transferTo }
  });
}`
      }
    ],
    relatedDocs: ['iam', 'roles-permissions', 'security-overview']
  },

  'roles-permissions': {
    id: 'roles-permissions',
    title: 'Roles & Permissions',
    description: 'Configure role-based access control and permissions',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Roles & Permissions

Implement fine-grained access control with Bunker Cloud's role-based access control (RBAC) system.

## RBAC Model

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Access Control Model                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   User ──────► Role ──────► Permissions ──────► Resources   │
│                 │                                            │
│                 └──────► Scope (Org/Project/Resource)        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Built-in Roles

### Organization Roles

| Role | Scope | Description |
|------|-------|-------------|
| **org:owner** | Organization | Full access including billing |
| **org:admin** | Organization | Full access except billing transfer |
| **org:member** | Organization | Basic organization membership |

### Project Roles

| Role | Scope | Description |
|------|-------|-------------|
| **project:admin** | Project | Full project access |
| **project:developer** | Project | Create and manage resources |
| **project:operator** | Project | Deploy and operate |
| **project:viewer** | Project | Read-only access |

### Resource Roles

| Role | Scope | Description |
|------|-------|-------------|
| **resource:admin** | Resource | Full resource management |
| **resource:editor** | Resource | Modify resource |
| **resource:viewer** | Resource | View resource only |

## Custom Roles

### Create Custom Role

\`\`\`bash
bunker iam role create \\
  --name custom:database-admin \\
  --description "Database administration role" \\
  --permissions '[
    "database:*",
    "monitoring:Read*",
    "logs:Read*"
  ]'
\`\`\`

### Role with Conditions

\`\`\`bash
bunker iam role create \\
  --name custom:dev-deployer \\
  --description "Deploy to development only" \\
  --permissions '[
    {
      "action": "compute:*",
      "conditions": {
        "StringEquals": {
          "bunker:ResourceTag/Environment": "development"
        }
      }
    }
  ]'
\`\`\`

## Permission Structure

### Actions

Actions follow the format: \`service:operation\`

\`\`\`
compute:CreateInstance      # Create compute instance
compute:*                   # All compute actions
storage:GetObject           # Read storage object
storage:Put*                # All Put operations
*:Describe*                 # All Describe operations across services
\`\`\`

### Resources

Resources use ARN format:

\`\`\`
arn:bunker:compute:us-east-1:123456789:instance/i-12345
arn:bunker:storage:::bucket/my-bucket/*
arn:bunker:database:*:*:cluster/*
\`\`\`

### Common Permissions

| Permission | Description |
|------------|-------------|
| \`*:*\` | Full access (admin) |
| \`*:Describe*\` | Read-only access |
| \`compute:*\` | Full compute access |
| \`storage:GetObject\` | Read storage objects |
| \`database:Connect\` | Connect to databases |

## Assigning Roles

### To Users

\`\`\`bash
# Assign organization role
bunker iam binding create \\
  --principal user:john@company.com \\
  --role org:admin \\
  --scope organization

# Assign project role
bunker iam binding create \\
  --principal user:john@company.com \\
  --role project:developer \\
  --scope project:my-project

# Assign resource role
bunker iam binding create \\
  --principal user:john@company.com \\
  --role resource:admin \\
  --scope resource:arn:bunker:database::cluster/prod-db
\`\`\`

### To Teams

\`\`\`bash
bunker iam binding create \\
  --principal team:backend-engineering \\
  --role project:developer \\
  --scope project:api-services
\`\`\`

### To Service Accounts

\`\`\`bash
bunker iam binding create \\
  --principal serviceAccount:ci-pipeline \\
  --role project:deployer \\
  --scope project:production
\`\`\`

## Conditional Access

### Time-Based

\`\`\`json
{
  "conditions": {
    "DateGreaterThan": {
      "bunker:CurrentTime": "2024-01-01T09:00:00Z"
    },
    "DateLessThan": {
      "bunker:CurrentTime": "2024-01-01T17:00:00Z"
    }
  }
}
\`\`\`

### IP-Based

\`\`\`json
{
  "conditions": {
    "IpAddress": {
      "bunker:SourceIp": ["192.168.1.0/24", "10.0.0.0/8"]
    }
  }
}
\`\`\`

### MFA Required

\`\`\`json
{
  "conditions": {
    "Bool": {
      "bunker:MultiFactorAuthPresent": "true"
    }
  }
}
\`\`\`

### Tag-Based

\`\`\`json
{
  "conditions": {
    "StringEquals": {
      "bunker:ResourceTag/Team": "\${bunker:PrincipalTag/Team}"
    }
  }
}
\`\`\`

## Permission Evaluation

Permissions are evaluated in order:

1. **Explicit Deny** - If any policy denies, access is denied
2. **Organization SCPs** - Service control policies checked
3. **Permission Boundaries** - Maximum permissions checked
4. **Identity Policies** - User/role policies evaluated
5. **Resource Policies** - Resource-level policies checked
6. **Default Deny** - If no allow found, access is denied

\`\`\`
┌─────────────────────────────────────────────────────┐
│                  Permission Evaluation               │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Request ──► Explicit Deny? ──Yes──► DENIED         │
│                    │                                 │
│                   No                                 │
│                    │                                 │
│              ──► SCP Allow? ──No──► DENIED          │
│                    │                                 │
│                   Yes                                │
│                    │                                 │
│           ──► Boundary Allow? ──No──► DENIED        │
│                    │                                 │
│                   Yes                                │
│                    │                                 │
│          ──► Identity Allow? ──No──► DENIED         │
│                    │                                 │
│                   Yes                                │
│                    │                                 │
│          ──► Resource Allow? ──No──► DENIED         │
│                    │                                 │
│                   Yes                                │
│                    ▼                                 │
│                 ALLOWED                              │
│                                                      │
└─────────────────────────────────────────────────────┘
\`\`\`

## Testing Permissions

### Simulate Access

\`\`\`bash
bunker iam simulate-access \\
  --principal user:john@company.com \\
  --action compute:CreateInstance \\
  --resource arn:bunker:compute:us-east-1::instance/*

# Output:
# Access: ALLOWED
# Matched Policy: DeveloperAccess
# Effective Permissions: [compute:*]
\`\`\`

### Analyze Policy

\`\`\`bash
bunker iam analyze-policy \\
  --policy-document file://policy.json

# Output:
# Analysis Results:
# - Allows 15 actions
# - Affects 3 resource types
# - No wildcards in resources (good)
# - MFA condition present (good)
# Warnings:
# - compute:* is overly permissive
\`\`\`

## Best Practices

1. **Use built-in roles** when possible
2. **Create custom roles** for specific needs
3. **Apply least privilege** - minimum necessary permissions
4. **Use conditions** for additional security
5. **Regular audits** of role assignments
6. **Test permissions** before deployment
7. **Document role purposes**
    `,
    codeExamples: [
      {
        title: 'RBAC Configuration',
        language: 'yaml',
        code: `# rbac-config.yaml
# Role definitions and bindings for the organization

roles:
  - name: custom:backend-developer
    description: Backend development team role
    permissions:
      - action: "compute:*"
        resources: ["arn:bunker:compute:*:*:instance/*"]
        conditions:
          StringEquals:
            "bunker:ResourceTag/Team": "backend"
      - action: "database:Connect"
        resources: ["arn:bunker:database:*:*:cluster/*"]
      - action: "storage:*"
        resources: ["arn:bunker:storage:::backend-*/*"]
      - action: "*:Describe*"
        resources: ["*"]

  - name: custom:production-deployer
    description: Production deployment role
    permissions:
      - action: "deploy:*"
        resources: ["arn:bunker:deploy:*:*:application/*"]
        conditions:
          StringEquals:
            "bunker:ResourceTag/Environment": "production"
          Bool:
            "bunker:MultiFactorAuthPresent": "true"

bindings:
  - principal: team:backend-engineering
    role: custom:backend-developer
    scope: project:api-services

  - principal: team:devops
    role: custom:production-deployer
    scope: project:production

  - principal: serviceAccount:ci-pipeline
    role: project:deployer
    scope: project:staging`
      }
    ],
    relatedDocs: ['iam', 'users-teams', 'service-accounts']
  },

  'api-keys': {
    id: 'api-keys',
    title: 'API Keys',
    description: 'Create and manage API keys for programmatic access',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '8 min',
    content: `
# API Keys

API keys provide programmatic access to Bunker Cloud services through the CLI, SDKs, and REST API.

## API Key Types

| Type | Use Case | Lifetime | Scope |
|------|----------|----------|-------|
| **Personal** | Individual CLI/API access | User-managed | User permissions |
| **Service Account** | Application access | Configurable | Role-based |
| **Temporary** | Short-term access | Auto-expires | Limited scope |

## Creating API Keys

### Personal API Key

\`\`\`bash
# Create API key
bunker iam api-key create \\
  --name my-cli-key \\
  --description "CLI access key"

# Output:
# API Key created successfully
# Key ID: BKAK123456789
# Secret Key: BKsk1234567890abcdef...
#
# IMPORTANT: Save your secret key now.
# You won't be able to see it again.
\`\`\`

### With Expiration

\`\`\`bash
bunker iam api-key create \\
  --name temp-key \\
  --expires-in 7d
\`\`\`

### With IP Restrictions

\`\`\`bash
bunker iam api-key create \\
  --name office-key \\
  --allowed-ips 192.168.1.0/24,10.0.0.0/8
\`\`\`

## Managing API Keys

### List Keys

\`\`\`bash
bunker iam api-key list

# Output:
# KEY ID          NAME           STATUS    CREATED      LAST USED
# BKAK123456789   my-cli-key     Active    2024-01-01   2024-01-15
# BKAK987654321   ci-pipeline    Active    2024-01-10   2024-01-15
# BKAK111222333   old-key        Inactive  2023-06-01   2023-12-01
\`\`\`

### Rotate Key

\`\`\`bash
# Create new key and get secret
bunker iam api-key rotate \\
  --key-id BKAK123456789

# Output:
# New secret key generated
# Key ID: BKAK123456789 (unchanged)
# New Secret Key: BKskNEW1234567890...
# Old secret key will remain valid for 24 hours
\`\`\`

### Disable Key

\`\`\`bash
bunker iam api-key disable --key-id BKAK123456789
\`\`\`

### Delete Key

\`\`\`bash
bunker iam api-key delete --key-id BKAK123456789
\`\`\`

## Using API Keys

### CLI Configuration

\`\`\`bash
# Configure CLI
bunker configure

# Enter your credentials:
# API Key ID: BKAK123456789
# Secret Key: BKsk1234567890abcdef...
# Default region: us-east-1

# Or set environment variables
export BUNKER_API_KEY_ID=BKAK123456789
export BUNKER_SECRET_KEY=BKsk1234567890abcdef
\`\`\`

### SDK Usage

\`\`\`javascript
const { BunkerCloud } = require('@bunkercloud/sdk');

// Using environment variables (recommended)
const client = new BunkerCloud();

// Or explicit credentials
const client = new BunkerCloud({
  apiKeyId: 'BKAK123456789',
  secretKey: 'BKsk1234567890abcdef'
});
\`\`\`

### REST API

\`\`\`bash
curl -X GET "https://api.bunkercloud.com/v1/compute/instances" \\
  -H "X-Bunker-Key-Id: BKAK123456789" \\
  -H "X-Bunker-Secret-Key: BKsk1234567890abcdef"

# Or using Authorization header
curl -X GET "https://api.bunkercloud.com/v1/compute/instances" \\
  -H "Authorization: Bunker BKAK123456789:BKsk1234567890abcdef"
\`\`\`

## API Key Security

### Best Practices

1. **Never commit keys** to version control
2. **Use environment variables** or secret managers
3. **Rotate keys regularly** (every 90 days)
4. **Use separate keys** for different environments
5. **Monitor key usage** for anomalies
6. **Delete unused keys** immediately
7. **Use IP restrictions** when possible

### Secret Storage

\`\`\`bash
# Store in secrets manager
bunker secrets put api-credentials \\
  --secret '{"keyId": "BKAK123", "secret": "BKsk..."}'

# Use in application
bunker secrets get api-credentials --output json
\`\`\`

### Monitoring Key Usage

\`\`\`bash
# View key activity
bunker iam api-key activity \\
  --key-id BKAK123456789 \\
  --start-time "2024-01-01"

# Set up alerts for suspicious activity
bunker alerts create \\
  --name api-key-anomaly \\
  --condition "api-key-usage > 1000/hour" \\
  --action notify:security-team
\`\`\`

## Key Policies

### Scope Restrictions

\`\`\`bash
# Create key with limited permissions
bunker iam api-key create \\
  --name read-only-key \\
  --policy '{
    "Version": "2024-01-01",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["*:Describe*", "*:Get*", "*:List*"],
      "Resource": "*"
    }]
  }'
\`\`\`

### Resource Restrictions

\`\`\`bash
bunker iam api-key create \\
  --name staging-only \\
  --policy '{
    "Version": "2024-01-01",
    "Statement": [{
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "bunker:ResourceTag/Environment": "staging"
        }
      }
    }]
  }'
\`\`\`

## Troubleshooting

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| InvalidKeyId | Key doesn't exist | Check key ID |
| ExpiredKey | Key has expired | Create new key |
| DisabledKey | Key is disabled | Enable or create new |
| AccessDenied | Insufficient permissions | Check key policy |
| RateLimitExceeded | Too many requests | Implement backoff |
    `,
    codeExamples: [
      {
        title: 'Secure API Key Management',
        language: 'python',
        code: `import os
import bunkercloud

# Best practice: Use environment variables
client = bunkercloud.Client(
    api_key_id=os.environ['BUNKER_API_KEY_ID'],
    secret_key=os.environ['BUNKER_SECRET_KEY']
)

# Or fetch from secrets manager
def get_api_credentials():
    secrets_client = bunkercloud.SecretsClient()
    creds = secrets_client.get_secret('api-credentials')
    return creds['keyId'], creds['secretKey']

# Rotate keys programmatically
def rotate_api_key(key_id: str):
    iam = client.iam

    # Create new key
    new_key = iam.api_keys.rotate(key_id)

    # Update secrets manager
    secrets_client = bunkercloud.SecretsClient()
    secrets_client.put_secret('api-credentials', {
        'keyId': new_key.key_id,
        'secretKey': new_key.secret_key
    })

    print(f"Key rotated. Old key valid for 24 hours.")
    return new_key

# Monitor key usage
def check_key_usage(key_id: str):
    usage = client.iam.api_keys.get_activity(
        key_id=key_id,
        start_time=datetime.now() - timedelta(days=7)
    )

    if usage.request_count > 10000:
        print(f"Warning: High usage on key {key_id}")

    if usage.error_rate > 0.1:
        print(f"Warning: High error rate on key {key_id}")`
      }
    ],
    relatedDocs: ['iam', 'service-accounts', 'secrets-management']
  },

  'service-accounts': {
    id: 'service-accounts',
    title: 'Service Accounts',
    description: 'Create machine identities for applications and automation',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    content: `
# Service Accounts

Service accounts are machine identities used by applications, scripts, and automation workflows to interact with Bunker Cloud services.

## Service Account Concepts

| Concept | Description |
|---------|-------------|
| **Service Account** | Machine identity |
| **Key** | Credentials for authentication |
| **Role Binding** | Permissions assigned |
| **Workload Identity** | Keyless authentication |

## Creating Service Accounts

### Basic Service Account

\`\`\`bash
bunker iam service-account create \\
  --name ci-pipeline \\
  --description "CI/CD pipeline service account" \\
  --project my-project
\`\`\`

### With Role Binding

\`\`\`bash
bunker iam service-account create \\
  --name deployment-sa \\
  --description "Deployment automation" \\
  --project my-project \\
  --roles project:deployer,compute:admin
\`\`\`

## Service Account Keys

### Create Key

\`\`\`bash
bunker iam service-account key create \\
  --service-account ci-pipeline \\
  --output-file ci-pipeline-key.json

# Key file contents:
# {
#   "type": "service_account",
#   "project_id": "my-project",
#   "service_account_id": "ci-pipeline",
#   "key_id": "key-123456",
#   "private_key": "-----BEGIN PRIVATE KEY-----\\n..."
# }
\`\`\`

### List Keys

\`\`\`bash
bunker iam service-account key list \\
  --service-account ci-pipeline

# Output:
# KEY ID        CREATED      EXPIRES     STATUS
# key-123456    2024-01-01   Never       Active
# key-789012    2024-01-15   2024-04-15  Active
\`\`\`

### Delete Key

\`\`\`bash
bunker iam service-account key delete \\
  --service-account ci-pipeline \\
  --key-id key-123456
\`\`\`

## Using Service Accounts

### In Applications

\`\`\`javascript
const { BunkerCloud } = require('@bunkercloud/sdk');

// Using key file
const client = new BunkerCloud({
  keyFile: './ci-pipeline-key.json'
});

// Or using environment variable
// BUNKER_SERVICE_ACCOUNT_KEY=/path/to/key.json
const client = new BunkerCloud();
\`\`\`

### In CI/CD Pipelines

\`\`\`yaml
# GitHub Actions
name: Deploy
on: push

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Authenticate to Bunker Cloud
        uses: bunkercloud/auth-action@v1
        with:
          service_account_key: \${{ secrets.BUNKER_SA_KEY }}

      - name: Deploy application
        run: bunker deploy --app my-app
\`\`\`

\`\`\`yaml
# GitLab CI
deploy:
  stage: deploy
  script:
    - echo "$BUNKER_SA_KEY" > /tmp/sa-key.json
    - export BUNKER_SERVICE_ACCOUNT_KEY=/tmp/sa-key.json
    - bunker deploy --app my-app
\`\`\`

## Workload Identity (Keyless)

Authenticate without managing keys by federating with external identity providers.

### Configure Workload Identity Pool

\`\`\`bash
# Create identity pool
bunker iam workload-identity-pool create \\
  --name github-actions \\
  --description "GitHub Actions OIDC"

# Add provider
bunker iam workload-identity-pool provider create \\
  --pool github-actions \\
  --name github-oidc \\
  --type oidc \\
  --issuer https://token.actions.githubusercontent.com \\
  --attribute-mapping 'google.subject=assertion.sub,attribute.repository=assertion.repository'
\`\`\`

### Grant Access

\`\`\`bash
bunker iam service-account add-binding \\
  --service-account deployment-sa \\
  --member "principalSet://iam.bunkercloud.com/projects/my-project/locations/global/workloadIdentityPools/github-actions/attribute.repository/myorg/myrepo" \\
  --role roles/deploy.deployer
\`\`\`

### Use in GitHub Actions

\`\`\`yaml
name: Deploy
on: push

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Authenticate with Workload Identity
        uses: bunkercloud/auth-action@v1
        with:
          workload_identity_provider: projects/my-project/locations/global/workloadIdentityPools/github-actions/providers/github-oidc
          service_account: deployment-sa@my-project.bunkercloud.com

      - name: Deploy
        run: bunker deploy --app my-app
\`\`\`

## Service Account Impersonation

### Grant Impersonation

\`\`\`bash
# Allow user to impersonate service account
bunker iam service-account add-binding \\
  --service-account deployment-sa \\
  --member user:admin@company.com \\
  --role roles/iam.serviceAccountTokenCreator
\`\`\`

### Impersonate

\`\`\`bash
# Using CLI
bunker iam impersonate \\
  --service-account deployment-sa@my-project.bunkercloud.com

# In code
const client = new BunkerCloud({
  impersonateServiceAccount: 'deployment-sa@my-project.bunkercloud.com'
});
\`\`\`

## Best Practices

1. **Use workload identity** instead of keys when possible
2. **One service account per workload** - don't share
3. **Minimum permissions** - principle of least privilege
4. **Rotate keys regularly** - automate rotation
5. **Monitor usage** - detect anomalies
6. **Use short-lived keys** - expire keys automatically
7. **Audit bindings** - review permissions regularly
    `,
    codeExamples: [
      {
        title: 'Service Account Management',
        language: 'python',
        code: `import bunkercloud
import json
from datetime import datetime, timedelta

client = bunkercloud.Client()

def create_service_account(name: str, roles: list[str], project: str):
    """Create a service account with specific roles."""

    # Create service account
    sa = client.iam.service_accounts.create(
        name=name,
        description=f"Service account for {name}",
        project=project
    )

    # Assign roles
    for role in roles:
        client.iam.add_binding(
            resource=f"projects/{project}",
            member=f"serviceAccount:{sa.email}",
            role=role
        )

    # Create key with expiration
    key = client.iam.service_accounts.keys.create(
        service_account=sa.email,
        expires_at=datetime.now() + timedelta(days=90)
    )

    return sa, key

def rotate_service_account_key(sa_email: str):
    """Rotate service account key."""

    # Create new key
    new_key = client.iam.service_accounts.keys.create(
        service_account=sa_email,
        expires_at=datetime.now() + timedelta(days=90)
    )

    # List and delete old keys (except the new one)
    keys = client.iam.service_accounts.keys.list(sa_email)
    for key in keys:
        if key.id != new_key.id:
            client.iam.service_accounts.keys.delete(
                service_account=sa_email,
                key_id=key.id
            )

    return new_key

def audit_service_accounts(project: str):
    """Audit service accounts in a project."""

    accounts = client.iam.service_accounts.list(project=project)

    for sa in accounts:
        # Check key age
        keys = client.iam.service_accounts.keys.list(sa.email)
        for key in keys:
            age = datetime.now() - key.created_at
            if age.days > 90:
                print(f"Warning: Key {key.id} for {sa.email} is {age.days} days old")

        # Check last usage
        if sa.last_used and (datetime.now() - sa.last_used).days > 30:
            print(f"Warning: {sa.email} hasn't been used in 30+ days")`
      }
    ],
    relatedDocs: ['api-keys', 'iam', 'roles-permissions']
  },

  'secrets-management': {
    id: 'secrets-management',
    title: 'Secrets Management',
    description: 'Securely store and manage sensitive data',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Secrets Management

Bunker Cloud Secrets Manager provides secure storage and management for sensitive data like API keys, passwords, certificates, and other credentials.

## Overview

### Features

| Feature | Description |
|---------|-------------|
| **Encryption** | AES-256 encryption at rest |
| **Rotation** | Automatic secret rotation |
| **Versioning** | Secret version history |
| **Access Control** | IAM-based permissions |
| **Audit Logging** | Full access audit trail |
| **Integration** | Native SDK support |

## Creating Secrets

### Basic Secret

\`\`\`bash
# Create text secret
bunker secrets create \\
  --name database-password \\
  --value "super-secret-password"

# Create JSON secret
bunker secrets create \\
  --name api-credentials \\
  --value '{"apiKey": "abc123", "apiSecret": "xyz789"}'
\`\`\`

### From File

\`\`\`bash
# Certificate or key file
bunker secrets create \\
  --name tls-certificate \\
  --value-file ./certificate.pem \\
  --binary

# JSON file
bunker secrets create \\
  --name config \\
  --value-file ./config.json
\`\`\`

### With Metadata

\`\`\`bash
bunker secrets create \\
  --name production-db \\
  --value "password123" \\
  --description "Production database password" \\
  --tags environment=production,service=api \\
  --rotation-schedule "rate(30 days)"
\`\`\`

## Retrieving Secrets

### CLI

\`\`\`bash
# Get current version
bunker secrets get --name database-password

# Get specific version
bunker secrets get --name database-password --version 2

# Get as JSON
bunker secrets get --name api-credentials --output json
\`\`\`

### SDK

\`\`\`javascript
const { SecretsClient } = require('@bunkercloud/sdk');

const secrets = new SecretsClient();

// Get secret value
const password = await secrets.get('database-password');
console.log(password);

// Get JSON secret
const creds = await secrets.getJSON('api-credentials');
console.log(creds.apiKey);

// Get specific version
const oldPassword = await secrets.get('database-password', { version: 1 });
\`\`\`

### In Applications

\`\`\`python
import bunkercloud

secrets = bunkercloud.SecretsClient()

# Direct retrieval
db_password = secrets.get('database-password')

# With caching
db_password = secrets.get('database-password', cache_ttl=300)  # 5 min cache

# Batch retrieval
all_secrets = secrets.get_batch([
    'database-password',
    'api-key',
    'redis-password'
])
\`\`\`

## Updating Secrets

### Update Value

\`\`\`bash
# Update creates new version
bunker secrets update \\
  --name database-password \\
  --value "new-password"

# Update with staged version
bunker secrets update \\
  --name database-password \\
  --value "new-password" \\
  --staging-label PENDING
\`\`\`

### Promote Version

\`\`\`bash
# Make staged version current
bunker secrets promote \\
  --name database-password \\
  --version-stage PENDING
\`\`\`

## Secret Rotation

### Automatic Rotation

\`\`\`bash
# Enable rotation
bunker secrets rotation enable \\
  --name database-password \\
  --rotation-lambda arn:bunker:lambda:rotate-db-password \\
  --rotation-schedule "rate(30 days)"

# Trigger immediate rotation
bunker secrets rotate --name database-password
\`\`\`

### Rotation Lambda Template

\`\`\`python
import bunkercloud
import secrets
import string

def handler(event, context):
    secret_name = event['SecretId']
    step = event['Step']

    secrets_client = bunkercloud.SecretsClient()

    if step == 'createSecret':
        # Generate new password
        new_password = ''.join(
            secrets.choice(string.ascii_letters + string.digits)
            for _ in range(32)
        )
        secrets_client.put_secret_value(
            secret_name,
            new_password,
            version_stage='PENDING'
        )

    elif step == 'setSecret':
        # Update the resource with new password
        pending = secrets_client.get(secret_name, version_stage='PENDING')
        update_database_password(pending)

    elif step == 'testSecret':
        # Verify new password works
        pending = secrets_client.get(secret_name, version_stage='PENDING')
        test_database_connection(pending)

    elif step == 'finishSecret':
        # Promote pending to current
        secrets_client.promote_version(
            secret_name,
            version_stage='PENDING'
        )
\`\`\`

## Access Control

### IAM Policy

\`\`\`json
{
  "Version": "2024-01-01",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secrets:GetSecretValue"
      ],
      "Resource": "arn:bunker:secrets:*:*:secret:production-*",
      "Condition": {
        "StringEquals": {
          "bunker:ResourceTag/Environment": "production"
        }
      }
    }
  ]
}
\`\`\`

### Resource Policy

\`\`\`bash
bunker secrets policy put \\
  --name database-password \\
  --policy '{
    "Version": "2024-01-01",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {
        "Service": "compute.bunkercloud.com"
      },
      "Action": "secrets:GetSecretValue",
      "Resource": "*"
    }]
  }'
\`\`\`

## Secret References

### In Environment Variables

\`\`\`yaml
# Container definition
containers:
  - name: api
    image: myapp:latest
    environment:
      - name: DB_PASSWORD
        valueFrom:
          secretRef:
            name: database-password
      - name: API_KEY
        valueFrom:
          secretRef:
            name: api-credentials
            key: apiKey
\`\`\`

### In Configuration Files

\`\`\`yaml
# Application config with secret reference
database:
  host: db.example.com
  port: 5432
  username: admin
  password: "{{secrets:database-password}}"
\`\`\`

## Versioning

### List Versions

\`\`\`bash
bunker secrets versions \\
  --name database-password

# Output:
# VERSION   STAGE      CREATED
# v3        CURRENT    2024-01-15
# v2        PREVIOUS   2024-01-01
# v1        -          2023-12-15
\`\`\`

### Restore Previous Version

\`\`\`bash
bunker secrets restore \\
  --name database-password \\
  --version v2
\`\`\`

## Replication

### Cross-Region Replication

\`\`\`bash
bunker secrets replicate \\
  --name database-password \\
  --replica-regions us-west-2,eu-west-1

# List replicas
bunker secrets describe \\
  --name database-password \\
  --show-replicas
\`\`\`

## Best Practices

1. **Use secrets manager** instead of config files
2. **Enable rotation** for all database credentials
3. **Use IAM conditions** to restrict access
4. **Enable audit logging** for compliance
5. **Replicate critical secrets** across regions
6. **Use versioning** for rollback capability
7. **Never log secrets** - use redaction
    `,
    codeExamples: [
      {
        title: 'Secrets Integration',
        language: 'javascript',
        code: `const { SecretsClient, KMS } = require('@bunkercloud/sdk');

class SecretManager {
  constructor() {
    this.client = new SecretsClient();
    this.cache = new Map();
    this.cacheTTL = 300000; // 5 minutes
  }

  async getSecret(name, options = {}) {
    const cacheKey = \`\${name}:\${options.version || 'current'}\`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.value;
      }
    }

    // Fetch from Secrets Manager
    const secret = await this.client.get(name, {
      version: options.version,
      versionStage: options.stage
    });

    // Cache the result
    this.cache.set(cacheKey, {
      value: secret,
      timestamp: Date.now()
    });

    return secret;
  }

  async getJSON(name) {
    const value = await this.getSecret(name);
    return JSON.parse(value);
  }

  async rotateSecret(name, generator) {
    // Generate new value
    const newValue = await generator();

    // Store with pending stage
    await this.client.update(name, newValue, {
      versionStage: 'PENDING'
    });

    return newValue;
  }

  async promoteSecret(name) {
    await this.client.promoteVersion(name, 'PENDING');
    this.cache.delete(\`\${name}:current\`);
  }
}

// Usage
const secrets = new SecretManager();

async function connectDatabase() {
  const creds = await secrets.getJSON('database-credentials');

  return createConnection({
    host: creds.host,
    user: creds.username,
    password: creds.password,
    database: creds.database
  });
}`
      }
    ],
    relatedDocs: ['encryption', 'api-keys', 'security-overview']
  },

  'encryption': {
    id: 'encryption',
    title: 'Encryption',
    description: 'Encrypt data at rest and in transit',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Encryption

Bunker Cloud provides comprehensive encryption capabilities to protect your data both at rest and in transit.

## Encryption Overview

| Type | Protection | Default |
|------|------------|---------|
| **At Rest** | Stored data | AES-256 |
| **In Transit** | Network traffic | TLS 1.2+ |
| **Client-Side** | Before upload | Optional |

## Encryption at Rest

### Default Encryption

All Bunker Cloud services encrypt data at rest by default:

| Service | Encryption | Key Management |
|---------|------------|----------------|
| Fortress Storage | AES-256 | SSE-S3 or SSE-KMS |
| Block Volumes | AES-256 | KMS |
| Databases | AES-256 | KMS |
| Secrets Manager | AES-256 | KMS |
| Backups | AES-256 | KMS |

### Server-Side Encryption (SSE)

#### SSE-S3 (Bunker Managed)

\`\`\`bash
# Default - automatic
bunker storage cp file.txt s3://my-bucket/

# Explicit
bunker storage cp file.txt s3://my-bucket/ \\
  --sse AES256
\`\`\`

#### SSE-KMS (Customer Key)

\`\`\`bash
# Use customer managed key
bunker storage cp file.txt s3://my-bucket/ \\
  --sse bunker:kms \\
  --sse-kms-key-id arn:bunker:kms:us-east-1:123456:key/my-key
\`\`\`

### Default Bucket Encryption

\`\`\`bash
bunker storage bucket encryption put \\
  --bucket my-bucket \\
  --sse-algorithm bunker:kms \\
  --kms-key-id arn:bunker:kms:us-east-1:123456:key/my-key
\`\`\`

## Key Management Service (KMS)

### Create Key

\`\`\`bash
# Create symmetric key
bunker kms key create \\
  --name my-encryption-key \\
  --description "Data encryption key" \\
  --key-usage ENCRYPT_DECRYPT

# Create asymmetric key
bunker kms key create \\
  --name my-signing-key \\
  --key-usage SIGN_VERIFY \\
  --key-spec RSA_2048
\`\`\`

### Key Policy

\`\`\`bash
bunker kms key policy put \\
  --key-id my-key \\
  --policy '{
    "Version": "2024-01-01",
    "Statement": [
      {
        "Sid": "Enable IAM policies",
        "Effect": "Allow",
        "Principal": {"AWS": "arn:bunker:iam::123456:root"},
        "Action": "kms:*",
        "Resource": "*"
      },
      {
        "Sid": "Allow use by specific role",
        "Effect": "Allow",
        "Principal": {"AWS": "arn:bunker:iam::123456:role/AppRole"},
        "Action": [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ],
        "Resource": "*"
      }
    ]
  }'
\`\`\`

### Encrypt/Decrypt

\`\`\`bash
# Encrypt data
bunker kms encrypt \\
  --key-id my-key \\
  --plaintext "sensitive data" \\
  --output ciphertext.bin

# Decrypt data
bunker kms decrypt \\
  --key-id my-key \\
  --ciphertext-blob file://ciphertext.bin
\`\`\`

### Data Key Generation

\`\`\`bash
# Generate data key for envelope encryption
bunker kms generate-data-key \\
  --key-id my-key \\
  --key-spec AES_256

# Output:
# PlaintextKey: (base64 encoded key)
# CiphertextBlob: (encrypted key)
# KeyId: arn:bunker:kms:us-east-1:123456:key/my-key
\`\`\`

### Envelope Encryption

\`\`\`
┌───────────────────────────────────────────────────────────┐
│                   Envelope Encryption                      │
├───────────────────────────────────────────────────────────┤
│                                                            │
│   1. Generate Data Key                                     │
│      ┌────────┐         ┌────────────┐                    │
│      │  KMS   │────────►│ Data Key   │                    │
│      │        │         │ (plaintext)│                    │
│      └────────┘         └────────────┘                    │
│                                                            │
│   2. Encrypt Data with Data Key                           │
│      ┌────────────┐    ┌─────────────┐                    │
│      │ Data Key   │───►│ Encrypted   │                    │
│      │ (plaintext)│    │    Data     │                    │
│      └────────────┘    └─────────────┘                    │
│           +                                                │
│      ┌──────────┐                                         │
│      │ Your Data│                                         │
│      └──────────┘                                         │
│                                                            │
│   3. Store Encrypted Data Key with Data                   │
│      ┌─────────────┐  ┌────────────────────┐             │
│      │ Encrypted   │  │ Encrypted Data Key │             │
│      │    Data     │  │   (ciphertext)     │             │
│      └─────────────┘  └────────────────────┘             │
│                                                            │
└───────────────────────────────────────────────────────────┘
\`\`\`

### SDK Example

\`\`\`javascript
const { KMS, Storage } = require('@bunkercloud/sdk');

const kms = new KMS();
const storage = new Storage();

async function encryptAndStore(data, bucket, key) {
  // Generate data key
  const { Plaintext, CiphertextBlob } = await kms.generateDataKey({
    KeyId: 'alias/my-key',
    KeySpec: 'AES_256'
  });

  // Encrypt data with plaintext key
  const cipher = crypto.createCipheriv('aes-256-gcm', Plaintext, iv);
  const encrypted = Buffer.concat([
    cipher.update(data),
    cipher.final()
  ]);

  // Store encrypted data with encrypted key
  await storage.putObject({
    Bucket: bucket,
    Key: key,
    Body: encrypted,
    Metadata: {
      'x-bunker-encrypted-key': CiphertextBlob.toString('base64'),
      'x-bunker-iv': iv.toString('base64')
    }
  });

  // Clear plaintext key from memory
  Plaintext.fill(0);
}
\`\`\`

## Key Rotation

### Automatic Rotation

\`\`\`bash
# Enable automatic rotation
bunker kms key enable-rotation \\
  --key-id my-key \\
  --rotation-period 365  # days

# Check rotation status
bunker kms key rotation-status \\
  --key-id my-key
\`\`\`

### Manual Rotation

\`\`\`bash
# Rotate key material
bunker kms key rotate \\
  --key-id my-key

# Import new key material (for imported keys)
bunker kms key import-material \\
  --key-id my-key \\
  --key-material file://new-key-material.bin
\`\`\`

## Encryption in Transit

### TLS Configuration

All Bunker Cloud endpoints require TLS 1.2+:

\`\`\`bash
# Check supported protocols
openssl s_client -connect api.bunkercloud.com:443 -tls1_3

# Supported cipher suites
TLS_AES_256_GCM_SHA384
TLS_AES_128_GCM_SHA256
TLS_CHACHA20_POLY1305_SHA256
\`\`\`

### Certificate Pinning

\`\`\`javascript
const https = require('https');
const { BunkerCloud } = require('@bunkercloud/sdk');

const client = new BunkerCloud({
  // Pin to Bunker Cloud's root CA
  ca: fs.readFileSync('./bunker-root-ca.pem'),
  checkServerIdentity: (host, cert) => {
    // Verify certificate fingerprint
    const fingerprint = cert.fingerprint256;
    const expected = 'XX:XX:XX:...';
    if (fingerprint !== expected) {
      throw new Error('Certificate fingerprint mismatch');
    }
  }
});
\`\`\`

## Client-Side Encryption

### S3 Client-Side Encryption

\`\`\`javascript
const { S3EncryptionClient } = require('@bunkercloud/sdk-encryption');

const encryptionClient = new S3EncryptionClient({
  kmsKeyId: 'alias/my-key'
});

// Upload with client-side encryption
await encryptionClient.putObject({
  Bucket: 'my-bucket',
  Key: 'secret-file.txt',
  Body: 'sensitive data'
});

// Download and decrypt
const data = await encryptionClient.getObject({
  Bucket: 'my-bucket',
  Key: 'secret-file.txt'
});
\`\`\`

## Best Practices

1. **Use KMS** for all encryption keys
2. **Enable automatic rotation** for symmetric keys
3. **Use envelope encryption** for large data
4. **Separate keys** by environment and use case
5. **Enable key deletion protection** for production keys
6. **Audit key usage** with CloudTrail
7. **Use customer managed keys** for sensitive data
    `,
    codeExamples: [
      {
        title: 'KMS Encryption Service',
        language: 'python',
        code: `import bunkercloud
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os
import base64

class EncryptionService:
    def __init__(self, key_id: str):
        self.kms = bunkercloud.KMS()
        self.key_id = key_id

    def encrypt(self, plaintext: bytes) -> dict:
        """Encrypt data using envelope encryption."""

        # Generate data key
        response = self.kms.generate_data_key(
            KeyId=self.key_id,
            KeySpec='AES_256'
        )

        plaintext_key = response['Plaintext']
        encrypted_key = response['CiphertextBlob']

        # Generate nonce
        nonce = os.urandom(12)

        # Encrypt data
        aesgcm = AESGCM(plaintext_key)
        ciphertext = aesgcm.encrypt(nonce, plaintext, None)

        # Clear plaintext key
        plaintext_key = b'\\x00' * len(plaintext_key)

        return {
            'ciphertext': base64.b64encode(ciphertext).decode(),
            'encrypted_key': base64.b64encode(encrypted_key).decode(),
            'nonce': base64.b64encode(nonce).decode()
        }

    def decrypt(self, encrypted_data: dict) -> bytes:
        """Decrypt data using envelope encryption."""

        encrypted_key = base64.b64decode(encrypted_data['encrypted_key'])
        ciphertext = base64.b64decode(encrypted_data['ciphertext'])
        nonce = base64.b64decode(encrypted_data['nonce'])

        # Decrypt data key
        response = self.kms.decrypt(
            KeyId=self.key_id,
            CiphertextBlob=encrypted_key
        )

        plaintext_key = response['Plaintext']

        # Decrypt data
        aesgcm = AESGCM(plaintext_key)
        plaintext = aesgcm.decrypt(nonce, ciphertext, None)

        # Clear plaintext key
        plaintext_key = b'\\x00' * len(plaintext_key)

        return plaintext

# Usage
encryption = EncryptionService('alias/my-key')
encrypted = encryption.encrypt(b'sensitive data')
decrypted = encryption.decrypt(encrypted)`
      }
    ],
    relatedDocs: ['secrets-management', 'security-overview', 'compliance']
  },

  'audit-logs': {
    id: 'audit-logs',
    title: 'Audit Logs',
    description: 'Track and analyze activity in your Bunker Cloud account',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    content: `
# Audit Logs

Bunker Cloud Audit Logs capture all API activity in your account, providing complete visibility for security analysis, compliance, and troubleshooting.

## Overview

### What's Logged

| Event Type | Description | Examples |
|------------|-------------|----------|
| **Management** | Control plane operations | Create/Delete resources |
| **Data** | Data plane operations | S3 GetObject, DB queries |
| **Console** | Console sign-in events | Successful/failed logins |
| **Insights** | Unusual activity | API call anomalies |

### Log Entry Structure

\`\`\`json
{
  "eventVersion": "1.0",
  "eventTime": "2024-01-15T10:30:00Z",
  "eventSource": "compute.bunkercloud.com",
  "eventName": "StartInstance",
  "userIdentity": {
    "type": "IAMUser",
    "principalId": "AIDAXXXXXXXX",
    "arn": "arn:bunker:iam::123456:user/admin",
    "accountId": "123456789012",
    "userName": "admin"
  },
  "sourceIPAddress": "203.0.113.50",
  "userAgent": "bunker-cli/2.0.0",
  "requestParameters": {
    "instanceId": "i-12345678"
  },
  "responseElements": {
    "instanceState": {
      "code": 0,
      "name": "pending"
    }
  },
  "requestID": "abc123-def456",
  "eventID": "xyz789",
  "eventType": "BunkerApiCall",
  "recipientAccountId": "123456789012"
}
\`\`\`

## Enabling Audit Logs

### Create Trail

\`\`\`bash
# Create trail for all regions
bunker audit create-trail \\
  --name organization-audit \\
  --s3-bucket audit-logs-bucket \\
  --is-multi-region \\
  --include-global-events \\
  --enable-log-file-validation

# Create trail with encryption
bunker audit create-trail \\
  --name encrypted-audit \\
  --s3-bucket audit-logs-bucket \\
  --kms-key-id alias/audit-key \\
  --enable-log-file-validation
\`\`\`

### Configure Event Selectors

\`\`\`bash
# Log all management events
bunker audit put-event-selectors \\
  --trail-name organization-audit \\
  --event-selectors '[
    {
      "ReadWriteType": "All",
      "IncludeManagementEvents": true,
      "DataResources": []
    }
  ]'

# Log S3 data events
bunker audit put-event-selectors \\
  --trail-name organization-audit \\
  --event-selectors '[
    {
      "ReadWriteType": "All",
      "IncludeManagementEvents": true,
      "DataResources": [
        {
          "Type": "Bunker::S3::Object",
          "Values": ["arn:bunker:s3:::sensitive-bucket/"]
        }
      ]
    }
  ]'
\`\`\`

## Querying Logs

### Using CLI

\`\`\`bash
# Recent events
bunker audit lookup-events \\
  --start-time "2024-01-15T00:00:00Z" \\
  --end-time "2024-01-16T00:00:00Z"

# Filter by event name
bunker audit lookup-events \\
  --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteBucket

# Filter by user
bunker audit lookup-events \\
  --lookup-attributes AttributeKey=Username,AttributeValue=admin

# Filter by resource
bunker audit lookup-events \\
  --lookup-attributes AttributeKey=ResourceName,AttributeValue=i-12345678
\`\`\`

### Using Log Insights

\`\`\`bash
# Query with Log Insights
bunker logs insights query \\
  --log-group bunker-audit-logs \\
  --query 'fields @timestamp, eventName, userIdentity.userName, sourceIPAddress
           | filter eventSource = "iam.bunkercloud.com"
           | filter eventName like /Delete/
           | sort @timestamp desc
           | limit 100'
\`\`\`

### Common Queries

#### Failed API Calls

\`\`\`sql
fields @timestamp, eventName, errorCode, errorMessage, userIdentity.userName
| filter errorCode != ""
| sort @timestamp desc
| limit 50
\`\`\`

#### Root Account Usage

\`\`\`sql
fields @timestamp, eventName, sourceIPAddress
| filter userIdentity.type = "Root"
| sort @timestamp desc
\`\`\`

#### Security Group Changes

\`\`\`sql
fields @timestamp, eventName, requestParameters, userIdentity.userName
| filter eventSource = "vpc.bunkercloud.com"
| filter eventName like /SecurityGroup/
| sort @timestamp desc
\`\`\`

#### Console Logins

\`\`\`sql
fields @timestamp, userIdentity.userName, sourceIPAddress, responseElements.ConsoleLogin
| filter eventName = "ConsoleLogin"
| sort @timestamp desc
\`\`\`

## Log Analysis

### Security Analysis

\`\`\`bash
# Detect unusual activity
bunker audit insights \\
  --insight-type UnusualApiCalls \\
  --start-time "2024-01-01" \\
  --end-time "2024-01-31"

# Analyze by IP
bunker audit analyze \\
  --group-by sourceIPAddress \\
  --metric eventCount \\
  --top 10
\`\`\`

### Compliance Reports

\`\`\`bash
# Generate compliance report
bunker audit report generate \\
  --report-type activity-summary \\
  --start-time "2024-01-01" \\
  --end-time "2024-01-31" \\
  --output report.pdf
\`\`\`

## Real-time Monitoring

### CloudWatch Integration

\`\`\`bash
# Send logs to CloudWatch
bunker audit update-trail \\
  --name organization-audit \\
  --cloud-watch-logs-log-group audit-log-group \\
  --cloud-watch-logs-role-arn arn:bunker:iam::123456:role/AuditLogRole
\`\`\`

### Event Notifications

\`\`\`bash
# Create SNS topic for audit alerts
bunker sns create-topic --name audit-alerts

# Create CloudWatch alarm
bunker cloudwatch put-metric-alarm \\
  --alarm-name RootAccountUsage \\
  --metric-name RootAccountUsageCount \\
  --namespace AuditLogs \\
  --statistic Sum \\
  --period 300 \\
  --threshold 1 \\
  --comparison-operator GreaterThanOrEqualToThreshold \\
  --alarm-actions arn:bunker:sns:us-east-1:123456:audit-alerts
\`\`\`

## Log Integrity

### Validation

\`\`\`bash
# Validate log file integrity
bunker audit validate-logs \\
  --trail-arn arn:bunker:audit::123456:trail/organization-audit \\
  --start-time "2024-01-01" \\
  --end-time "2024-01-31"
\`\`\`

### Digest Files

Log digest files are created hourly containing:
- SHA-256 hash of each log file
- Digital signature using Bunker Cloud's private key
- Reference to previous digest file (chain)

## Log Retention

\`\`\`bash
# Configure S3 lifecycle for log retention
bunker storage lifecycle put \\
  --bucket audit-logs-bucket \\
  --rules '[
    {
      "ID": "ArchiveOldLogs",
      "Status": "Enabled",
      "Transitions": [
        {"Days": 90, "StorageClass": "GLACIER"},
        {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}
      ],
      "Expiration": {"Days": 2555}
    }
  ]'
\`\`\`

## Best Practices

1. **Enable for all regions** - Use multi-region trails
2. **Enable log validation** - Ensure integrity
3. **Use encryption** - Protect sensitive log data
4. **Set up alerts** - Monitor for security events
5. **Archive logs** - Comply with retention requirements
6. **Regular analysis** - Review logs proactively
7. **Integrate with SIEM** - Centralize security monitoring
    `,
    codeExamples: [
      {
        title: 'Audit Log Analysis',
        language: 'python',
        code: `import bunkercloud
from datetime import datetime, timedelta
from collections import defaultdict

class AuditAnalyzer:
    def __init__(self):
        self.audit = bunkercloud.AuditLogs()
        self.logs = bunkercloud.Logs()

    def get_security_events(self, hours=24):
        """Get security-relevant events."""
        start = datetime.utcnow() - timedelta(hours=hours)

        events = self.audit.lookup_events(
            StartTime=start,
            LookupAttributes=[
                {'AttributeKey': 'EventSource', 'AttributeValue': 'iam.bunkercloud.com'}
            ]
        )

        security_events = []
        for event in events['Events']:
            if any(keyword in event['EventName'] for keyword in
                   ['Delete', 'Create', 'Update', 'Attach', 'Detach']):
                security_events.append(event)

        return security_events

    def detect_anomalies(self, hours=24):
        """Detect unusual activity patterns."""
        start = datetime.utcnow() - timedelta(hours=hours)

        # Get all events
        events = self.audit.lookup_events(StartTime=start)

        # Analyze patterns
        by_user = defaultdict(list)
        by_ip = defaultdict(list)
        by_action = defaultdict(int)

        for event in events['Events']:
            user = event.get('Username', 'unknown')
            ip = event.get('SourceIPAddress', 'unknown')
            action = event.get('EventName', 'unknown')

            by_user[user].append(event)
            by_ip[ip].append(event)
            by_action[action] += 1

        anomalies = []

        # Check for unusual activity
        for user, user_events in by_user.items():
            if len(user_events) > 100:  # High activity threshold
                anomalies.append({
                    'type': 'high_activity',
                    'user': user,
                    'count': len(user_events)
                })

        # Check for new IPs
        for ip, ip_events in by_ip.items():
            users = set(e.get('Username') for e in ip_events)
            if len(users) > 3:  # Multiple users from same IP
                anomalies.append({
                    'type': 'shared_ip',
                    'ip': ip,
                    'users': list(users)
                })

        return anomalies

    def generate_compliance_report(self, start_date, end_date):
        """Generate compliance activity report."""
        query = '''
        fields @timestamp, eventName, userIdentity.userName,
               sourceIPAddress, errorCode
        | stats count() as eventCount by eventName, userIdentity.userName
        | sort eventCount desc
        '''

        results = self.logs.insights_query(
            logGroupName='bunker-audit-logs',
            query=query,
            startTime=int(start_date.timestamp() * 1000),
            endTime=int(end_date.timestamp() * 1000)
        )

        return results

# Usage
analyzer = AuditAnalyzer()
anomalies = analyzer.detect_anomalies()
for anomaly in anomalies:
    print(f"Anomaly detected: {anomaly}")`
      }
    ],
    relatedDocs: ['security-overview', 'compliance', 'monitoring-overview']
  },

  'compliance': {
    id: 'compliance',
    title: 'Compliance & Certifications',
    description: 'Security certifications and compliance programs',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# Compliance & Certifications

Bunker Cloud maintains rigorous security and compliance standards to help you meet your regulatory requirements.

## Certifications

### SOC 2 Type II

Our SOC 2 Type II report covers:

| Trust Principle | Coverage |
|-----------------|----------|
| Security | Access controls, encryption, monitoring |
| Availability | Uptime, disaster recovery, redundancy |
| Confidentiality | Data protection, access management |
| Processing Integrity | Accuracy, completeness, timeliness |
| Privacy | Data handling, consent management |

**Report availability:** Annual reports available under NDA.

### ISO 27001

Information Security Management System (ISMS) certified:

- Risk management framework
- Security policies and procedures
- Continuous improvement process
- Regular third-party audits

**Certificate validity:** 3 years with annual surveillance audits.

### PCI DSS Level 1

Payment Card Industry Data Security Standard:

| Requirement | Implementation |
|-------------|----------------|
| Network Security | Firewalls, segmentation |
| Access Control | MFA, least privilege |
| Data Protection | Encryption, tokenization |
| Monitoring | Logging, alerting |
| Testing | Penetration testing, scans |

**Scope:** All services handling cardholder data.

## Regulatory Compliance

### GDPR

General Data Protection Regulation compliance:

| Article | Implementation |
|---------|----------------|
| Art. 25 | Privacy by design |
| Art. 28 | Data processing agreement |
| Art. 32 | Security measures |
| Art. 33 | Breach notification |
| Art. 35 | Impact assessments |

**Resources:**
- Data Processing Addendum (DPA)
- Sub-processor list
- Privacy documentation

### HIPAA

Health Insurance Portability and Accountability Act:

| Safeguard | Implementation |
|-----------|----------------|
| Administrative | Policies, training, risk analysis |
| Physical | Data center security, access controls |
| Technical | Encryption, audit logs, access management |

**Requirements:**
- Business Associate Agreement (BAA)
- HIPAA-eligible services only
- PHI handling procedures

### SOX

Sarbanes-Oxley Act compliance:

- Financial data integrity controls
- Access management
- Audit trails
- Change management

## Regional Compliance

### US

| Program | Status |
|---------|--------|
| FedRAMP | In Progress (Moderate) |
| ITAR | Compliant |
| CJIS | Compliant |
| StateRAMP | Certified |

### EU

| Program | Status |
|---------|--------|
| GDPR | Compliant |
| EU Data Boundary | Available |
| Cloud Code of Conduct | Certified |

### Other Regions

| Region | Compliance |
|--------|------------|
| UK | UK GDPR, Cyber Essentials |
| Canada | PIPEDA |
| Australia | IRAP |
| Singapore | MTCS |

## Compliance Tools

### Security Hub

\`\`\`bash
# Enable Security Hub
bunker security-hub enable

# Run compliance check
bunker security-hub standards enable \\
  --standards pci-dss-3.2.1,cis-benchmarks

# View compliance status
bunker security-hub compliance-status
\`\`\`

### Config Rules

\`\`\`bash
# Enable managed rules for compliance
bunker config rules enable \\
  --conformance-pack pci-dss

# View compliance results
bunker config compliance-summary
\`\`\`

### Audit Manager

\`\`\`bash
# Create assessment
bunker audit-manager create-assessment \\
  --name "Annual SOC 2 Assessment" \\
  --framework soc2-type2 \\
  --scope resources=all

# Generate report
bunker audit-manager generate-report \\
  --assessment-id asmt-123 \\
  --format pdf
\`\`\`

## Compliance Reports

### Accessing Reports

\`\`\`bash
# List available reports
bunker artifact list-reports

# Download report
bunker artifact download-report \\
  --report-id soc2-2024 \\
  --output soc2-report.pdf
\`\`\`

### Available Reports

| Report | Frequency | Access |
|--------|-----------|--------|
| SOC 2 Type II | Annual | NDA required |
| SOC 3 | Annual | Public |
| ISO 27001 | 3 years | Public |
| PCI AOC | Annual | On request |
| Pen Test Summary | Annual | NDA required |

## Shared Responsibility

### Bunker Cloud Responsibilities

- Physical security
- Infrastructure security
- Platform security
- Compliance certifications
- Security of the cloud

### Customer Responsibilities

- Data classification
- Access management
- Application security
- Client-side encryption
- Security in the cloud

## Best Practices

1. **Enable compliance features** - Security Hub, Config
2. **Regular assessments** - Use Audit Manager
3. **Document controls** - Maintain evidence
4. **Train teams** - Security awareness
5. **Monitor continuously** - Don't just audit annually
6. **Engage early** - Include compliance in design

## Resources

- **Trust Center** - trust.bunkercloud.com
- **Compliance Center** - compliance.bunkercloud.com
- **Security Documentation** - docs.bunkercloud.com/security
- **Contact Security** - security@bunkercloud.com
    `,
    codeExamples: [
      {
        title: 'Compliance Monitoring',
        language: 'bash',
        code: `#!/bin/bash
# Compliance monitoring setup script

# Enable Security Hub
bunker security-hub enable --region us-east-1

# Enable compliance standards
bunker security-hub batch-enable-standards \\
  --standards-subscription-requests '[
    {"StandardsArn": "arn:bunker:securityhub:::ruleset/cis-benchmark/v1.2.0"},
    {"StandardsArn": "arn:bunker:securityhub:::ruleset/pci-dss/v3.2.1"},
    {"StandardsArn": "arn:bunker:securityhub:::ruleset/bunker-foundational/v1.0.0"}
  ]'

# Create Config conformance pack
bunker config put-conformance-pack \\
  --conformance-pack-name "Operational-Best-Practices-for-PCI-DSS" \\
  --template-s3-uri s3://bunker-config-rules/pci-dss-conformance-pack.yaml

# Enable GuardDuty
bunker guard create-detector \\
  --enable \\
  --finding-publishing-frequency FIFTEEN_MINUTES

# Create Audit Manager assessment
bunker audit-manager create-assessment \\
  --name "Continuous-SOC2-Assessment" \\
  --assessment-reports-destination "s3://compliance-reports/" \\
  --framework-id soc2-type2 \\
  --roles '[
    {"roleType": "PROCESS_OWNER", "roleArn": "arn:bunker:iam::123456:role/AuditOwner"}
  ]'

echo "Compliance monitoring enabled successfully!"`
      }
    ],
    relatedDocs: ['security-overview', 'audit-logs', 'encryption']
  }
};

// Export all security doc IDs for validation
export const securityDocIds = Object.keys(securityDocs);
