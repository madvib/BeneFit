import { z } from 'zod';
import type { CreateView, DomainBrandTag } from '@bene/shared';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
export const SyncStateSchema = z.enum([
  'never_synced',
  'syncing',
  'synced',
  'error',
  'paused',
]);

export const SyncErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  occurredAt: z.coerce.date<Date>(),
  retriesRemaining: z.number().int().min(0),
  willRetryAt: z.coerce.date<Date>().optional(),
});

export const SyncStatusSchema = z
  .object({
    state: SyncStateSchema,
    lastAttemptAt: z.coerce.date<Date>().optional(),
    lastSuccessAt: z.coerce.date<Date>().optional(),
    nextScheduledSync: z.coerce.date<Date>().optional(),

    // Stats
    workoutsSynced: z.number().int().min(0),
    activitiesSynced: z.number().int().min(0),
    heartRateDataSynced: z.number().int().min(0),

    // Error
    error: SyncErrorSchema.optional(),
    consecutiveFailures: z.number().int().min(0),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES
 */
export type SyncState = z.infer<typeof SyncStateSchema>;
export type SyncError = Readonly<z.infer<typeof SyncErrorSchema>>;
export type SyncStatus = Readonly<z.infer<typeof SyncStatusSchema>>;

/**
 * 3. VIEW TYPES
 */
export type SyncStatusView = CreateView<SyncStatus>;
