import { describe, it, expect } from 'vitest';
import { randomUUID } from 'node:crypto';

import { createOAuthCredentialsFixture, createServicePermissionsFixture } from '@/fixtures.js';

import { createConnectedServiceFixture } from './connected-service.fixtures.js';
import { refreshCredentials } from '../connected-service.commands.js';
import { CreateConnectedServiceSchema } from '../connected-service.factory.js';

describe('ConnectedService', () => {
  const TEST_USER_ID = randomUUID();

  describe('Factory', () => {
    it('should create a valid connected service', () => {
      // Arrange
      const credentials = createOAuthCredentialsFixture();
      const permissions = createServicePermissionsFixture();
      const input = {
        userId: TEST_USER_ID,
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
        expect(service.userId).toBe(TEST_USER_ID);
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
      const accessToken = 'new-access-token';
      const newCredentials = createOAuthCredentialsFixture({
        accessToken
      });

      // Act
      const updatedResult = refreshCredentials(service, newCredentials);

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        expect(updatedResult.value.credentials.accessToken).toBe(accessToken);
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