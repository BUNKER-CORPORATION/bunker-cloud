import chalk from 'chalk';
import { table } from 'table';

export function success(message: string): void {
  console.log(chalk.green('✓') + ' ' + message);
}

export function error(message: string): void {
  console.log(chalk.red('✗') + ' ' + chalk.red(message));
}

export function warning(message: string): void {
  console.log(chalk.yellow('⚠') + ' ' + chalk.yellow(message));
}

export function info(message: string): void {
  console.log(chalk.blue('ℹ') + ' ' + message);
}

export function heading(message: string): void {
  console.log('\n' + chalk.bold.underline(message) + '\n');
}

export function printTable(headers: string[], rows: string[][]): void {
  const data = [headers.map((h) => chalk.bold(h)), ...rows];
  console.log(
    table(data, {
      border: {
        topBody: '─',
        topJoin: '┬',
        topLeft: '┌',
        topRight: '┐',
        bottomBody: '─',
        bottomJoin: '┴',
        bottomLeft: '└',
        bottomRight: '┘',
        bodyLeft: '│',
        bodyRight: '│',
        bodyJoin: '│',
        joinBody: '─',
        joinLeft: '├',
        joinRight: '┤',
        joinJoin: '┼',
      },
    })
  );
}

export function printKeyValue(data: Record<string, any>): void {
  const maxKeyLength = Math.max(...Object.keys(data).map((k) => k.length));
  for (const [key, value] of Object.entries(data)) {
    const paddedKey = key.padEnd(maxKeyLength);
    console.log(`  ${chalk.gray(paddedKey)}  ${value}`);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}

export function statusColor(status: string): string {
  const statusColors: Record<string, (s: string) => string> = {
    running: chalk.green,
    healthy: chalk.green,
    active: chalk.green,
    success: chalk.green,
    stopped: chalk.yellow,
    pending: chalk.yellow,
    deploying: chalk.blue,
    failed: chalk.red,
    error: chalk.red,
    deleted: chalk.gray,
  };
  const colorFn = statusColors[status.toLowerCase()] || chalk.white;
  return colorFn(status);
}
