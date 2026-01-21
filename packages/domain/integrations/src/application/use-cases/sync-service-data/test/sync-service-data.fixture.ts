import { faker } from '@faker-js/faker';
import type { SyncServiceDataResponse } from '../sync-service-data.js';

/**
 * Build SyncServiceDataResponse fixture
 * 
 * Note: This use case returns sync metrics, not a service view
 */
export function buildSyncServiceDataResponse(
  overrides?: Partial<SyncServiceDataResponse>
): SyncServiceDataResponse {
  return {
    serviceId: faker.string.uuid(),
    success: true,
    activitiesSynced: faker.number.int({ min: 1, max: 20 }),
    ...overrides,
  };
}
