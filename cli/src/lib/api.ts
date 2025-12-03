import axios, { AxiosInstance, AxiosError } from 'axios';
import { getApiUrl, getToken, setToken, getRefreshToken, setRefreshToken, logout } from './config.js';

let apiClient: AxiosInstance | null = null;

export function getApi(): AxiosInstance {
  if (!apiClient) {
    apiClient = axios.create({
      baseURL: getApiUrl(),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    apiClient.interceptors.request.use((config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token refresh on 401
    apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const refreshToken = getRefreshToken();
          if (refreshToken) {
            try {
              const response = await axios.post(`${getApiUrl()}/auth/refresh`, {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              setToken(accessToken);
              setRefreshToken(newRefreshToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return apiClient!(originalRequest);
            } catch (refreshError) {
              logout();
              throw new Error('Session expired. Please login again.');
            }
          }
        }

        throw error;
      }
    );
  }

  return apiClient;
}

export function resetApi(): void {
  apiClient = null;
}

export function handleApiError(error: any): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    if (axiosError.response?.data) {
      return axiosError.response.data.error || axiosError.response.data.message || 'Unknown error';
    }
    if (axiosError.code === 'ECONNREFUSED') {
      return 'Could not connect to Bunker Cloud API. Check your internet connection.';
    }
    return axiosError.message;
  }
  return error.message || 'An unexpected error occurred';
}
