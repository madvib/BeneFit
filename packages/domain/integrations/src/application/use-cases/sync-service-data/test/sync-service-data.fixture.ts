import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { faker } from '@faker-js/faker';
import type { SyncServiceDataResponse } from '../sync-service-data.js';

export type SyncServiceDataFixtureOptions = BaseFixtureOptions<SyncServiceDataResponse>;

/**
 * Build SyncServiceDataResponse fixture
 * 
 * Note: This use case returns sync metrics, not a service view
 */
export function buildSyncServiceDataResponse(
  options: SyncServiceDataFixtureOptions = {}
): Result<SyncServiceDataResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to sync service data');
  if (errorResult) return errorResult;

  return Result.ok({
    serviceId: faker.string.uuid(),
    success: true,
    activitiesSynced: faker.number.int({ min: 1, max: 20 }),
    ...overrides,
  });
}
