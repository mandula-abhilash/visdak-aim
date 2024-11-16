import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { ApiConfig, ApiResponse } from './types';
import { tokenManager } from './token-manager';

export const createAxiosInstance = (config: ApiConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: config.defaultHeaders || {},
  });

  // Configure retry mechanism
  axiosRetry(instance, {
    retries: config.retryCount || 3,
    retryDelay: (retryCount) => {
      const delay = config.retryDelay || 1000;
      return retryCount * delay;
    },
    retryCondition: (error: AxiosError) => {
      return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
             (error.response?.status ? error.response.status >= 500 : false);
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      const apiResponse: ApiResponse = {
        status: 'success',
        data: response.data,
        message: response.data?.message,
      };
      return apiResponse;
    },
    (error: AxiosError) => {
      const status = error.response?.status;
      const apiResponse: ApiResponse = {
        status: 'error',
        message: error.message,
        error: {
          code: status || 500,
          details: error.response?.data?.message,
        },
      };

      if (status === 401 && config.onUnauthorized) {
        config.onUnauthorized();
      } else if (status === 403 && config.onForbidden) {
        config.onForbidden();
      }

      return Promise.reject(apiResponse);
    }
  );

  return instance;
};