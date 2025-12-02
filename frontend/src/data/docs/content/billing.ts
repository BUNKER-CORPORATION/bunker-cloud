// Billing Documentation Content for Bunker Cloud

import { DocPage } from '../types';

export const billingDocs: Record<string, DocPage> = {
  'pricing-overview': {
    id: 'pricing-overview',
    title: 'Pricing Overview',
    description: 'Understanding Bunker Cloud pricing and cost structure',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# Pricing Overview

Bunker Cloud uses a pay-as-you-go pricing model. You only pay for what you use with no upfront costs or long-term commitments.

## Pricing Model

### Pay-As-You-Go

- **No upfront costs** - Start using services immediately
- **No minimums** - Pay only for actual usage
- **Per-second billing** - Granular billing for compute resources
- **Monthly billing** - Consolidated monthly invoices

### Cost Components

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                     Total Monthly Cost                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │
│   │   Compute    │ + │   Storage    │ + │   Network    │           │
│   │              │   │              │   │              │           │
│   │  Instances   │   │  Block/Object│   │  Data Xfer  │           │
│   │  Containers  │   │  Backups     │   │  Load Bal.  │           │
│   │  Functions   │   │  Snapshots   │   │  CDN        │           │
│   └──────────────┘   └──────────────┘   └──────────────┘           │
│          +                  +                  +                     │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │
│   │  Databases   │ + │  Security    │ + │  Monitoring  │           │
│   │              │   │              │   │              │           │
│   │  Managed DB  │   │  Secrets     │   │  Logs        │           │
│   │  Caching     │   │  KMS         │   │  Metrics     │           │
│   └──────────────┘   └──────────────┘   └──────────────┘           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

## Service Pricing

### Compute

| Service | Unit | Price |
|---------|------|-------|
| Vault Instances | per vCPU-hour | From $0.008 |
| Containers | per vCPU-hour | From $0.010 |
| Serverless Functions | per GB-second | $0.00001667 |
| Auto Scaling | No charge | - |

### Storage

| Service | Unit | Price |
|---------|------|-------|
| Fortress Object Storage | per GB/month | $0.023 |
| Block Volumes (SSD) | per GB/month | $0.10 |
| Block Volumes (HDD) | per GB/month | $0.045 |
| Snapshots | per GB/month | $0.05 |

### Databases

| Service | Unit | Price |
|---------|------|-------|
| PostgreSQL | per vCPU-hour | From $0.034 |
| MySQL | per vCPU-hour | From $0.034 |
| MongoDB | per vCPU-hour | From $0.040 |
| Redis | per GB-hour | From $0.016 |

### Networking

| Service | Unit | Price |
|---------|------|-------|
| Data Transfer Out | per GB | $0.09 (first 10TB) |
| Load Balancer | per hour | $0.025 |
| CDN | per GB | $0.085 |
| DNS Queries | per million | $0.40 |

## Free Tier

New accounts receive free tier benefits for 12 months:

| Service | Free Allowance |
|---------|----------------|
| Compute | 750 hours/month (vault.micro) |
| Storage | 5 GB Fortress Storage |
| Database | 750 hours (db.micro) |
| Data Transfer | 15 GB/month |
| Functions | 1M requests/month |

## Pricing Calculator

Estimate your monthly costs:
\`\`\`
https://bunkercloud.com/pricing/calculator
\`\`\`

### Example Calculation

Small web application:
\`\`\`
2x vault.medium instances (24/7)
= 2 × $0.046/hr × 730 hrs = $67.16

100 GB SSD storage
= 100 GB × $0.10/month = $10.00

50 GB data transfer
= 50 GB × $0.09 = $4.50

PostgreSQL db.small (24/7)
= $0.068/hr × 730 hrs = $49.64

Total: ~$131.30/month
\`\`\`

## Cost Optimization

### Right-sizing

- Use appropriate instance sizes
- Monitor utilization and scale accordingly
- Use auto-scaling for variable workloads

### Reserved Capacity

| Term | Discount |
|------|----------|
| 1 Year (No Upfront) | 20% |
| 1 Year (Partial Upfront) | 30% |
| 1 Year (All Upfront) | 35% |
| 3 Year (All Upfront) | 55% |

### Spot Instances

Save up to 90% on interruptible workloads.
    `,
    codeExamples: [
      {
        title: 'Cost Estimation API',
        language: 'javascript',
        code: `const { BunkerCloud } = require('@bunkercloud/sdk');

const client = new BunkerCloud();

async function estimateCosts() {
  const estimate = await client.pricing.estimate({
    resources: [
      {
        type: 'compute.instance',
        instanceType: 'vault.medium',
        count: 2,
        hoursPerMonth: 730
      },
      {
        type: 'storage.volume',
        volumeType: 'gp3',
        sizeGb: 100
      },
      {
        type: 'database.postgresql',
        instanceClass: 'db.small',
        hoursPerMonth: 730
      }
    ]
  });

  console.log('Estimated monthly cost:', estimate.total);
  console.log('Breakdown:');
  estimate.items.forEach(item => {
    console.log(\`  \${item.name}: $\${item.cost.toFixed(2)}\`);
  });

  return estimate;
}`
      }
    ],
    relatedDocs: ['billing-management', 'cost-optimization', 'reserved-capacity']
  },

  'billing-management': {
    id: 'billing-management',
    title: 'Billing Management',
    description: 'Manage your billing settings and preferences',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# Billing Management

Configure billing settings, view charges, and manage your payment methods.

## Billing Dashboard

Access the billing dashboard at:
\`\`\`
https://console.bunkercloud.com/billing
\`\`\`

Or via CLI:
\`\`\`bash
bunker billing dashboard
\`\`\`

## Current Charges

### View Current Month

\`\`\`bash
# Summary
bunker billing current

# Detailed breakdown
bunker billing current --detailed

# By service
bunker billing current --group-by service

# By project
bunker billing current --group-by project
\`\`\`

### Sample Output

\`\`\`
Month-to-Date Charges (Jan 1-15, 2024)
======================================

Service           Usage          Cost
-------           -----          ----
Compute           1,095 hrs      $50.37
Storage           250 GB-mo      $28.75
Database          730 hrs        $49.64
Networking        45 GB          $4.05
Other             -              $2.50
                                 ------
Total                            $135.31

Projected Month End: $270.62
\`\`\`

## Billing Alerts

### Create Alert

\`\`\`bash
bunker billing alert create \\
  --name budget-warning \\
  --type budget \\
  --threshold 500 \\
  --notify email:billing@company.com

bunker billing alert create \\
  --name cost-spike \\
  --type anomaly \\
  --sensitivity medium \\
  --notify slack:#billing
\`\`\`

### Alert Types

| Type | Description |
|------|-------------|
| **Budget** | Alert when spending exceeds threshold |
| **Forecast** | Alert when forecast exceeds threshold |
| **Anomaly** | Alert on unusual spending patterns |
| **Service** | Alert on specific service costs |

## Budgets

### Create Budget

\`\`\`bash
bunker billing budget create \\
  --name monthly-budget \\
  --amount 1000 \\
  --period monthly \\
  --alerts 50,80,100 \\
  --notify email:finance@company.com
\`\`\`

### Budget Configuration

\`\`\`yaml
# budget.yaml
budgets:
  - name: production
    amount: 5000
    period: monthly
    scope:
      tags:
        environment: production
    alerts:
      - threshold: 50%
        notify: [slack:#ops]
      - threshold: 80%
        notify: [slack:#ops, email:manager@company.com]
      - threshold: 100%
        notify: [slack:#ops, email:finance@company.com, pagerduty:billing]
    actions:
      - threshold: 120%
        action: notify-only  # or stop-resources
\`\`\`

## Cost Allocation

### Tags

Tag resources for cost allocation:
\`\`\`bash
bunker compute instance tag \\
  --instance-id i-12345 \\
  --tags "project=website,team=frontend,environment=production"
\`\`\`

### Cost Allocation Report

\`\`\`bash
bunker billing report cost-allocation \\
  --start 2024-01-01 \\
  --end 2024-01-31 \\
  --group-by project,team \\
  --output cost-report.csv
\`\`\`

## Billing Contacts

### Manage Contacts

\`\`\`bash
# Add billing contact
bunker billing contact add \\
  --email finance@company.com \\
  --type billing

# Add operations contact
bunker billing contact add \\
  --email ops@company.com \\
  --type operations \\
  --alerts true
\`\`\`

## Tax Settings

### Configure Tax ID

\`\`\`bash
bunker billing tax set \\
  --tax-id "XX-1234567" \\
  --country US \\
  --business-type corporation
\`\`\`

### Tax Exemption

Upload exemption certificate:
\`\`\`bash
bunker billing tax exemption upload \\
  --certificate exemption.pdf \\
  --state CA \\
  --expires 2025-12-31
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Billing Automation',
        language: 'python',
        code: `import bunkercloud
from datetime import datetime, timedelta

billing = bunkercloud.BillingClient()

def monitor_costs():
    """Monitor costs and send alerts."""

    # Get current month costs
    costs = billing.get_current_costs()

    # Check against budget
    budget = billing.get_budget('monthly-budget')
    usage_percent = (costs.total / budget.amount) * 100

    if usage_percent > 80:
        send_alert(
            f"Budget alert: {usage_percent:.1f}% of monthly budget used",
            severity='warning'
        )

    # Check for anomalies
    yesterday = datetime.now() - timedelta(days=1)
    daily_cost = billing.get_costs(
        start=yesterday,
        end=datetime.now()
    )

    # Compare with 7-day average
    avg_daily = billing.get_average_daily_cost(days=7)
    if daily_cost.total > avg_daily * 1.5:
        send_alert(
            f"Cost anomaly: Yesterday's cost \${daily_cost.total:.2f} "
            f"is 50%+ above average \${avg_daily:.2f}",
            severity='warning'
        )

    # Generate report
    report = billing.generate_report(
        start=datetime.now().replace(day=1),
        end=datetime.now(),
        group_by=['service', 'project']
    )

    return report

def forecast_costs():
    """Forecast end-of-month costs."""

    forecast = billing.forecast(
        period='month',
        confidence=0.9
    )

    print(f"Forecasted month-end cost: \${forecast.amount:.2f}")
    print(f"90% confidence interval: "
          f"\${forecast.low:.2f} - \${forecast.high:.2f}")

    return forecast`
      }
    ],
    relatedDocs: ['pricing-overview', 'invoices', 'usage-reports']
  },

  'payment-methods': {
    id: 'payment-methods',
    title: 'Payment Methods',
    description: 'Add and manage payment methods',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '6 min',
    content: `
# Payment Methods

Configure payment methods for your Bunker Cloud account.

## Supported Payment Methods

| Method | Availability |
|--------|-------------|
| Credit/Debit Card | All regions |
| ACH Bank Transfer | US only |
| Wire Transfer | Enterprise |
| Invoice | Enterprise (Net 30) |

## Adding Payment Methods

### Credit Card

\`\`\`bash
bunker billing payment-method add \\
  --type card \\
  --interactive
\`\`\`

Or via Console:
1. Go to **Billing** > **Payment Methods**
2. Click **Add Payment Method**
3. Enter card details
4. Click **Save**

### ACH Bank Account

\`\`\`bash
bunker billing payment-method add \\
  --type ach \\
  --bank-name "Example Bank" \\
  --routing-number 123456789 \\
  --account-number 987654321
\`\`\`

## Managing Payment Methods

### List Methods

\`\`\`bash
bunker billing payment-method list

# Output:
# ID              TYPE    LAST 4    EXPIRES    DEFAULT
# pm-card-123     Card    4242      03/26      Yes
# pm-ach-456      ACH     6789      -          No
\`\`\`

### Set Default

\`\`\`bash
bunker billing payment-method set-default pm-ach-456
\`\`\`

### Remove Method

\`\`\`bash
bunker billing payment-method remove pm-card-123
\`\`\`

## Payment Security

- All card data is encrypted and stored with PCI DSS compliant providers
- Card numbers are never stored on Bunker Cloud servers
- 3D Secure supported for additional verification

## Auto-Pay

### Enable Auto-Pay

\`\`\`bash
bunker billing auto-pay enable \\
  --payment-method pm-card-123 \\
  --threshold 100  # Charge when balance exceeds $100
\`\`\`

### Disable Auto-Pay

\`\`\`bash
bunker billing auto-pay disable
\`\`\`

## Failed Payments

If a payment fails:
1. Email notification sent
2. 3-day grace period
3. Services suspended after grace period
4. Full restoration upon payment

### Retry Payment

\`\`\`bash
bunker billing retry-payment --invoice inv-123
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Payment Method Management',
        language: 'bash',
        code: `#!/bin/bash
# Payment method management script

# List current payment methods
echo "Current payment methods:"
bunker billing payment-method list

# Add new card (interactive)
echo "Adding new card..."
bunker billing payment-method add --type card --interactive

# Set up auto-pay
echo "Enabling auto-pay..."
bunker billing auto-pay enable \\
  --threshold 500 \\
  --notify-before 3d

# Check payment status
echo "Payment status:"
bunker billing status

# View upcoming payment
bunker billing upcoming-payment`
      }
    ],
    relatedDocs: ['billing-management', 'invoices']
  },

  'invoices': {
    id: 'invoices',
    title: 'Invoices & Receipts',
    description: 'View and download invoices and receipts',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '6 min',
    content: `
# Invoices & Receipts

Access and download your billing invoices and payment receipts.

## Viewing Invoices

### Console

Navigate to **Billing** > **Invoices**

### CLI

\`\`\`bash
# List invoices
bunker billing invoice list

# Output:
# INVOICE ID    DATE        AMOUNT     STATUS
# inv-202401    Jan 2024    $523.45    Paid
# inv-202312    Dec 2023    $498.12    Paid
# inv-202311    Nov 2023    $445.67    Paid

# View specific invoice
bunker billing invoice get inv-202401
\`\`\`

## Downloading Invoices

### Single Invoice

\`\`\`bash
# Download as PDF
bunker billing invoice download inv-202401 --format pdf

# Download as CSV
bunker billing invoice download inv-202401 --format csv
\`\`\`

### Bulk Download

\`\`\`bash
# Download all invoices for year
bunker billing invoice download-all \\
  --year 2024 \\
  --format pdf \\
  --output ./invoices/
\`\`\`

## Invoice Details

Each invoice includes:
- Account information
- Billing period
- Itemized charges by service
- Tax details
- Payment information
- Running totals

### Sample Invoice Structure

\`\`\`
BUNKER CLOUD INVOICE
====================
Invoice #: INV-202401
Date: January 31, 2024
Billing Period: Jan 1-31, 2024

Bill To:
  Example Corp
  123 Main St
  San Francisco, CA 94105

CHARGES
-------
Compute Services
  vault.medium (730 hrs × 2)         $67.16
  Serverless Functions (1.5M req)    $15.00

Storage Services
  Fortress Storage (150 GB)          $3.45
  Block Volumes (500 GB)             $50.00

Database Services
  PostgreSQL db.medium (730 hrs)     $98.56

Networking
  Data Transfer Out (100 GB)         $9.00
  Load Balancer (730 hrs)            $18.25

Subtotal:                            $261.42
Tax (8.625%):                        $22.55
                                     -------
Total:                               $283.97

Payment received: Feb 1, 2024
Payment method: Visa ending 4242
\`\`\`

## Receipts

### Download Receipt

\`\`\`bash
bunker billing receipt download \\
  --invoice inv-202401 \\
  --format pdf
\`\`\`

## Invoice Settings

### Custom Invoice Info

\`\`\`bash
bunker billing invoice-settings set \\
  --company-name "Example Corp" \\
  --address "123 Main St" \\
  --city "San Francisco" \\
  --state "CA" \\
  --zip "94105" \\
  --tax-id "XX-1234567" \\
  --po-number "PO-2024-001"
\`\`\`

### Email Settings

\`\`\`bash
bunker billing invoice-settings email \\
  --recipients finance@company.com,accounting@company.com \\
  --format pdf \\
  --send-automatically true
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Invoice Management',
        language: 'python',
        code: `import bunkercloud
from datetime import datetime

billing = bunkercloud.BillingClient()

def download_invoices(year: int):
    """Download all invoices for a year."""

    invoices = billing.invoices.list(
        start=f"{year}-01-01",
        end=f"{year}-12-31"
    )

    for invoice in invoices:
        # Download PDF
        pdf = billing.invoices.download(
            invoice_id=invoice.id,
            format='pdf'
        )
        pdf.save(f"./invoices/{invoice.id}.pdf")

        # Download CSV for analysis
        csv = billing.invoices.download(
            invoice_id=invoice.id,
            format='csv'
        )
        csv.save(f"./invoices/{invoice.id}.csv")

        print(f"Downloaded {invoice.id}: \${invoice.amount}")

def analyze_invoices(year: int):
    """Analyze yearly spending."""

    invoices = billing.invoices.list(
        start=f"{year}-01-01",
        end=f"{year}-12-31"
    )

    total = sum(inv.amount for inv in invoices)
    avg_monthly = total / len(invoices)

    by_service = {}
    for invoice in invoices:
        for item in invoice.line_items:
            service = item.service
            by_service[service] = by_service.get(service, 0) + item.amount

    print(f"Year {year} Summary")
    print(f"Total: \${total:,.2f}")
    print(f"Monthly Average: \${avg_monthly:,.2f}")
    print("\\nBy Service:")
    for service, amount in sorted(by_service.items(), key=lambda x: -x[1]):
        print(f"  {service}: \${amount:,.2f}")`
      }
    ],
    relatedDocs: ['billing-management', 'payment-methods', 'usage-reports']
  },

  'usage-reports': {
    id: 'usage-reports',
    title: 'Usage Reports',
    description: 'Generate and analyze usage reports',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    content: `
# Usage Reports

Generate detailed reports on resource usage and costs.

## Report Types

| Report | Description |
|--------|-------------|
| **Cost & Usage** | Detailed cost breakdown |
| **Cost Allocation** | Costs by tags/projects |
| **Resource Usage** | Resource utilization |
| **Data Transfer** | Network transfer details |
| **Reserved Capacity** | Reservation utilization |

## Generating Reports

### Cost & Usage Report

\`\`\`bash
bunker billing report create \\
  --type cost-usage \\
  --start 2024-01-01 \\
  --end 2024-01-31 \\
  --granularity daily \\
  --dimensions service,region \\
  --output report.csv
\`\`\`

### Cost Allocation Report

\`\`\`bash
bunker billing report create \\
  --type cost-allocation \\
  --start 2024-01-01 \\
  --end 2024-01-31 \\
  --group-by project,team,environment \\
  --output allocation.csv
\`\`\`

## Report Configuration

\`\`\`yaml
# report-config.yaml
reports:
  - name: monthly-cost-report
    type: cost-usage
    schedule: monthly
    granularity: daily
    dimensions:
      - service
      - region
      - usage_type
    filters:
      tags:
        environment: production
    delivery:
      - type: s3
        bucket: reports-bucket
        prefix: billing/monthly/
      - type: email
        recipients:
          - finance@company.com

  - name: weekly-allocation
    type: cost-allocation
    schedule: weekly
    group_by:
      - project
      - team
    delivery:
      - type: email
        recipients:
          - managers@company.com
\`\`\`

## Usage Metrics

### Compute Usage

\`\`\`bash
bunker billing usage compute \\
  --start 2024-01-01 \\
  --end 2024-01-31 \\
  --group-by instance-type
\`\`\`

### Storage Usage

\`\`\`bash
bunker billing usage storage \\
  --start 2024-01-01 \\
  --end 2024-01-31 \\
  --include-snapshots
\`\`\`

### Data Transfer

\`\`\`bash
bunker billing usage data-transfer \\
  --start 2024-01-01 \\
  --end 2024-01-31 \\
  --group-by region
\`\`\`

## Cost Explorer

Interactive cost analysis:

\`\`\`bash
# Open cost explorer
bunker billing explorer

# Filter by date range
bunker billing explorer \\
  --start 2024-01-01 \\
  --end 2024-03-31

# Analyze specific service
bunker billing explorer \\
  --service compute \\
  --group-by instance-type
\`\`\`

## Scheduled Reports

\`\`\`bash
# Create scheduled report
bunker billing report schedule create \\
  --name weekly-summary \\
  --type cost-usage \\
  --frequency weekly \\
  --day monday \\
  --recipients finance@company.com \\
  --format pdf,csv
\`\`\`

## Export to Data Warehouse

\`\`\`bash
# Export to S3 for analysis
bunker billing export enable \\
  --bucket billing-data \\
  --prefix exports/ \\
  --format parquet \\
  --compression snappy
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Usage Analysis',
        language: 'python',
        code: `import bunkercloud
import pandas as pd
from datetime import datetime, timedelta

billing = bunkercloud.BillingClient()

def analyze_usage(days=30):
    """Analyze usage patterns."""

    end = datetime.now()
    start = end - timedelta(days=days)

    # Get cost and usage data
    report = billing.reports.cost_usage(
        start=start,
        end=end,
        granularity='daily',
        dimensions=['service', 'usage_type']
    )

    df = pd.DataFrame(report.data)

    # Daily cost trend
    daily = df.groupby('date')['cost'].sum()
    print("Daily Cost Trend:")
    print(daily.tail(7))

    # Cost by service
    by_service = df.groupby('service')['cost'].sum().sort_values(ascending=False)
    print("\\nCost by Service:")
    print(by_service)

    # Identify cost drivers
    top_items = df.nlargest(10, 'cost')[['service', 'usage_type', 'cost']]
    print("\\nTop Cost Drivers:")
    print(top_items)

    # Detect anomalies
    mean = daily.mean()
    std = daily.std()
    anomalies = daily[daily > mean + 2*std]
    if not anomalies.empty:
        print("\\nCost Anomalies Detected:")
        print(anomalies)

    return df

def generate_team_report():
    """Generate cost report by team."""

    report = billing.reports.cost_allocation(
        start=datetime.now().replace(day=1),
        end=datetime.now(),
        group_by=['team', 'project']
    )

    df = pd.DataFrame(report.data)

    # Summary by team
    by_team = df.groupby('team')['cost'].sum().sort_values(ascending=False)

    # Generate email report
    html = f\"\"\"
    <h2>Monthly Cost Report</h2>
    <table>
    <tr><th>Team</th><th>Cost</th></tr>
    {''.join(f"<tr><td>{team}</td><td>\${cost:,.2f}</td></tr>"
             for team, cost in by_team.items())}
    </table>
    \"\"\"

    return html`
      }
    ],
    relatedDocs: ['billing-management', 'cost-optimization', 'invoices']
  },

  'cost-optimization': {
    id: 'cost-optimization',
    title: 'Cost Optimization',
    description: 'Strategies to optimize your Bunker Cloud costs',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Cost Optimization

Reduce costs while maintaining performance with these optimization strategies.

## Cost Optimization Pillars

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                     Cost Optimization                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │
│   │ Right-Sizing │   │  Purchasing  │   │  Scheduling  │           │
│   │              │   │   Options    │   │              │           │
│   │ Match size   │   │ Reserved     │   │ Turn off     │           │
│   │ to workload  │   │ Spot         │   │ when idle    │           │
│   └──────────────┘   └──────────────┘   └──────────────┘           │
│                                                                      │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │
│   │  Storage     │   │  Network     │   │  Monitoring  │           │
│   │ Optimization │   │ Optimization │   │              │           │
│   │              │   │              │   │              │           │
│   │ Lifecycle    │   │ Reduce       │   │ Track &      │           │
│   │ policies     │   │ transfers    │   │ Alert        │           │
│   └──────────────┘   └──────────────┘   └──────────────┘           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

## Right-Sizing

### Analyze Usage

\`\`\`bash
bunker optimize recommendations \\
  --type compute \\
  --period 14d

# Output:
# RESOURCE         CURRENT        RECOMMENDED    SAVINGS
# i-12345         vault.large    vault.medium   $45/mo (35%)
# i-67890         vault.medium   vault.small    $23/mo (50%)
\`\`\`

### Apply Recommendations

\`\`\`bash
# Preview changes
bunker optimize apply --resource i-12345 --dry-run

# Apply
bunker optimize apply --resource i-12345
\`\`\`

### Auto Right-Sizing

\`\`\`yaml
# optimization.yaml
right_sizing:
  enabled: true
  rules:
    - resource_type: compute
      conditions:
        cpu_utilization: "< 40%"
        duration: 7d
      action: recommend
      exclude_tags:
        - no-resize

    - resource_type: database
      conditions:
        cpu_utilization: "< 30%"
        duration: 14d
      action: recommend
\`\`\`

## Reserved Capacity

### Analyze Savings

\`\`\`bash
bunker optimize reserved analyze \\
  --period 30d

# Output:
# Recommended reservations based on usage:
#
# INSTANCE TYPE    QTY    TERM       UPFRONT    SAVINGS
# vault.medium     5      1yr-pu     $500       $1,200/yr
# vault.large      2      1yr-pu     $400       $800/yr
# db.medium        3      1yr-pu     $600       $1,800/yr
#
# Total potential savings: $3,800/year
\`\`\`

### Purchase Reserved Capacity

\`\`\`bash
bunker reserved purchase \\
  --instance-type vault.medium \\
  --quantity 5 \\
  --term 1-year \\
  --payment partial-upfront
\`\`\`

## Spot Instances

### Use Spot for Batch Workloads

\`\`\`bash
bunker compute instance create \\
  --name batch-worker \\
  --instance-type vault.large \\
  --pricing spot \\
  --max-price 0.05  # Maximum price per hour
\`\`\`

### Spot Fleet

\`\`\`yaml
# spot-fleet.yaml
spot_fleet:
  target_capacity: 10
  allocation_strategy: diversified
  instance_types:
    - vault.medium
    - vault.large
    - vault.xlarge
  max_price_percentage: 60  # % of on-demand
  interruption_behavior: terminate
  replace_unhealthy: true
\`\`\`

## Storage Optimization

### Lifecycle Policies

\`\`\`bash
bunker storage lifecycle set \\
  --bucket my-bucket \\
  --rules '[
    {"prefix": "logs/", "transition_days": 30, "to": "GLACIER"},
    {"prefix": "backups/", "expiration_days": 365}
  ]'
\`\`\`

### Identify Unused Volumes

\`\`\`bash
bunker optimize storage unused

# Output:
# VOLUME ID      SIZE      AGE       ESTIMATED SAVINGS
# vol-12345      500GB     45d       $50/mo
# vol-67890      1TB       90d       $100/mo
\`\`\`

## Network Optimization

### Data Transfer Analysis

\`\`\`bash
bunker optimize network analyze

# Output:
# Data Transfer Optimization Opportunities:
#
# 1. Cross-region traffic: $450/mo
#    Recommendation: Use regional endpoints
#
# 2. Internet egress: $200/mo
#    Recommendation: Enable CDN for static content
\`\`\`

### Use VPC Endpoints

Save data transfer costs:
\`\`\`bash
bunker vpc endpoint create \\
  --vpc-id vpc-123 \\
  --service storage \\
  --type gateway
\`\`\`

## Scheduling

### Stop Development Resources

\`\`\`bash
bunker schedule create \\
  --name dev-hours \\
  --action stop \\
  --cron "0 18 * * 1-5"  # Stop at 6 PM weekdays \\
  --resources tag:environment=development

bunker schedule create \\
  --name dev-start \\
  --action start \\
  --cron "0 8 * * 1-5"   # Start at 8 AM weekdays \\
  --resources tag:environment=development
\`\`\`

## Cost Dashboard

\`\`\`bash
bunker optimize dashboard

# Shows:
# - Current month spending
# - Savings opportunities
# - Reserved capacity utilization
# - Spot savings
# - Recommendations
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Cost Optimization Automation',
        language: 'python',
        code: `import bunkercloud
from datetime import datetime, timedelta

client = bunkercloud.Client()
optimize = bunkercloud.OptimizeClient()

def run_cost_optimization():
    """Run comprehensive cost optimization."""

    results = {
        'compute': optimize_compute(),
        'storage': optimize_storage(),
        'reserved': analyze_reserved(),
        'unused': find_unused_resources()
    }

    total_savings = sum(r['potential_savings'] for r in results.values())
    print(f"\\nTotal Potential Savings: \${total_savings:,.2f}/month")

    return results

def optimize_compute():
    """Right-size compute resources."""

    recommendations = optimize.get_recommendations(
        resource_type='compute',
        lookback_days=14
    )

    savings = 0
    for rec in recommendations:
        print(f"Instance {rec.resource_id}:")
        print(f"  Current: {rec.current_type} (\${rec.current_cost}/mo)")
        print(f"  Recommended: {rec.recommended_type} (\${rec.recommended_cost}/mo)")
        print(f"  Savings: \${rec.savings}/mo")
        savings += rec.savings

    return {'potential_savings': savings, 'recommendations': recommendations}

def optimize_storage():
    """Optimize storage costs."""

    # Find objects that should be in cheaper tiers
    analysis = optimize.analyze_storage()

    recommendations = []
    for bucket in analysis.buckets:
        if bucket.infrequent_access_candidates:
            recommendations.append({
                'bucket': bucket.name,
                'action': 'Move to IA storage',
                'size': bucket.ia_candidate_size,
                'savings': bucket.ia_potential_savings
            })

    return {
        'potential_savings': sum(r['savings'] for r in recommendations),
        'recommendations': recommendations
    }

def analyze_reserved():
    """Analyze reserved capacity opportunities."""

    usage = optimize.analyze_reserved_opportunities(days=30)

    print("Reserved Capacity Recommendations:")
    for rec in usage.recommendations:
        print(f"  {rec.instance_type}: {rec.quantity} units")
        print(f"  Estimated savings: \${rec.annual_savings}/year")

    return {
        'potential_savings': usage.total_monthly_savings,
        'recommendations': usage.recommendations
    }

def find_unused_resources():
    """Find unused resources."""

    unused = optimize.find_unused()

    print("Unused Resources:")
    for resource in unused:
        print(f"  {resource.type} {resource.id}: \${resource.monthly_cost}/mo")

    return {
        'potential_savings': sum(r.monthly_cost for r in unused),
        'resources': unused
    }

# Run optimization
if __name__ == '__main__':
    run_cost_optimization()`
      }
    ],
    relatedDocs: ['pricing-overview', 'reserved-capacity', 'billing-management']
  },

  'reserved-capacity': {
    id: 'reserved-capacity',
    title: 'Reserved Capacity',
    description: 'Save with reserved capacity commitments',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    content: `
# Reserved Capacity

Commit to reserved capacity for significant discounts on compute and database resources.

## Reservation Options

| Term | Payment | Discount |
|------|---------|----------|
| 1 Year | No Upfront | 20% |
| 1 Year | Partial Upfront | 30% |
| 1 Year | All Upfront | 35% |
| 3 Year | No Upfront | 35% |
| 3 Year | Partial Upfront | 45% |
| 3 Year | All Upfront | 55% |

## Purchasing Reservations

### Analyze Usage

\`\`\`bash
bunker reserved recommend \\
  --period 30d \\
  --coverage-target 80

# Output:
# Based on your usage, we recommend:
#
# INSTANCE TYPE    QUANTITY    TERM    SAVINGS
# vault.medium     10          1yr     $2,400/yr
# vault.large      5           1yr     $1,800/yr
# db.medium        3           3yr     $4,500/yr
\`\`\`

### Purchase

\`\`\`bash
bunker reserved purchase \\
  --instance-type vault.medium \\
  --quantity 10 \\
  --term 1-year \\
  --payment partial-upfront \\
  --region us-east-1
\`\`\`

## Reservation Types

### Standard Reservations

- Specific instance type
- Specific region/AZ
- Highest discount

### Convertible Reservations

- Exchange for different instance types
- Slightly lower discount (5% less)
- More flexibility

\`\`\`bash
bunker reserved purchase \\
  --instance-type vault.medium \\
  --quantity 5 \\
  --term 1-year \\
  --type convertible
\`\`\`

## Managing Reservations

### View Reservations

\`\`\`bash
bunker reserved list

# Output:
# ID              TYPE           QTY    TERM    EXPIRES      UTILIZATION
# ri-12345       vault.medium   10     1yr     2025-01-15   92%
# ri-67890       db.medium      3      3yr     2027-06-01   78%
\`\`\`

### Utilization Report

\`\`\`bash
bunker reserved utilization \\
  --period 30d

# Output:
# Reserved Capacity Utilization Report
#
# Overall Utilization: 87%
# Unused Capacity Cost: $234/mo
#
# Low Utilization Reservations:
# - ri-12345 (vault.medium): 65% utilized
#   Consider: Exchange or sell
\`\`\`

### Exchange Convertible Reservation

\`\`\`bash
bunker reserved exchange \\
  --reservation ri-12345 \\
  --new-instance-type vault.large \\
  --new-quantity 5
\`\`\`

## Savings Plans

Alternative to reservations with more flexibility:

\`\`\`bash
bunker savings-plan purchase \\
  --commitment 100  # $/hour \\
  --term 1-year \\
  --type compute
\`\`\`

### Savings Plan Types

| Type | Coverage | Flexibility |
|------|----------|-------------|
| Compute | EC2, Fargate, Lambda | High |
| Instance | Specific instance family | Medium |

## Best Practices

1. **Analyze before purchasing** - Use recommendations
2. **Start with 1-year terms** - Until usage is predictable
3. **Use convertible** - If workloads may change
4. **Monitor utilization** - Ensure reservations are used
5. **Consider Savings Plans** - For mixed workloads
    `,
    codeExamples: [
      {
        title: 'Reservation Management',
        language: 'python',
        code: `import bunkercloud

reserved = bunkercloud.ReservedClient()

def analyze_and_recommend():
    """Analyze usage and recommend reservations."""

    # Get usage analysis
    analysis = reserved.analyze_usage(days=30)

    # Get recommendations
    recommendations = reserved.get_recommendations(
        coverage_target=0.8,
        term='1-year',
        payment='partial-upfront'
    )

    print("Reservation Recommendations")
    print("=" * 50)

    total_savings = 0
    for rec in recommendations:
        print(f"\\n{rec.instance_type}:")
        print(f"  Quantity: {rec.quantity}")
        print(f"  On-demand cost: \${rec.on_demand_cost}/mo")
        print(f"  Reserved cost: \${rec.reserved_cost}/mo")
        print(f"  Savings: \${rec.savings}/mo ({rec.discount_percent}%)")
        total_savings += rec.savings

    print(f"\\nTotal Monthly Savings: \${total_savings}")
    print(f"Total Annual Savings: \${total_savings * 12}")

    return recommendations

def monitor_utilization():
    """Monitor reservation utilization."""

    utilization = reserved.get_utilization(days=30)

    print(f"Overall Utilization: {utilization.overall_percent}%")

    for res in utilization.reservations:
        status = "OK" if res.utilization > 80 else "LOW"
        print(f"  {res.id}: {res.utilization}% [{status}]")

        if res.utilization < 50:
            print(f"    Consider: Exchange or modify")

    # Calculate waste
    waste = sum(
        r.unused_cost for r in utilization.reservations
        if r.utilization < 100
    )
    print(f"\\nUnused Capacity Cost: \${waste}/mo")

def exchange_reservation(reservation_id, new_type, new_quantity):
    """Exchange convertible reservation."""

    # Check if exchangeable
    reservation = reserved.get(reservation_id)
    if reservation.type != 'convertible':
        raise ValueError("Only convertible reservations can be exchanged")

    # Calculate exchange
    exchange = reserved.calculate_exchange(
        reservation_id=reservation_id,
        new_instance_type=new_type,
        new_quantity=new_quantity
    )

    print(f"Exchange Summary:")
    print(f"  Current: {reservation.instance_type} x {reservation.quantity}")
    print(f"  New: {new_type} x {new_quantity}")
    print(f"  Additional cost: \${exchange.additional_cost}")

    # Execute exchange
    if input("Proceed? (y/n): ").lower() == 'y':
        reserved.exchange(
            reservation_id=reservation_id,
            new_instance_type=new_type,
            new_quantity=new_quantity
        )
        print("Exchange completed!")`
      }
    ],
    relatedDocs: ['pricing-overview', 'cost-optimization', 'billing-management']
  },

  'enterprise-billing': {
    id: 'enterprise-billing',
    title: 'Enterprise Billing',
    description: 'Billing features for enterprise customers',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '8 min',
    content: `
# Enterprise Billing

Advanced billing features for enterprise accounts.

## Enterprise Features

| Feature | Description |
|---------|-------------|
| **Consolidated Billing** | Single invoice for multiple accounts |
| **Custom Contracts** | Negotiated pricing and terms |
| **Net Payment Terms** | Net 30/45/60 payment options |
| **Volume Discounts** | Tiered pricing based on usage |
| **Dedicated Support** | Billing support team |
| **Custom Reports** | Tailored billing reports |

## Organization Billing

### Consolidated Billing

\`\`\`bash
# Enable consolidated billing
bunker organizations billing enable \\
  --payer-account main-account \\
  --member-accounts dev-account,prod-account,staging-account
\`\`\`

### Cost Allocation

\`\`\`bash
# Allocate costs by account
bunker organizations billing report \\
  --type cost-by-account \\
  --period 2024-01

# Output:
# ACCOUNT         SERVICE         COST
# main-account    Compute         $5,234
# main-account    Storage         $1,234
# dev-account     Compute         $523
# prod-account    Compute         $8,456
# prod-account    Database        $3,234
\`\`\`

## Custom Contracts

### Contract Terms

- **Commit Amount**: Minimum annual spend
- **Discount**: Based on commitment level
- **Term**: 1-3 years
- **Payment**: Monthly, quarterly, or annual

### Contract Management

\`\`\`bash
# View contract
bunker enterprise contract show

# Output:
# Contract ID: ENT-2024-001
# Term: 3 years (2024-01-01 to 2026-12-31)
# Annual Commitment: $500,000
# Discount: 25%
# Payment Terms: Net 30
# Remaining Commitment: $125,000
\`\`\`

## Volume Discounts

### Tiered Pricing

| Tier | Monthly Spend | Discount |
|------|---------------|----------|
| Standard | $0 - $10K | 0% |
| Silver | $10K - $50K | 5% |
| Gold | $50K - $100K | 10% |
| Platinum | $100K+ | 15%+ |

### Credits

\`\`\`bash
# View credits
bunker enterprise credits list

# Output:
# CREDIT ID       AMOUNT      EXPIRES      REMAINING
# cred-promo      $10,000     2024-12-31   $7,500
# cred-support    $5,000      2025-06-30   $5,000
\`\`\`

## Invoice Options

### Payment Terms

\`\`\`bash
bunker enterprise invoice-settings set \\
  --payment-terms net-30 \\
  --currency USD \\
  --po-required true
\`\`\`

### Wire Transfer

\`\`\`bash
bunker enterprise payment wire-info

# Output:
# Bank: Example Bank
# Account: 1234567890
# Routing: 123456789
# Reference: Your account ID
\`\`\`

## Support

### Enterprise Support

- Dedicated billing team
- Monthly billing reviews
- Custom report generation
- Contract negotiations

### Contact

\`\`\`bash
bunker enterprise support contact \\
  --type billing \\
  --priority high \\
  --subject "Contract review request"
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Enterprise Billing Management',
        language: 'python',
        code: `import bunkercloud

enterprise = bunkercloud.EnterpriseClient()

def organization_billing_report():
    """Generate organization billing report."""

    # Get all accounts
    accounts = enterprise.organizations.list_accounts()

    # Get costs for each account
    report = []
    for account in accounts:
        costs = enterprise.billing.get_costs(
            account_id=account.id,
            start='2024-01-01',
            end='2024-01-31'
        )

        report.append({
            'account': account.name,
            'account_id': account.id,
            'cost': costs.total,
            'services': costs.by_service
        })

    # Total
    total = sum(r['cost'] for r in report)

    print("Organization Billing Report")
    print("=" * 60)
    for r in sorted(report, key=lambda x: -x['cost']):
        print(f"\\n{r['account']} ({r['account_id']})")
        print(f"  Total: \${r['cost']:,.2f}")
        for service, cost in r['services'].items():
            print(f"    {service}: \${cost:,.2f}")

    print(f"\\nOrganization Total: \${total:,.2f}")

    return report

def check_contract_status():
    """Check enterprise contract status."""

    contract = enterprise.contract.get()

    print(f"Contract: {contract.id}")
    print(f"Status: {contract.status}")
    print(f"Term: {contract.start_date} to {contract.end_date}")
    print(f"Annual Commitment: \${contract.annual_commitment:,}")
    print(f"YTD Spend: \${contract.ytd_spend:,}")
    print(f"Remaining: \${contract.remaining_commitment:,}")

    # Check if on track
    days_elapsed = (datetime.now() - contract.start_date).days
    days_in_year = 365
    expected_spend = contract.annual_commitment * (days_elapsed / days_in_year)

    if contract.ytd_spend < expected_spend * 0.9:
        print("\\nWarning: Behind on commitment pace")
        print(f"Expected by now: \${expected_spend:,.2f}")
    else:
        print("\\nOn track to meet commitment")

    return contract`
      }
    ],
    relatedDocs: ['billing-management', 'pricing-overview', 'cost-optimization']
  }
};

// Export all billing doc IDs for validation
export const billingDocIds = Object.keys(billingDocs);
