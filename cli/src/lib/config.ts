import Conf from 'conf';

interface BunkerConfig {
  apiUrl: string;
  token?: string;
  refreshToken?: string;
  email?: string;
}

const config = new Conf<BunkerConfig>({
  projectName: 'bunker-cli',
  defaults: {
    apiUrl: 'https://cloud-api.bunkercorpo.com',
  },
});

export function getApiUrl(): string {
  return config.get('apiUrl');
}

export function setApiUrl(url: string): void {
  config.set('apiUrl', url);
}

export function getToken(): string | undefined {
  return config.get('token');
}

export function setToken(token: string): void {
  config.set('token', token);
}

export function getRefreshToken(): string | undefined {
  return config.get('refreshToken');
}

export function setRefreshToken(token: string): void {
  config.set('refreshToken', token);
}

export function getEmail(): string | undefined {
  return config.get('email');
}

export function setEmail(email: string): void {
  config.set('email', email);
}

export function isLoggedIn(): boolean {
  return !!config.get('token');
}

export function logout(): void {
  config.delete('token');
  config.delete('refreshToken');
  config.delete('email');
}

export function getAll(): BunkerConfig {
  return config.store;
}
