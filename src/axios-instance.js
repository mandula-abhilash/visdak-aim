import axios from "axios";
import axiosRetry from "axios-retry";
import { tokenManager } from "./token-manager.js";

export const createAxiosInstance = (config) => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: config.defaultHeaders || {},
    withCredentials: true,
  });

  const defaultOnUnauthorized = () => {
    console.log("User is unauthorized. Logging out...");
    tokenManager.removeTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const defaultOnForbidden = () => {
    console.log("Access forbidden.");
  };

  axiosRetry(instance, {
    retries: config.retryCount || 3,
    retryDelay: (retryCount) => {
      if (config.onRetry) {
        config.onRetry(retryCount);
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

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = tokenManager.getAccessToken();
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
      // Extract tokens from response headers if present
      const accessToken = response.headers["x-access-token"];
      const refreshToken = response.headers["x-refresh-token"];

      if (accessToken && refreshToken) {
        tokenManager.setTokens(accessToken, refreshToken);
      }

      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = tokenManager.getRefreshToken();
          if (!refreshToken) throw new Error("No refresh token available");

          const response = await instance.post("/api/auth/refresh-token", {
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;
          tokenManager.setTokens(newAccessToken, newRefreshToken);

          instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          tokenManager.removeTokens();
          (config.onUnauthorized || defaultOnUnauthorized)();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (error.response?.status === 403) {
        (config.onForbidden || defaultOnForbidden)();
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
