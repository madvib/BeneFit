import { describe, it, expect } from 'vitest';
import { CreateSyncStatusSchema, createInitialSyncStatus, createSyncError } from '../sync-status.factory.js';
import { createSyncStatusFixture } from './sync-status.fixtures.js';

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
      const result = createSyncError({
        code: 'auth_expired',
        message: 'Access token expired',
        retriesRemaining: 2
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const error = result.value;
        expect(error.code).toBe('auth_expired');
        expect(error.message).toBe('Access token expired');
        expect(error.retriesRemaining).toBe(2);
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
      const input = {
        state: 'synced' as const,
        workoutsSynced: 10,
      };

      const result = CreateSyncStatusSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.state).toBe('synced');
        expect(result.data.workoutsSynced).toBe(10);
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
      const fixture = createSyncStatusFixture({ state: 'error', consecutiveFailures: 3 });

      expect(fixture.state).toBe('error');
      expect(fixture.consecutiveFailures).toBe(3);
    });
  });
});