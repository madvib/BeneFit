// MAPPERS

import { ConnectedService } from '@bene/integrations-domain';

import { connectedServices } from '../data/schema';

export function toDomain(row: typeof connectedServices.$inferSelect): ConnectedService {
  return {
    id: row.id,
    userId: row.userId,
    serviceType: row.serviceType,
    credentials: {
      accessToken: row.accessTokenEncrypted,
      refreshToken: row.refreshTokenEncrypted || undefined,
      expiresAt: row.tokenExpiresAt || undefined,
      scopes: row.scope ? row.scope.split(',') : [],
      tokenType: 'Bearer', // Default or need to store?
    },
    permissions: row.permissions as any,
    syncStatus: row.syncStatus as any,
    metadata: row.metadata as any,
    isActive: row.isActive ?? true,
    isPaused: row.isPaused ?? false,
    connectedAt: row.connectedAt ?? new Date(),
    lastSyncAt: row.lastSyncAt || undefined,
    updatedAt: row.updatedAt ?? new Date(),
  };
}

export function toDatabase(
  service: ConnectedService,
): typeof connectedServices.$inferInsert {
  return {
    id: service.id,
    userId: service.userId,
    serviceType: service.serviceType,
    accessTokenEncrypted: service.credentials.accessToken,
    refreshTokenEncrypted: service.credentials.refreshToken,
    tokenExpiresAt: service.credentials.expiresAt,
    scope: service.credentials.scopes.join(','),
    permissions: service.permissions as any,
    syncStatus: service.syncStatus as any,
    metadata: service.metadata as any,
    isActive: service.isActive,
    isPaused: service.isPaused,
    connectedAt: service.connectedAt,
    lastSyncAt: service.lastSyncAt,
    updatedAt: service.updatedAt,
  };
}
