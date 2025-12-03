import Docker from 'dockerode';
import { config } from '../config.js';
import { logger } from './logger.js';

const docker = new Docker({ socketPath: config.docker.socketPath });

export interface AppContainer {
  id: string;
  name: string;
  status: string;
  state: string;
  ports: { internal: number; external?: number }[];
  created: Date;
}

export interface DeployOptions {
  appId: string;
  name: string;
  image: string;
  port: number;
  envVars?: Record<string, string>;
  memory?: string;
  cpus?: string;
  replicas?: number;
  healthCheck?: {
    path: string;
    interval: number;
    timeout: number;
  };
}

// Ensure the apps network exists
export async function ensureNetwork(): Promise<void> {
  const networkName = config.docker.network;
  try {
    await docker.getNetwork(networkName).inspect();
  } catch (error: any) {
    if (error.statusCode === 404) {
      await docker.createNetwork({
        Name: networkName,
        Driver: 'bridge',
        Labels: {
          'bunker.managed': 'true',
          'bunker.type': 'apps-network',
        },
      });
      logger.info(`Created network: ${networkName}`);
    } else {
      throw error;
    }
  }
}

// Pull an image from registry
export async function pullImage(image: string): Promise<void> {
  return new Promise((resolve, reject) => {
    docker.pull(image, (err: any, stream: any) => {
      if (err) return reject(err);

      docker.modem.followProgress(stream, (err: any) => {
        if (err) return reject(err);
        logger.info(`Pulled image: ${image}`);
        resolve();
      });
    });
  });
}

// Deploy an app container
export async function deployApp(options: DeployOptions): Promise<string> {
  const containerName = `bunker-app-${options.appId}`;

  // Stop and remove existing container if exists
  try {
    const existing = docker.getContainer(containerName);
    await existing.stop().catch(() => {});
    await existing.remove().catch(() => {});
  } catch (error) {
    // Container doesn't exist, continue
  }

  // Pull the image first
  try {
    await pullImage(options.image);
  } catch (error: any) {
    logger.warn(`Failed to pull image ${options.image}: ${error.message}`);
    // Continue anyway, image might be local
  }

  // Prepare environment variables
  const env = Object.entries(options.envVars || {}).map(([k, v]) => `${k}=${v}`);
  env.push(`PORT=${options.port}`);

  // Create container
  const container = await docker.createContainer({
    name: containerName,
    Image: options.image,
    Env: env,
    ExposedPorts: {
      [`${options.port}/tcp`]: {},
    },
    HostConfig: {
      Memory: parseMemory(options.memory || config.defaults.memory),
      NanoCpus: parseCpus(options.cpus || config.defaults.cpus),
      NetworkMode: config.docker.network,
      RestartPolicy: { Name: 'unless-stopped' },
      PublishAllPorts: true,
    },
    Labels: {
      'bunker.managed': 'true',
      'bunker.type': 'app',
      'bunker.app.id': options.appId,
      'bunker.app.name': options.name,
      'bunker.app.port': options.port.toString(),
      // Traefik labels for routing
      'traefik.enable': 'true',
      [`traefik.http.routers.app-${options.appId}.rule`]: `Host(\`${options.name}.${config.baseDomain}\`)`,
      [`traefik.http.routers.app-${options.appId}.entrypoints`]: 'websecure',
      [`traefik.http.routers.app-${options.appId}.tls.certresolver`]: 'letsencrypt',
      [`traefik.http.services.app-${options.appId}.loadbalancer.server.port`]: options.port.toString(),
    },
    Healthcheck: options.healthCheck ? {
      Test: ['CMD-SHELL', `wget -qO- http://127.0.0.1:${options.port}${options.healthCheck.path} || exit 1`],
      Interval: options.healthCheck.interval * 1000000000, // nanoseconds
      Timeout: options.healthCheck.timeout * 1000000000,
      Retries: 3,
      StartPeriod: 30000000000,
    } : undefined,
  });

  await container.start();

  // Connect to apps network
  try {
    const network = docker.getNetwork(config.docker.network);
    await network.connect({ Container: container.id });
  } catch (error) {
    // Already connected or network issue
  }

  logger.info(`Deployed app: ${containerName}`);
  return container.id;
}

// Get app container info
export async function getAppContainer(appId: string): Promise<AppContainer | null> {
  const containerName = `bunker-app-${appId}`;
  try {
    const container = docker.getContainer(containerName);
    const info = await container.inspect();

    const ports = Object.entries(info.NetworkSettings.Ports || {}).map(([key, bindings]) => {
      const internal = parseInt(key.split('/')[0]);
      const external = bindings?.[0]?.HostPort ? parseInt(bindings[0].HostPort) : undefined;
      return { internal, external };
    });

    return {
      id: info.Id,
      name: containerName,
      status: info.State.Status,
      state: info.State.Health?.Status || info.State.Status,
      ports,
      created: new Date(info.Created),
    };
  } catch (error) {
    return null;
  }
}

// Get app logs
export async function getAppLogs(appId: string, lines: number = 100): Promise<string> {
  const containerName = `bunker-app-${appId}`;
  try {
    const container = docker.getContainer(containerName);
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail: lines,
      timestamps: true,
    });
    return logs.toString('utf8');
  } catch (error) {
    return '';
  }
}

// Stop an app
export async function stopApp(appId: string): Promise<void> {
  const containerName = `bunker-app-${appId}`;
  const container = docker.getContainer(containerName);
  await container.stop();
  logger.info(`Stopped app: ${containerName}`);
}

// Start an app
export async function startApp(appId: string): Promise<void> {
  const containerName = `bunker-app-${appId}`;
  const container = docker.getContainer(containerName);
  await container.start();
  logger.info(`Started app: ${containerName}`);
}

// Restart an app
export async function restartApp(appId: string): Promise<void> {
  const containerName = `bunker-app-${appId}`;
  const container = docker.getContainer(containerName);
  await container.restart();
  logger.info(`Restarted app: ${containerName}`);
}

// Delete an app container
export async function deleteApp(appId: string): Promise<void> {
  const containerName = `bunker-app-${appId}`;
  try {
    const container = docker.getContainer(containerName);
    await container.stop().catch(() => {});
    await container.remove({ force: true });
    logger.info(`Deleted app: ${containerName}`);
  } catch (error: any) {
    if (error.statusCode !== 404) throw error;
  }
}

// Get container stats
export async function getAppStats(appId: string): Promise<any> {
  const containerName = `bunker-app-${appId}`;
  try {
    const container = docker.getContainer(containerName);
    const stats = await container.stats({ stream: false });

    // Calculate CPU percentage
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;

    // Calculate memory usage
    const memoryUsage = stats.memory_stats.usage || 0;
    const memoryLimit = stats.memory_stats.limit || 0;
    const memoryPercent = (memoryUsage / memoryLimit) * 100;

    return {
      cpu_percent: cpuPercent.toFixed(2),
      memory_usage: memoryUsage,
      memory_limit: memoryLimit,
      memory_percent: memoryPercent.toFixed(2),
      network_rx: stats.networks?.eth0?.rx_bytes || 0,
      network_tx: stats.networks?.eth0?.tx_bytes || 0,
    };
  } catch (error) {
    return null;
  }
}

// Helper: Parse memory string to bytes
function parseMemory(memory: string): number {
  const match = memory.match(/^(\d+)(m|g|mb|gb)?$/i);
  if (!match) return 256 * 1024 * 1024; // default 256MB

  const value = parseInt(match[1]);
  const unit = (match[2] || 'm').toLowerCase();

  if (unit === 'g' || unit === 'gb') return value * 1024 * 1024 * 1024;
  return value * 1024 * 1024; // MB
}

// Helper: Parse CPU string to nanocpus
function parseCpus(cpus: string): number {
  const value = parseFloat(cpus);
  return Math.floor(value * 1000000000);
}

// Check Docker health
export async function checkDockerHealth(): Promise<boolean> {
  try {
    await docker.ping();
    return true;
  } catch (error) {
    return false;
  }
}
