import { describe, it, expect } from 'vitest';
import { createOAuthCredentials } from './oauth-credentials.js';

describe('OAuthCredentials Value Object', () => {
  it('should create valid credentials', () => {
    const result = createOAuthCredentials({
      accessToken: 'valid_token',
      scopes: ['read', 'write']
    });

    expect(result.isSuccess).toBe(true);
    const credentials = result.value;
    expect(credentials.accessToken).toBe('valid_token');
    expect(credentials.scopes).toEqual(['read', 'write']);
  });

  it('should fail with empty access token', () => {
    const result = createOAuthCredentials({
      accessToken: '',
      scopes: ['read']
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail with empty scopes', () => {
    const result = createOAuthCredentials({
      accessToken: 'valid_token',
      scopes: []
    });

    expect(result.isFailure).toBe(true);
  });
});