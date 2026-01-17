import { describe, it, expect } from 'vitest';
import {
  OAuthCredentialsPresentationSchema,
  toOAuthCredentialsPresentation,
} from '../oauth-credentials.presentation.js';
import { createOAuthCredentialsFixture } from './oauth-credentials.fixtures.js';

describe('OAuthCredentials Presentation', () => {
  it('should map valid credentials to presentation DTO', () => {
    const credentials = createOAuthCredentialsFixture();
    const presentation = toOAuthCredentialsPresentation(credentials);

    const result = OAuthCredentialsPresentationSchema.safeParse(presentation);
    expect(result.success).toBe(true);
    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }
    expect(presentation.tokenType).toBe(credentials.tokenType);
    expect(presentation.scopes).toEqual(credentials.scopes);
  });

  it('should redact accessToken and refreshToken from presentation', () => {
    const credentials = createOAuthCredentialsFixture({
      accessToken: 'super-secret-token',
      refreshToken: 'super-secret-refresh',
    });
    const presentation = toOAuthCredentialsPresentation(credentials);

    expect('accessToken' in presentation).toBe(false);
    expect('refreshToken' in presentation).toBe(false);
    expect((presentation as any).accessToken).toBeUndefined();
    expect((presentation as any).refreshToken).toBeUndefined();
  });

  it('should convert expiresAt Date to ISO string', () => {
    const credentials = createOAuthCredentialsFixture({
      expiresAt: new Date('2025-01-15T10:30:00Z'),
    });
    const presentation = toOAuthCredentialsPresentation(credentials);

    expect(typeof presentation.expiresAt).toBe('string');
    expect(presentation.expiresAt).toBe('2025-01-15T10:30:00.000Z');
  });

  it('should compute isExpired field correctly', () => {
    const expiredCredentials = createOAuthCredentialsFixture({
      expiresAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    });
    const validCredentials = createOAuthCredentialsFixture({
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    });

    const expiredPresentation = toOAuthCredentialsPresentation(expiredCredentials);
    const validPresentation = toOAuthCredentialsPresentation(validCredentials);

    expect(expiredPresentation.isExpired).toBe(true);
    expect(validPresentation.isExpired).toBe(false);
  });

  it('should compute expiresInMinutes for valid tokens', () => {
    const credentials = createOAuthCredentialsFixture({
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    });
    const presentation = toOAuthCredentialsPresentation(credentials);

    expect(presentation.expiresInMinutes).toBeDefined();
    expect(presentation.expiresInMinutes).toBeGreaterThan(28);
    expect(presentation.expiresInMinutes).toBeLessThan(32);
  });

  it('should handle credentials without expiration', () => {
    const credentials = createOAuthCredentialsFixture({
      expiresAt: undefined,
    });
    const presentation = toOAuthCredentialsPresentation(credentials);

    expect(presentation.expiresAt).toBeUndefined();
    expect(presentation.isExpired).toBe(false);
    expect(presentation.expiresInMinutes).toBeUndefined();
  });

  it('should convert readonly scopes array to mutable array', () => {
    const credentials = createOAuthCredentialsFixture({
      scopes: ['read:workouts', 'read:heart_rate'],
    });
    const presentation = toOAuthCredentialsPresentation(credentials);

    expect(Array.isArray(presentation.scopes)).toBe(true);
    expect(presentation.scopes).toEqual(['read:workouts', 'read:heart_rate']);
  });
});
