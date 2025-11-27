import { describe, it, expect } from 'vitest';
import { createInitialSyncStatus, createSyncError } from './sync-status.js';

describe('SyncStatus Value Object', () => {
  it('should create initial sync status', () => {
    const status = createInitialSyncStatus();

    expect(status.state).toBe('never_synced');
    expect(status.workoutsSynced).toBe(0);
    expect(status.activitiesSynced).toBe(0);
    expect(status.heartRateDataSynced).toBe(0);
    expect(status.consecutiveFailures).toBe(0);
  });

  it('should create sync error', () => {
    const result = createSyncError({
      code: 'auth_expired',
      message: 'Access token expired',
      retriesRemaining: 2
    });

    expect(result.isSuccess).toBe(true);
    const error = result.value;
    expect(error.code).toBe('auth_expired');
    expect(error.message).toBe('Access token expired');
    expect(error.retriesRemaining).toBe(2);
  });

  it('should fail to create sync error with empty code', () => {
    const result = createSyncError({
      code: '',
      message: 'Error message',
      retriesRemaining: 2
    });

    expect(result.isFailure).toBe(true);
  });
});