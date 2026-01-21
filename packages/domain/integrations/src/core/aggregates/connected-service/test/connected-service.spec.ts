import { describe, it, expect } from 'vitest';
import { CreateConnectedServiceSchema } from '../connected-service.factory.js';
import { refreshCredentials } from '../connected-service.commands.js';
import { createConnectedServiceFixture } from './connected-service.fixtures.js';
import { createOAuthCredentialsFixture, createServicePermissionsFixture } from '../../../value-objects/index.js';

describe('ConnectedService', () => {
  describe('Factory', () => {
    it('should create a valid connected service', () => {
      // Arrange
      const credentials = createOAuthCredentialsFixture();
      const permissions = createServicePermissionsFixture();
      const input = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        serviceType: 'strava' as const,
        credentials,
        permissions
      };

      // Act
      const result = CreateConnectedServiceSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const service = result.data;
        expect(service.userId).toBe('550e8400-e29b-41d4-a716-446655440000');
        expect(service.serviceType).toBe('strava');
        expect(service.isActive).toBe(true);
        expect(service.credentials).toEqual(credentials);
        expect(service.permissions).toEqual(permissions);
      }
    });

    it('should fail to create with invalid userId', () => {
      // Act
      const result = CreateConnectedServiceSchema.safeParse({
        userId: 'invalid-uuid',
        serviceType: 'strava',
        credentials: createOAuthCredentialsFixture(),
        permissions: createServicePermissionsFixture()
      });

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('Commands', () => {
    it('should allow refreshing credentials', () => {
      // Arrange
      const service = createConnectedServiceFixture();
      const newCredentials = createOAuthCredentialsFixture({
        accessToken: 'new_token'
      });

      // Act
      const updatedResult = refreshCredentials(service, newCredentials);

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        expect(updatedResult.value.credentials.accessToken).toBe('new_token');
      }
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const fixture = createConnectedServiceFixture();

      expect(fixture.id).toBeDefined();
      expect(fixture.syncStatus).toBeDefined();
    });

    it('should allow overrides in fixture', () => {
      const fixture = createConnectedServiceFixture({ isActive: false });

      expect(fixture.isActive).toBe(false);
    });
  });
});