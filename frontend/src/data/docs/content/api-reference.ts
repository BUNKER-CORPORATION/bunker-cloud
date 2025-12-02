// API Reference Documentation Content for Bunker Cloud

import { DocPage } from '../types';

export const apiReferenceDocs: Record<string, DocPage> = {
  'api-overview': {
    id: 'api-overview',
    title: 'API Overview',
    description: 'Introduction to the Bunker Cloud REST API',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# API Overview

The Bunker Cloud API provides programmatic access to all platform services. Build applications, automate workflows, and integrate with your existing tools.

## Base URL

All API requests are made to:

\`\`\`
https://api.bunkercloud.com/v1
\`\`\`

Regional endpoints are also available:

| Region | Endpoint |
|--------|----------|
| US East | https://us-east-1.api.bunkercloud.com/v1 |
| US West | https://us-west-2.api.bunkercloud.com/v1 |
| EU West | https://eu-west-1.api.bunkercloud.com/v1 |
| Asia Pacific | https://ap-northeast-1.api.bunkercloud.com/v1 |

## API Versioning

The API is versioned via URL path:

- \`/v1/\` - Current stable version
- \`/v2/\` - Beta features (when available)

Version changes and deprecations are announced 12 months in advance.

## Request Format

### HTTP Methods

| Method | Usage |
|--------|-------|
| GET | Retrieve resources |
| POST | Create resources |
| PUT | Replace resources |
| PATCH | Update resources |
| DELETE | Remove resources |

### Headers

Required headers for all requests:

\`\`\`bash
Authorization: Bunker {API_KEY_ID}:{SECRET_KEY}
Content-Type: application/json
X-Bunker-Account: {ACCOUNT_ID}  # Optional, for cross-account access
\`\`\`

### Request Body

JSON-encoded body for POST, PUT, and PATCH requests:

\`\`\`json
{
  "name": "my-resource",
  "config": {
    "key": "value"
  }
}
\`\`\`

## Response Format

### Success Response

\`\`\`json
{
  "data": {
    "id": "res-123456",
    "name": "my-resource",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "metadata": {
    "requestId": "req-abc123",
    "processingTime": 45
  }
}
\`\`\`

### List Response

\`\`\`json
{
  "data": [
    {"id": "res-1", "name": "resource-1"},
    {"id": "res-2", "name": "resource-2"}
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "nextToken": "eyJsYXN0SWQiOiJyZXMtMiJ9"
  },
  "metadata": {
    "requestId": "req-xyz789"
  }
}
\`\`\`

### Error Response

\`\`\`json
{
  "error": {
    "code": "ResourceNotFound",
    "message": "Instance i-12345 not found",
    "details": {
      "resourceType": "Instance",
      "resourceId": "i-12345"
    }
  },
  "metadata": {
    "requestId": "req-error123"
  }
}
\`\`\`

## Quick Start

### 1. Get API Credentials

\`\`\`bash
bunker iam api-key create --name my-api-key
\`\`\`

### 2. Make Your First Request

\`\`\`bash
curl -X GET "https://api.bunkercloud.com/v1/compute/instances" \\
  -H "Authorization: Bunker BKAK123:BKsk456..." \\
  -H "Content-Type: application/json"
\`\`\`

### 3. Create a Resource

\`\`\`bash
curl -X POST "https://api.bunkercloud.com/v1/compute/instances" \\
  -H "Authorization: Bunker BKAK123:BKsk456..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "my-instance",
    "instanceType": "vault.medium",
    "imageId": "img-ubuntu-22.04",
    "subnetId": "subnet-123"
  }'
\`\`\`

## API Services

| Service | Base Path | Description |
|---------|-----------|-------------|
| Compute | /v1/compute | Instances, images, snapshots |
| Storage | /v1/storage | Object storage, buckets |
| Database | /v1/databases | Managed databases |
| Networking | /v1/networking | VPCs, subnets, load balancers |
| IAM | /v1/iam | Users, roles, policies |
| Secrets | /v1/secrets | Secrets management |

## SDK Support

Official SDKs available:

| Language | Package |
|----------|---------|
| JavaScript/Node.js | \`@bunkercloud/sdk\` |
| Python | \`bunkercloud\` |
| Go | \`github.com/bunkercloud/go-sdk\` |
| Java | \`com.bunkercloud:sdk\` |
| Ruby | \`bunkercloud\` |
| .NET | \`BunkerCloud.SDK\` |

## Best Practices

1. **Use SDK when available** - Handles auth, retries, pagination
2. **Include request IDs** - For debugging and support
3. **Handle rate limits** - Implement exponential backoff
4. **Use regional endpoints** - Reduce latency
5. **Validate responses** - Check for errors
    `,
    codeExamples: [
      {
        title: 'Basic API Request',
        language: 'javascript',
        code: `const axios = require('axios');

const API_KEY_ID = process.env.BUNKER_API_KEY_ID;
const SECRET_KEY = process.env.BUNKER_SECRET_KEY;

const client = axios.create({
  baseURL: 'https://api.bunkercloud.com/v1',
  headers: {
    'Authorization': \`Bunker \${API_KEY_ID}:\${SECRET_KEY}\`,
    'Content-Type': 'application/json'
  }
});

// List instances
async function listInstances() {
  const response = await client.get('/compute/instances');
  return response.data.data;
}

// Create instance
async function createInstance(config) {
  const response = await client.post('/compute/instances', config);
  return response.data.data;
}

// Example usage
const instances = await listInstances();
console.log(instances);`
      }
    ],
    relatedDocs: ['authentication', 'rate-limits', 'errors', 'sdks']
  },

  'authentication': {
    id: 'authentication',
    title: 'Authentication',
    description: 'Authenticate API requests to Bunker Cloud',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    content: `
# Authentication

All API requests to Bunker Cloud must be authenticated. We support multiple authentication methods for different use cases.

## Authentication Methods

| Method | Use Case | Security Level |
|--------|----------|----------------|
| **API Keys** | CLI, scripts, applications | High |
| **OAuth 2.0** | Third-party apps, user delegation | High |
| **Temporary Credentials** | Short-term access | Very High |
| **Instance Credentials** | EC2 metadata service | High |

## API Key Authentication

### Request Signing

API key authentication uses the Authorization header:

\`\`\`
Authorization: Bunker {API_KEY_ID}:{SECRET_KEY}
\`\`\`

### Example

\`\`\`bash
curl -X GET "https://api.bunkercloud.com/v1/compute/instances" \\
  -H "Authorization: Bunker BKAK1234567890:BKsk0987654321abcdef..."
\`\`\`

### Signed Requests (Recommended)

For enhanced security, sign requests with HMAC-SHA256:

\`\`\`
Authorization: Bunker-HMAC-SHA256 Credential={KEY_ID}/{DATE}/{REGION}/{SERVICE}/bunker_request,
    SignedHeaders=host;x-bunker-date,
    Signature={SIGNATURE}
\`\`\`

### Signature Calculation

\`\`\`javascript
const crypto = require('crypto');

function signRequest(method, path, headers, body, secretKey, date) {
  // 1. Create canonical request
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map(k => \`\${k.toLowerCase()}:\${headers[k].trim()}\`)
    .join('\\n');

  const signedHeaders = Object.keys(headers)
    .sort()
    .map(k => k.toLowerCase())
    .join(';');

  const bodyHash = crypto
    .createHash('sha256')
    .update(body || '')
    .digest('hex');

  const canonicalRequest = [
    method,
    path,
    '', // query string
    canonicalHeaders,
    '',
    signedHeaders,
    bodyHash
  ].join('\\n');

  // 2. Create string to sign
  const dateStamp = date.toISOString().split('T')[0].replace(/-/g, '');
  const scope = \`\${dateStamp}/us-east-1/bunkercloud/bunker_request\`;

  const stringToSign = [
    'BUNKER-HMAC-SHA256',
    date.toISOString().replace(/[:-]|\\..*/g, ''),
    scope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\\n');

  // 3. Calculate signature
  const kDate = hmac('BUNKER' + secretKey, dateStamp);
  const kRegion = hmac(kDate, 'us-east-1');
  const kService = hmac(kRegion, 'bunkercloud');
  const kSigning = hmac(kService, 'bunker_request');
  const signature = hmac(kSigning, stringToSign, 'hex');

  return signature;
}

function hmac(key, data, encoding) {
  return crypto.createHmac('sha256', key).update(data).digest(encoding);
}
\`\`\`

## OAuth 2.0

### Authorization Code Flow

For applications accessing on behalf of users:

\`\`\`
1. Redirect user to:
   https://auth.bunkercloud.com/oauth/authorize?
     client_id={CLIENT_ID}&
     redirect_uri={REDIRECT_URI}&
     response_type=code&
     scope=compute:read storage:write

2. Exchange code for tokens:
   POST https://auth.bunkercloud.com/oauth/token
   {
     "grant_type": "authorization_code",
     "code": "{AUTH_CODE}",
     "redirect_uri": "{REDIRECT_URI}",
     "client_id": "{CLIENT_ID}",
     "client_secret": "{CLIENT_SECRET}"
   }

3. Use access token:
   Authorization: Bearer {ACCESS_TOKEN}
\`\`\`

### Client Credentials Flow

For server-to-server communication:

\`\`\`bash
curl -X POST "https://auth.bunkercloud.com/oauth/token" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials" \\
  -d "client_id={CLIENT_ID}" \\
  -d "client_secret={CLIENT_SECRET}" \\
  -d "scope=compute:* storage:*"
\`\`\`

### Token Response

\`\`\`json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "scope": "compute:read storage:write"
}
\`\`\`

### Refresh Tokens

\`\`\`bash
curl -X POST "https://auth.bunkercloud.com/oauth/token" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=refresh_token" \\
  -d "refresh_token={REFRESH_TOKEN}" \\
  -d "client_id={CLIENT_ID}" \\
  -d "client_secret={CLIENT_SECRET}"
\`\`\`

## Temporary Credentials

### Get Session Token

\`\`\`bash
curl -X POST "https://api.bunkercloud.com/v1/sts/session-token" \\
  -H "Authorization: Bunker {KEY_ID}:{SECRET}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "durationSeconds": 3600
  }'
\`\`\`

### Response

\`\`\`json
{
  "data": {
    "accessKeyId": "BKSESSION123",
    "secretAccessKey": "temporary-secret-key...",
    "sessionToken": "FwoGZXIvYXdzEBYaDBc...",
    "expiration": "2024-01-15T11:30:00Z"
  }
}
\`\`\`

### Using Session Credentials

Include the session token in requests:

\`\`\`bash
curl -X GET "https://api.bunkercloud.com/v1/compute/instances" \\
  -H "Authorization: Bunker {SESSION_KEY}:{SESSION_SECRET}" \\
  -H "X-Bunker-Security-Token: {SESSION_TOKEN}"
\`\`\`

## Instance Credentials

For applications running on Bunker Cloud instances:

\`\`\`bash
# Get credentials from metadata service
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Get credentials for specific role
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/{ROLE_NAME}
\`\`\`

### IMDSv2 (Recommended)

\`\`\`bash
# Get session token
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" \\
  -H "X-bunker-metadata-token-ttl-seconds: 21600")

# Use token for requests
curl "http://169.254.169.254/latest/meta-data/iam/security-credentials/" \\
  -H "X-bunker-metadata-token: $TOKEN"
\`\`\`

## Security Best Practices

1. **Never expose credentials** in code or logs
2. **Use environment variables** or secret managers
3. **Rotate credentials** regularly
4. **Use temporary credentials** when possible
5. **Implement MFA** for sensitive operations
6. **Use signed requests** in production
7. **Monitor credential usage** via audit logs
    `,
    codeExamples: [
      {
        title: 'OAuth 2.0 Client',
        language: 'python',
        code: `import requests
from datetime import datetime, timedelta

class BunkerOAuthClient:
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_url = 'https://auth.bunkercloud.com/oauth/token'
        self.access_token = None
        self.refresh_token = None
        self.expires_at = None

    def get_client_credentials_token(self, scopes: list[str]):
        """Get token using client credentials flow."""
        response = requests.post(
            self.token_url,
            data={
                'grant_type': 'client_credentials',
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'scope': ' '.join(scopes)
            }
        )
        response.raise_for_status()
        self._handle_token_response(response.json())

    def refresh_access_token(self):
        """Refresh the access token."""
        response = requests.post(
            self.token_url,
            data={
                'grant_type': 'refresh_token',
                'refresh_token': self.refresh_token,
                'client_id': self.client_id,
                'client_secret': self.client_secret
            }
        )
        response.raise_for_status()
        self._handle_token_response(response.json())

    def _handle_token_response(self, data: dict):
        self.access_token = data['access_token']
        self.refresh_token = data.get('refresh_token')
        self.expires_at = datetime.now() + timedelta(seconds=data['expires_in'])

    def get_access_token(self) -> str:
        """Get valid access token, refreshing if needed."""
        if not self.access_token or datetime.now() >= self.expires_at:
            if self.refresh_token:
                self.refresh_access_token()
            else:
                raise Exception("No valid token available")
        return self.access_token

    def make_request(self, method: str, url: str, **kwargs) -> dict:
        """Make authenticated API request."""
        headers = kwargs.pop('headers', {})
        headers['Authorization'] = f'Bearer {self.get_access_token()}'

        response = requests.request(method, url, headers=headers, **kwargs)
        response.raise_for_status()
        return response.json()`
      }
    ],
    relatedDocs: ['api-overview', 'api-keys', 'rate-limits']
  },

  'rate-limits': {
    id: 'rate-limits',
    title: 'Rate Limits',
    description: 'API rate limiting and throttling policies',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '8 min',
    content: `
# Rate Limits

Bunker Cloud implements rate limiting to ensure fair usage and platform stability. Understanding rate limits helps you build reliable applications.

## Rate Limit Tiers

| Tier | Requests/Second | Requests/Day | Burst |
|------|-----------------|--------------|-------|
| **Free** | 10 | 10,000 | 20 |
| **Developer** | 50 | 100,000 | 100 |
| **Pro** | 200 | 1,000,000 | 500 |
| **Enterprise** | Custom | Custom | Custom |

## Service-Specific Limits

| Service | Read (req/s) | Write (req/s) |
|---------|--------------|---------------|
| Compute | 100 | 20 |
| Storage | 1000 | 100 |
| Database | 50 | 10 |
| Networking | 100 | 20 |
| IAM | 50 | 10 |

## Rate Limit Headers

Every response includes rate limit information:

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705320000
X-RateLimit-RetryAfter: 5
\`\`\`

| Header | Description |
|--------|-------------|
| X-RateLimit-Limit | Maximum requests allowed in window |
| X-RateLimit-Remaining | Requests remaining in current window |
| X-RateLimit-Reset | Unix timestamp when limit resets |
| X-RateLimit-RetryAfter | Seconds until you can retry (when throttled) |

## Throttling Response

When rate limited, you'll receive a 429 response:

\`\`\`json
{
  "error": {
    "code": "TooManyRequests",
    "message": "Rate limit exceeded. Retry after 5 seconds.",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetAt": "2024-01-15T10:35:00Z",
      "retryAfter": 5
    }
  }
}
\`\`\`

## Handling Rate Limits

### Exponential Backoff

\`\`\`javascript
async function requestWithRetry(fn, maxRetries = 5) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['x-ratelimit-retryafter'] || 1;
        const backoff = Math.min(
          retryAfter * 1000 * Math.pow(2, attempt),
          60000 // Max 60 seconds
        );
        await sleep(backoff);
        lastError = error;
      } else {
        throw error;
      }
    }
  }

  throw lastError;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
\`\`\`

### Rate Limiter Pattern

\`\`\`javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async acquire() {
    const now = Date.now();
    this.requests = this.requests.filter(t => t > now - this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = oldestRequest + this.windowMs - now;
      await sleep(waitTime);
      return this.acquire();
    }

    this.requests.push(now);
    return true;
  }
}

// Usage
const limiter = new RateLimiter(100, 1000); // 100 req/sec

async function makeRequest() {
  await limiter.acquire();
  return client.get('/api/resource');
}
\`\`\`

### Bulk Operations

Use bulk endpoints to reduce API calls:

\`\`\`bash
# Instead of multiple calls
for id in i-1 i-2 i-3; do
  curl .../instances/$id
done

# Use bulk endpoint
curl -X POST ".../instances/batch" \\
  -d '{"ids": ["i-1", "i-2", "i-3"]}'
\`\`\`

## Request Prioritization

Some requests have higher priority:

| Priority | Request Type | Notes |
|----------|--------------|-------|
| High | Health checks | Not rate limited |
| High | Authentication | Minimal limits |
| Normal | Read operations | Standard limits |
| Low | Write operations | Stricter limits |
| Low | Bulk operations | May be queued |

## Concurrency Limits

Beyond rate limits, some operations have concurrency limits:

| Operation | Max Concurrent |
|-----------|----------------|
| Instance launches | 20 |
| Volume creation | 10 |
| Database operations | 5 |
| Bulk imports | 1 |

## Increasing Limits

### Request Increase

\`\`\`bash
# Check current limits
bunker account limits show

# Request increase
bunker account limits request \\
  --service compute \\
  --limit requests-per-second \\
  --requested-value 500 \\
  --reason "High-traffic production application"
\`\`\`

### Enterprise Options

Contact sales for:
- Custom rate limits
- Dedicated API endpoints
- Priority queue access
- SLA guarantees

## Best Practices

1. **Implement backoff** - Always handle 429 responses
2. **Use caching** - Reduce unnecessary requests
3. **Batch operations** - Use bulk endpoints
4. **Monitor usage** - Track rate limit headers
5. **Distribute load** - Spread requests over time
6. **Use webhooks** - Instead of polling
    `,
    codeExamples: [
      {
        title: 'Rate Limit Handler',
        language: 'python',
        code: `import time
import requests
from functools import wraps

class RateLimitedClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers['Authorization'] = f'Bunker {api_key}'

        # Track rate limits
        self.rate_limit = None
        self.remaining = None
        self.reset_at = None

    def _update_rate_limits(self, response):
        """Update rate limit tracking from response headers."""
        headers = response.headers
        self.rate_limit = int(headers.get('X-RateLimit-Limit', 100))
        self.remaining = int(headers.get('X-RateLimit-Remaining', 100))
        self.reset_at = int(headers.get('X-RateLimit-Reset', 0))

    def _wait_if_needed(self):
        """Wait if we're close to rate limit."""
        if self.remaining is not None and self.remaining < 5:
            wait_time = max(0, self.reset_at - time.time())
            if wait_time > 0:
                print(f"Rate limit approaching, waiting {wait_time:.1f}s")
                time.sleep(wait_time)

    def request(self, method: str, path: str, max_retries: int = 5, **kwargs):
        """Make request with automatic retry on rate limit."""
        self._wait_if_needed()

        for attempt in range(max_retries):
            response = self.session.request(
                method,
                f'{self.base_url}{path}',
                **kwargs
            )

            self._update_rate_limits(response)

            if response.status_code == 429:
                retry_after = int(
                    response.headers.get('X-RateLimit-RetryAfter', 1)
                )
                backoff = retry_after * (2 ** attempt)
                print(f"Rate limited, retrying in {backoff}s")
                time.sleep(backoff)
                continue

            response.raise_for_status()
            return response.json()

        raise Exception("Max retries exceeded")

    def get(self, path: str, **kwargs):
        return self.request('GET', path, **kwargs)

    def post(self, path: str, **kwargs):
        return self.request('POST', path, **kwargs)

# Usage
client = RateLimitedClient(
    'https://api.bunkercloud.com/v1',
    'BKAK123:BKsk456'
)

instances = client.get('/compute/instances')`
      }
    ],
    relatedDocs: ['api-overview', 'errors', 'pagination']
  },

  'errors': {
    id: 'errors',
    title: 'Error Handling',
    description: 'API error codes and handling strategies',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    content: `
# Error Handling

Understanding API errors helps you build robust applications. This guide covers error codes, response formats, and best practices.

## Error Response Format

All errors follow a consistent format:

\`\`\`json
{
  "error": {
    "code": "ErrorCode",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    },
    "requestId": "req-abc123"
  }
}
\`\`\`

## HTTP Status Codes

### Client Errors (4xx)

| Code | Name | Description |
|------|------|-------------|
| 400 | Bad Request | Invalid request syntax or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource state conflict |
| 422 | Unprocessable | Valid syntax but semantic errors |
| 429 | Too Many Requests | Rate limit exceeded |

### Server Errors (5xx)

| Code | Name | Description |
|------|------|-------------|
| 500 | Internal Error | Unexpected server error |
| 502 | Bad Gateway | Upstream service error |
| 503 | Service Unavailable | Temporary overload |
| 504 | Gateway Timeout | Upstream timeout |

## Error Codes

### Authentication Errors

| Code | HTTP | Description |
|------|------|-------------|
| InvalidCredentials | 401 | Invalid API key or secret |
| ExpiredCredentials | 401 | Credentials have expired |
| InvalidToken | 401 | Invalid OAuth token |
| MFARequired | 401 | MFA verification needed |

### Authorization Errors

| Code | HTTP | Description |
|------|------|-------------|
| AccessDenied | 403 | Permission denied |
| InsufficientPermissions | 403 | Missing required permission |
| ResourcePolicyDenied | 403 | Resource policy blocks access |

### Resource Errors

| Code | HTTP | Description |
|------|------|-------------|
| ResourceNotFound | 404 | Resource doesn't exist |
| ResourceAlreadyExists | 409 | Duplicate resource |
| ResourceInUse | 409 | Resource is being used |
| ResourceLimitExceeded | 400 | Quota or limit reached |

### Validation Errors

| Code | HTTP | Description |
|------|------|-------------|
| ValidationError | 400 | Invalid parameter values |
| MissingParameter | 400 | Required parameter missing |
| InvalidParameter | 400 | Parameter format invalid |
| InvalidRequestBody | 400 | Malformed JSON body |

### Rate Limiting

| Code | HTTP | Description |
|------|------|-------------|
| TooManyRequests | 429 | Rate limit exceeded |
| ConcurrencyLimitExceeded | 429 | Too many concurrent requests |

## Detailed Error Examples

### Validation Error

\`\`\`json
{
  "error": {
    "code": "ValidationError",
    "message": "Request validation failed",
    "details": {
      "errors": [
        {
          "field": "instanceType",
          "message": "Invalid instance type 'vault.xxxl'",
          "validValues": ["vault.small", "vault.medium", "vault.large"]
        },
        {
          "field": "subnetId",
          "message": "Required field is missing"
        }
      ]
    },
    "requestId": "req-val123"
  }
}
\`\`\`

### Permission Error

\`\`\`json
{
  "error": {
    "code": "AccessDenied",
    "message": "User is not authorized to perform compute:StartInstance on resource i-12345",
    "details": {
      "action": "compute:StartInstance",
      "resource": "arn:bunker:compute:us-east-1:123456:instance/i-12345",
      "principal": "arn:bunker:iam::123456:user/john"
    },
    "requestId": "req-auth456"
  }
}
\`\`\`

### Resource Conflict

\`\`\`json
{
  "error": {
    "code": "ResourceInUse",
    "message": "Volume vol-123 is attached to instance i-456",
    "details": {
      "resourceType": "Volume",
      "resourceId": "vol-123",
      "attachedTo": "i-456",
      "suggestion": "Detach the volume before deleting"
    },
    "requestId": "req-conflict789"
  }
}
\`\`\`

## Error Handling Best Practices

### Retry Logic

\`\`\`javascript
const RETRYABLE_ERRORS = [
  'ServiceUnavailable',
  'InternalError',
  'RequestTimeout',
  'TooManyRequests'
];

async function handleError(error, attempt) {
  const errorCode = error.response?.data?.error?.code;

  if (RETRYABLE_ERRORS.includes(errorCode)) {
    const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
    await sleep(delay);
    return true; // Retry
  }

  return false; // Don't retry
}
\`\`\`

### Error Categories

\`\`\`javascript
function categorizeError(error) {
  const code = error.response?.status;
  const errorCode = error.response?.data?.error?.code;

  if (code === 401 || code === 403) {
    return 'auth'; // Re-authenticate or escalate
  }

  if (code === 404) {
    return 'not_found'; // Resource doesn't exist
  }

  if (code === 422 || code === 400) {
    return 'validation'; // Fix request parameters
  }

  if (code === 429) {
    return 'rate_limit'; // Back off and retry
  }

  if (code >= 500) {
    return 'server'; // Retry with backoff
  }

  return 'unknown';
}
\`\`\`

### User-Friendly Messages

\`\`\`javascript
const ERROR_MESSAGES = {
  'ResourceNotFound': 'The requested resource could not be found.',
  'AccessDenied': 'You don\\'t have permission to perform this action.',
  'ValidationError': 'Please check your input and try again.',
  'TooManyRequests': 'Too many requests. Please wait a moment.',
  'ServiceUnavailable': 'Service is temporarily unavailable. Please try again.',
};

function getUserMessage(error) {
  const code = error.response?.data?.error?.code;
  return ERROR_MESSAGES[code] || 'An unexpected error occurred.';
}
\`\`\`

## Debugging Tips

1. **Log request IDs** - Include in support requests
2. **Check error details** - Contains specific failure info
3. **Validate requests** - Before sending to API
4. **Use dry-run mode** - When available
5. **Monitor error rates** - Set up alerts
    `,
    codeExamples: [
      {
        title: 'Comprehensive Error Handler',
        language: 'typescript',
        code: `interface BunkerError {
  code: string;
  message: string;
  details?: Record<string, any>;
  requestId: string;
}

class BunkerAPIError extends Error {
  code: string;
  details: Record<string, any>;
  requestId: string;
  httpStatus: number;
  retryable: boolean;

  constructor(httpStatus: number, error: BunkerError) {
    super(error.message);
    this.name = 'BunkerAPIError';
    this.code = error.code;
    this.details = error.details || {};
    this.requestId = error.requestId;
    this.httpStatus = httpStatus;
    this.retryable = this.isRetryable();
  }

  private isRetryable(): boolean {
    const retryableCodes = ['ServiceUnavailable', 'InternalError', 'TooManyRequests'];
    return this.httpStatus >= 500 || retryableCodes.includes(this.code);
  }

  getRetryDelay(attempt: number): number {
    if (this.code === 'TooManyRequests' && this.details.retryAfter) {
      return this.details.retryAfter * 1000;
    }
    return Math.min(1000 * Math.pow(2, attempt), 30000);
  }

  toUserMessage(): string {
    const messages: Record<string, string> = {
      ResourceNotFound: 'The resource you requested was not found.',
      AccessDenied: 'You do not have permission to perform this action.',
      ValidationError: 'Please correct the errors and try again.',
      TooManyRequests: 'Please wait a moment before trying again.',
    };
    return messages[this.code] || 'An error occurred. Please try again.';
  }
}

async function apiRequestWithErrorHandling<T>(
  request: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: BunkerAPIError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await request();
    } catch (err: any) {
      if (err.response?.data?.error) {
        lastError = new BunkerAPIError(
          err.response.status,
          err.response.data.error
        );

        if (lastError.retryable && attempt < maxRetries - 1) {
          const delay = lastError.getRetryDelay(attempt);
          console.log(\`Retrying in \${delay}ms (attempt \${attempt + 1})\`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }

        throw lastError;
      }
      throw err;
    }
  }

  throw lastError!;
}`
      }
    ],
    relatedDocs: ['api-overview', 'rate-limits', 'sdks']
  },

  'pagination': {
    id: 'pagination',
    title: 'Pagination',
    description: 'Navigate large result sets efficiently',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '6 min',
    content: `
# Pagination

Bunker Cloud uses cursor-based pagination to efficiently navigate large result sets.

## Pagination Response

\`\`\`json
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "pageSize": 20,
    "nextToken": "eyJsYXN0SWQiOiJpLTEyMzQ1In0=",
    "previousToken": null
  }
}
\`\`\`

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| pageSize | int | 20 | Items per page (max 100) |
| pageToken | string | null | Token for next page |
| sortBy | string | createdAt | Sort field |
| sortOrder | string | desc | Sort direction (asc/desc) |

## Basic Usage

### First Page

\`\`\`bash
curl -X GET "https://api.bunkercloud.com/v1/compute/instances?pageSize=20"
\`\`\`

### Subsequent Pages

\`\`\`bash
curl -X GET "https://api.bunkercloud.com/v1/compute/instances?pageSize=20&pageToken=eyJsYXN0SWQiOiJpLTEyMzQ1In0="
\`\`\`

## Iterating All Results

\`\`\`javascript
async function* getAllInstances() {
  let pageToken = null;

  do {
    const response = await client.get('/compute/instances', {
      params: { pageSize: 100, pageToken }
    });

    for (const instance of response.data.data) {
      yield instance;
    }

    pageToken = response.data.pagination.nextToken;
  } while (pageToken);
}

// Usage
for await (const instance of getAllInstances()) {
  console.log(instance.id);
}
\`\`\`

## Filtering and Sorting

Combine pagination with filters:

\`\`\`bash
curl -X GET "https://api.bunkercloud.com/v1/compute/instances" \\
  -G \\
  --data-urlencode "pageSize=50" \\
  --data-urlencode "sortBy=createdAt" \\
  --data-urlencode "sortOrder=desc" \\
  --data-urlencode "filter[status]=running" \\
  --data-urlencode "filter[instanceType]=vault.medium"
\`\`\`

## SDK Pagination

### JavaScript

\`\`\`javascript
const { BunkerCloud } = require('@bunkercloud/sdk');

const client = new BunkerCloud();

// Automatic pagination
const instances = await client.compute.instances.list({ all: true });

// Manual pagination
const paginator = client.compute.instances.paginate({ pageSize: 50 });

for await (const page of paginator) {
  console.log(\`Processing \${page.length} instances\`);
}
\`\`\`

### Python

\`\`\`python
import bunkercloud

client = bunkercloud.Client()

# Automatic pagination
for instance in client.compute.instances.list(all=True):
    print(instance.id)

# Manual pagination
paginator = client.compute.instances.paginate(page_size=50)
for page in paginator:
    print(f"Processing {len(page)} instances")
\`\`\`

## Best Practices

1. **Use reasonable page sizes** - 20-100 items
2. **Don't store page tokens** - They can expire
3. **Handle empty pages** - May occur during iteration
4. **Use SDK pagination** - Handles edge cases
5. **Apply filters early** - Reduce data transfer
    `,
    codeExamples: [
      {
        title: 'Paginated Data Fetcher',
        language: 'python',
        code: `import bunkercloud
from typing import Iterator, TypeVar, Generic

T = TypeVar('T')

class Paginator(Generic[T]):
    def __init__(self, fetch_func, page_size: int = 20):
        self.fetch_func = fetch_func
        self.page_size = page_size

    def __iter__(self) -> Iterator[T]:
        page_token = None

        while True:
            response = self.fetch_func(
                page_size=self.page_size,
                page_token=page_token
            )

            for item in response['data']:
                yield item

            page_token = response['pagination'].get('nextToken')
            if not page_token:
                break

    def pages(self) -> Iterator[list[T]]:
        page_token = None

        while True:
            response = self.fetch_func(
                page_size=self.page_size,
                page_token=page_token
            )

            yield response['data']

            page_token = response['pagination'].get('nextToken')
            if not page_token:
                break

# Usage
client = bunkercloud.Client()

paginator = Paginator(
    lambda **kwargs: client.compute.instances._list(**kwargs),
    page_size=50
)

# Iterate items
for instance in paginator:
    print(instance['id'])

# Iterate pages
for page in paginator.pages():
    print(f"Processing {len(page)} instances")`
      }
    ],
    relatedDocs: ['api-overview', 'sdks']
  },

  'compute-api': {
    id: 'compute-api',
    title: 'Compute API',
    description: 'API reference for compute resources',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '15 min',
    content: `
# Compute API

The Compute API provides programmatic access to Vault Instances, images, and related resources.

## Base URL

\`\`\`
https://api.bunkercloud.com/v1/compute
\`\`\`

## Instances

### List Instances

\`\`\`
GET /instances
\`\`\`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| pageSize | int | Items per page (max 100) |
| pageToken | string | Pagination token |
| status | string | Filter by status |
| instanceType | string | Filter by type |
| vpcId | string | Filter by VPC |

**Example:**

\`\`\`bash
curl -X GET "https://api.bunkercloud.com/v1/compute/instances?status=running" \\
  -H "Authorization: Bunker {KEY}:{SECRET}"
\`\`\`

**Response:**

\`\`\`json
{
  "data": [
    {
      "id": "i-12345678",
      "name": "web-server-1",
      "instanceType": "vault.medium",
      "status": "running",
      "privateIp": "10.0.1.100",
      "publicIp": "203.0.113.50",
      "vpcId": "vpc-abc123",
      "subnetId": "subnet-def456",
      "imageId": "img-ubuntu-22.04",
      "securityGroupIds": ["sg-web"],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "pageSize": 20,
    "nextToken": "..."
  }
}
\`\`\`

### Get Instance

\`\`\`
GET /instances/{instanceId}
\`\`\`

### Create Instance

\`\`\`
POST /instances
\`\`\`

**Request Body:**

\`\`\`json
{
  "name": "web-server-1",
  "instanceType": "vault.medium",
  "imageId": "img-ubuntu-22.04",
  "subnetId": "subnet-def456",
  "securityGroupIds": ["sg-web"],
  "keyName": "my-ssh-key",
  "userData": "#!/bin/bash\\necho 'Hello'",
  "tags": {
    "Environment": "production"
  },
  "blockDeviceMappings": [
    {
      "deviceName": "/dev/sda1",
      "ebs": {
        "volumeSize": 100,
        "volumeType": "gp3",
        "encrypted": true
      }
    }
  ]
}
\`\`\`

**Response:**

\`\`\`json
{
  "data": {
    "id": "i-new12345",
    "name": "web-server-1",
    "status": "pending",
    ...
  }
}
\`\`\`

### Start/Stop/Reboot Instance

\`\`\`
POST /instances/{instanceId}/start
POST /instances/{instanceId}/stop
POST /instances/{instanceId}/reboot
\`\`\`

### Terminate Instance

\`\`\`
DELETE /instances/{instanceId}
\`\`\`

### Modify Instance

\`\`\`
PATCH /instances/{instanceId}
\`\`\`

**Request Body:**

\`\`\`json
{
  "instanceType": "vault.large",
  "securityGroupIds": ["sg-new"]
}
\`\`\`

## Instance Actions

### Get Console Output

\`\`\`
GET /instances/{instanceId}/console-output
\`\`\`

### Get Instance Metadata

\`\`\`
GET /instances/{instanceId}/metadata
\`\`\`

### Create Instance Snapshot

\`\`\`
POST /instances/{instanceId}/snapshots
\`\`\`

\`\`\`json
{
  "name": "before-upgrade",
  "description": "Snapshot before system upgrade"
}
\`\`\`

## Images

### List Images

\`\`\`
GET /images
\`\`\`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| owner | string | Filter by owner (self, bunker, marketplace) |
| platform | string | Filter by platform |
| architecture | string | Filter by architecture |

### Get Image

\`\`\`
GET /images/{imageId}
\`\`\`

### Create Image

\`\`\`
POST /images
\`\`\`

\`\`\`json
{
  "name": "custom-app-server",
  "sourceInstanceId": "i-12345678",
  "description": "App server with custom configuration"
}
\`\`\`

### Delete Image

\`\`\`
DELETE /images/{imageId}
\`\`\`

## Volumes

### List Volumes

\`\`\`
GET /volumes
\`\`\`

### Create Volume

\`\`\`
POST /volumes
\`\`\`

\`\`\`json
{
  "name": "data-volume",
  "size": 500,
  "volumeType": "gp3",
  "iops": 3000,
  "throughput": 125,
  "availabilityZone": "us-east-1a",
  "encrypted": true,
  "kmsKeyId": "key-123"
}
\`\`\`

### Attach Volume

\`\`\`
POST /volumes/{volumeId}/attach
\`\`\`

\`\`\`json
{
  "instanceId": "i-12345678",
  "device": "/dev/sdf"
}
\`\`\`

### Detach Volume

\`\`\`
POST /volumes/{volumeId}/detach
\`\`\`

## Security Groups

### List Security Groups

\`\`\`
GET /security-groups
\`\`\`

### Create Security Group

\`\`\`
POST /security-groups
\`\`\`

\`\`\`json
{
  "name": "web-servers",
  "description": "Security group for web servers",
  "vpcId": "vpc-abc123",
  "rules": {
    "inbound": [
      {
        "protocol": "tcp",
        "port": 443,
        "source": "0.0.0.0/0"
      }
    ],
    "outbound": [
      {
        "protocol": "all",
        "destination": "0.0.0.0/0"
      }
    ]
  }
}
\`\`\`

## Key Pairs

### List Key Pairs

\`\`\`
GET /key-pairs
\`\`\`

### Create Key Pair

\`\`\`
POST /key-pairs
\`\`\`

\`\`\`json
{
  "name": "my-key",
  "publicKey": "ssh-rsa AAAA..."
}
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Compute API Operations',
        language: 'javascript',
        code: `const { BunkerCloud } = require('@bunkercloud/sdk');

const client = new BunkerCloud();

// List running instances
const instances = await client.compute.instances.list({
  filters: { status: 'running' }
});

// Create instance
const newInstance = await client.compute.instances.create({
  name: 'web-server',
  instanceType: 'vault.medium',
  imageId: 'img-ubuntu-22.04',
  subnetId: 'subnet-123',
  securityGroupIds: ['sg-web'],
  tags: { Environment: 'production' }
});

// Wait for instance to be running
await client.compute.instances.waitUntilRunning(newInstance.id);

// Get instance details
const instance = await client.compute.instances.get(newInstance.id);

// Stop instance
await client.compute.instances.stop(instance.id);

// Create snapshot
const snapshot = await client.compute.instances.createSnapshot(instance.id, {
  name: 'before-maintenance'
});`
      }
    ],
    relatedDocs: ['api-overview', 'storage-api', 'networking-api']
  },

  'storage-api': {
    id: 'storage-api',
    title: 'Storage API',
    description: 'API reference for storage operations',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Storage API

The Storage API provides S3-compatible object storage operations.

## Base URL

\`\`\`
https://fortress.bunkercloud.com
\`\`\`

## Authentication

Storage API uses the same authentication as the main API, plus supports AWS Signature Version 4.

## Buckets

### List Buckets

\`\`\`
GET /
\`\`\`

**Response:**

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<ListAllMyBucketsResult>
  <Owner>
    <ID>123456789</ID>
    <DisplayName>my-account</DisplayName>
  </Owner>
  <Buckets>
    <Bucket>
      <Name>my-bucket</Name>
      <CreationDate>2024-01-15T10:30:00Z</CreationDate>
    </Bucket>
  </Buckets>
</ListAllMyBucketsResult>
\`\`\`

### Create Bucket

\`\`\`
PUT /{bucket}
\`\`\`

**Headers:**

\`\`\`
x-amz-acl: private
x-bunker-bucket-region: us-east-1
\`\`\`

### Delete Bucket

\`\`\`
DELETE /{bucket}
\`\`\`

### Get Bucket Location

\`\`\`
GET /{bucket}?location
\`\`\`

## Objects

### List Objects

\`\`\`
GET /{bucket}
\`\`\`

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| prefix | Filter by prefix |
| delimiter | Group by delimiter |
| max-keys | Maximum keys (default 1000) |
| marker | Start after this key |
| continuation-token | For pagination |

### Get Object

\`\`\`
GET /{bucket}/{key}
\`\`\`

**Headers:**

\`\`\`
Range: bytes=0-1023
If-None-Match: "etag"
If-Modified-Since: timestamp
\`\`\`

### Put Object

\`\`\`
PUT /{bucket}/{key}
\`\`\`

**Headers:**

\`\`\`
Content-Type: application/octet-stream
Content-Length: 1234
x-amz-server-side-encryption: AES256
x-amz-storage-class: STANDARD
\`\`\`

### Delete Object

\`\`\`
DELETE /{bucket}/{key}
\`\`\`

### Copy Object

\`\`\`
PUT /{bucket}/{key}
x-amz-copy-source: /source-bucket/source-key
\`\`\`

## Multipart Upload

### Initiate Upload

\`\`\`
POST /{bucket}/{key}?uploads
\`\`\`

### Upload Part

\`\`\`
PUT /{bucket}/{key}?partNumber=1&uploadId={uploadId}
\`\`\`

### Complete Upload

\`\`\`
POST /{bucket}/{key}?uploadId={uploadId}
\`\`\`

\`\`\`xml
<CompleteMultipartUpload>
  <Part>
    <PartNumber>1</PartNumber>
    <ETag>"etag1"</ETag>
  </Part>
  <Part>
    <PartNumber>2</PartNumber>
    <ETag>"etag2"</ETag>
  </Part>
</CompleteMultipartUpload>
\`\`\`

### Abort Upload

\`\`\`
DELETE /{bucket}/{key}?uploadId={uploadId}
\`\`\`

## Presigned URLs

Generate temporary URLs for direct access:

\`\`\`javascript
const url = await client.storage.getSignedUrl('getObject', {
  Bucket: 'my-bucket',
  Key: 'file.pdf',
  Expires: 3600 // 1 hour
});
\`\`\`

## Bucket Policies

### Get Policy

\`\`\`
GET /{bucket}?policy
\`\`\`

### Put Policy

\`\`\`
PUT /{bucket}?policy
\`\`\`

\`\`\`json
{
  "Version": "2024-01-01",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:bunker:s3:::my-bucket/public/*"
    }
  ]
}
\`\`\`

## CORS Configuration

### Get CORS

\`\`\`
GET /{bucket}?cors
\`\`\`

### Put CORS

\`\`\`
PUT /{bucket}?cors
\`\`\`

\`\`\`xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://example.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Storage Operations',
        language: 'python',
        code: `import bunkercloud
from bunkercloud.storage import StorageClient

storage = StorageClient()

# Create bucket
storage.create_bucket('my-bucket', region='us-east-1')

# Upload file
storage.upload_file(
    'my-bucket',
    'documents/report.pdf',
    '/local/path/report.pdf',
    extra_args={
        'ContentType': 'application/pdf',
        'ServerSideEncryption': 'AES256'
    }
)

# Download file
storage.download_file(
    'my-bucket',
    'documents/report.pdf',
    '/local/path/downloaded.pdf'
)

# List objects
objects = storage.list_objects('my-bucket', prefix='documents/')
for obj in objects:
    print(f"{obj.key}: {obj.size} bytes")

# Generate presigned URL
url = storage.generate_presigned_url(
    'get_object',
    bucket='my-bucket',
    key='documents/report.pdf',
    expires_in=3600
)
print(f"Download URL: {url}")

# Multipart upload for large files
with open('large-file.zip', 'rb') as f:
    storage.upload_fileobj(
        f,
        'my-bucket',
        'backups/large-file.zip',
        config=TransferConfig(multipart_threshold=100*1024*1024)
    )`
      }
    ],
    relatedDocs: ['api-overview', 'compute-api', 'fortress-object-storage']
  },

  'database-api': {
    id: 'database-api',
    title: 'Database API',
    description: 'API reference for managed database operations',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Database API

The Database API provides management operations for PostgreSQL, MySQL, MongoDB, and Redis databases.

## Base URL

\`\`\`
https://api.bunkercloud.com/v1/databases
\`\`\`

## Database Clusters

### List Clusters

\`\`\`
GET /clusters
\`\`\`

### Create Cluster

\`\`\`
POST /clusters
\`\`\`

\`\`\`json
{
  "name": "production-db",
  "engine": "postgresql",
  "engineVersion": "15",
  "instanceClass": "db.vault.medium",
  "storage": {
    "size": 100,
    "type": "gp3",
    "encrypted": true,
    "kmsKeyId": "key-123"
  },
  "vpcId": "vpc-abc123",
  "subnetGroupName": "db-subnets",
  "securityGroupIds": ["sg-db"],
  "masterUsername": "admin",
  "masterPassword": "secure-password",
  "backupRetention": 7,
  "maintenanceWindow": "sun:03:00-sun:04:00",
  "tags": {
    "Environment": "production"
  }
}
\`\`\`

### Get Cluster

\`\`\`
GET /clusters/{clusterId}
\`\`\`

### Modify Cluster

\`\`\`
PATCH /clusters/{clusterId}
\`\`\`

### Delete Cluster

\`\`\`
DELETE /clusters/{clusterId}
\`\`\`

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| skipFinalSnapshot | Skip final snapshot |
| finalSnapshotId | Name for final snapshot |

## Read Replicas

### Create Replica

\`\`\`
POST /clusters/{clusterId}/replicas
\`\`\`

\`\`\`json
{
  "name": "production-db-replica-1",
  "instanceClass": "db.vault.medium",
  "availabilityZone": "us-east-1b"
}
\`\`\`

### List Replicas

\`\`\`
GET /clusters/{clusterId}/replicas
\`\`\`

### Promote Replica

\`\`\`
POST /clusters/{clusterId}/replicas/{replicaId}/promote
\`\`\`

## Backups

### List Backups

\`\`\`
GET /clusters/{clusterId}/backups
\`\`\`

### Create Backup

\`\`\`
POST /clusters/{clusterId}/backups
\`\`\`

\`\`\`json
{
  "name": "manual-backup-20240115",
  "description": "Before migration"
}
\`\`\`

### Restore from Backup

\`\`\`
POST /clusters
\`\`\`

\`\`\`json
{
  "name": "restored-db",
  "restoreFromBackup": {
    "backupId": "backup-123",
    "pointInTime": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

## Parameter Groups

### List Parameter Groups

\`\`\`
GET /parameter-groups
\`\`\`

### Create Parameter Group

\`\`\`
POST /parameter-groups
\`\`\`

\`\`\`json
{
  "name": "custom-postgres-params",
  "family": "postgresql15",
  "description": "Custom PostgreSQL parameters",
  "parameters": {
    "max_connections": "200",
    "shared_buffers": "256MB"
  }
}
\`\`\`

## Logs

### List Log Files

\`\`\`
GET /clusters/{clusterId}/logs
\`\`\`

### Download Log

\`\`\`
GET /clusters/{clusterId}/logs/{logFileName}
\`\`\`

## Metrics

### Get Metrics

\`\`\`
GET /clusters/{clusterId}/metrics
\`\`\`

**Query Parameters:**

| Parameter | Description |
|-----------|-------------|
| metrics | Comma-separated metric names |
| startTime | Start time (ISO 8601) |
| endTime | End time (ISO 8601) |
| period | Aggregation period (seconds) |

Available metrics:
- CPUUtilization
- DatabaseConnections
- FreeStorageSpace
- ReadIOPS
- WriteIOPS
- ReadLatency
- WriteLatency
    `,
    codeExamples: [
      {
        title: 'Database Management',
        language: 'javascript',
        code: `const { BunkerCloud } = require('@bunkercloud/sdk');

const client = new BunkerCloud();

// Create PostgreSQL cluster
const cluster = await client.databases.clusters.create({
  name: 'production-db',
  engine: 'postgresql',
  engineVersion: '15',
  instanceClass: 'db.vault.medium',
  storage: { size: 100, encrypted: true },
  vpcId: 'vpc-123',
  subnetGroupName: 'db-subnets',
  masterUsername: 'admin',
  masterPassword: process.env.DB_PASSWORD
});

// Wait for cluster to be available
await client.databases.clusters.waitUntilAvailable(cluster.id);

// Create read replica
const replica = await client.databases.clusters.createReplica(cluster.id, {
  name: 'production-db-replica',
  instanceClass: 'db.vault.medium'
});

// Create manual backup
const backup = await client.databases.backups.create(cluster.id, {
  name: 'pre-migration-backup'
});

// Get cluster metrics
const metrics = await client.databases.clusters.getMetrics(cluster.id, {
  metrics: ['CPUUtilization', 'DatabaseConnections'],
  startTime: new Date(Date.now() - 3600000),
  endTime: new Date(),
  period: 300
});`
      }
    ],
    relatedDocs: ['api-overview', 'postgresql', 'mysql', 'mongodb']
  },

  'networking-api': {
    id: 'networking-api',
    title: 'Networking API',
    description: 'API reference for networking operations',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '12 min',
    content: `
# Networking API

The Networking API provides operations for VPCs, subnets, load balancers, and other networking resources.

## Base URL

\`\`\`
https://api.bunkercloud.com/v1/networking
\`\`\`

## VPCs

### List VPCs

\`\`\`
GET /vpcs
\`\`\`

### Create VPC

\`\`\`
POST /vpcs
\`\`\`

\`\`\`json
{
  "name": "production-vpc",
  "cidrBlock": "10.0.0.0/16",
  "enableDnsHostnames": true,
  "enableDnsSupport": true,
  "tags": {
    "Environment": "production"
  }
}
\`\`\`

### Get VPC

\`\`\`
GET /vpcs/{vpcId}
\`\`\`

### Delete VPC

\`\`\`
DELETE /vpcs/{vpcId}
\`\`\`

## Subnets

### List Subnets

\`\`\`
GET /subnets
\`\`\`

### Create Subnet

\`\`\`
POST /subnets
\`\`\`

\`\`\`json
{
  "name": "public-subnet-1a",
  "vpcId": "vpc-123",
  "cidrBlock": "10.0.1.0/24",
  "availabilityZone": "us-east-1a",
  "mapPublicIpOnLaunch": true
}
\`\`\`

## Security Groups

### List Security Groups

\`\`\`
GET /security-groups
\`\`\`

### Create Security Group

\`\`\`
POST /security-groups
\`\`\`

### Add Rule

\`\`\`
POST /security-groups/{sgId}/rules
\`\`\`

\`\`\`json
{
  "direction": "inbound",
  "protocol": "tcp",
  "port": 443,
  "source": "0.0.0.0/0",
  "description": "HTTPS traffic"
}
\`\`\`

## Load Balancers

### List Load Balancers

\`\`\`
GET /load-balancers
\`\`\`

### Create Load Balancer

\`\`\`
POST /load-balancers
\`\`\`

\`\`\`json
{
  "name": "production-alb",
  "type": "application",
  "scheme": "internet-facing",
  "subnetIds": ["subnet-1a", "subnet-1b"],
  "securityGroupIds": ["sg-alb"]
}
\`\`\`

### Create Target Group

\`\`\`
POST /target-groups
\`\`\`

\`\`\`json
{
  "name": "api-targets",
  "protocol": "HTTP",
  "port": 8080,
  "vpcId": "vpc-123",
  "healthCheck": {
    "path": "/health",
    "interval": 30,
    "healthyThreshold": 2,
    "unhealthyThreshold": 3
  }
}
\`\`\`

### Register Targets

\`\`\`
POST /target-groups/{tgId}/targets
\`\`\`

\`\`\`json
{
  "targets": [
    {"id": "i-12345", "port": 8080},
    {"id": "i-67890", "port": 8080}
  ]
}
\`\`\`

### Create Listener

\`\`\`
POST /load-balancers/{lbId}/listeners
\`\`\`

\`\`\`json
{
  "protocol": "HTTPS",
  "port": 443,
  "certificateArn": "arn:bunker:cert:my-cert",
  "defaultActions": [
    {
      "type": "forward",
      "targetGroupArn": "arn:bunker:tg:api-targets"
    }
  ]
}
\`\`\`

## DNS Zones

### List Zones

\`\`\`
GET /dns/zones
\`\`\`

### Create Zone

\`\`\`
POST /dns/zones
\`\`\`

\`\`\`json
{
  "name": "example.com",
  "type": "public"
}
\`\`\`

### Create Record

\`\`\`
POST /dns/zones/{zoneId}/records
\`\`\`

\`\`\`json
{
  "name": "api.example.com",
  "type": "A",
  "ttl": 300,
  "values": ["192.0.2.1"]
}
\`\`\`
    `,
    codeExamples: [
      {
        title: 'Networking Setup',
        language: 'python',
        code: `import bunkercloud

client = bunkercloud.Client()

# Create VPC
vpc = client.networking.vpcs.create(
    name='production-vpc',
    cidr_block='10.0.0.0/16',
    enable_dns_hostnames=True
)

# Create subnets
public_subnet = client.networking.subnets.create(
    vpc_id=vpc.id,
    name='public-1a',
    cidr_block='10.0.1.0/24',
    availability_zone='us-east-1a',
    map_public_ip=True
)

private_subnet = client.networking.subnets.create(
    vpc_id=vpc.id,
    name='private-1a',
    cidr_block='10.0.10.0/24',
    availability_zone='us-east-1a'
)

# Create security group
sg = client.networking.security_groups.create(
    vpc_id=vpc.id,
    name='web-servers',
    description='Web server security group'
)

# Add rules
client.networking.security_groups.add_rule(
    security_group_id=sg.id,
    direction='inbound',
    protocol='tcp',
    port=443,
    source='0.0.0.0/0'
)

# Create load balancer
alb = client.networking.load_balancers.create(
    name='production-alb',
    type='application',
    scheme='internet-facing',
    subnet_ids=[public_subnet.id],
    security_group_ids=[sg.id]
)`
      }
    ],
    relatedDocs: ['api-overview', 'vpc', 'load-balancers-network']
  },

  'webhooks': {
    id: 'webhooks',
    title: 'Webhooks',
    description: 'Receive real-time event notifications',
    lastUpdated: '2024-12-01',
    difficulty: 'intermediate',
    timeToRead: '10 min',
    content: `
# Webhooks

Receive real-time notifications when events occur in your Bunker Cloud account.

## Overview

Webhooks allow your application to be notified immediately when events happen, rather than polling for changes.

## Creating Webhooks

### Console

1. Navigate to **Settings** > **Webhooks**
2. Click **Create Webhook**
3. Configure endpoint URL and events

### API

\`\`\`
POST /v1/webhooks
\`\`\`

\`\`\`json
{
  "name": "deployment-notifications",
  "url": "https://api.example.com/webhooks/bunker",
  "events": [
    "instance.started",
    "instance.stopped",
    "deployment.completed",
    "deployment.failed"
  ],
  "secret": "whsec_your_signing_secret"
}
\`\`\`

## Event Types

### Compute Events

| Event | Description |
|-------|-------------|
| instance.created | Instance created |
| instance.started | Instance started |
| instance.stopped | Instance stopped |
| instance.terminated | Instance terminated |
| instance.state_changed | State changed |

### Database Events

| Event | Description |
|-------|-------------|
| database.created | Database created |
| database.available | Database available |
| database.backup.completed | Backup completed |
| database.failover.started | Failover initiated |

### Deployment Events

| Event | Description |
|-------|-------------|
| deployment.started | Deployment started |
| deployment.completed | Deployment succeeded |
| deployment.failed | Deployment failed |
| deployment.rolled_back | Rollback completed |

### Security Events

| Event | Description |
|-------|-------------|
| security.alert | Security alert triggered |
| security.user.login | User login |
| security.api_key.created | API key created |

## Webhook Payload

\`\`\`json
{
  "id": "evt_1234567890",
  "type": "instance.started",
  "created": "2024-01-15T10:30:00Z",
  "data": {
    "object": {
      "id": "i-12345678",
      "name": "web-server-1",
      "status": "running"
    },
    "previous_attributes": {
      "status": "stopped"
    }
  },
  "account_id": "acc_123456",
  "request_id": "req_abcdef"
}
\`\`\`

## Verifying Signatures

All webhook payloads are signed. Verify signatures to ensure authenticity:

\`\`\`javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const timestamp = signature.split(',')[0].split('=')[1];
  const signatureHash = signature.split(',')[1].split('=')[1];

  const signedPayload = \`\${timestamp}.\${payload}\`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // Verify timestamp is within 5 minutes
  const timestampAge = Date.now() - (parseInt(timestamp) * 1000);
  if (timestampAge > 300000) {
    throw new Error('Timestamp too old');
  }

  if (!crypto.timingSafeEqual(
    Buffer.from(signatureHash),
    Buffer.from(expectedSignature)
  )) {
    throw new Error('Invalid signature');
  }

  return true;
}
\`\`\`

## Handling Webhooks

### Express.js Example

\`\`\`javascript
const express = require('express');
const app = express();

app.post('/webhooks/bunker', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['bunker-signature'];

  try {
    verifyWebhookSignature(req.body, signature, process.env.WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(req.body);

  switch (event.type) {
    case 'instance.started':
      handleInstanceStarted(event.data);
      break;
    case 'deployment.completed':
      handleDeploymentCompleted(event.data);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
});
\`\`\`

## Retry Policy

Failed webhook deliveries are retried with exponential backoff:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |
| 6 | 8 hours |

After 6 failed attempts, the webhook is marked as failed.

## Managing Webhooks

### List Webhooks

\`\`\`
GET /v1/webhooks
\`\`\`

### Update Webhook

\`\`\`
PATCH /v1/webhooks/{webhookId}
\`\`\`

### Delete Webhook

\`\`\`
DELETE /v1/webhooks/{webhookId}
\`\`\`

### View Delivery Attempts

\`\`\`
GET /v1/webhooks/{webhookId}/deliveries
\`\`\`

### Resend Event

\`\`\`
POST /v1/webhooks/{webhookId}/deliveries/{deliveryId}/resend
\`\`\`

## Best Practices

1. **Verify signatures** - Always validate webhook authenticity
2. **Respond quickly** - Return 2xx within 30 seconds
3. **Process async** - Queue events for background processing
4. **Handle duplicates** - Implement idempotency
5. **Monitor failures** - Set up alerts for failed deliveries
    `,
    codeExamples: [
      {
        title: 'Webhook Handler',
        language: 'python',
        code: `import hmac
import hashlib
import json
import time
from flask import Flask, request, jsonify

app = Flask(__name__)
WEBHOOK_SECRET = os.environ['WEBHOOK_SECRET']

def verify_signature(payload: bytes, signature: str) -> bool:
    """Verify webhook signature."""
    parts = dict(part.split('=') for part in signature.split(','))
    timestamp = int(parts['t'])
    received_sig = parts['v1']

    # Check timestamp
    if time.time() - timestamp > 300:
        raise ValueError("Timestamp too old")

    # Calculate expected signature
    signed_payload = f"{timestamp}.{payload.decode()}"
    expected_sig = hmac.new(
        WEBHOOK_SECRET.encode(),
        signed_payload.encode(),
        hashlib.sha256
    ).hexdigest()

    # Constant-time comparison
    return hmac.compare_digest(received_sig, expected_sig)

@app.route('/webhooks/bunker', methods=['POST'])
def handle_webhook():
    payload = request.get_data()
    signature = request.headers.get('Bunker-Signature')

    if not verify_signature(payload, signature):
        return jsonify({'error': 'Invalid signature'}), 400

    event = json.loads(payload)

    # Queue for async processing
    process_event.delay(event)

    return jsonify({'received': True})

@celery.task
def process_event(event):
    handlers = {
        'instance.started': handle_instance_started,
        'deployment.completed': handle_deployment_completed,
        'security.alert': handle_security_alert,
    }

    handler = handlers.get(event['type'])
    if handler:
        handler(event['data'])`
      }
    ],
    relatedDocs: ['api-overview', 'sdks']
  },

  'sdks': {
    id: 'sdks',
    title: 'SDKs & Libraries',
    description: 'Official SDKs for Bunker Cloud',
    lastUpdated: '2024-12-01',
    difficulty: 'beginner',
    timeToRead: '8 min',
    content: `
# SDKs & Libraries

Official Bunker Cloud SDKs provide idiomatic interfaces for your preferred programming language.

## Available SDKs

| Language | Package | Version |
|----------|---------|---------|
| JavaScript/TypeScript | @bunkercloud/sdk | 2.x |
| Python | bunkercloud | 2.x |
| Go | github.com/bunkercloud/go-sdk | 2.x |
| Java | com.bunkercloud:sdk | 2.x |
| Ruby | bunkercloud | 2.x |
| .NET | BunkerCloud.SDK | 2.x |
| PHP | bunkercloud/sdk | 2.x |

## JavaScript/TypeScript

### Installation

\`\`\`bash
npm install @bunkercloud/sdk
# or
yarn add @bunkercloud/sdk
\`\`\`

### Usage

\`\`\`typescript
import { BunkerCloud } from '@bunkercloud/sdk';

const client = new BunkerCloud({
  apiKeyId: process.env.BUNKER_API_KEY_ID,
  secretKey: process.env.BUNKER_SECRET_KEY,
  region: 'us-east-1'
});

// List instances
const instances = await client.compute.instances.list();

// Create instance
const instance = await client.compute.instances.create({
  name: 'web-server',
  instanceType: 'vault.medium',
  imageId: 'img-ubuntu-22.04'
});

// Upload to storage
await client.storage.putObject({
  bucket: 'my-bucket',
  key: 'file.txt',
  body: Buffer.from('Hello, World!')
});
\`\`\`

## Python

### Installation

\`\`\`bash
pip install bunkercloud
\`\`\`

### Usage

\`\`\`python
import bunkercloud

client = bunkercloud.Client(
    api_key_id=os.environ['BUNKER_API_KEY_ID'],
    secret_key=os.environ['BUNKER_SECRET_KEY'],
    region='us-east-1'
)

# List instances
instances = client.compute.instances.list()

# Create instance
instance = client.compute.instances.create(
    name='web-server',
    instance_type='vault.medium',
    image_id='img-ubuntu-22.04'
)

# Async support
async with bunkercloud.AsyncClient() as client:
    instances = await client.compute.instances.list()
\`\`\`

## Go

### Installation

\`\`\`bash
go get github.com/bunkercloud/go-sdk/v2
\`\`\`

### Usage

\`\`\`go
package main

import (
    "context"
    "github.com/bunkercloud/go-sdk/v2"
)

func main() {
    client := bunkercloud.NewClient(
        bunkercloud.WithAPIKey(os.Getenv("BUNKER_API_KEY_ID"), os.Getenv("BUNKER_SECRET_KEY")),
        bunkercloud.WithRegion("us-east-1"),
    )

    // List instances
    instances, err := client.Compute.Instances.List(context.Background(), nil)
    if err != nil {
        log.Fatal(err)
    }

    // Create instance
    instance, err := client.Compute.Instances.Create(context.Background(), &bunkercloud.CreateInstanceInput{
        Name:         "web-server",
        InstanceType: "vault.medium",
        ImageID:      "img-ubuntu-22.04",
    })
}
\`\`\`

## Java

### Installation

\`\`\`xml
<dependency>
    <groupId>com.bunkercloud</groupId>
    <artifactId>sdk</artifactId>
    <version>2.0.0</version>
</dependency>
\`\`\`

### Usage

\`\`\`java
import com.bunkercloud.sdk.*;

public class Example {
    public static void main(String[] args) {
        BunkerCloud client = BunkerCloud.builder()
            .apiKeyId(System.getenv("BUNKER_API_KEY_ID"))
            .secretKey(System.getenv("BUNKER_SECRET_KEY"))
            .region("us-east-1")
            .build();

        // List instances
        List<Instance> instances = client.compute().instances().list();

        // Create instance
        Instance instance = client.compute().instances().create(
            CreateInstanceRequest.builder()
                .name("web-server")
                .instanceType("vault.medium")
                .imageId("img-ubuntu-22.04")
                .build()
        );
    }
}
\`\`\`

## Common Features

All SDKs provide:

- **Automatic retries** with exponential backoff
- **Pagination helpers** for listing resources
- **Waiters** for async operations
- **Request signing** handled automatically
- **Type definitions** for IDE support
- **Error handling** with typed exceptions

## SDK Configuration

### Environment Variables

\`\`\`bash
export BUNKER_API_KEY_ID=BKAK123...
export BUNKER_SECRET_KEY=BKsk456...
export BUNKER_REGION=us-east-1
export BUNKER_ENDPOINT=https://api.bunkercloud.com
\`\`\`

### Configuration File

\`\`\`ini
# ~/.bunker/credentials
[default]
bunker_api_key_id = BKAK123...
bunker_secret_key = BKsk456...

[production]
bunker_api_key_id = BKAK789...
bunker_secret_key = BKsk012...

# ~/.bunker/config
[default]
region = us-east-1

[production]
region = eu-west-1
\`\`\`

## Versioning

SDKs follow semantic versioning:
- **Major**: Breaking changes
- **Minor**: New features, backwards compatible
- **Patch**: Bug fixes

We recommend pinning to major versions:

\`\`\`bash
npm install @bunkercloud/sdk@^2.0.0
pip install bunkercloud~=2.0
\`\`\`
    `,
    codeExamples: [
      {
        title: 'SDK Quick Start',
        language: 'javascript',
        code: `const { BunkerCloud } = require('@bunkercloud/sdk');

// Initialize client
const client = new BunkerCloud();

async function main() {
  // Compute operations
  const instances = await client.compute.instances.list({ status: 'running' });
  console.log(\`Running instances: \${instances.length}\`);

  // Storage operations
  const buckets = await client.storage.listBuckets();
  console.log(\`Buckets: \${buckets.map(b => b.name).join(', ')}\`);

  // Database operations
  const databases = await client.databases.clusters.list();
  console.log(\`Databases: \${databases.length}\`);

  // Networking operations
  const vpcs = await client.networking.vpcs.list();
  console.log(\`VPCs: \${vpcs.length}\`);

  // Use waiters for async operations
  const newInstance = await client.compute.instances.create({
    name: 'test-instance',
    instanceType: 'vault.small',
    imageId: 'img-ubuntu-22.04'
  });

  await client.compute.instances.waitUntilRunning(newInstance.id, {
    delay: 5,
    maxAttempts: 40
  });

  console.log('Instance is running!');
}

main().catch(console.error);`
      }
    ],
    relatedDocs: ['api-overview', 'authentication', 'cli-overview']
  }
};

// Export all API reference doc IDs for validation
export const apiReferenceDocIds = Object.keys(apiReferenceDocs);
