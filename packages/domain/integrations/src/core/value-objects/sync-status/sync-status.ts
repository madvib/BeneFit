import { Guard, Result } from '@bene/shared-domain';

export type SyncState =
  | 'never_synced' // Initial state
  | 'syncing' // Currently syncing
  | 'synced' // Last sync successful
  | 'error' // Last sync failed
  | 'paused'; // User paused sync

export interface SyncError {
  code: string; // "auth_expired", "rate_limit", "network_error", etc.
  message: string;
  occurredAt: Date;
  retriesRemaining: number;
  willRetryAt?: Date;
}

interface SyncStatusData {
  state: SyncState;
  lastAttemptAt?: Date;
  lastSuccessAt?: Date;
  nextScheduledSync?: Date;

  // Sync statistics
  workoutsSynced: number;
  activitiesSynced: number;
  heartRateDataSynced: number;

  // Error tracking
  error?: SyncError;
  consecutiveFailures: number;
}

export type SyncStatus = Readonly<SyncStatusData>;

export function createInitialSyncStatus(): SyncStatus {
  return {
    state: 'never_synced',
    workoutsSynced: 0,
    activitiesSynced: 0,
    heartRateDataSynced: 0,
    consecutiveFailures: 0,
  };
}

export function createSyncError(props: {
  code: string;
  message: string;
  retriesRemaining: number;
  willRetryAt?: Date;
}): Result<SyncError> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: props.code, argumentName: 'code' },
      { argument: props.message, argumentName: 'message' },
      { argument: props.retriesRemaining, argumentName: 'retriesRemaining' },
    ]),

    Guard.againstEmptyString(props.code, 'code'),
    Guard.againstEmptyString(props.message, 'message'),
    Guard.againstNegative(props.retriesRemaining, 'retriesRemaining'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  return Result.ok({
    code: props.code,
    message: props.message,
    occurredAt: new Date(),
    retriesRemaining: props.retriesRemaining,
    willRetryAt: props.willRetryAt,
  });
}
