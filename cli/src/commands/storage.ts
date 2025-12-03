import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { getApi, handleApiError } from '../lib/api.js';
import { isLoggedIn } from '../lib/config.js';
import { success, error, info, heading, printTable, printKeyValue, formatBytes, formatDate } from '../lib/output.js';

function requireAuth(): void {
  if (!isLoggedIn()) {
    error('Not logged in. Run `bunker auth login` first.');
    process.exit(1);
  }
}

export function registerStorageCommands(program: Command): void {
  const storage = program.command('storage').alias('s3').description('Manage object storage buckets');

  // List buckets
  storage
    .command('list')
    .alias('ls')
    .description('List all buckets')
    .action(async () => {
      requireAuth();
      const spinner = ora('Fetching buckets...').start();

      try {
        const api = getApi();
        const response = await api.get('/buckets');
        const buckets = response.data.data;

        spinner.stop();

        if (buckets.length === 0) {
          info('No buckets found. Create one with `bunker storage create`');
          return;
        }

        heading('Your Buckets');
        printTable(
          ['Name', 'Size', 'Objects', 'Public', 'Created'],
          buckets.map((b: any) => [
            b.name,
            b.size_formatted || formatBytes(parseInt(b.size_bytes) || 0),
            b.object_count.toString(),
            b.public ? 'Yes' : 'No',
            formatDate(b.created_at),
          ])
        );
      } catch (err) {
        spinner.stop();
        error(`Failed to list buckets: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Create bucket
  storage
    .command('create <name>')
    .description('Create a new bucket')
    .option('-p, --public', 'Make bucket public')
    .action(async (name, options) => {
      requireAuth();
      const spinner = ora('Creating bucket...').start();

      try {
        const api = getApi();
        const response = await api.post('/buckets', {
          name,
          is_public: options.public || false,
        });

        const bucket = response.data.data;
        spinner.stop();
        success(`Bucket "${bucket.name}" created successfully!`);
        info(`Endpoint: ${bucket.endpoint}`);
      } catch (err) {
        spinner.stop();
        error(`Failed to create bucket: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Delete bucket
  storage
    .command('delete <name>')
    .description('Delete a bucket')
    .option('-f, --force', 'Skip confirmation')
    .action(async (name, options) => {
      requireAuth();

      if (!options.force) {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to delete bucket "${name}"? All objects will be deleted!`,
            default: false,
          },
        ]);
        if (!confirm) {
          info('Aborted');
          return;
        }
      }

      const spinner = ora(`Deleting bucket ${name}...`).start();

      try {
        const api = getApi();
        const bucket = await findBucketByName(api, name);
        await api.delete(`/buckets/${bucket.id}`);
        spinner.stop();
        success(`Bucket "${name}" deleted`);
      } catch (err) {
        spinner.stop();
        error(`Failed to delete bucket: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // List objects in bucket
  storage
    .command('objects <bucket>')
    .description('List objects in a bucket')
    .option('-p, --prefix <prefix>', 'Filter by prefix')
    .action(async (bucketName, options) => {
      requireAuth();
      const spinner = ora('Fetching objects...').start();

      try {
        const api = getApi();
        const bucket = await findBucketByName(api, bucketName);
        const response = await api.get(`/buckets/${bucket.id}/objects`, {
          params: { prefix: options.prefix || '' },
        });

        const { objects, count } = response.data.data;
        spinner.stop();

        if (count === 0) {
          info(`No objects in bucket "${bucketName}"`);
          return;
        }

        heading(`Objects in ${bucketName} (${count} total)`);
        printTable(
          ['Name', 'Size', 'Last Modified'],
          objects.map((o: any) => [
            o.name,
            o.size_formatted || formatBytes(o.size),
            o.last_modified ? formatDate(o.last_modified) : '-',
          ])
        );
      } catch (err) {
        spinner.stop();
        error(`Failed to list objects: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Get presigned upload URL
  storage
    .command('presign-upload <bucket> <key>')
    .description('Generate a presigned URL for uploading')
    .option('-e, --expires <seconds>', 'URL expiry in seconds', '3600')
    .action(async (bucketName, key, options) => {
      requireAuth();
      const spinner = ora('Generating presigned URL...').start();

      try {
        const api = getApi();
        const bucket = await findBucketByName(api, bucketName);
        const response = await api.post(`/buckets/${bucket.id}/presigned/upload`, {
          key,
          expires: parseInt(options.expires),
        });

        const data = response.data.data;
        spinner.stop();

        heading('Presigned Upload URL');
        printKeyValue({
          Key: data.key,
          Method: data.method,
          'Expires in': `${data.expires_in} seconds`,
          'Expires at': formatDate(data.expires_at),
        });
        console.log('\nURL:');
        console.log(data.url);
      } catch (err) {
        spinner.stop();
        error(`Failed to generate URL: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Get presigned download URL
  storage
    .command('presign-download <bucket> <key>')
    .description('Generate a presigned URL for downloading')
    .option('-e, --expires <seconds>', 'URL expiry in seconds', '3600')
    .action(async (bucketName, key, options) => {
      requireAuth();
      const spinner = ora('Generating presigned URL...').start();

      try {
        const api = getApi();
        const bucket = await findBucketByName(api, bucketName);
        const response = await api.post(`/buckets/${bucket.id}/presigned/download`, {
          key,
          expires: parseInt(options.expires),
        });

        const data = response.data.data;
        spinner.stop();

        heading('Presigned Download URL');
        printKeyValue({
          Key: data.key,
          'Expires in': `${data.expires_in} seconds`,
          'Expires at': formatDate(data.expires_at),
        });
        console.log('\nURL:');
        console.log(data.url);
      } catch (err) {
        spinner.stop();
        error(`Failed to generate URL: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Get bucket info
  storage
    .command('info <bucket>')
    .description('Get bucket details')
    .action(async (bucketName) => {
      requireAuth();
      const spinner = ora('Fetching bucket info...').start();

      try {
        const api = getApi();
        const bucket = await findBucketByName(api, bucketName);
        const response = await api.get(`/buckets/${bucket.id}`);
        const data = response.data.data;

        spinner.stop();
        heading(`Bucket: ${data.name}`);
        printKeyValue({
          ID: data.id,
          'Bucket Name': data.bucket,
          Size: data.size_formatted || formatBytes(parseInt(data.size_bytes) || 0),
          Objects: data.object_count,
          Public: data.public ? 'Yes' : 'No',
          Endpoint: data.endpoint,
          Created: formatDate(data.created_at),
        });
      } catch (err) {
        spinner.stop();
        error(`Failed to get bucket info: ${handleApiError(err)}`);
        process.exit(1);
      }
    });
}

async function findBucketByName(api: any, name: string): Promise<any> {
  const response = await api.get('/buckets');
  const bucket = response.data.data.find((b: any) => b.name === name);
  if (!bucket) {
    throw new Error(`Bucket "${name}" not found`);
  }
  return bucket;
}
