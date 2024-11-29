let customTokenManager = null;

const isLocalStorageAvailable = () => {
  try {
    return typeof localStorage !== "undefined";
  } catch (error) {
    return false;
  }
};

export const tokenManager = {
  getAccessToken: () => {
    if (customTokenManager && customTokenManager.getAccessToken) {
      return customTokenManager.getAccessToken();
    }
    if (isLocalStorageAvailable()) {
      return localStorage.getItem("accessToken");
    }
    return null;
  },

  getRefreshToken: () => {
    if (customTokenManager && customTokenManager.getRefreshToken) {
      return customTokenManager.getRefreshToken();
    }
    if (isLocalStorageAvailable()) {
      return localStorage.getItem("refreshToken");
    }
    return null;
  },

  setTokens: (accessToken, refreshToken) => {
    if (customTokenManager && customTokenManager.setTokens) {
      customTokenManager.setTokens(accessToken, refreshToken);
      return;
    }
    if (isLocalStorageAvailable()) {
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    }
  },

  removeTokens: () => {
    if (customTokenManager && customTokenManager.removeTokens) {
      customTokenManager.removeTokens();
      return;
    }
    if (isLocalStorageAvailable()) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  isTokenExpired: (token) => {
    if (!token) return true;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const { exp } = JSON.parse(jsonPayload);
      return exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  },
};

export const setCustomTokenManager = (manager) => {
  customTokenManager = manager;
};
