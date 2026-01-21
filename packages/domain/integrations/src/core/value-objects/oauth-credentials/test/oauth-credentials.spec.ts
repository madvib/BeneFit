import { describe, it, expect } from 'vitest';
import { CreateOAuthCredentialsSchema } from '../oauth-credentials.factory.js';
import { createOAuthCredentialsFixture } from './oauth-credentials.fixtures.js';

describe('OAuthCredentials', () => {
  describe('Factory', () => {
    it('should create valid credentials', () => {
      // Arrange
      const input = {
        accessToken: 'valid_token',
        scopes: ['read', 'write']
      };

      // Act
      const result = CreateOAuthCredentialsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.accessToken).toBe('valid_token');
        expect(result.data.scopes).toEqual(['read', 'write']);
      }
    });

    it('should fail with empty access token', () => {
      // Act
      const result = CreateOAuthCredentialsSchema.safeParse({
        accessToken: '',
        scopes: ['read']
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail with empty scopes', () => {
      // Act
      const result = CreateOAuthCredentialsSchema.safeParse({
        accessToken: 'valid_token',
        scopes: []
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail if expiresAt is in the past', () => {
      // Arrange
      const pastDate = new Date(Date.now() - 10000);

      // Act
      const result = CreateOAuthCredentialsSchema.safeParse({
        accessToken: 'valid_token',
        scopes: ['read'],
        expiresAt: pastDate
      });

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const fixture = createOAuthCredentialsFixture();

      expect(fixture.accessToken).toBeDefined();
      expect(fixture.scopes.length).toBeGreaterThan(0);
    });

    it('should allow overrides in fixture', () => {
      const fixture = createOAuthCredentialsFixture({ accessToken: 'custom-token' });

      expect(fixture.accessToken).toBe('custom-token');
    });
  });
});