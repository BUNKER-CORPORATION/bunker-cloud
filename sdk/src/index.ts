import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Types
export interface BunkerConfig {
  apiUrl?: string;
  apiKey?: string;
  accessToken?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface App {
  id: string;
  name: string;
  image: string;
  port: number;
  status: string;
  url: string;
  memory: string;
  cpus: string;
  env_vars: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface AppCreateOptions {
  name: string;
  image: string;
  port?: number;
  env_vars?: Record<string, string>;
  memory?: string;
  cpus?: string;
  health_check_path?: string;
}

export interface Database {
  id: string;
  name: string;
  engine: string;
  version: string;
  status: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  connection_string: string;
  created_at: string;
}

export interface DatabaseCreateOptions {
  name: string;
  engine: 'postgresql' | 'mysql' | 'redis' | 'mongodb';
  version?: string;
}

export interface Bucket {
  id: string;
  name: string;
  bucket: string;
  public: boolean;
  size_bytes: string;
  object_count: number;
  endpoint: string;
  created_at: string;
}

export interface StorageObject {
  name: string;
  size: number;
  size_formatted: string;
  last_modified: string;
  etag: string;
  is_folder: boolean;
}

export interface PresignedUrl {
  url: string;
  key: string;
  method?: string;
  expires_in: number;
  expires_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Error class
export class BunkerError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'BunkerError';
  }
}

function handleError(error: unknown): BunkerError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    const message = axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message;
    return new BunkerError(message, axiosError.response?.status);
  }
  if (error instanceof Error) {
    return new BunkerError(error.message);
  }
  return new BunkerError('Unknown error');
}

// Main SDK class
export class BunkerCloud {
  private client: AxiosInstance;
  public apps: AppsService;
  public databases: DatabasesService;
  public storage: StorageService;
  public auth: AuthService;

  constructor(config: BunkerConfig = {}) {
    const baseURL = config.apiUrl || 'https://cloud-api.bunkercorpo.com';

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'X-API-Key': config.apiKey }),
        ...(config.accessToken && { Authorization: `Bearer ${config.accessToken}` }),
      },
    });

    // Initialize services
    this.apps = new AppsService(this.client);
    this.databases = new DatabasesService(this.client);
    this.storage = new StorageService(this.client);
    this.auth = new AuthService(this.client);
  }

  setAccessToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setApiKey(key: string): void {
    this.client.defaults.headers.common['X-API-Key'] = key;
  }
}

// Auth Service
class AuthService {
  constructor(private client: AxiosInstance) {}

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ accessToken: string; refreshToken: string }>> =
        await this.client.post('/auth/login', { email, password });
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> =
        await this.client.post('/auth/register', { email, password, name });
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async me(): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.client.get('/auth/me');
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ accessToken: string; refreshToken: string }>> =
        await this.client.post('/auth/refresh', { refreshToken });
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }
}

// Apps Service
class AppsService {
  constructor(private client: AxiosInstance) {}

  async list(): Promise<App[]> {
    try {
      const response: AxiosResponse<ApiResponse<App[]>> = await this.client.get('/apps');
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async get(id: string): Promise<App> {
    try {
      const response: AxiosResponse<ApiResponse<App>> = await this.client.get(`/apps/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async create(options: AppCreateOptions): Promise<App> {
    try {
      const response: AxiosResponse<ApiResponse<App>> = await this.client.post('/apps', options);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async update(id: string, options: Partial<AppCreateOptions>): Promise<App> {
    try {
      const response: AxiosResponse<ApiResponse<App>> = await this.client.put(`/apps/${id}`, options);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(`/apps/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  }

  async start(id: string): Promise<void> {
    try {
      await this.client.post(`/apps/${id}/start`);
    } catch (error) {
      throw handleError(error);
    }
  }

  async stop(id: string): Promise<void> {
    try {
      await this.client.post(`/apps/${id}/stop`);
    } catch (error) {
      throw handleError(error);
    }
  }

  async restart(id: string): Promise<void> {
    try {
      await this.client.post(`/apps/${id}/restart`);
    } catch (error) {
      throw handleError(error);
    }
  }

  async logs(id: string, lines: number = 100): Promise<string> {
    try {
      const response: AxiosResponse<ApiResponse<{ logs: string }>> =
        await this.client.get(`/apps/${id}/logs`, { params: { lines } });
      return response.data.data.logs;
    } catch (error) {
      throw handleError(error);
    }
  }

  async stats(id: string): Promise<Record<string, unknown>> {
    try {
      const response: AxiosResponse<ApiResponse<Record<string, unknown>>> =
        await this.client.get(`/apps/${id}/stats`);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }
}

// Databases Service
class DatabasesService {
  constructor(private client: AxiosInstance) {}

  async list(): Promise<Database[]> {
    try {
      const response: AxiosResponse<ApiResponse<Database[]>> = await this.client.get('/databases');
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async get(id: string): Promise<Database> {
    try {
      const response: AxiosResponse<ApiResponse<Database>> = await this.client.get(`/databases/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async create(options: DatabaseCreateOptions): Promise<Database> {
    try {
      const response: AxiosResponse<ApiResponse<Database>> = await this.client.post('/databases', options);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(`/databases/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  }

  async start(id: string): Promise<void> {
    try {
      await this.client.post(`/databases/${id}/start`);
    } catch (error) {
      throw handleError(error);
    }
  }

  async stop(id: string): Promise<void> {
    try {
      await this.client.post(`/databases/${id}/stop`);
    } catch (error) {
      throw handleError(error);
    }
  }
}

// Storage Service
class StorageService {
  constructor(private client: AxiosInstance) {}

  async listBuckets(): Promise<Bucket[]> {
    try {
      const response: AxiosResponse<ApiResponse<Bucket[]>> = await this.client.get('/buckets');
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getBucket(id: string): Promise<Bucket> {
    try {
      const response: AxiosResponse<ApiResponse<Bucket>> = await this.client.get(`/buckets/${id}`);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async createBucket(name: string, isPublic: boolean = false): Promise<Bucket> {
    try {
      const response: AxiosResponse<ApiResponse<Bucket>> =
        await this.client.post('/buckets', { name, is_public: isPublic });
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteBucket(id: string): Promise<void> {
    try {
      await this.client.delete(`/buckets/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  }

  async listObjects(bucketId: string, prefix: string = ''): Promise<StorageObject[]> {
    try {
      const response: AxiosResponse<ApiResponse<{ objects: StorageObject[] }>> =
        await this.client.get(`/buckets/${bucketId}/objects`, { params: { prefix } });
      return response.data.data.objects;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getPresignedUploadUrl(bucketId: string, key: string, expires: number = 3600): Promise<PresignedUrl> {
    try {
      const response: AxiosResponse<ApiResponse<PresignedUrl>> =
        await this.client.post(`/buckets/${bucketId}/presigned/upload`, { key, expires });
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getPresignedDownloadUrl(bucketId: string, key: string, expires: number = 3600): Promise<PresignedUrl> {
    try {
      const response: AxiosResponse<ApiResponse<PresignedUrl>> =
        await this.client.post(`/buckets/${bucketId}/presigned/download`, { key, expires });
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteObject(bucketId: string, key: string): Promise<void> {
    try {
      await this.client.delete(`/buckets/${bucketId}/objects/${encodeURIComponent(key)}`);
    } catch (error) {
      throw handleError(error);
    }
  }
}

// Default export
export default BunkerCloud;
