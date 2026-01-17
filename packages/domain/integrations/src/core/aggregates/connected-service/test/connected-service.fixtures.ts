import { faker } from '@faker-js/faker';
import { ConnectedService, ServiceType } from '../connected-service.types.js';
import { createOAuthCredentialsFixture } from '../../../value-objects/oauth-credentials/test/oauth-credentials.fixtures.js';
import { createServicePermissionsFixture } from '../../../value-objects/service-permissions/test/service-permissions.fixtures.js';
import { createServiceMetadataFixture } from '../../../value-objects/service-metadata/test/service-metadata.fixtures.js';
import { createSyncStatusFixture } from '../../../value-objects/sync-status/test/sync-status.fixtures.js';

export function createConnectedServiceFixture(
  overrides?: Partial<ConnectedService>
): ConnectedService {
  const connectedAt = faker.date.past({ years: 1 });
  const isActive = overrides?.isActive ?? faker.datatype.boolean({ probability: 0.8 });

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    serviceType: faker.helpers.arrayElement([
      'strava',
      'garmin',
      'apple_health',
      'fitbit',
      'whoop',
      'peloton',
      'polar',
      'coros',
      'google_fit',
    ] as ServiceType[]),
    credentials: createOAuthCredentialsFixture(),
    permissions: createServicePermissionsFixture(),
    syncStatus: createSyncStatusFixture(),
    metadata: createServiceMetadataFixture(),
    isActive,
    isPaused: isActive ? faker.datatype.boolean({ probability: 0.2 }) : false,
    connectedAt,
    lastSyncAt: isActive ? faker.date.recent({ days: 7 }) : undefined,
    updatedAt: faker.date.recent({ days: 3 }),
    ...overrides,
  };
}
