import { TokenManager } from './types';

let authToken: string | null = null;

export const tokenManager: TokenManager = {
  getToken: () => authToken,
  setToken: (token: string) => {
    authToken = token;
  },
  removeToken: () => {
    authToken = null;
  }
};