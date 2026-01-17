import { z } from 'zod';
import { SyncStatus, SyncError } from './sync-status.js';

export const SyncStateSchema = z.enum(['never_synced', 'syncing', 'synced', 'error', 'paused']);

export const SyncErrorSchema = z.object({
  code: z.string().min(1).max(50),
  message: z.string().min(1).max(500),
  occurredAt: z.iso.datetime(),
  retriesRemaining: z.number().int().min(0).max(10),
  willRetryAt: z.iso.datetime().optional(),
});

export const SyncStatusPresentationSchema = z.object({
  state: SyncStateSchema,
  lastAttemptAt: z.iso.datetime().optional(),
  lastSuccessAt: z.iso.datetime().optional(),
  nextScheduledSync: z.iso.datetime().optional(),
  workoutsSynced: z.number().int().min(0).max(100000),
  activitiesSynced: z.number().int().min(0).max(100000),
  heartRateDataSynced: z.number().int().min(0).max(1000000),
  error: SyncErrorSchema.optional(),
  consecutiveFailures: z.number().int().min(0).max(100),
  // Computed fields
  minutesSinceLastSync: z.number().int().min(0).max(1000000).optional(),
  syncHealthStatus: z.enum(['healthy', 'warning', 'error']),
});

export type SyncStatusPresentation = z.infer<typeof SyncStatusPresentationSchema>;

export function toSyncStatusPresentation(status: SyncStatus): SyncStatusPresentation {
  const minutesSinceLastSync = status.lastSuccessAt
    ? Math.floor((Date.now() - status.lastSuccessAt.getTime()) / (1000 * 60))
    : undefined;

  let syncHealthStatus: 'healthy' | 'warning' | 'error';
  if (status.state === 'error' || status.consecutiveFailures >= 3) {
    syncHealthStatus = 'error';
  } else if (status.state === 'paused' || status.consecutiveFailures > 0) {
    syncHealthStatus = 'warning';
  } else {
    syncHealthStatus = 'healthy';
  }

  return {
    state: status.state,
    lastAttemptAt: status.lastAttemptAt?.toISOString(),
    lastSuccessAt: status.lastSuccessAt?.toISOString(),
    nextScheduledSync: status.nextScheduledSync?.toISOString(),
    workoutsSynced: status.workoutsSynced,
    activitiesSynced: status.activitiesSynced,
    heartRateDataSynced: status.heartRateDataSynced,
    error: status.error
      ? {
        code: status.error.code,
        message: status.error.message,
        occurredAt: status.error.occurredAt.toISOString(),
        retriesRemaining: status.error.retriesRemaining,
        willRetryAt: status.error.willRetryAt?.toISOString(),
      }
      : undefined,
    consecutiveFailures: status.consecutiveFailures,
    // Computed
    minutesSinceLastSync,
    syncHealthStatus,
  };
}
