import Docker from 'dockerode';
import { config } from '../config.js';
import { nanoid } from 'nanoid';

const docker = new Docker({ socketPath: config.docker.socketPath });

export interface DatabaseInstance {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'redis' | 'mongodb';
  containerId: string;
  port: number;
  host: string;
  status: string;
}

// Generate a random available port in the range 20000-30000
async function getAvailablePort(): Promise<number> {
  const containers = await docker.listContainers({ all: true });
  const usedPorts = new Set<number>();

  containers.forEach(container => {
    container.Ports?.forEach(port => {
      if (port.PublicPort) {
        usedPorts.add(port.PublicPort);
      }
    });
  });

  let port: number;
  do {
    port = Math.floor(Math.random() * 10000) + 20000;
  } while (usedPorts.has(port));

  return port;
}

// Generate secure password
function generatePassword(): string {
  return nanoid(32);
}

// Ensure database network exists
async function ensureNetwork(): Promise<void> {
  const networks = await docker.listNetworks();
  const exists = networks.some(n => n.Name === config.network.name);

  if (!exists) {
    await docker.createNetwork({
      Name: config.network.name,
      Driver: 'bridge',
      IPAM: {
        Driver: 'default',
        Config: [{ Subnet: config.network.subnet }],
      },
    });
  }
}

export async function createPostgresInstance(
  userId: string,
  name: string,
  dbName: string
): Promise<{ instance: DatabaseInstance; credentials: { username: string; password: string; database: string } }> {
  await ensureNetwork();

  const instanceId = `db-${nanoid(12)}`;
  const port = await getAvailablePort();
  const password = generatePassword();
  const username = 'bunker_user';

  const container = await docker.createContainer({
    Image: config.instances.postgres.image,
    name: `bunker-pg-${instanceId}`,
    Env: [
      `POSTGRES_USER=${username}`,
      `POSTGRES_PASSWORD=${password}`,
      `POSTGRES_DB=${dbName}`,
    ],
    Labels: {
      'bunker.service': 'database',
      'bunker.type': 'postgres',
      'bunker.user': userId,
      'bunker.instance': instanceId,
    },
    HostConfig: {
      PortBindings: {
        '5432/tcp': [{ HostPort: port.toString() }],
      },
      NetworkMode: config.network.name,
      Memory: 256 * 1024 * 1024, // 256MB
      MemorySwap: 512 * 1024 * 1024,
      RestartPolicy: { Name: 'unless-stopped' },
    },
  });

  await container.start();

  return {
    instance: {
      id: instanceId,
      name,
      type: 'postgres',
      containerId: container.id,
      port,
      host: 'localhost',
      status: 'running',
    },
    credentials: {
      username,
      password,
      database: dbName,
    },
  };
}

export async function createMySQLInstance(
  userId: string,
  name: string,
  dbName: string
): Promise<{ instance: DatabaseInstance; credentials: { username: string; password: string; database: string; rootPassword: string } }> {
  await ensureNetwork();

  const instanceId = `db-${nanoid(12)}`;
  const port = await getAvailablePort();
  const password = generatePassword();
  const rootPassword = generatePassword();
  const username = 'bunker_user';

  const container = await docker.createContainer({
    Image: config.instances.mysql.image,
    name: `bunker-mysql-${instanceId}`,
    Env: [
      `MYSQL_ROOT_PASSWORD=${rootPassword}`,
      `MYSQL_USER=${username}`,
      `MYSQL_PASSWORD=${password}`,
      `MYSQL_DATABASE=${dbName}`,
    ],
    Labels: {
      'bunker.service': 'database',
      'bunker.type': 'mysql',
      'bunker.user': userId,
      'bunker.instance': instanceId,
    },
    HostConfig: {
      PortBindings: {
        '3306/tcp': [{ HostPort: port.toString() }],
      },
      NetworkMode: config.network.name,
      Memory: 512 * 1024 * 1024, // 512MB
      MemorySwap: 1024 * 1024 * 1024,
      RestartPolicy: { Name: 'unless-stopped' },
    },
  });

  await container.start();

  return {
    instance: {
      id: instanceId,
      name,
      type: 'mysql',
      containerId: container.id,
      port,
      host: 'localhost',
      status: 'running',
    },
    credentials: {
      username,
      password,
      database: dbName,
      rootPassword,
    },
  };
}

export async function createRedisInstance(
  userId: string,
  name: string
): Promise<{ instance: DatabaseInstance; credentials: { password: string } }> {
  await ensureNetwork();

  const instanceId = `db-${nanoid(12)}`;
  const port = await getAvailablePort();
  const password = generatePassword();

  const container = await docker.createContainer({
    Image: config.instances.redis.image,
    name: `bunker-redis-${instanceId}`,
    Cmd: ['redis-server', '--requirepass', password, '--appendonly', 'yes'],
    Labels: {
      'bunker.service': 'database',
      'bunker.type': 'redis',
      'bunker.user': userId,
      'bunker.instance': instanceId,
    },
    HostConfig: {
      PortBindings: {
        '6379/tcp': [{ HostPort: port.toString() }],
      },
      NetworkMode: config.network.name,
      Memory: 128 * 1024 * 1024, // 128MB
      MemorySwap: 256 * 1024 * 1024,
      RestartPolicy: { Name: 'unless-stopped' },
    },
  });

  await container.start();

  return {
    instance: {
      id: instanceId,
      name,
      type: 'redis',
      containerId: container.id,
      port,
      host: 'localhost',
      status: 'running',
    },
    credentials: {
      password,
    },
  };
}

export async function createMongoDBInstance(
  userId: string,
  name: string,
  dbName: string
): Promise<{ instance: DatabaseInstance; credentials: { username: string; password: string; database: string } }> {
  await ensureNetwork();

  const instanceId = `db-${nanoid(12)}`;
  const port = await getAvailablePort();
  const password = generatePassword();
  const username = 'bunker_user';

  const container = await docker.createContainer({
    Image: config.instances.mongodb.image,
    name: `bunker-mongo-${instanceId}`,
    Env: [
      `MONGO_INITDB_ROOT_USERNAME=${username}`,
      `MONGO_INITDB_ROOT_PASSWORD=${password}`,
      `MONGO_INITDB_DATABASE=${dbName}`,
    ],
    Labels: {
      'bunker.service': 'database',
      'bunker.type': 'mongodb',
      'bunker.user': userId,
      'bunker.instance': instanceId,
    },
    HostConfig: {
      PortBindings: {
        '27017/tcp': [{ HostPort: port.toString() }],
      },
      NetworkMode: config.network.name,
      Memory: 512 * 1024 * 1024, // 512MB
      MemorySwap: 1024 * 1024 * 1024,
      RestartPolicy: { Name: 'unless-stopped' },
    },
  });

  await container.start();

  return {
    instance: {
      id: instanceId,
      name,
      type: 'mongodb',
      containerId: container.id,
      port,
      host: 'localhost',
      status: 'running',
    },
    credentials: {
      username,
      password,
      database: dbName,
    },
  };
}

export async function getInstanceStatus(containerId: string): Promise<string> {
  try {
    const container = docker.getContainer(containerId);
    const info = await container.inspect();
    return info.State.Running ? 'running' : info.State.Status;
  } catch (error) {
    return 'unknown';
  }
}

export async function startInstance(containerId: string): Promise<void> {
  const container = docker.getContainer(containerId);
  await container.start();
}

export async function stopInstance(containerId: string): Promise<void> {
  const container = docker.getContainer(containerId);
  await container.stop();
}

export async function deleteInstance(containerId: string): Promise<void> {
  const container = docker.getContainer(containerId);
  try {
    await container.stop();
  } catch (e) {
    // Container might already be stopped
  }
  await container.remove({ v: true }); // v: true removes volumes
}

export async function getInstanceLogs(containerId: string, tail: number = 100): Promise<string> {
  const container = docker.getContainer(containerId);
  const logs = await container.logs({
    stdout: true,
    stderr: true,
    tail,
    timestamps: true,
  });
  return logs.toString();
}

export async function getInstanceStats(containerId: string): Promise<{
  cpu_percent: number;
  memory_usage: number;
  memory_limit: number;
  network_rx: number;
  network_tx: number;
}> {
  const container = docker.getContainer(containerId);
  const stats = await container.stats({ stream: false });

  // Calculate CPU percentage
  const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;

  // Network stats
  let networkRx = 0;
  let networkTx = 0;
  if (stats.networks) {
    Object.values(stats.networks).forEach((net: any) => {
      networkRx += net.rx_bytes;
      networkTx += net.tx_bytes;
    });
  }

  return {
    cpu_percent: cpuPercent || 0,
    memory_usage: stats.memory_stats.usage || 0,
    memory_limit: stats.memory_stats.limit || 0,
    network_rx: networkRx,
    network_tx: networkTx,
  };
}
