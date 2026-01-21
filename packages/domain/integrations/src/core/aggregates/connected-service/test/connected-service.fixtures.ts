import { faker } from '@faker-js/faker';
import {
  createServicePermissionsFixture,
  createOAuthCredentialsFixture,
  createServiceMetadataFixture,
  createSyncStatusFixture
} from '../../../../fixtures.js';
import { ConnectedService, ServiceType } from '../connected-service.types.js';
import { connectedServiceFromPersistence } from '../connected-service.factory.js';

/**
 * Creates a ConnectedService fixture for testing.
 * Uses connectedServiceFromPersistence to ensure branding and type safety.
 */
export function createConnectedServiceFixture(
  overrides?: Partial<ConnectedService>
): ConnectedService {
  const serviceType =
    overrides?.serviceType ??
    faker.helpers.arrayElement([
      'strava',
      'garmin',
      'apple_health',
      'fitbit',
      'whoop',
      'peloton',
      'polar',
      'coros',
      'google_fit',
    ] as ServiceType[]);

  const data = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    serviceType,
    credentials: createOAuthCredentialsFixture(),
    permissions: createServicePermissionsFixture(),
    syncStatus: createSyncStatusFixture(),
    metadata: createServiceMetadataFixture(),
    isActive: true,
    isPaused: false,
    connectedAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };

  const result = connectedServiceFromPersistence(data as ConnectedService);

  if (result.isFailure) {
    throw new Error(`Failed to create ConnectedService fixture: ${ result.error }`);
  }

  return result.value;
}
