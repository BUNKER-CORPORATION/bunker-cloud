import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { getApi, handleApiError } from '../lib/api.js';
import { isLoggedIn } from '../lib/config.js';
import { success, error, info, heading, printTable, printKeyValue, statusColor, formatDate, formatBytes } from '../lib/output.js';

function requireAuth(): void {
  if (!isLoggedIn()) {
    error('Not logged in. Run `bunker auth login` first.');
    process.exit(1);
  }
}

export function registerDatabasesCommands(program: Command): void {
  const db = program.command('databases').alias('db').description('Manage database instances');

  // List databases
  db.command('list')
    .alias('ls')
    .description('List all databases')
    .action(async () => {
      requireAuth();
      const spinner = ora('Fetching databases...').start();

      try {
        const api = getApi();
        const response = await api.get('/databases');
        const databases = response.data.data;

        spinner.stop();

        if (databases.length === 0) {
          info('No databases found. Create one with `bunker databases create`');
          return;
        }

        heading('Your Databases');
        printTable(
          ['Name', 'Engine', 'Version', 'Status', 'Created'],
          databases.map((db: any) => [
            db.name,
            db.engine,
            db.version,
            statusColor(db.status),
            formatDate(db.created_at),
          ])
        );
      } catch (err) {
        spinner.stop();
        error(`Failed to list databases: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Create database
  db.command('create')
    .description('Create a new database')
    .option('-n, --name <name>', 'Database name')
    .option('-e, --engine <engine>', 'Database engine (postgresql, mysql, redis, mongodb)')
    .option('-v, --version <version>', 'Engine version')
    .action(async (options) => {
      requireAuth();

      let { name, engine, version } = options;

      if (!name || !engine) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Database name:',
            when: !name,
            validate: (input) =>
              /^[a-z][a-z0-9-]*$/.test(input)
                ? true
                : 'Name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens',
          },
          {
            type: 'list',
            name: 'engine',
            message: 'Database engine:',
            when: !engine,
            choices: [
              { name: 'PostgreSQL', value: 'postgresql' },
              { name: 'MySQL', value: 'mysql' },
              { name: 'Redis', value: 'redis' },
              { name: 'MongoDB', value: 'mongodb' },
            ],
          },
          {
            type: 'list',
            name: 'version',
            message: 'Version:',
            when: !version,
            choices: (answers: any) => {
              const versions: Record<string, string[]> = {
                postgresql: ['16', '15', '14'],
                mysql: ['8.0', '5.7'],
                redis: ['7', '6'],
                mongodb: ['7', '6'],
              };
              return versions[answers.engine || engine] || ['latest'];
            },
          },
        ]);
        name = name || answers.name;
        engine = engine || answers.engine;
        version = version || answers.version;
      }

      const spinner = ora('Creating database...').start();

      try {
        const api = getApi();
        const response = await api.post('/databases', { name, engine, version });
        const db = response.data.data;

        spinner.stop();
        success(`Database "${db.name}" created successfully!`);

        heading('Connection Details');
        printKeyValue({
          Host: db.host,
          Port: db.port,
          Database: db.database,
          Username: db.username,
          Password: db.password,
        });

        if (db.connection_string) {
          console.log('\n' + info('Connection string:'));
          console.log(`  ${db.connection_string}`);
        }
      } catch (err) {
        spinner.stop();
        error(`Failed to create database: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Get database info
  db.command('info <name>')
    .description('Get database connection details')
    .action(async (name) => {
      requireAuth();
      const spinner = ora('Fetching database info...').start();

      try {
        const api = getApi();
        const database = await findDatabaseByName(api, name);
        const response = await api.get(`/databases/${database.id}`);
        const db = response.data.data;

        spinner.stop();
        heading(`Database: ${db.name}`);
        printKeyValue({
          ID: db.id,
          Engine: `${db.engine} ${db.version}`,
          Status: statusColor(db.status),
          Created: formatDate(db.created_at),
        });

        heading('Connection Details');
        printKeyValue({
          Host: db.host,
          Port: db.port,
          Database: db.database,
          Username: db.username,
          Password: db.password,
        });

        if (db.connection_string) {
          console.log('\n  Connection string:');
          console.log(`  ${db.connection_string}`);
        }
      } catch (err) {
        spinner.stop();
        error(`Failed to get database info: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Start database
  db.command('start <name>')
    .description('Start a database')
    .action(async (name) => {
      requireAuth();
      const spinner = ora(`Starting ${name}...`).start();

      try {
        const api = getApi();
        const database = await findDatabaseByName(api, name);
        await api.post(`/databases/${database.id}/start`);
        spinner.stop();
        success(`Database "${name}" started`);
      } catch (err) {
        spinner.stop();
        error(`Failed to start database: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Stop database
  db.command('stop <name>')
    .description('Stop a database')
    .action(async (name) => {
      requireAuth();
      const spinner = ora(`Stopping ${name}...`).start();

      try {
        const api = getApi();
        const database = await findDatabaseByName(api, name);
        await api.post(`/databases/${database.id}/stop`);
        spinner.stop();
        success(`Database "${name}" stopped`);
      } catch (err) {
        spinner.stop();
        error(`Failed to stop database: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Delete database
  db.command('delete <name>')
    .description('Delete a database')
    .option('-f, --force', 'Skip confirmation')
    .action(async (name, options) => {
      requireAuth();

      if (!options.force) {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to delete "${name}"? All data will be lost!`,
            default: false,
          },
        ]);
        if (!confirm) {
          info('Aborted');
          return;
        }
      }

      const spinner = ora(`Deleting ${name}...`).start();

      try {
        const api = getApi();
        const database = await findDatabaseByName(api, name);
        await api.delete(`/databases/${database.id}`);
        spinner.stop();
        success(`Database "${name}" deleted`);
      } catch (err) {
        spinner.stop();
        error(`Failed to delete database: ${handleApiError(err)}`);
        process.exit(1);
      }
    });
}

async function findDatabaseByName(api: any, name: string): Promise<any> {
  const response = await api.get('/databases');
  const db = response.data.data.find((d: any) => d.name === name);
  if (!db) {
    throw new Error(`Database "${name}" not found`);
  }
  return db;
}
