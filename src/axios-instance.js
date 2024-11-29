import axios from "axios";
import axiosRetry from "axios-retry";
import { tokenManager } from "./token-manager.js";

export const createAxiosInstance = (config) => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: config.defaultHeaders || {},
  });

  // Configure retry mechanism
  axiosRetry(instance, {
    retries: config.retryCount || 3,
    retryDelay: (retryCount) => {
      if (config.onRetry) {
        config.onRetry(retryCount); // Notify about retries
      }
      const delay = config.retryDelay || 1000;
      return retryCount * delay;
    },
    retryCondition: (error) => {
      return (
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        (error.response?.status ? error.response.status >= 500 : false)
      );
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
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
      // Return the raw Axios response
      return response;
    },
    (error) => {
      // Transform errors to a rejected promise
      return Promise.reject(error);
    }
  );

  return instance;
};
