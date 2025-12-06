import Docker from 'dockerode';
import { config } from '../config.js';
import { logger } from './logger.js';
import crypto from 'crypto';

const docker = new Docker({ socketPath: config.docker.socketPath });

interface FunctionExecOptions {
  functionId: string;
  name: string;
  runtime: string;
  code: string;
  handler: string;
  envVars: Record<string, string>;
  memory: number;
  timeout: number;
  payload: any;
}

interface ExecutionResult {
  success: boolean;
  output?: any;
  logs?: string;
  error?: string;
  duration: number;
  memoryUsed?: number;
  billedDuration: number;
}

// Ensure function network exists
export async function ensureNetwork(): Promise<void> {
  try {
    await docker.getNetwork(config.docker.network).inspect();
  } catch {
    await docker.createNetwork({
      Name: config.docker.network,
      Driver: 'bridge',
    });
    logger.info(`Created network ${config.docker.network}`);
  }
}

// Generate container name for function execution
function getContainerName(functionId: string, invocationId: string): string {
  return `bunker-fn-${functionId.substring(0, 8)}-${invocationId.substring(0, 8)}`;
}

// Execute a function in a Docker container
export async function executeFunction(options: FunctionExecOptions): Promise<ExecutionResult> {
  const startTime = Date.now();
  const invocationId = crypto.randomUUID();
  const containerName = getContainerName(options.functionId, invocationId);

  const runtimeConfig = config.runtimes[options.runtime];
  if (!runtimeConfig) {
    return {
      success: false,
      error: `Unsupported runtime: ${options.runtime}`,
      duration: Date.now() - startTime,
      billedDuration: 100,
    };
  }

  let container: Docker.Container | null = null;

  try {
    // Prepare environment variables
    const env = [
      `BUNKER_FUNCTION_ID=${options.functionId}`,
      `BUNKER_INVOCATION_ID=${invocationId}`,
      `BUNKER_HANDLER=${options.handler}`,
      `BUNKER_TIMEOUT=${options.timeout}`,
      `BUNKER_PAYLOAD=${JSON.stringify(options.payload)}`,
      ...Object.entries(options.envVars).map(([k, v]) => `${k}=${v}`),
    ];

    // Create container
    container = await docker.createContainer({
      Image: runtimeConfig.image,
      name: containerName,
      Env: env,
      HostConfig: {
        Memory: options.memory * 1024 * 1024, // Convert MB to bytes
        MemorySwap: options.memory * 1024 * 1024, // No swap
        CpuPeriod: 100000,
        CpuQuota: 50000, // 50% of one CPU
        NetworkMode: config.docker.network,
        AutoRemove: true,
        ReadonlyRootfs: true,
        Tmpfs: {
          '/tmp': 'rw,noexec,nosuid,size=64m',
        },
        SecurityOpt: ['no-new-privileges'],
      },
      StopTimeout: Math.ceil(options.timeout / 1000),
    });

    // Start container
    await container.start();

    // Wait for execution with timeout
    const result = await Promise.race([
      waitForContainer(container),
      new Promise<{ StatusCode: number }>((_, reject) =>
        setTimeout(() => reject(new Error('Function execution timed out')), options.timeout)
      ),
    ]);

    const duration = Date.now() - startTime;

    // Get container logs
    const logsStream = await container.logs({
      stdout: true,
      stderr: true,
      follow: false,
    });
    const logs = logsStream.toString('utf-8');

    // Parse output (last line should be JSON result)
    const lines = logs.trim().split('\n');
    const outputLine = lines[lines.length - 1];

    let output: any;
    try {
      output = JSON.parse(outputLine);
    } catch {
      output = outputLine;
    }

    // Calculate billed duration (rounded up to nearest 100ms)
    const billedDuration = Math.ceil(duration / 100) * 100;

    if (result.StatusCode !== 0) {
      return {
        success: false,
        error: logs,
        logs,
        duration,
        billedDuration,
      };
    }

    return {
      success: true,
      output,
      logs: lines.slice(0, -1).join('\n'),
      duration,
      billedDuration,
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const billedDuration = Math.ceil(duration / 100) * 100;

    // Try to stop and remove container
    if (container) {
      try {
        await container.stop({ t: 1 });
      } catch {
        // Ignore
      }
      try {
        await container.remove({ force: true });
      } catch {
        // Ignore
      }
    }

    return {
      success: false,
      error: error.message,
      duration,
      billedDuration,
    };
  }
}

// Wait for container to finish
async function waitForContainer(container: Docker.Container): Promise<{ StatusCode: number }> {
  return new Promise((resolve, reject) => {
    container.wait((err: any, data: any) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Build function code into a deployable package
export async function buildFunction(
  functionId: string,
  runtime: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  // For now, we store code directly and inject it at runtime
  // In production, this would build a proper deployment package
  const runtimeConfig = config.runtimes[runtime];
  if (!runtimeConfig) {
    return { success: false, error: `Unsupported runtime: ${runtime}` };
  }

  // Validate code syntax based on runtime
  try {
    if (runtime.startsWith('nodejs')) {
      // Basic syntax check for JavaScript
      new Function(code);
    }
    // Add other runtime validations as needed
  } catch (error: any) {
    return { success: false, error: `Syntax error: ${error.message}` };
  }

  return { success: true };
}

// Get warm container for faster execution (connection pooling for functions)
const warmContainers = new Map<string, Docker.Container>();

export async function getWarmContainer(
  functionId: string,
  runtime: string
): Promise<Docker.Container | null> {
  const key = `${functionId}-${runtime}`;
  return warmContainers.get(key) || null;
}

// Cleanup expired containers
export async function cleanupContainers(): Promise<void> {
  try {
    const containers = await docker.listContainers({
      all: true,
      filters: {
        name: ['bunker-fn-'],
        status: ['exited', 'dead'],
      },
    });

    for (const containerInfo of containers) {
      try {
        const container = docker.getContainer(containerInfo.Id);
        await container.remove({ force: true });
        logger.info(`Cleaned up container ${containerInfo.Names[0]}`);
      } catch {
        // Ignore cleanup errors
      }
    }
  } catch (error) {
    logger.error('Error cleaning up containers:', error);
  }
}
