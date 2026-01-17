import { faker } from '@faker-js/faker';
import { SyncStatus, SyncState, SyncError } from '../sync-status.js';

export function createSyncErrorFixture(overrides?: Partial<SyncError>): SyncError {
  return {
    code: faker.helpers.arrayElement(['auth_expired', 'rate_limit', 'network_error', 'server_error']),
    message: faker.lorem.sentence(),
    occurredAt: faker.date.recent({ days: 1 }),
    retriesRemaining: faker.number.int({ min: 0, max: 3 }),
    willRetryAt: faker.datatype.boolean() ? faker.date.soon({ days: 1 }) : undefined,
    ...overrides,
  };
}

export function createSyncStatusFixture(overrides?: Partial<SyncStatus>): SyncStatus {
  const state = overrides?.state || faker.helpers.arrayElement([
    'never_synced',
    'syncing',
    'synced',
    'error',
    'paused',
  ] as SyncState[]);

  const hasError = state === 'error';
  const hasSucceeded = state === 'synced' || state === 'error';

  return {
    state,
    lastAttemptAt: hasSucceeded ? faker.date.recent({ days: 7 }) : undefined,
    lastSuccessAt: state === 'synced' ? faker.date.recent({ days: 7 }) : undefined,
    nextScheduledSync: state !== 'paused' ? faker.date.soon({ days: 1 }) : undefined,
    workoutsSynced: faker.number.int({ min: 0, max: 500 }),
    activitiesSynced: faker.number.int({ min: 0, max: 1000 }),
    heartRateDataSynced: faker.number.int({ min: 0, max: 2000 }),
    error: hasError ? createSyncErrorFixture() : undefined,
    consecutiveFailures: hasError ? faker.number.int({ min: 1, max: 5 }) : 0,
    ...overrides,
  };
}
