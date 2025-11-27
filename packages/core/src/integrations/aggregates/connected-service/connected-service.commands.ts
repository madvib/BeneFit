import { Guard, Result } from '@shared';
import { OAuthCredentials } from '../../value-objects/oauth-credentials/oauth-credentials.js';
import { ServiceMetadata } from '../../value-objects/service-metadata/service-metadata.js';
import { ServicePermissions } from '../../value-objects/service-permissions/service-permission.js';
import { SyncError } from '../../value-objects/sync-status/sync-status.js';
import { ConnectedService } from './index.js';

export function refreshCredentials(
  service: ConnectedService,
  newCredentials: OAuthCredentials,
): Result<ConnectedService> {
  const guardResult = Guard.againstNullOrUndefined(newCredentials, 'newCredentials');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    ...service,
    credentials: newCredentials,
    updatedAt: new Date(),
  });
}

export function updatePermissions(
  service: ConnectedService,
  permissions: ServicePermissions,
): Result<ConnectedService> {
  const guardResult = Guard.againstNullOrUndefined(permissions, 'permissions');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    ...service,
    permissions,
    updatedAt: new Date(),
  });
}

export function startSync(service: ConnectedService): Result<ConnectedService> {
  const guardResult = Guard.isTrue(
    service.isActive && !service.isPaused,
    'Cannot sync inactive or paused service',
  );
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  return Result.ok({
    ...service,
    syncStatus: {
      ...service.syncStatus,
      state: 'syncing',
      lastAttemptAt: new Date(),
    },
    updatedAt: new Date(),
  });
}

export function recordSyncSuccess(
  service: ConnectedService,
  syncedData: {
    workouts?: number;
    activities?: number;
    heartRate?: number;
  },
): ConnectedService {
  const now = new Date();

  return {
    ...service,
    syncStatus: {
      ...service.syncStatus,
      state: 'synced',
      lastSuccessAt: now,
      workoutsSynced: service.syncStatus.workoutsSynced + (syncedData.workouts || 0),
      activitiesSynced:
        service.syncStatus.activitiesSynced + (syncedData.activities || 0),
      heartRateDataSynced:
        service.syncStatus.heartRateDataSynced + (syncedData.heartRate || 0),
      error: undefined,
      consecutiveFailures: 0,
    },
    lastSyncAt: now,
    updatedAt: now,
  };
}

export function recordSyncError(
  service: ConnectedService,
  error: SyncError,
): Result<ConnectedService> {
  const guardResult = Guard.againstNullOrUndefined(error, 'error');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  return Result.ok({
    ...service,
    syncStatus: {
      ...service.syncStatus,
      state: 'error',
      error,
      consecutiveFailures: service.syncStatus.consecutiveFailures + 1,
    },
    updatedAt: new Date(),
  });
}

export function pauseSync(service: ConnectedService): ConnectedService {
  return {
    ...service,
    isPaused: true,
    syncStatus: {
      ...service.syncStatus,
      state: 'paused',
    },
    updatedAt: new Date(),
  };
}

export function resumeSync(service: ConnectedService): Result<ConnectedService> {
  const guardResult = Guard.isTrue(service.isActive, 'Cannot resume inactive service');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  return Result.ok({
    ...service,
    isPaused: false,
    syncStatus: {
      ...service.syncStatus,
      state: service.syncStatus.lastSuccessAt ? 'synced' : 'never_synced',
      error: undefined,
    },
    updatedAt: new Date(),
  });
}

export function disconnectService(service: ConnectedService): ConnectedService {
  return {
    ...service,
    isActive: false,
    isPaused: true,
    syncStatus: {
      ...service.syncStatus,
      state: 'paused',
    },
    updatedAt: new Date(),
  };
}

export function reconnectService(
  service: ConnectedService,
  newCredentials: OAuthCredentials,
): Result<ConnectedService> {
  const guardResult = Guard.againstNullOrUndefined(newCredentials, 'newCredentials');
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  return Result.ok({
    ...service,
    credentials: newCredentials,
    isActive: true,
    isPaused: false,
    syncStatus: {
      ...service.syncStatus,
      state: 'never_synced',
      error: undefined,
      consecutiveFailures: 0,
    },
    updatedAt: new Date(),
  });
}

export function registerWebhook(
  service: ConnectedService,
  webhookUrl: string,
): Result<ConnectedService> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(webhookUrl, 'webhookUrl'),
    Guard.isTrue(
      service.metadata.supportsWebhooks,
      'Service does not support webhooks',
    ),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  return Result.ok({
    ...service,
    metadata: {
      ...service.metadata,
      webhookRegistered: true,
      webhookUrl,
    },
    updatedAt: new Date(),
  });
}

export function unregisterWebhook(service: ConnectedService): ConnectedService {
  return {
    ...service,
    metadata: {
      ...service.metadata,
      webhookRegistered: false,
      webhookUrl: undefined,
    },
    updatedAt: new Date(),
  };
}

export function updateMetadata(
  service: ConnectedService,
  metadata: Partial<ServiceMetadata>,
): ConnectedService {
  return {
    ...service,
    metadata: {
      ...service.metadata,
      ...metadata,
    },
    updatedAt: new Date(),
  };
}
