import { createClient, RedisClientType } from 'redis';
import { config } from '../config.js';

class Redis {
  public client: RedisClientType | null = null;

  async connect(): Promise<void> {
    this.client = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password || undefined,
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    this.client.on('connect', () => {
      console.log('Redis connected successfully');
    });

    await this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) throw new Error('Redis not connected');
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.client) throw new Error('Redis not connected');
    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) throw new Error('Redis not connected');
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) throw new Error('Redis not connected');
    const result = await this.client.exists(key);
    return result === 1;
  }

  async incr(key: string): Promise<number> {
    if (!this.client) throw new Error('Redis not connected');
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    if (!this.client) throw new Error('Redis not connected');
    await this.client.expire(key, seconds);
  }

  async hSet(key: string, field: string, value: string): Promise<void> {
    if (!this.client) throw new Error('Redis not connected');
    await this.client.hSet(key, field, value);
  }

  async hGet(key: string, field: string): Promise<string | undefined> {
    if (!this.client) throw new Error('Redis not connected');
    return this.client.hGet(key, field);
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    if (!this.client) throw new Error('Redis not connected');
    return this.client.hGetAll(key);
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      console.log('Redis connection closed');
    }
  }
}

export const redis = new Redis();
