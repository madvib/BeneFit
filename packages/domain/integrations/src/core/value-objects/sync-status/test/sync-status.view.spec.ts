import { describe, it, expect } from 'vitest';
import { toSyncStatusView } from '../sync-status.view.js';
import { createSyncStatusFixture } from './sync-status.fixtures.js';

describe('SyncStatus Presentation', () => {
  it('should map valid sync status to presentation DTO', () => {
    const status = createSyncStatusFixture();
    const presentation = toSyncStatusView(status);

    expect(presentation.state).toBe(status.state);
    expect(presentation.workoutsSynced).toBe(status.workoutsSynced);
  });

  it('should convert all dates to ISO strings', () => {
    const status = createSyncStatusFixture({
      state: 'synced',
      lastAttemptAt: new Date('2024-01-15T10:00:00Z'),
      lastSuccessAt: new Date('2024-01-15T10:00:00Z'),
      nextScheduledSync: new Date('2024-01-16T10:00:00Z'),
    });
    const presentation = toSyncStatusView(status);

    expect(presentation.lastAttemptAt).toBe('2024-01-15T10:00:00.000Z');
    expect(presentation.lastSuccessAt).toBe('2024-01-15T10:00:00.000Z');
    expect(presentation.nextScheduledSync).toBe('2024-01-16T10:00:00.000Z');
  });

  it('should handle sync errors with dates', () => {
    const status = createSyncStatusFixture({
      state: 'error',
      error: {
        code: 'auth_expired',
        message: 'Token has expired',
        occurredAt: new Date('2024-01-15T10:00:00Z'),
        retriesRemaining: 2,
        willRetryAt: new Date('2024-01-15T11:00:00Z'),
      },
    });
    const presentation = toSyncStatusView(status);

    expect(presentation.error).toBeDefined();
    expect(presentation.error?.code).toBe('auth_expired');
    expect(presentation.error?.occurredAt).toBe('2024-01-15T10:00:00.000Z');
    expect(presentation.error?.willRetryAt).toBe('2024-01-15T11:00:00.000Z');
  });

  it('should handle never_synced state', () => {
    const status = createSyncStatusFixture({
      state: 'never_synced',
      lastAttemptAt: undefined,
      lastSuccessAt: undefined,
    });
    const presentation = toSyncStatusView(status);

    expect(presentation.state).toBe('never_synced');
    expect(presentation.lastAttemptAt).toBeUndefined();
    expect(presentation.lastSuccessAt).toBeUndefined();
  });
});
