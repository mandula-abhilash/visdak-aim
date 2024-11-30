import axios from "axios";
import axiosRetry from "axios-retry";

export const createAxiosInstance = (config) => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: config.defaultHeaders || {},
    withCredentials: true,
  });

  const defaultOnUnauthorized = () => {
    console.log("User is unauthorized. Logging out...");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
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

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Log out the user by redirecting to login page
        (config.onUnauthorized || defaultOnUnauthorized)();
        return Promise.reject(error);
      }

      if (error.response?.status === 403) {
        (config.onForbidden || defaultOnForbidden)();
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
