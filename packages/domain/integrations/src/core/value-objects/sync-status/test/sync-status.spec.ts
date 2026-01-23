import { describe, it, expect } from 'vitest';

import { createSyncStatusFixture } from './sync-status.fixtures.js';
import { CreateSyncStatusSchema, createInitialSyncStatus, createSyncError } from '../sync-status.factory.js';

describe('SyncStatus', () => {
  describe('Factory', () => {
    it('should create initial sync status', () => {
      const status = createInitialSyncStatus();

      expect(status.state).toBe('never_synced');
      expect(status.workoutsSynced).toBe(0);
      expect(status.activitiesSynced).toBe(0);
      expect(status.heartRateDataSynced).toBe(0);
      expect(status.consecutiveFailures).toBe(0);
    });

    it('should create sync error via factory', () => {
      const message = 'Test error message';
      const retriesRemaining = 3;
      const result = createSyncError({
        code: 'auth_expired',
        message,
        retriesRemaining
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const error = result.value;
        expect(error.code).toBe('auth_expired');
        expect(error.message).toBe(message);
        expect(error.retriesRemaining).toBe(retriesRemaining);
      }
    });

    it('should fail to create sync error with empty code', () => {
      const result = createSyncError({
        code: '',
        message: 'Error message',
        retriesRemaining: 2
      });

      expect(result.isFailure).toBe(true);
    });

    it('should validate SyncStatus via schema', () => {
      const workoutsSynced = 42;
      const input = {
        state: 'synced' as const,
        workoutsSynced,
      };

      const result = CreateSyncStatusSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.state).toBe('synced');
        expect(result.data.workoutsSynced).toBe(workoutsSynced);
        expect(result.data.activitiesSynced).toBe(0); // default applied in transform
      }
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const fixture = createSyncStatusFixture();

      expect(fixture.state).toBeDefined();
    });

    it('should allow overrides in fixture', () => {
      const consecutiveFailures = 5;
      const fixture = createSyncStatusFixture({ state: 'error', consecutiveFailures });

      expect(fixture.state).toBe('error');
      expect(fixture.consecutiveFailures).toBe(consecutiveFailures);
    });
  });
});