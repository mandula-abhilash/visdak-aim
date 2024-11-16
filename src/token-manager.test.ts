import { describe, it, expect, beforeEach } from 'vitest';
import { tokenManager } from './token-manager';

describe('Token Manager', () => {
  beforeEach(() => {
    tokenManager.removeToken();
  });

  it('should set and get token', () => {
    const token = 'test-token';
    tokenManager.setToken(token);
    expect(tokenManager.getToken()).toBe(token);
  });

  it('should remove token', () => {
    const token = 'test-token';
    tokenManager.setToken(token);
    tokenManager.removeToken();
    expect(tokenManager.getToken()).toBeNull();
  });

  it('should return null when token is not set', () => {
    expect(tokenManager.getToken()).toBeNull();
  });
});