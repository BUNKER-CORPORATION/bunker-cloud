// Documentation Structure for Bunker Cloud
// This defines the sidebar navigation and section organization

import {
  Zap,
  Server,
  HardDrive,
  Database,
  Network,
  Shield,
  GitBranch,
  BarChart3,
  Code,
  CreditCard,
  BookOpen,
  Terminal,
  Layers,
  Globe,
  Key,
  Lock,
  Users,
  Settings,
  Cpu,
  Box,
  Cloud,
  RefreshCw,
  Activity,
  Bell,
  FileText,
  Webhook,
  Puzzle
} from 'lucide-react';
import { DocSection } from './types';

export const docsSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics and get up and running quickly',
    icon: Zap,
    items: [
      { id: 'introduction', title: 'Introduction to Bunker Cloud' },
      { id: 'quickstart', title: 'Quickstart Guide' },
      { id: 'account-setup', title: 'Account Setup' },
      { id: 'console-overview', title: 'Console Overview' },
      { id: 'cli-installation', title: 'CLI Installation' },
      { id: 'first-deployment', title: 'Your First Deployment' },
      { id: 'core-concepts', title: 'Core Concepts' },
    ]
  },
  {
    id: 'compute',
    title: 'Compute',
    description: 'Virtual machines, containers, and serverless',
    icon: Server,
    items: [
      { id: 'compute-overview', title: 'Compute Overview' },
      { id: 'vault-instances', title: 'Vault Instances' },
      { id: 'instance-types', title: 'Instance Types & Sizing' },
      { id: 'containers', title: 'Container Deployments' },
      { id: 'kubernetes', title: 'Managed Kubernetes' },
      { id: 'serverless-functions', title: 'Serverless Functions' },
      { id: 'auto-scaling', title: 'Auto Scaling' },
      { id: 'load-balancing', title: 'Load Balancing' },
      { id: 'health-checks', title: 'Health Checks' },
    ]
  },
  {
    id: 'storage',
    title: 'Storage',
    description: 'Object, block, and file storage solutions',
    icon: HardDrive,
    items: [
      { id: 'storage-overview', title: 'Storage Overview' },
      { id: 'fortress-object-storage', title: 'Fortress Object Storage' },
      { id: 'block-volumes', title: 'Block Volumes' },
      { id: 'file-storage', title: 'File Storage (NFS)' },
      { id: 'storage-classes', title: 'Storage Classes' },
      { id: 'snapshots', title: 'Snapshots & Backups' },
      { id: 'data-transfer', title: 'Data Transfer' },
      { id: 'lifecycle-policies', title: 'Lifecycle Policies' },
    ]
  },
  {
    id: 'databases',
    title: 'Databases',
    description: 'Managed database services',
    icon: Database,
    items: [
      { id: 'databases-overview', title: 'Databases Overview' },
      { id: 'postgresql', title: 'PostgreSQL' },
      { id: 'mysql', title: 'MySQL' },
      { id: 'mongodb', title: 'MongoDB' },
      { id: 'redis', title: 'Redis' },
      { id: 'connection-pooling', title: 'Connection Pooling' },
      { id: 'read-replicas', title: 'Read Replicas' },
      { id: 'database-backups', title: 'Backups & Recovery' },
      { id: 'database-migration', title: 'Database Migration' },
    ]
  },
  {
    id: 'networking',
    title: 'Networking',
    description: 'VPC, DNS, CDN, and network security',
    icon: Network,
    items: [
      { id: 'networking-overview', title: 'Networking Overview' },
      { id: 'vpc', title: 'Virtual Private Cloud (VPC)' },
      { id: 'subnets', title: 'Subnets & IP Addresses' },
      { id: 'firewalls', title: 'Firewalls & Security Groups' },
      { id: 'load-balancers-network', title: 'Load Balancers' },
      { id: 'cdn', title: 'Content Delivery Network' },
      { id: 'dns-management', title: 'DNS Management' },
      { id: 'custom-domains', title: 'Custom Domains' },
      { id: 'ssl-certificates', title: 'SSL/TLS Certificates' },
      { id: 'private-networking', title: 'Private Networking' },
    ]
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Identity, access, and compliance',
    icon: Shield,
    items: [
      { id: 'security-overview', title: 'Security Overview' },
      { id: 'iam', title: 'Identity & Access Management' },
      { id: 'users-teams', title: 'Users & Teams' },
      { id: 'roles-permissions', title: 'Roles & Permissions' },
      { id: 'api-keys', title: 'API Keys' },
      { id: 'service-accounts', title: 'Service Accounts' },
      { id: 'secrets-management', title: 'Secrets Management' },
      { id: 'encryption', title: 'Encryption' },
      { id: 'audit-logs', title: 'Audit Logs' },
      { id: 'compliance', title: 'Compliance & Certifications' },
    ]
  },
  {
    id: 'devops',
    title: 'CI/CD & DevOps',
    description: 'Deployment pipelines and automation',
    icon: GitBranch,
    items: [
      { id: 'devops-overview', title: 'DevOps Overview' },
      { id: 'deployment-methods', title: 'Deployment Methods' },
      { id: 'github-integration', title: 'GitHub Integration' },
      { id: 'gitlab-integration', title: 'GitLab Integration' },
      { id: 'bitbucket-integration', title: 'Bitbucket Integration' },
      { id: 'deployment-pipelines', title: 'Deployment Pipelines' },
      { id: 'environment-variables', title: 'Environment Variables' },
      { id: 'preview-deployments', title: 'Preview Deployments' },
      { id: 'rollbacks', title: 'Rollbacks & Versioning' },
      { id: 'infrastructure-as-code', title: 'Infrastructure as Code' },
    ]
  },
  {
    id: 'monitoring',
    title: 'Observability',
    description: 'Metrics, logs, and alerting',
    icon: BarChart3,
    items: [
      { id: 'monitoring-overview', title: 'Monitoring Overview' },
      { id: 'metrics-dashboards', title: 'Metrics & Dashboards' },
      { id: 'logging', title: 'Logging' },
      { id: 'log-management', title: 'Log Management' },
      { id: 'alerting', title: 'Alerting & Notifications' },
      { id: 'uptime-monitoring', title: 'Uptime Monitoring' },
      { id: 'distributed-tracing', title: 'Distributed Tracing' },
      { id: 'apm', title: 'Application Performance Monitoring' },
    ]
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    description: 'REST API and SDK documentation',
    icon: Code,
    items: [
      { id: 'api-overview', title: 'API Overview' },
      { id: 'authentication', title: 'Authentication' },
      { id: 'rate-limits', title: 'Rate Limits' },
      { id: 'errors', title: 'Error Handling' },
      { id: 'pagination', title: 'Pagination' },
      { id: 'compute-api', title: 'Compute API' },
      { id: 'storage-api', title: 'Storage API' },
      { id: 'database-api', title: 'Database API' },
      { id: 'networking-api', title: 'Networking API' },
      { id: 'webhooks', title: 'Webhooks' },
      { id: 'sdks', title: 'SDKs & Libraries' },
    ]
  },
  {
    id: 'cli',
    title: 'CLI Reference',
    description: 'Command-line interface documentation',
    icon: Terminal,
    items: [
      { id: 'cli-overview', title: 'CLI Overview' },
      { id: 'cli-install', title: 'Installation' },
      { id: 'cli-auth', title: 'Authentication' },
      { id: 'cli-commands', title: 'Commands Reference' },
      { id: 'cli-config', title: 'Configuration' },
      { id: 'cli-scripting', title: 'Scripting & Automation' },
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Pricing',
    description: 'Pricing, invoices, and cost management',
    icon: CreditCard,
    items: [
      { id: 'pricing-overview', title: 'Pricing Overview' },
      { id: 'billing-management', title: 'Billing Management' },
      { id: 'payment-methods', title: 'Payment Methods' },
      { id: 'invoices', title: 'Invoices & Receipts' },
      { id: 'usage-reports', title: 'Usage Reports' },
      { id: 'cost-optimization', title: 'Cost Optimization' },
      { id: 'reserved-capacity', title: 'Reserved Capacity' },
      { id: 'enterprise-billing', title: 'Enterprise Billing' },
    ]
  },
];

// Helper function to find a section by ID
export function findSection(sectionId: string): DocSection | undefined {
  return docsSections.find(s => s.id === sectionId);
}

// Helper function to find all doc IDs
export function getAllDocIds(): string[] {
  const ids: string[] = [];
  docsSections.forEach(section => {
    section.items.forEach(item => {
      ids.push(item.id);
      if (item.items) {
        item.items.forEach(subItem => ids.push(subItem.id));
      }
    });
  });
  return ids;
}

// Helper function to get section for a doc ID
export function getSectionForDoc(docId: string): DocSection | undefined {
  return docsSections.find(section =>
    section.items.some(item =>
      item.id === docId || (item.items && item.items.some(sub => sub.id === docId))
    )
  );
}

// Generate URL for a doc page
export function getDocUrl(sectionId: string, docId: string): string {
  return `/docs?section=${sectionId}&doc=${docId}`;
}
