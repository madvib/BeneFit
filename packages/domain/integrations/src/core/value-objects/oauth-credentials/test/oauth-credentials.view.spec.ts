import { describe, it, expect } from 'vitest';
import { toOAuthCredentialsView } from '../oauth-credentials.view.js';
import { createOAuthCredentialsFixture } from './oauth-credentials.fixtures.js';

describe('OAuthCredentials Presentation', () => {
  it('should map valid credentials to presentation DTO', () => {
    const credentials = createOAuthCredentialsFixture();
    const presentation = toOAuthCredentialsView(credentials);

    expect(presentation.tokenType).toBe(credentials.tokenType);
    expect(presentation.scopes).toEqual(credentials.scopes);
  });

  it('should redact accessToken and refreshToken from presentation', () => {
    const credentials = createOAuthCredentialsFixture({
      accessToken: 'super-secret-token',
      refreshToken: 'super-secret-refresh',
    });
    const presentation = toOAuthCredentialsView(credentials);

    expect('accessToken' in presentation).toBe(false);
    expect('refreshToken' in presentation).toBe(false);
    expect((presentation as any).accessToken).toBeUndefined();
    expect((presentation as any).refreshToken).toBeUndefined();
    expect(presentation.hasRefreshToken).toBe(true);
  });

  it('should convert expiresAt Date to ISO string', () => {
    const credentials = createOAuthCredentialsFixture({
      expiresAt: new Date('2025-01-15T10:30:00Z'),
    });
    const presentation = toOAuthCredentialsView(credentials);

    expect(typeof presentation.expiresAt).toBe('string');
    expect(presentation.expiresAt).toBe('2025-01-15T10:30:00.000Z');
  });

  it('should compute isExpired field correctly', () => {
    // Manually create expired credentials to bypass factory validation (which enforces future date)
    const expiredCredentials = {
      accessToken: 'expired-token',
      scopes: [],
      tokenType: 'Bearer',
      expiresAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    } as any;
    const validCredentials = createOAuthCredentialsFixture({
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    });

    const expiredPresentation = toOAuthCredentialsView(expiredCredentials);
    const validPresentation = toOAuthCredentialsView(validCredentials);

    expect(expiredPresentation.isExpired).toBe(true);
    expect(validPresentation.isExpired).toBe(false);
  });

  it('should compute willExpireSoon field', () => {
    const soonCredentials = createOAuthCredentialsFixture({
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    });
    const laterCredentials = createOAuthCredentialsFixture({
      expiresAt: new Date(Date.now() + 120 * 60 * 1000), // 2 hours from now
    });

    const soonPresentation = toOAuthCredentialsView(soonCredentials);
    const laterPresentation = toOAuthCredentialsView(laterCredentials);

    expect(soonPresentation.willExpireSoon).toBe(true);
    expect(laterPresentation.willExpireSoon).toBe(false);
  });

  it('should handle credentials without expiration', () => {
    const credentials = {
      accessToken: 'token',
      scopes: [],
      tokenType: 'Bearer',
      expiresAt: undefined,
    } as any;
    const presentation = toOAuthCredentialsView(credentials);

    expect(presentation.expiresAt).toBeUndefined();
    expect(presentation.isExpired).toBe(false);
    expect(presentation.willExpireSoon).toBe(false);
  });

  it('should convert readonly scopes array to mutable array', () => {
    const credentials = createOAuthCredentialsFixture({
      scopes: ['read:workouts', 'read:heart_rate'],
    });
    const presentation = toOAuthCredentialsView(credentials);

    expect(Array.isArray(presentation.scopes)).toBe(true);
    expect(presentation.scopes).toEqual(['read:workouts', 'read:heart_rate']);
  });
});
