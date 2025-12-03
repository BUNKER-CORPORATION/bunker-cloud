import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { getApi, handleApiError } from '../lib/api.js';
import { isLoggedIn } from '../lib/config.js';
import { success, error, info, heading, printTable, printKeyValue, statusColor, formatDate } from '../lib/output.js';

function requireAuth(): void {
  if (!isLoggedIn()) {
    error('Not logged in. Run `bunker auth login` first.');
    process.exit(1);
  }
}

export function registerAppsCommands(program: Command): void {
  const apps = program.command('apps').description('Manage deployed applications');

  // List apps
  apps
    .command('list')
    .alias('ls')
    .description('List all apps')
    .action(async () => {
      requireAuth();
      const spinner = ora('Fetching apps...').start();

      try {
        const api = getApi();
        const response = await api.get('/apps');
        const appsList = response.data.data;

        spinner.stop();

        if (appsList.length === 0) {
          info('No apps found. Create one with `bunker apps create`');
          return;
        }

        heading('Your Apps');
        printTable(
          ['Name', 'Status', 'Image', 'URL', 'Created'],
          appsList.map((app: any) => [
            app.name,
            statusColor(app.status),
            app.image.substring(0, 30),
            app.url,
            formatDate(app.created_at),
          ])
        );
      } catch (err) {
        spinner.stop();
        error(`Failed to list apps: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Create app
  apps
    .command('create')
    .description('Deploy a new app')
    .option('-n, --name <name>', 'App name')
    .option('-i, --image <image>', 'Docker image')
    .option('-p, --port <port>', 'Container port', '3000')
    .option('-e, --env <env...>', 'Environment variables (KEY=value)')
    .option('-m, --memory <memory>', 'Memory limit (e.g., 256m, 1g)', '256m')
    .option('-c, --cpus <cpus>', 'CPU limit (e.g., 0.25, 1)', '0.25')
    .action(async (options) => {
      requireAuth();

      let { name, image, port, env, memory, cpus } = options;

      if (!name || !image) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'App name:',
            when: !name,
            validate: (input) =>
              /^[a-z][a-z0-9-]*[a-z0-9]$/.test(input)
                ? true
                : 'Name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens',
          },
          {
            type: 'input',
            name: 'image',
            message: 'Docker image:',
            when: !image,
          },
        ]);
        name = name || answers.name;
        image = image || answers.image;
      }

      // Parse env vars
      const envVars: Record<string, string> = {};
      if (env) {
        for (const e of env) {
          const [key, ...valueParts] = e.split('=');
          envVars[key] = valueParts.join('=');
        }
      }

      const spinner = ora('Deploying app...').start();

      try {
        const api = getApi();
        const response = await api.post('/apps', {
          name,
          image,
          port: parseInt(port),
          env_vars: envVars,
          memory,
          cpus,
        });

        const app = response.data.data;
        spinner.stop();
        success(`App "${app.name}" deployed successfully!`);
        info(`URL: ${app.url}`);
      } catch (err) {
        spinner.stop();
        error(`Failed to deploy app: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Get app info
  apps
    .command('info <name>')
    .description('Get detailed information about an app')
    .action(async (name) => {
      requireAuth();
      const spinner = ora('Fetching app info...').start();

      try {
        const api = getApi();
        const listResponse = await api.get('/apps');
        const app = listResponse.data.data.find((a: any) => a.name === name);

        if (!app) {
          spinner.stop();
          error(`App "${name}" not found`);
          process.exit(1);
        }

        const response = await api.get(`/apps/${app.id}`);
        const appInfo = response.data.data;

        spinner.stop();
        heading(`App: ${appInfo.name}`);
        printKeyValue({
          ID: appInfo.id,
          Status: statusColor(appInfo.status),
          Image: appInfo.image,
          Port: appInfo.port,
          URL: appInfo.url,
          Memory: appInfo.memory,
          CPUs: appInfo.cpus,
          Created: formatDate(appInfo.created_at),
        });

        if (appInfo.stats) {
          heading('Resource Usage');
          printKeyValue({
            CPU: `${appInfo.stats.cpu_percent}%`,
            Memory: `${appInfo.stats.memory_percent}%`,
            'Network RX': `${(appInfo.stats.network_rx / 1024 / 1024).toFixed(2)} MB`,
            'Network TX': `${(appInfo.stats.network_tx / 1024 / 1024).toFixed(2)} MB`,
          });
        }

        if (appInfo.domains && appInfo.domains.length > 0) {
          heading('Custom Domains');
          printTable(
            ['Domain', 'Primary', 'SSL'],
            appInfo.domains.map((d: any) => [
              d.domain,
              d.is_primary ? 'Yes' : 'No',
              statusColor(d.ssl_status),
            ])
          );
        }
      } catch (err) {
        spinner.stop();
        error(`Failed to get app info: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Start app
  apps
    .command('start <name>')
    .description('Start an app')
    .action(async (name) => {
      requireAuth();
      const spinner = ora(`Starting ${name}...`).start();

      try {
        const api = getApi();
        const app = await findAppByName(api, name);
        await api.post(`/apps/${app.id}/start`);
        spinner.stop();
        success(`App "${name}" started`);
      } catch (err) {
        spinner.stop();
        error(`Failed to start app: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Stop app
  apps
    .command('stop <name>')
    .description('Stop an app')
    .action(async (name) => {
      requireAuth();
      const spinner = ora(`Stopping ${name}...`).start();

      try {
        const api = getApi();
        const app = await findAppByName(api, name);
        await api.post(`/apps/${app.id}/stop`);
        spinner.stop();
        success(`App "${name}" stopped`);
      } catch (err) {
        spinner.stop();
        error(`Failed to stop app: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Restart app
  apps
    .command('restart <name>')
    .description('Restart an app')
    .action(async (name) => {
      requireAuth();
      const spinner = ora(`Restarting ${name}...`).start();

      try {
        const api = getApi();
        const app = await findAppByName(api, name);
        await api.post(`/apps/${app.id}/restart`);
        spinner.stop();
        success(`App "${name}" restarted`);
      } catch (err) {
        spinner.stop();
        error(`Failed to restart app: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Delete app
  apps
    .command('delete <name>')
    .description('Delete an app')
    .option('-f, --force', 'Skip confirmation')
    .action(async (name, options) => {
      requireAuth();

      if (!options.force) {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to delete "${name}"? This cannot be undone.`,
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
        const app = await findAppByName(api, name);
        await api.delete(`/apps/${app.id}`);
        spinner.stop();
        success(`App "${name}" deleted`);
      } catch (err) {
        spinner.stop();
        error(`Failed to delete app: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Logs
  apps
    .command('logs <name>')
    .description('View app logs')
    .option('-n, --lines <lines>', 'Number of lines', '100')
    .action(async (name, options) => {
      requireAuth();
      const spinner = ora('Fetching logs...').start();

      try {
        const api = getApi();
        const app = await findAppByName(api, name);
        const response = await api.get(`/apps/${app.id}/logs`, {
          params: { lines: options.lines },
        });

        spinner.stop();
        console.log(response.data.data.logs || 'No logs available');
      } catch (err) {
        spinner.stop();
        error(`Failed to get logs: ${handleApiError(err)}`);
        process.exit(1);
      }
    });

  // Deploy (update)
  apps
    .command('deploy <name>')
    .description('Deploy a new version of an app')
    .option('-i, --image <image>', 'New Docker image')
    .action(async (name, options) => {
      requireAuth();

      let { image } = options;
      if (!image) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'image',
            message: 'Docker image:',
          },
        ]);
        image = answers.image;
      }

      const spinner = ora(`Deploying new version of ${name}...`).start();

      try {
        const api = getApi();
        const app = await findAppByName(api, name);
        await api.put(`/apps/${app.id}`, { image });
        spinner.stop();
        success(`App "${name}" deployed with new image: ${image}`);
      } catch (err) {
        spinner.stop();
        error(`Failed to deploy: ${handleApiError(err)}`);
        process.exit(1);
      }
    });
}

async function findAppByName(api: any, name: string): Promise<any> {
  const response = await api.get('/apps');
  const app = response.data.data.find((a: any) => a.name === name);
  if (!app) {
    throw new Error(`App "${name}" not found`);
  }
  return app;
}
