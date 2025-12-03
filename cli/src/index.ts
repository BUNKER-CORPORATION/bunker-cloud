#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { registerAuthCommands } from './commands/auth.js';
import { registerAppsCommands } from './commands/apps.js';
import { registerDatabasesCommands } from './commands/databases.js';
import { registerStorageCommands } from './commands/storage.js';

const program = new Command();

program
  .name('bunker')
  .description(chalk.bold('Bunker Cloud CLI') + ' - Deploy and manage your cloud infrastructure')
  .version('1.0.0');

// Register command groups
registerAuthCommands(program);
registerAppsCommands(program);
registerDatabasesCommands(program);
registerStorageCommands(program);

// Config command
program
  .command('config')
  .description('View or set CLI configuration')
  .option('--api-url <url>', 'Set API URL')
  .option('--show', 'Show current configuration')
  .action(async (options) => {
    const { getAll, setApiUrl, getApiUrl } = await import('./lib/config.js');

    if (options.apiUrl) {
      setApiUrl(options.apiUrl);
      console.log(chalk.green('✓') + ` API URL set to ${options.apiUrl}`);
      return;
    }

    if (options.show || Object.keys(options).length === 0) {
      const config = getAll();
      console.log('\n' + chalk.bold.underline('Configuration') + '\n');
      console.log(`  API URL: ${config.apiUrl}`);
      console.log(`  Logged in: ${config.token ? 'Yes' : 'No'}`);
      if (config.email) {
        console.log(`  Email: ${config.email}`);
      }
      console.log();
    }
  });

// Version info
program
  .command('version')
  .description('Show version information')
  .action(() => {
    console.log(chalk.bold('Bunker Cloud CLI') + ' v1.0.0');
    console.log('API: https://cloud-api.bunkercorpo.com');
    console.log('Docs: https://cloud.bunkercorpo.com/docs');
  });

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red('Invalid command: %s'), program.args.join(' '));
  console.log('Run ' + chalk.cyan('bunker --help') + ' for a list of available commands.');
  process.exit(1);
});

// Parse and execute
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  console.log();
  console.log(chalk.bold.cyan('  ____              _             '));
  console.log(chalk.bold.cyan(' | __ ) _   _ _ __ | | _____ _ __ '));
  console.log(chalk.bold.cyan(' |  _ \\| | | |  _ \\| |/ / _ \\  __|'));
  console.log(chalk.bold.cyan(' | |_) | |_| | | | |   <  __/ |   '));
  console.log(chalk.bold.cyan(' |____/ \\__,_|_| |_|_|\\_\\___|_|   '));
  console.log();
  console.log(chalk.gray('  Cloud infrastructure made simple'));
  console.log();
  program.help();
}
