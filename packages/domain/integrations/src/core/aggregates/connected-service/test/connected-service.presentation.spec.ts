import { describe, it, expect } from 'vitest';
import {
  ConnectedServicePresentationSchema,
  toConnectedServicePresentation,
} from '../connected-service.presentation.js';
import { createConnectedServiceFixture } from './connected-service.fixtures.js';

describe('ConnectedService Presentation', () => {
  it('should map a valid connected service to presentation DTO', () => {
    const service = createConnectedServiceFixture();
    const presentation = toConnectedServicePresentation(service);

    const result = ConnectedServicePresentationSchema.safeParse(presentation);
    expect(result.success).toBe(true);
    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }
    expect(presentation.id).toBe(service.id);
    expect(presentation.userId).toBe(service.userId);
    expect(presentation.serviceType).toBe(service.serviceType);
  });

  it('should convert all dates to ISO strings', () => {
    const service = createConnectedServiceFixture({
      connectedAt: new Date('2024-01-01T00:00:00Z'),
      lastSyncAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-16T12:00:00Z'),
    });
    const presentation = toConnectedServicePresentation(service);

    expect(presentation.connectedAt).toBe('2024-01-01T00:00:00.000Z');
    expect(presentation.lastSyncAt).toBe('2024-01-15T10:00:00.000Z');
    expect(presentation.updatedAt).toBe('2024-01-16T12:00:00.000Z');
  });

  it('should map nested credentials with sensitive data redacted', () => {
    const service = createConnectedServiceFixture();
    const presentation = toConnectedServicePresentation(service);

    expect(presentation.credentials).toBeDefined();
    expect('accessToken' in presentation.credentials).toBe(false);
    expect('refreshToken' in presentation.credentials).toBe(false);
    expect(presentation.credentials.scopes).toBeDefined();
  });

  it('should map nested permissions', () => {
    const service = createConnectedServiceFixture();
    const presentation = toConnectedServicePresentation(service);

    expect(presentation.permissions).toBeDefined();
    expect(typeof presentation.permissions.readWorkouts).toBe('boolean');
  });

  it('should map nested sync status', () => {
    const service = createConnectedServiceFixture();
    const presentation = toConnectedServicePresentation(service);

    expect(presentation.syncStatus).toBeDefined();
    expect(presentation.syncStatus.state).toBeDefined();
    expect(presentation.syncStatus.syncHealthStatus).toBeDefined();
  });

  it('should map nested metadata', () => {
    const service = createConnectedServiceFixture();
    const presentation = toConnectedServicePresentation(service);

    expect(presentation.metadata).toBeDefined();
    expect(typeof presentation.metadata.supportsWebhooks).toBe('boolean');
  });

  it('should compute connectionHealthStatus as needs_reauth when credentials expired', () => {
    const service = createConnectedServiceFixture({
      credentials: {
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: new Date(Date.now() - 1000 * 60 * 60), // Expired 1 hour ago
        scopes: ['read:workouts'],
        tokenType: 'Bearer',
      },
    });
    const presentation = toConnectedServicePresentation(service);

    expect(presentation.connectionHealthStatus).toBe('needs_reauth');
  });

  it('should compute connectionHealthStatus as error when sync has errors', () => {
    const service = createConnectedServiceFixture({
      credentials: {
        accessToken: 'token',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // Valid
        scopes: ['read:workouts'],
        tokenType: 'Bearer',
      },
      syncStatus: {
        state: 'error',
        workoutsSynced: 0,
        activitiesSynced: 0,
        heartRateDataSynced: 0,
        consecutiveFailures: 3,
      },
    });
    const presentation = toConnectedServicePresentation(service);

    expect(presentation.connectionHealthStatus).toBe('error');
  });

  it('should compute connectionHealthStatus as healthy when all is well', () => {
    const service = createConnectedServiceFixture({
      credentials: {
        accessToken: 'token',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // Valid
        scopes: ['read:workouts'],
        tokenType: 'Bearer',
      },
      syncStatus: {
        state: 'synced',
        workoutsSynced: 100,
        activitiesSynced: 200,
        heartRateDataSynced: 300,
        consecutiveFailures: 0,
      },
    });
    const presentation = toConnectedServicePresentation(service);

    expect(presentation.connectionHealthStatus).toBe('healthy');
  });

  it('should compute daysSinceConnected', () => {
    const service = createConnectedServiceFixture({
      connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    });
    const presentation = toConnectedServicePresentation(service);

    expect(presentation.daysSinceConnected).toBeGreaterThanOrEqual(29);
    expect(presentation.daysSinceConnected).toBeLessThanOrEqual(31);
  });

  it('should validate all service types', () => {
    const serviceTypes = [
      'strava',
      'garmin',
      'apple_health',
      'fitbit',
      'whoop',
      'peloton',
      'polar',
      'coros',
      'google_fit',
    ] as const;

    serviceTypes.forEach((serviceType) => {
      const service = createConnectedServiceFixture({ serviceType });
      const presentation = toConnectedServicePresentation(service);
      const result = ConnectedServicePresentationSchema.safeParse(presentation);
      expect(result.success).toBe(true);
    });
  });
});
