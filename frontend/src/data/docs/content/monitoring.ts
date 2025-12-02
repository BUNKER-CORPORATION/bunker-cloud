// Monitoring Documentation Content for Bunker Cloud

import { DocPage } from '../types';

export const monitoringDocs: Record<string, DocPage> = {
  'monitoring-overview': {
    id: 'monitoring-overview',
    title: 'Monitoring Overview',
    description: 'Introduction to Bunker Cloud monitoring and observability',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# Monitoring Overview

Bunker Cloud provides comprehensive monitoring and observability tools to help you understand the health and performance of your applications.

## Observability Pillars

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                     Bunker Cloud Observability                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐           │
│   │   Metrics    │   │    Logs      │   │   Traces     │           │
│   │              │   │              │   │              │           │
│   │ Performance  │   │ Application  │   │ Distributed  │           │
│   │ Resource Use │   │ System Logs  │   │ Request Flow │           │
│   │ Custom Stats │   │ Audit Logs   │   │ Dependencies │           │
│   └──────────────┘   └──────────────┘   └──────────────┘           │
│           │                  │                  │                   │
│           └──────────────────┼──────────────────┘                   │
│                              ▼                                       │
│                    ┌──────────────────┐                             │
│                    │    Dashboards    │                             │
│                    │     Alerts       │                             │
│                    │    Analytics     │                             │
│                    └──────────────────┘                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

## Key Features

| Feature | Description |
|---------|-------------|
| **Real-time Metrics** | CPU, memory, network, custom metrics |
| **Log Aggregation** | Centralized logging with search |
| **Distributed Tracing** | End-to-end request tracking |
| **Alerting** | Customizable alerts and notifications |
| **Dashboards** | Pre-built and custom dashboards |
| **APM** | Application performance monitoring |

## Built-in Metrics

All Bunker Cloud resources emit metrics automatically:

### Compute Metrics

| Metric | Description | Unit |
|--------|-------------|------|
| cpu_utilization | CPU usage percentage | Percent |
| memory_utilization | Memory usage | Percent |
| disk_read_ops | Disk read operations | Count/sec |
| disk_write_ops | Disk write operations | Count/sec |
| network_in | Network bytes received | Bytes/sec |
| network_out | Network bytes sent | Bytes/sec |

### Database Metrics

| Metric | Description | Unit |
|--------|-------------|------|
| connections | Active connections | Count |
| queries_per_second | Query rate | Count/sec |
| read_latency | Read operation latency | Milliseconds |
| write_latency | Write operation latency | Milliseconds |
| replication_lag | Replica lag time | Seconds |

### Application Metrics

| Metric | Description | Unit |
|--------|-------------|------|
| request_count | HTTP request count | Count |
| request_latency | Request latency | Milliseconds |
| error_rate | Error percentage | Percent |
| response_time_p99 | 99th percentile response | Milliseconds |

## Quick Start

### Enable Monitoring

\`\`\`bash
# Enable for application
bunker monitoring enable --app my-app

# Enable detailed logging
bunker logging enable --app my-app --level debug
\`\`\`

### View Metrics

\`\`\`bash
# Get current metrics
bunker metrics get --app my-app --metric cpu_utilization

# Get metrics over time
bunker metrics query \\
  --app my-app \\
  --metric request_latency \\
  --start "1 hour ago" \\
  --end "now"
\`\`\`

### Create Alert

\`\`\`bash
bunker alerts create \\
  --name high-cpu \\
  --app my-app \\
  --metric cpu_utilization \\
  --threshold 80 \\
  --duration 5m \\
  --notify slack:#alerts
\`\`\`

## Dashboard Access

Access dashboards at:
\`\`\`
https://console.bunkercloud.com/monitoring/dashboards
\`\`\`

Or via CLI:
\`\`\`bash
bunker dashboard open --app my-app
\`\`\`

## Integrations

| Integration | Type | Status |
|-------------|------|--------|
| Datadog | Metrics, Logs, APM | Supported |
| New Relic | APM, Logs | Supported |
| Grafana | Dashboards | Supported |
| PagerDuty | Alerting | Supported |
| Slack | Notifications | Supported |
| OpsGenie | Alerting | Supported |

## Best Practices

1. **Set baseline alerts** - Know your normal metrics
2. **Use tags** - Organize metrics by environment, service
3. **Create dashboards** - Visualize key metrics
4. **Enable tracing** - Understand request flow
5. **Aggregate logs** - Centralize for analysis
6. **Set up SLOs** - Define service level objectives
    `,
    codeExamples: [
      {
        title: 'Monitoring Configuration',
        language: 'yaml',
        code: `# bunker.yaml
monitoring:
  enabled: true

  metrics:
    enabled: true
    retention: 30d
    custom:
      - name: business_transactions
        type: counter
      - name: order_value
        type: histogram

  logging:
    enabled: true
    level: info
    retention: 14d

  tracing:
    enabled: true
    sample_rate: 0.1  # 10% of requests

  alerts:
    - name: high-error-rate
      metric: error_rate
      condition: "> 5%"
      duration: 5m
      severity: critical
      notify:
        - slack:#alerts
        - pagerduty:critical

    - name: high-latency
      metric: response_time_p99
      condition: "> 500ms"
      duration: 10m
      severity: warning
      notify:
        - slack:#ops

  dashboards:
    - name: overview
      widgets:
        - type: timeseries
          metric: request_count
        - type: gauge
          metric: error_rate`
      }
    ],
    relatedDocs: ['metrics-dashboards', 'logging', 'alerting']
  },

  'metrics-dashboards': {
    id: 'metrics-dashboards',
    title: 'Metrics & Dashboards',
    description: 'Collect, visualize, and analyze metrics',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Metrics & Dashboards

Collect custom metrics and create visualizations to monitor your applications.

## Collecting Metrics

### Automatic Metrics

All infrastructure metrics are collected automatically:

\`\`\`bash
# View available metrics
bunker metrics list --resource-type instance

# Query metrics
bunker metrics query \\
  --resource-id i-12345 \\
  --metric cpu_utilization \\
  --start "2 hours ago" \\
  --period 5m
\`\`\`

### Custom Metrics

\`\`\`javascript
const { Metrics } = require('@bunkercloud/sdk');

const metrics = new Metrics();

// Counter
metrics.increment('orders.created', {
  tags: { region: 'us-east', plan: 'premium' }
});

// Gauge
metrics.gauge('queue.depth', 42, {
  tags: { queue: 'processing' }
});

// Histogram
metrics.histogram('request.latency', 150, {
  tags: { endpoint: '/api/orders' }
});

// Timer
const timer = metrics.timer('database.query');
// ... execute query
timer.stop({ tags: { query_type: 'select' } });
\`\`\`

### StatsD Protocol

Send metrics using StatsD:

\`\`\`bash
# Counter
echo "page.views:1|c" | nc -u -w0 localhost 8125

# Gauge
echo "queue.size:42|g" | nc -u -w0 localhost 8125

# Timer
echo "request.time:320|ms" | nc -u -w0 localhost 8125
\`\`\`

## Metric Queries

### Query Language

\`\`\`sql
-- Average CPU over time
SELECT avg(cpu_utilization)
FROM metrics
WHERE app = 'my-app'
AND time > now() - 1h
GROUP BY time(5m)

-- Error rate by endpoint
SELECT
  sum(errors) / sum(requests) * 100 as error_rate
FROM metrics
WHERE app = 'my-app'
GROUP BY endpoint
ORDER BY error_rate DESC
\`\`\`

### CLI Queries

\`\`\`bash
bunker metrics query \\
  --query 'avg(cpu_utilization) by (instance_id)' \\
  --app my-app \\
  --start "1h ago"
\`\`\`

## Dashboards

### Create Dashboard

\`\`\`bash
bunker dashboard create \\
  --name "Production Overview" \\
  --description "Key production metrics"
\`\`\`

### Add Widgets

\`\`\`yaml
# dashboard.yaml
name: Production Overview
widgets:
  - type: timeseries
    title: Request Rate
    metrics:
      - query: rate(request_count[5m])
        label: Requests/sec
    position: { x: 0, y: 0, w: 6, h: 4 }

  - type: gauge
    title: Error Rate
    metric: error_rate
    thresholds:
      - value: 1
        color: green
      - value: 5
        color: yellow
      - value: 10
        color: red
    position: { x: 6, y: 0, w: 3, h: 4 }

  - type: table
    title: Top Endpoints
    query: |
      topk(10, sum(request_count) by (endpoint))
    position: { x: 0, y: 4, w: 6, h: 4 }

  - type: heatmap
    title: Latency Distribution
    metric: request_latency
    position: { x: 6, y: 4, w: 6, h: 4 }
\`\`\`

### Pre-built Dashboards

| Dashboard | Description |
|-----------|-------------|
| Overview | System-wide metrics |
| Compute | Instance performance |
| Database | Database health |
| Networking | Network metrics |
| Application | App-specific metrics |

## Aggregations

### Time-based

\`\`\`bash
bunker metrics query \\
  --metric request_count \\
  --aggregation sum \\
  --period 1h \\
  --start "24h ago"
\`\`\`

### By Dimension

\`\`\`bash
bunker metrics query \\
  --metric error_rate \\
  --group-by endpoint,status_code \\
  --start "1h ago"
\`\`\`

## Retention

| Tier | Resolution | Retention |
|------|------------|-----------|
| Raw | 1 second | 24 hours |
| 1-minute | 1 minute | 7 days |
| 5-minute | 5 minutes | 30 days |
| 1-hour | 1 hour | 13 months |
    `,
    codeExamples: [
      {
        title: 'Custom Metrics SDK',
        language: 'python',
        code: `import bunkercloud
from bunkercloud.metrics import MetricsClient
from contextlib import contextmanager
import time

metrics = MetricsClient()

# Counter for tracking events
def track_order(order):
    metrics.increment(
        'orders.created',
        tags={
            'plan': order.plan,
            'region': order.region
        }
    )
    metrics.increment(
        'revenue.total',
        value=order.amount,
        tags={'currency': order.currency}
    )

# Gauge for current state
def update_queue_metrics(queue_name, depth):
    metrics.gauge(
        'queue.depth',
        value=depth,
        tags={'queue': queue_name}
    )

# Timer context manager
@contextmanager
def track_latency(operation, **tags):
    start = time.time()
    try:
        yield
    finally:
        duration = (time.time() - start) * 1000  # ms
        metrics.histogram(
            f'{operation}.latency',
            value=duration,
            tags=tags
        )

# Usage
with track_latency('database.query', query_type='select'):
    result = db.query("SELECT * FROM users")

# Batch metrics
with metrics.batch() as batch:
    for endpoint, count in request_counts.items():
        batch.increment(
            'requests.total',
            value=count,
            tags={'endpoint': endpoint}
        )`
      }
    ],
    relatedDocs: ['monitoring-overview', 'alerting', 'logging']
  },

  'logging': {
    id: 'logging',
    title: 'Logging',
    description: 'Collect and query application logs',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Logging

Centralized logging for all your Bunker Cloud applications and infrastructure.

## Log Collection

### Automatic Collection

Logs are automatically collected from:
- Application stdout/stderr
- System logs
- Infrastructure components
- Managed services

### Log Configuration

\`\`\`yaml
# bunker.yaml
logging:
  enabled: true
  level: info
  format: json
  retention: 30d
  fields:
    app: my-app
    environment: production
\`\`\`

### SDK Logging

\`\`\`javascript
const { Logger } = require('@bunkercloud/sdk');

const logger = new Logger({
  service: 'my-service',
  level: 'info'
});

// Structured logging
logger.info('User logged in', {
  userId: user.id,
  method: 'oauth',
  ip: req.ip
});

logger.error('Payment failed', {
  orderId: order.id,
  error: error.message,
  stack: error.stack
});
\`\`\`

## Log Formats

### JSON Format (Recommended)

\`\`\`json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Request completed",
  "service": "api",
  "trace_id": "abc123",
  "span_id": "def456",
  "fields": {
    "method": "GET",
    "path": "/api/users",
    "status": 200,
    "duration_ms": 45
  }
}
\`\`\`

### Plain Text Format

\`\`\`
2024-01-15T10:30:00.000Z [INFO] api: Request completed method=GET path=/api/users status=200 duration_ms=45
\`\`\`

## Querying Logs

### CLI

\`\`\`bash
# Search logs
bunker logs search \\
  --app my-app \\
  --query 'level:error' \\
  --start "1h ago"

# Follow logs
bunker logs tail --app my-app

# Filter by field
bunker logs search \\
  --app my-app \\
  --query 'status:500 AND path:/api/*'
\`\`\`

### Query Syntax

\`\`\`
# Simple search
error

# Field search
level:error

# Multiple conditions
level:error AND service:api

# Wildcards
path:/api/*

# Numeric ranges
status:[400 TO 599]
duration_ms:>1000

# Negation
NOT level:debug

# Regex
message:/timeout.*/
\`\`\`

### Log Insights

\`\`\`bash
bunker logs insights \\
  --query '
    fields @timestamp, @message
    | filter level = "error"
    | stats count() by service
    | sort count desc
    | limit 10
  ' \\
  --start "24h ago"
\`\`\`

## Log Streaming

### To External Systems

\`\`\`bash
# Stream to S3
bunker logs export create \\
  --name archive \\
  --destination s3://my-logs-bucket/archive \\
  --filter 'level:error OR level:warn'

# Stream to Datadog
bunker logs export create \\
  --name datadog \\
  --destination datadog \\
  --api-key $DATADOG_API_KEY

# Stream to Elasticsearch
bunker logs export create \\
  --name elasticsearch \\
  --destination https://es.example.com:9200 \\
  --index logs
\`\`\`

## Log Analysis

### Patterns

\`\`\`bash
# Find common patterns
bunker logs patterns \\
  --app my-app \\
  --start "24h ago"

# Output:
# Pattern: "Connection timeout to {ip}"
#   Count: 1,234
#   First: 2024-01-15T08:00:00Z
#   Last:  2024-01-15T10:30:00Z
\`\`\`

### Anomalies

\`\`\`bash
# Detect anomalies
bunker logs anomalies \\
  --app my-app \\
  --baseline "7 days"
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Structured Logging',
        language: 'python',
        code: `import bunkercloud
from bunkercloud.logging import Logger
import sys

# Configure logger
logger = Logger(
    service='payment-service',
    level='info',
    format='json'
)

# Add global context
logger.set_context({
    'environment': 'production',
    'version': '1.2.3'
})

class PaymentService:
    def __init__(self):
        self.logger = logger.child(component='payment')

    def process_payment(self, order_id: str, amount: float):
        # Log with context
        self.logger.info(
            'Processing payment',
            order_id=order_id,
            amount=amount
        )

        try:
            result = self._charge(amount)
            self.logger.info(
                'Payment successful',
                order_id=order_id,
                transaction_id=result.transaction_id
            )
            return result

        except PaymentError as e:
            self.logger.error(
                'Payment failed',
                order_id=order_id,
                error=str(e),
                error_code=e.code,
                exc_info=True
            )
            raise

    def _charge(self, amount):
        # Trace ID automatically added
        with self.logger.span('charge_card') as span:
            span.set_tag('amount', amount)
            # Process payment...

# Request middleware
def logging_middleware(request, handler):
    request_id = request.headers.get('X-Request-ID')

    with logger.context(request_id=request_id):
        logger.info(
            'Request started',
            method=request.method,
            path=request.path
        )

        try:
            response = handler(request)
            logger.info(
                'Request completed',
                status=response.status,
                duration_ms=response.duration
            )
            return response

        except Exception as e:
            logger.error(
                'Request failed',
                error=str(e),
                exc_info=True
            )
            raise`
      }
    ],
    relatedDocs: ['monitoring-overview', 'log-management', 'distributed-tracing']
  },

  'log-management': {
    id: 'log-management',
    title: 'Log Management',
    description: 'Manage log retention, archival, and compliance',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    content: `
# Log Management

Manage log lifecycle, retention, and compliance requirements.

## Retention Policies

### Configure Retention

\`\`\`bash
bunker logs retention set \\
  --app my-app \\
  --retention 30d

# Different retention by log group
bunker logs retention set \\
  --log-group /app/my-app/errors \\
  --retention 90d

bunker logs retention set \\
  --log-group /app/my-app/debug \\
  --retention 7d
\`\`\`

### Retention Tiers

| Tier | Storage | Cost | Query Speed |
|------|---------|------|-------------|
| Hot | SSD | $$$ | < 1s |
| Warm | HDD | $$ | < 10s |
| Cold | Archive | $ | Minutes |

### Lifecycle Rules

\`\`\`yaml
# log-lifecycle.yaml
rules:
  - name: standard
    match: "*"
    transitions:
      - after: 7d
        to: warm
      - after: 30d
        to: cold
    expiration: 365d

  - name: errors
    match: "level:error"
    transitions:
      - after: 30d
        to: warm
    expiration: 730d

  - name: audit
    match: "log_group:/audit/*"
    transitions:
      - after: 90d
        to: cold
    expiration: never
\`\`\`

## Log Archival

### Archive to Storage

\`\`\`bash
bunker logs archive create \\
  --name production-archive \\
  --source /app/my-app \\
  --destination s3://logs-archive/my-app \\
  --schedule daily \\
  --compress gzip \\
  --encrypt true
\`\`\`

### Restore from Archive

\`\`\`bash
bunker logs archive restore \\
  --archive production-archive \\
  --date 2024-01-15 \\
  --destination /restored/my-app
\`\`\`

## Log Filtering

### Sampling

\`\`\`yaml
# Reduce debug logs in production
logging:
  sampling:
    rules:
      - match: "level:debug"
        rate: 0.01  # 1% sampling
      - match: "level:info AND path:/health"
        rate: 0.1   # 10% for health checks
      - match: "*"
        rate: 1.0   # Keep all other logs
\`\`\`

### Filtering Sensitive Data

\`\`\`yaml
logging:
  redact:
    fields:
      - password
      - credit_card
      - ssn
    patterns:
      - '\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b'  # Credit cards
      - '\\b\\d{3}-\\d{2}-\\d{4}\\b'  # SSN
\`\`\`

## Compliance

### Audit Logging

\`\`\`yaml
audit:
  enabled: true
  events:
    - user.login
    - user.logout
    - resource.created
    - resource.deleted
    - permission.changed
  retention: 7y
  immutable: true
\`\`\`

### Log Integrity

\`\`\`bash
# Enable log signing
bunker logs integrity enable \\
  --log-group /audit \\
  --signing-key alias/audit-key

# Verify log integrity
bunker logs integrity verify \\
  --log-group /audit \\
  --start "2024-01-01" \\
  --end "2024-01-31"
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Log Management Configuration',
        language: 'yaml',
        code: `# logging-config.yaml
log_groups:
  - name: /app/production
    retention: 30d
    storage_class: standard
    sampling:
      rate: 1.0
    indexes:
      - field: level
      - field: service
      - field: trace_id

  - name: /app/staging
    retention: 7d
    storage_class: standard

  - name: /audit
    retention: 2555d  # 7 years
    storage_class: compliance
    immutable: true
    encryption:
      enabled: true
      kms_key: alias/audit-logs

archives:
  - name: production-archive
    source: /app/production
    destination: s3://logs-archive/production
    schedule: "0 2 * * *"  # Daily at 2 AM
    format: parquet
    compression: snappy
    partition_by:
      - year
      - month
      - day
      - service

redaction:
  enabled: true
  rules:
    - name: credit-cards
      pattern: '\\b(?:\\d{4}[- ]?){3}\\d{4}\\b'
      replacement: "[REDACTED_CC]"
    - name: api-keys
      pattern: 'api[_-]?key[=:]["\\']?\\w+'
      replacement: "api_key=[REDACTED]"
    - name: passwords
      fields:
        - password
        - secret
        - token
      replacement: "[REDACTED]"

exports:
  - name: security-siem
    destination: siem.company.com:514
    format: syslog
    filter: 'level:error OR log_group:/audit/*'
    tls: true`
      }
    ],
    relatedDocs: ['logging', 'monitoring-overview', 'compliance']
  },

  'alerting': {
    id: 'alerting',
    title: 'Alerting & Notifications',
    description: 'Set up alerts and notification channels',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Alerting & Notifications

Configure alerts to be notified when metrics exceed thresholds or anomalies are detected.

## Creating Alerts

### CLI

\`\`\`bash
bunker alerts create \\
  --name high-cpu \\
  --description "CPU utilization above 80%" \\
  --metric cpu_utilization \\
  --condition "> 80" \\
  --duration 5m \\
  --severity warning \\
  --notify slack:#ops
\`\`\`

### Configuration File

\`\`\`yaml
# alerts.yaml
alerts:
  - name: high-error-rate
    description: Error rate exceeds 5%
    metric: error_rate
    condition: "> 5"
    duration: 5m
    severity: critical
    labels:
      team: backend
      service: api
    notify:
      - channel: pagerduty
        severity: critical
      - channel: slack
        channel: "#incidents"

  - name: high-latency
    description: P99 latency above 500ms
    metric: latency_p99
    condition: "> 500"
    duration: 10m
    severity: warning
    notify:
      - channel: slack
        channel: "#ops"
\`\`\`

## Alert Conditions

### Threshold Alerts

\`\`\`yaml
alerts:
  - name: static-threshold
    metric: cpu_utilization
    condition: "> 80"
    duration: 5m
\`\`\`

### Rate of Change

\`\`\`yaml
alerts:
  - name: traffic-spike
    metric: request_count
    condition: rate(5m) > 200%
    description: Traffic increased by 200% in 5 minutes
\`\`\`

### Anomaly Detection

\`\`\`yaml
alerts:
  - name: anomaly-detection
    metric: request_count
    condition: anomaly(sensitivity=medium)
    baseline: 7d
\`\`\`

### Composite Alerts

\`\`\`yaml
alerts:
  - name: service-degradation
    condition: |
      (error_rate > 5 OR latency_p99 > 500)
      AND request_count > 100
    duration: 5m
\`\`\`

## Notification Channels

### Slack

\`\`\`bash
bunker notifications channel create \\
  --name slack-ops \\
  --type slack \\
  --webhook-url https://hooks.slack.com/... \\
  --channel "#ops"
\`\`\`

### PagerDuty

\`\`\`bash
bunker notifications channel create \\
  --name pagerduty-critical \\
  --type pagerduty \\
  --integration-key $PD_KEY \\
  --severity critical
\`\`\`

### Email

\`\`\`bash
bunker notifications channel create \\
  --name email-team \\
  --type email \\
  --recipients team@company.com,oncall@company.com
\`\`\`

### Webhook

\`\`\`bash
bunker notifications channel create \\
  --name custom-webhook \\
  --type webhook \\
  --url https://api.example.com/alerts \\
  --headers "Authorization: Bearer $TOKEN"
\`\`\`

## Alert Routing

### Severity-Based

\`\`\`yaml
routing:
  - match:
      severity: critical
    notify:
      - pagerduty-critical
      - slack-incidents
  - match:
      severity: warning
    notify:
      - slack-ops
  - match:
      severity: info
    notify:
      - slack-monitoring
\`\`\`

### Time-Based

\`\`\`yaml
routing:
  - match:
      severity: critical
    notify:
      - schedule: business-hours  # 9-5 M-F
        channel: slack-ops
      - schedule: after-hours
        channel: pagerduty-oncall
\`\`\`

### Team-Based

\`\`\`yaml
routing:
  - match:
      labels:
        team: backend
    notify:
      - slack-backend
  - match:
      labels:
        team: frontend
    notify:
      - slack-frontend
\`\`\`

## Alert Lifecycle

\`\`\`
┌──────────┐    ┌──────────┐    ┌──────────┐
│  FIRING  │───►│  ACTIVE  │───►│ RESOLVED │
└──────────┘    └──────────┘    └──────────┘
     │               │
     │               ▼
     │          ┌──────────┐
     └─────────►│   MUTED  │
                └──────────┘
\`\`\`

### Muting Alerts

\`\`\`bash
# Mute during maintenance
bunker alerts mute \\
  --name high-cpu \\
  --duration 2h \\
  --reason "Scheduled maintenance"

# Mute by label
bunker alerts mute \\
  --label service=api \\
  --duration 1h
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Alert Configuration',
        language: 'yaml',
        code: `# alerting.yaml
notification_channels:
  - name: slack-critical
    type: slack
    webhook_url: \${SLACK_WEBHOOK_URL}
    channel: "#incidents"
    template: |
      :rotating_light: *{{ .Alert.Name }}*
      Severity: {{ .Alert.Severity }}
      Service: {{ .Alert.Labels.service }}
      Value: {{ .Alert.Value }}
      {{ .Alert.Description }}

  - name: pagerduty-oncall
    type: pagerduty
    integration_key: \${PAGERDUTY_KEY}

  - name: email-team
    type: email
    recipients:
      - oncall@company.com
      - team-lead@company.com

alerts:
  - name: high-error-rate
    description: "Error rate exceeds threshold"
    metric: |
      sum(rate(http_requests_total{status=~"5.."}[5m]))
      / sum(rate(http_requests_total[5m])) * 100
    condition: "> 5"
    for: 5m
    severity: critical
    labels:
      team: platform
    annotations:
      runbook: https://wiki/runbooks/high-error-rate

  - name: pod-crash-looping
    description: "Pod is crash looping"
    metric: |
      increase(kube_pod_container_status_restarts_total[1h])
    condition: "> 5"
    for: 10m
    severity: warning

  - name: disk-filling-up
    description: "Disk will be full within 4 hours"
    metric: |
      predict_linear(node_filesystem_free_bytes[6h], 4*3600)
    condition: "< 0"
    for: 30m
    severity: warning

routing:
  default: slack-monitoring

  routes:
    - match:
        severity: critical
      channels:
        - pagerduty-oncall
        - slack-critical
        - email-team
      repeat_interval: 15m

    - match:
        severity: warning
      channels:
        - slack-ops
      repeat_interval: 1h

inhibition_rules:
  - source_match:
      severity: critical
    target_match:
      severity: warning
    equal:
      - service`
      }
    ],
    relatedDocs: ['monitoring-overview', 'metrics-dashboards', 'uptime-monitoring']
  },

  'uptime-monitoring': {
    id: 'uptime-monitoring',
    title: 'Uptime Monitoring',
    description: 'Monitor endpoint availability and response times',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# Uptime Monitoring

Monitor your endpoints from multiple global locations to ensure availability.

## Creating Monitors

### HTTP Monitor

\`\`\`bash
bunker uptime create \\
  --name api-health \\
  --type http \\
  --url https://api.example.com/health \\
  --interval 1m \\
  --timeout 10s \\
  --locations us-east,eu-west,ap-northeast
\`\`\`

### TCP Monitor

\`\`\`bash
bunker uptime create \\
  --name database \\
  --type tcp \\
  --host db.example.com \\
  --port 5432 \\
  --interval 1m
\`\`\`

### SSL Certificate Monitor

\`\`\`bash
bunker uptime create \\
  --name ssl-check \\
  --type ssl \\
  --host example.com \\
  --alert-before 30d  # Alert 30 days before expiry
\`\`\`

## Monitor Configuration

\`\`\`yaml
# uptime.yaml
monitors:
  - name: api-health
    type: http
    url: https://api.example.com/health
    method: GET
    interval: 1m
    timeout: 10s
    locations:
      - us-east-1
      - us-west-2
      - eu-west-1
      - ap-northeast-1
    assertions:
      - type: status_code
        value: 200
      - type: response_time
        value: "< 500ms"
      - type: body_contains
        value: '"status": "healthy"'
    headers:
      Authorization: Bearer \${API_TOKEN}

  - name: website
    type: http
    url: https://www.example.com
    method: GET
    interval: 5m
    assertions:
      - type: status_code
        value: 200
      - type: ssl_valid
        value: true
      - type: ssl_expiry
        value: "> 30 days"

  - name: dns-check
    type: dns
    hostname: api.example.com
    record_type: A
    interval: 5m
    assertions:
      - type: resolves
        value: true
\`\`\`

## Global Locations

| Region | Location |
|--------|----------|
| US East | Virginia, New York |
| US West | California, Oregon |
| EU | Ireland, Frankfurt, London |
| Asia | Tokyo, Singapore, Sydney |

## Status Pages

### Create Status Page

\`\`\`bash
bunker status-page create \\
  --name "Example Status" \\
  --domain status.example.com \\
  --monitors api-health,website,database
\`\`\`

### Components

\`\`\`yaml
# status-page.yaml
name: Example Status
domain: status.example.com
components:
  - name: API
    monitors: [api-health]
  - name: Website
    monitors: [website]
  - name: Database
    monitors: [database]
groups:
  - name: Core Services
    components: [API, Website, Database]
\`\`\`

## Incidents

### Manual Incident

\`\`\`bash
bunker incident create \\
  --status-page example-status \\
  --title "API Degradation" \\
  --status investigating \\
  --components api
\`\`\`

### Update Incident

\`\`\`bash
bunker incident update \\
  --id inc-123 \\
  --status resolved \\
  --message "Issue has been resolved"
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Uptime Monitoring Setup',
        language: 'yaml',
        code: `# uptime-config.yaml
monitors:
  # Primary API
  - name: api-primary
    type: http
    url: https://api.example.com/health
    method: GET
    interval: 30s
    timeout: 10s
    retries: 2
    locations: [us-east-1, us-west-2, eu-west-1]
    assertions:
      - status_code: 200
      - response_time: "< 300ms"
      - json_path:
          path: $.status
          value: healthy
    alerts:
      - channel: pagerduty
        after: 2  # After 2 failures
      - channel: slack
        after: 1

  # Multi-step API test
  - name: api-workflow
    type: http
    steps:
      - name: login
        url: https://api.example.com/auth/login
        method: POST
        body:
          username: \${TEST_USER}
          password: \${TEST_PASS}
        extract:
          token: $.access_token
      - name: get-profile
        url: https://api.example.com/users/me
        method: GET
        headers:
          Authorization: Bearer \${token}
        assertions:
          - status_code: 200

status_page:
  name: Example Status
  domain: status.example.com
  logo: https://example.com/logo.png
  components:
    - name: API
      description: REST API
      monitors: [api-primary, api-workflow]
    - name: Website
      description: Public website
      monitors: [website]
  maintenance_windows:
    - name: Weekly Maintenance
      schedule: "0 3 * * 0"  # Sundays at 3 AM
      duration: 2h`
      }
    ],
    relatedDocs: ['monitoring-overview', 'alerting', 'health-checks']
  },

  'distributed-tracing': {
    id: 'distributed-tracing',
    title: 'Distributed Tracing',
    description: 'Track requests across services with distributed tracing',
    lastUpdated: '2024-12-01',
    difficulty: 'advanced',
    timeToRead: '15 min',
    content: `
# Distributed Tracing

Understand request flow across your microservices with distributed tracing.

## Tracing Concepts

\`\`\`
                          Trace: abc123
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   Gateway   │───►│   API Svc   │───►│   DB Svc    │          │
│  │  Span: 001  │    │  Span: 002  │    │  Span: 003  │          │
│  │  50ms       │    │  120ms      │    │  45ms       │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│        │                   │                                     │
│        │            ┌─────────────┐                              │
│        │            │  Cache Svc  │                              │
│        │            │  Span: 004  │                              │
│        │            │  5ms        │                              │
│        │            └─────────────┘                              │
│        │                                                         │
│  Total Duration: 220ms                                           │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

## Enabling Tracing

### Configuration

\`\`\`yaml
# bunker.yaml
tracing:
  enabled: true
  sample_rate: 0.1  # 10% of requests
  propagation: w3c   # or b3, jaeger
\`\`\`

### SDK Integration

\`\`\`javascript
const { Tracer } = require('@bunkercloud/sdk');

const tracer = new Tracer({
  service: 'api-service',
  sampleRate: 0.1
});

// Automatic HTTP tracing
const http = tracer.instrument(require('http'));

// Manual spans
app.get('/users/:id', async (req, res) => {
  const span = tracer.startSpan('get-user');

  try {
    span.setTag('user.id', req.params.id);

    const user = await tracer.trace('database.query', async () => {
      return db.users.findById(req.params.id);
    });

    span.setTag('user.found', !!user);
    res.json(user);

  } catch (error) {
    span.setError(error);
    throw error;

  } finally {
    span.finish();
  }
});
\`\`\`

## Trace Propagation

### W3C Trace Context (Recommended)

\`\`\`
traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01
tracestate: bunker=id:abc123
\`\`\`

### B3 (Zipkin)

\`\`\`
X-B3-TraceId: 80f198ee56343ba864fe8b2a57d3eff7
X-B3-SpanId: e457b5a2e4d86bd1
X-B3-ParentSpanId: 05e3ac9a4f6e3b90
X-B3-Sampled: 1
\`\`\`

## Querying Traces

### Find Traces

\`\`\`bash
# By trace ID
bunker traces get --trace-id abc123

# By criteria
bunker traces search \\
  --service api-service \\
  --min-duration 500ms \\
  --status error \\
  --start "1h ago"
\`\`\`

### Trace Analysis

\`\`\`bash
# Service dependency map
bunker traces dependencies --start "24h ago"

# Latency percentiles
bunker traces latency \\
  --service api-service \\
  --operation get-user \\
  --percentiles 50,95,99
\`\`\`

## Service Maps

Generate service dependency maps:

\`\`\`bash
bunker traces service-map \\
  --start "24h ago" \\
  --output service-map.png
\`\`\`

## Integrations

| Platform | Status |
|----------|--------|
| OpenTelemetry | Native |
| Jaeger | Supported |
| Zipkin | Supported |
| Datadog APM | Supported |
| New Relic | Supported |

### OpenTelemetry Export

\`\`\`yaml
tracing:
  exporter: otlp
  endpoint: https://otel-collector:4317
  headers:
    authorization: Bearer \${OTEL_TOKEN}
\`\`\`
    `,
    codeExamples: [
      {
        title: 'OpenTelemetry Tracing',
        language: 'javascript',
        code: `const { trace, context, SpanStatusCode } = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { BunkerExporter } = require('@bunkercloud/otel-exporter');

// Configure tracer
const provider = new NodeTracerProvider();
provider.addSpanProcessor(
  new BatchSpanProcessor(new BunkerExporter())
);
provider.register();

const tracer = trace.getTracer('my-service');

// Express middleware
function tracingMiddleware(req, res, next) {
  const span = tracer.startSpan(\`\${req.method} \${req.path}\`, {
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
      'http.route': req.route?.path,
    },
  });

  // Store span in context
  const ctx = trace.setSpan(context.active(), span);

  // Wrap response
  const originalEnd = res.end;
  res.end = function(...args) {
    span.setAttribute('http.status_code', res.statusCode);
    if (res.statusCode >= 400) {
      span.setStatus({ code: SpanStatusCode.ERROR });
    }
    span.end();
    return originalEnd.apply(this, args);
  };

  context.with(ctx, () => next());
}

// Manual tracing
async function processOrder(orderId) {
  return tracer.startActiveSpan('process-order', async (span) => {
    try {
      span.setAttribute('order.id', orderId);

      // Database query
      const order = await tracer.startActiveSpan('db.query', async (dbSpan) => {
        dbSpan.setAttribute('db.system', 'postgresql');
        dbSpan.setAttribute('db.operation', 'SELECT');
        const result = await db.orders.findById(orderId);
        dbSpan.end();
        return result;
      });

      // External API call
      await tracer.startActiveSpan('payment.process', async (paymentSpan) => {
        paymentSpan.setAttribute('payment.amount', order.total);
        await paymentService.charge(order);
        paymentSpan.end();
      });

      span.setAttribute('order.status', 'completed');
      return order;

    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;

    } finally {
      span.end();
    }
  });
}`
      }
    ],
    relatedDocs: ['monitoring-overview', 'logging', 'apm']
  },

  'apm': {
    id: 'apm',
    title: 'Application Performance Monitoring',
    description: 'Deep application performance insights and profiling',
    lastUpdated: '2024-12-01',
    difficulty: 'advanced',
    timeToRead: '12 min',
    content: `
# Application Performance Monitoring (APM)

Gain deep insights into your application's performance with profiling, error tracking, and performance analysis.

## APM Features

| Feature | Description |
|---------|-------------|
| **Transaction Tracing** | End-to-end request tracking |
| **Error Tracking** | Automatic error capture and grouping |
| **Performance Profiling** | CPU and memory profiling |
| **Database Monitoring** | Query analysis and optimization |
| **Service Dependencies** | Automatic service discovery |

## Enabling APM

### Agent Installation

\`\`\`bash
# Node.js
npm install @bunkercloud/apm

# Python
pip install bunkercloud-apm

# Java
# Add to your JVM arguments:
# -javaagent:/path/to/bunker-apm-agent.jar
\`\`\`

### Configuration

\`\`\`javascript
// At the very top of your application
require('@bunkercloud/apm').start({
  serviceName: 'my-api',
  environment: 'production',
  captureBody: true,
  captureHeaders: true,
  errorOnAbort: true
});
\`\`\`

## Transaction Monitoring

### Automatic Instrumentation

Automatically traces:
- HTTP requests (Express, Fastify, etc.)
- Database queries (PostgreSQL, MySQL, MongoDB)
- Cache operations (Redis, Memcached)
- External HTTP calls (axios, fetch)
- Message queues (RabbitMQ, SQS)

### Custom Transactions

\`\`\`javascript
const apm = require('@bunkercloud/apm');

async function processJob(job) {
  const transaction = apm.startTransaction('process-job', 'job');

  try {
    transaction.setLabel('job.type', job.type);
    transaction.setLabel('job.priority', job.priority);

    const result = await doWork(job);

    transaction.result = 'success';
    return result;

  } catch (error) {
    apm.captureError(error);
    transaction.result = 'error';
    throw error;

  } finally {
    transaction.end();
  }
}
\`\`\`

## Error Tracking

### Automatic Capture

\`\`\`javascript
// Automatically captured
app.get('/api/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  res.json(user);
});
\`\`\`

### Manual Capture

\`\`\`javascript
try {
  await riskyOperation();
} catch (error) {
  apm.captureError(error, {
    custom: {
      userId: user.id,
      operation: 'risky-op'
    }
  });
}
\`\`\`

### Error Grouping

Errors are automatically grouped by:
- Error type/class
- Error message (normalized)
- Stack trace

## Performance Profiling

### CPU Profiling

\`\`\`bash
bunker apm profile cpu \\
  --app my-app \\
  --duration 60s \\
  --output cpu-profile.json
\`\`\`

### Memory Profiling

\`\`\`bash
bunker apm profile memory \\
  --app my-app \\
  --output heap-snapshot.json
\`\`\`

### Continuous Profiling

\`\`\`yaml
apm:
  profiling:
    enabled: true
    cpu:
      interval: 10m
      duration: 60s
    memory:
      interval: 1h
      on_high_usage: true
\`\`\`

## Database Monitoring

### Query Analysis

View slow queries:
\`\`\`bash
bunker apm queries \\
  --app my-app \\
  --min-duration 100ms \\
  --start "24h ago"
\`\`\`

### Query Explain Plans

\`\`\`bash
bunker apm query explain \\
  --query-id qry-123
\`\`\`

## Alerting on APM Data

\`\`\`yaml
alerts:
  - name: slow-transactions
    type: apm
    metric: transaction.duration.p99
    condition: "> 1000ms"
    for: 5m
    filter:
      transaction.name: "GET /api/users"

  - name: high-error-rate
    type: apm
    metric: error.rate
    condition: "> 5%"
    for: 5m

  - name: memory-leak
    type: apm
    metric: memory.heap.used
    condition: "rate(1h) > 10%"
    for: 30m
\`\`\`
    `,
    codeExamples: [
      {
        title: 'APM Integration',
        language: 'python',
        code: `from bunkercloud.apm import APM, capture_error
from functools import wraps

# Initialize APM
apm = APM(
    service_name='payment-service',
    environment='production',
    capture_body=True
)

# Decorator for transactions
def trace_transaction(name=None, transaction_type='request'):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            tx_name = name or func.__name__
            transaction = apm.begin_transaction(tx_name, transaction_type)

            try:
                result = await func(*args, **kwargs)
                transaction.result = 'success'
                return result

            except Exception as e:
                capture_error(e)
                transaction.result = 'error'
                raise

            finally:
                apm.end_transaction()

        return wrapper
    return decorator

# Usage
@trace_transaction('process-payment')
async def process_payment(order_id: str, amount: float):
    # Create custom span
    with apm.capture_span('validate-payment') as span:
        span.set_label('order_id', order_id)
        span.set_label('amount', amount)
        validate_payment(order_id, amount)

    # Database operations are auto-traced
    order = await db.orders.get(order_id)

    # External API calls are auto-traced
    result = await payment_gateway.charge(order)

    # Custom metrics
    apm.metrics.counter('payments.processed').inc()
    apm.metrics.histogram('payment.amount').observe(amount)

    return result

# Error tracking with context
class PaymentError(Exception):
    pass

try:
    await charge_card(card, amount)
except CardDeclined as e:
    capture_error(e, custom={
        'card_type': card.type,
        'amount': amount,
        'reason': e.reason
    })
    raise PaymentError(f"Card declined: {e.reason}")`
      }
    ],
    relatedDocs: ['monitoring-overview', 'distributed-tracing', 'alerting']
  }
};

// Export all monitoring doc IDs for validation
export const monitoringDocIds = Object.keys(monitoringDocs);
