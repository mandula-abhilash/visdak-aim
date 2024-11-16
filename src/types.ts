export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  onRetry?: (retryCount: number) => void;
  defaultHeaders?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: {
    code: number;
    details?: string;
  };
}

export interface TokenManager {
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}
