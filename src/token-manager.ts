import { TokenManager } from './types';

let customTokenManager: TokenManager | null = null;

export const tokenManager: TokenManager = {
  getToken: () => customTokenManager?.getToken() || localStorage.getItem('authToken'),
  setToken: (token: string) => {
    if (customTokenManager) {
      customTokenManager.setToken(token);
    } else {
      localStorage.setItem('authToken', token);
    }
  },
  removeToken: () => {
    if (customTokenManager) {
      customTokenManager.removeToken();
    } else {
      localStorage.removeItem('authToken');
    }
  },
};

export const setCustomTokenManager = (manager: TokenManager) => {
  customTokenManager = manager;
};
