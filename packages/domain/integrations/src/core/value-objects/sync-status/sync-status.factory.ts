import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { SyncStatus, SyncStatusSchema, SyncError, SyncErrorSchema } from './sync-status.types.js';

/**
 * ============================================================================
 * SYNC STATUS FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (3 exports):
 * 1. syncStatusFromPersistence() - For fixtures & DB hydration
 * 2. CreateSyncStatusSchema - Zod transform for API boundaries
 * 3. createInitialSyncStatus() - Domain helper for new integrations
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates SyncStatus with domain-specific business rules */
function validateSyncStatus(data: unknown): Result<SyncStatus> {
  const parseResult = SyncStatusSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates SyncStatus from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function syncStatusFromPersistence(
  data: Unbrand<SyncStatus>,
): Result<SyncStatus> {
  return Result.ok(data as SyncStatus);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================


/**
 * Zod transform for creating SyncStatus with validation.
 */
export const CreateSyncStatusSchema: z.ZodType<SyncStatus> = SyncStatusSchema.partial().transform((input, ctx) => {
  const data = {
    state: input.state ?? 'never_synced',
    workoutsSynced: input.workoutsSynced ?? 0,
    activitiesSynced: input.activitiesSynced ?? 0,
    heartRateDataSynced: input.heartRateDataSynced ?? 0,
    consecutiveFailures: input.consecutiveFailures ?? 0,
    ...input,
  };

  const validationResult = validateSyncStatus(data);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// 3. DOMAIN HELPERS
// ============================================================================

/**
 * Creates an initial SyncStatus for a new integration.
 */
export function createInitialSyncStatus(): SyncStatus {
  return syncStatusFromPersistence({
    state: 'never_synced',
    workoutsSynced: 0,
    activitiesSynced: 0,
    heartRateDataSynced: 0,
    consecutiveFailures: 0,
  }).value;
}

/**
 * Creates a validated SyncError.
 * Note: Internal to domain logic, not typically used at API boundaries for creation.
 */
export function createSyncError(props: {
  code: string;
  message: string;
  retriesRemaining: number;
  willRetryAt?: Date;
}): Result<SyncError> {
  const data = {
    code: props.code,
    message: props.message,
    occurredAt: new Date(),
    retriesRemaining: props.retriesRemaining,
    willRetryAt: props.willRetryAt
  };

  const parseResult = SyncErrorSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data as SyncError);
}

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateSyncStatusSchema or syncStatusFromPersistence.
 */
export function createSyncStatus(props: unknown): Result<SyncStatus> {
  return validateSyncStatus(props);
}
