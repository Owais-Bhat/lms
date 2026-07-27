import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://api.freeapi.app/api/v1';
const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const TIMEOUT_MS = 10000; 

export interface ApiError extends Error {
  statusCode?: number;
  data?: any;
  success?: boolean;
}

interface FetchOptions extends RequestInit {
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export const apiClient = {
  getAccessAndRefreshTokens: async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return { accessToken, refreshToken };
  },

  setTokens: async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const {
      timeout = TIMEOUT_MS,
      retry = 2,
      retryDelay = 1000,
      skipAuth = false,
      ...initOptions
    } = options;

    const url = `${BASE_URL}${endpoint}`;
    
    
    const headers = new Headers(initOptions.headers || {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');

    if (!skipAuth) {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
    }

    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const config: RequestInit = {
      ...initOptions,
      headers,
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(id);

      
      if (response.status === 401 && !skipAuth && endpoint !== '/users/refresh-token') {
        try {
          const newAccessToken = await handleTokenRefresh();
          if (newAccessToken) {
            
            headers.set('Authorization', `Bearer ${newAccessToken}`);
            return await apiClient.request<T>(endpoint, { ...options, headers });
          }
        } catch (refreshErr) {
          
          await apiClient.clearTokens();
          throw refreshErr;
        }
      }

      const json = await response.json();

      if (!response.ok || !json.success) {
        const error: ApiError = new Error(json.message || `Request failed with status ${response.status}`);
        error.statusCode = response.status;
        error.data = json.data;
        error.success = json.success;
        throw error;
      }

      return json as T;
    } catch (error: any) {
      clearTimeout(id);

      
      if (error.name === 'AbortError') {
        const timeoutError: ApiError = new Error('Request timed out. Please check your network connection.');
        timeoutError.statusCode = 408;
        throw timeoutError;
      }

      
      if (retry > 0 && (!error.statusCode || error.statusCode >= 500)) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return apiClient.request<T>(endpoint, {
          ...options,
          retry: retry - 1,
          retryDelay: retryDelay * 2,
        });
      }

      throw error;
    }
  },

  get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return apiClient.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: any, options?: FetchOptions): Promise<T> {
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: any, options?: FetchOptions): Promise<T> {
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: any, options?: FetchOptions): Promise<T> {
    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return apiClient.request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  upload<T>(endpoint: string, formData: FormData, options?: FetchOptions): Promise<T> {
    const headers = new Headers(options?.headers || {});
    
    headers.delete('Content-Type');

    return apiClient.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: formData,
      headers,
    });
  }
};

async function handleTokenRefresh(): Promise<string | null> {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    const response = await fetch(`${BASE_URL}/users/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Token refresh failed');
    }

    const newAccessToken = json.data.accessToken;
    const newRefreshToken = json.data.refreshToken;

    await apiClient.setTokens(newAccessToken, newRefreshToken);
    onRefreshed(newAccessToken);
    return newAccessToken;
  } catch (error) {
    throw error;
  } finally {
    isRefreshing = false;
  }
}
