import { describe, it, expect } from 'vitest';
import { createConnectedService } from '../connected-service.factory.js';
import { refreshCredentials } from '../connected-service.commands.js';
import { createOAuthCredentials, createServicePermissions } from '../../../value-objects/index.js';

describe('ConnectedService Aggregate', () => {
  const validCredentials = createOAuthCredentials({
    accessToken: 'valid_token',
    scopes: ['read', 'write']
  }).value;
  const validPermissions = createServicePermissions({
    readWorkouts: true,
    readHeartRate: true
  });

  it('should create a valid connected service', () => {
    const result = createConnectedService({
      userId: 'user-123',
      serviceType: 'strava',
      credentials: validCredentials,
      permissions: validPermissions
    });

    expect(result.isSuccess).toBe(true);
    const service = result.value;
    expect(service.userId).toBe('user-123');
    expect(service.serviceType).toBe('strava');
    expect(service.isActive).toBe(true);
    expect(service.credentials).toEqual(validCredentials);
    expect(service.permissions).toEqual(validPermissions);
  });

  it('should fail to create with invalid userId', () => {
    const result = createConnectedService({
      userId: '',
      serviceType: 'strava',
      credentials: validCredentials,
      permissions: validPermissions
    });

    expect(result.isFailure).toBe(true);
  });

  it('should allow refreshing credentials', () => {
    const createResult = createConnectedService({
      userId: 'user-123',
      serviceType: 'strava',
      credentials: validCredentials,
      permissions: validPermissions
    });

    const newCredentials = createOAuthCredentials({
      accessToken: 'new_token',
      scopes: ['read']
    }).value;

    const updatedResult = refreshCredentials(createResult.value, newCredentials);

    expect(updatedResult.isSuccess).toBe(true);
    const service = updatedResult.value;
    expect(service.credentials.accessToken).toBe('new_token');
  });
});