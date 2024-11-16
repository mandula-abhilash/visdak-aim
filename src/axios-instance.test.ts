import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createAxiosInstance } from './axios-instance';
import { tokenManager } from './token-manager';
import { ApiConfig } from './types';

vi.mock('axios');

describe('Axios Instance', () => {
  const mockConfig: ApiConfig = {
    baseURL: 'https://api.example.com',
    timeout: 5000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    tokenManager.removeToken();
  });

  it('should create an axios instance with correct config', () => {
    createAxiosInstance(mockConfig);
    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: mockConfig.baseURL,
      timeout: mockConfig.timeout,
    }));
  });

  it('should add authorization header when token exists', () => {
    const token = 'test-token';
    tokenManager.setToken(token);
    const instance = createAxiosInstance(mockConfig);
    
    expect(instance.interceptors.request).toBeDefined();
  });

  it('should handle successful responses', async () => {
    const mockResponse = {
      data: { message: 'Success' },
      status: 200,
    };

    const instance = createAxiosInstance(mockConfig);
    const response = await instance.interceptors.response.handlers[0].fulfilled(mockResponse);

    expect(response).toEqual({
      status: 'success',
      data: mockResponse.data,
      message: mockResponse.data.message,
    });
  });

  it('should handle error responses', async () => {
    const mockError = {
      response: {
        status: 400,
        data: { message: 'Bad Request' },
      },
      message: 'Request failed',
    };

    const instance = createAxiosInstance(mockConfig);
    try {
      await instance.interceptors.response.handlers[0].rejected(mockError);
    } catch (error: any) {
      expect(error).toEqual({
        status: 'error',
        message: mockError.message,
        error: {
          code: mockError.response.status,
          details: mockError.response.data.message,
        },
      });
    }
  });
});