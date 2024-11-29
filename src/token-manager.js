let customTokenManager = null;

const isLocalStorageAvailable = () => {
  try {
    return typeof localStorage !== "undefined";
  } catch (error) {
    return false;
  }
};

export const tokenManager = {
  getToken: () => {
    if (customTokenManager && customTokenManager.getToken) {
      return customTokenManager.getToken();
    }
    if (isLocalStorageAvailable()) {
      return localStorage.getItem("authToken");
    }
    throw new Error("localStorage is not available in this environment.");
  },
  setToken: (token) => {
    if (customTokenManager && customTokenManager.setToken) {
      customTokenManager.setToken(token);
    } else if (isLocalStorageAvailable()) {
      localStorage.setItem("authToken", token);
    } else {
      throw new Error("localStorage is not available in this environment.");
    }
  },
  removeToken: () => {
    if (customTokenManager && customTokenManager.removeToken) {
      customTokenManager.removeToken();
    } else if (isLocalStorageAvailable()) {
      localStorage.removeItem("authToken");
    } else {
      throw new Error("localStorage is not available in this environment.");
    }
  },
};

export const setCustomTokenManager = (manager) => {
  customTokenManager = manager;
};
