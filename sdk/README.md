# Bunker Cloud SDK

Official JavaScript/TypeScript SDK for Bunker Cloud.

## Installation

```bash
npm install @bunker-cloud/sdk
```

## Quick Start

```typescript
import BunkerCloud from '@bunker-cloud/sdk';

const bunker = new BunkerCloud({
  accessToken: 'your-access-token',
});

// List apps
const apps = await bunker.apps.list();
console.log(apps);

// Create a database
const db = await bunker.databases.create({
  name: 'my-database',
  engine: 'postgresql',
  version: '16',
});
console.log(db.connection_string);
```

## Authentication

### Using Access Token

```typescript
const bunker = new BunkerCloud({
  accessToken: 'your-jwt-token',
});
```

### Using API Key

```typescript
const bunker = new BunkerCloud({
  apiKey: 'your-api-key',
});
```

### Login Programmatically

```typescript
const bunker = new BunkerCloud();

const { accessToken, refreshToken } = await bunker.auth.login(
  'email@example.com',
  'password'
);

bunker.setAccessToken(accessToken);
```

## Apps API

```typescript
// List all apps
const apps = await bunker.apps.list();

// Create an app
const app = await bunker.apps.create({
  name: 'my-app',
  image: 'nginx:alpine',
  port: 80,
  env_vars: { NODE_ENV: 'production' },
  memory: '256m',
  cpus: '0.25',
});

// Get app details
const appInfo = await bunker.apps.get(app.id);

// Update and redeploy
await bunker.apps.update(app.id, { image: 'nginx:latest' });

// Control app lifecycle
await bunker.apps.start(app.id);
await bunker.apps.stop(app.id);
await bunker.apps.restart(app.id);

// Get logs
const logs = await bunker.apps.logs(app.id, 100);

// Get stats
const stats = await bunker.apps.stats(app.id);

// Delete app
await bunker.apps.delete(app.id);
```

## Databases API

```typescript
// List all databases
const databases = await bunker.databases.list();

// Create a database
const db = await bunker.databases.create({
  name: 'my-postgres',
  engine: 'postgresql', // postgresql, mysql, redis, mongodb
  version: '16',
});

// Get connection details
const dbInfo = await bunker.databases.get(db.id);
console.log(dbInfo.connection_string);

// Control database
await bunker.databases.start(db.id);
await bunker.databases.stop(db.id);

// Delete database
await bunker.databases.delete(db.id);
```

## Storage API

```typescript
// List buckets
const buckets = await bunker.storage.listBuckets();

// Create a bucket
const bucket = await bunker.storage.createBucket('my-bucket', false);

// List objects
const objects = await bunker.storage.listObjects(bucket.id, 'uploads/');

// Get presigned URLs
const uploadUrl = await bunker.storage.getPresignedUploadUrl(
  bucket.id,
  'file.txt',
  3600
);

const downloadUrl = await bunker.storage.getPresignedDownloadUrl(
  bucket.id,
  'file.txt',
  3600
);

// Delete object
await bunker.storage.deleteObject(bucket.id, 'file.txt');

// Delete bucket
await bunker.storage.deleteBucket(bucket.id);
```

## Error Handling

```typescript
import BunkerCloud, { BunkerError } from '@bunker-cloud/sdk';

try {
  await bunker.apps.create({ name: 'my-app', image: 'nginx' });
} catch (error) {
  if (error instanceof BunkerError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

```typescript
import BunkerCloud, {
  App,
  Database,
  Bucket,
  AppCreateOptions,
  DatabaseCreateOptions,
} from '@bunker-cloud/sdk';
```

## Configuration

```typescript
const bunker = new BunkerCloud({
  apiUrl: 'https://cloud-api.bunkercorpo.com', // Default
  accessToken: 'your-token',
  // OR
  apiKey: 'your-api-key',
});
```

## License

MIT License - Bunker Corporation
