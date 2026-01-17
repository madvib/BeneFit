// MAPPERS

import { ConnectedService } from '@bene/integrations-domain';
import type { DbConnectedService, NewDbConnectedService } from '../data/schema';

export function toDomain(row: DbConnectedService): ConnectedService {
  const syncStatus = row.syncStatus as any;
  const hydratedSyncStatus = {
    ...syncStatus,
    lastAttemptAt: row.lastSyncAttempt || undefined,
    lastSuccessAt: row.lastSyncSuccess || undefined,
    nextScheduledSync: row.nextScheduledSync || undefined,
  };

  // Parse nested dates in error object if they exist
  if (hydratedSyncStatus.error) {
    hydratedSyncStatus.error = {
      ...hydratedSyncStatus.error,
      occurredAt: hydratedSyncStatus.error.occurredAt
        ? new Date(hydratedSyncStatus.error.occurredAt)
        : undefined,
      willRetryAt: hydratedSyncStatus.error.willRetryAt
        ? new Date(hydratedSyncStatus.error.willRetryAt)
        : undefined,
    };
  }

  return {
    id: row.id,
    userId: row.userId,
    serviceType: row.serviceType,
    credentials: {
      accessToken: row.accessTokenEncrypted,
      refreshToken: row.refreshTokenEncrypted ?? undefined,
      expiresAt: row.tokenExpiresAt ?? undefined,
      scopes: row.scope ? row.scope.split(',') : [],
      tokenType: 'Bearer', // Default or need to store?
    },
    permissions: row.permissions,
    syncStatus: hydratedSyncStatus,
    metadata: row.metadata,
    isActive: row.isActive,
    isPaused: row.isPaused,
    connectedAt: row.connectedAt,
    lastSyncAt: row.lastSyncAt ?? undefined,
    updatedAt: row.updatedAt,
  };
}

export function toDatabase(service: ConnectedService): NewDbConnectedService {
  // Extract dates from syncStatus
  const { lastAttemptAt, lastSuccessAt, nextScheduledSync, ...syncStatusData } = service.syncStatus;

  return {
    id: service.id,
    userId: service.userId,
    serviceType: service.serviceType,
    accessTokenEncrypted: service.credentials.accessToken,
    refreshTokenEncrypted: service.credentials.refreshToken,
    tokenExpiresAt: service.credentials.expiresAt,
    scope: service.credentials.scopes.join(','),
    permissions: service.permissions,
    lastSyncAttempt: lastAttemptAt || null,
    lastSyncSuccess: lastSuccessAt || null,
    nextScheduledSync: nextScheduledSync || null,
    syncStatus: syncStatusData,
    metadata: service.metadata,
    isActive: service.isActive,
    isPaused: service.isPaused,
    connectedAt: service.connectedAt,
    lastSyncAt: service.lastSyncAt,
    updatedAt: service.updatedAt,
  };
}
