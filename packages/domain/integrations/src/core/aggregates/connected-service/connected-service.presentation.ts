import { z } from 'zod';
import {
  OAuthCredentialsPresentationSchema,
  toOAuthCredentialsPresentation,
} from '../../value-objects/oauth-credentials/oauth-credentials.presentation.js';
import {
  ServicePermissionsPresentationSchema,
  toServicePermissionsPresentation,
} from '../../value-objects/service-permissions/service-permissions.presentation.js';
import {
  ServiceMetadataPresentationSchema,
  toServiceMetadataPresentation,
} from '../../value-objects/service-metadata/service-metadata.presentation.js';
import {
  SyncStatusPresentationSchema,
  toSyncStatusPresentation,
} from '../../value-objects/sync-status/sync-status.presentation.js';
import { ConnectedService } from './connected-service.types.js';

export const ServiceTypeSchema = z.enum([
  'strava',
  'garmin',
  'apple_health',
  'fitbit',
  'whoop',
  'peloton',
  'polar',
  'coros',
  'google_fit',
]);

export const ConnectedServicePresentationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  serviceType: ServiceTypeSchema,
  credentials: OAuthCredentialsPresentationSchema,
  permissions: ServicePermissionsPresentationSchema,
  syncStatus: SyncStatusPresentationSchema,
  metadata: ServiceMetadataPresentationSchema,
  isActive: z.boolean(),
  isPaused: z.boolean(),
  connectedAt: z.iso.datetime(), // ISO date
  lastSyncAt: z.iso.datetime().optional(), // ISO date
  updatedAt: z.iso.datetime(), // ISO date
  // Computed fields
  connectionHealthStatus: z.enum(['healthy', 'needs_reauth', 'error']),
  daysSinceConnected: z.number().int().min(0).max(10000),
});

export type ConnectedServicePresentation = z.infer<typeof ConnectedServicePresentationSchema>;

export function toConnectedServicePresentation(
  service: ConnectedService
): ConnectedServicePresentation {
  const credentialsPresentation = toOAuthCredentialsPresentation(service.credentials);

  let connectionHealthStatus: 'healthy' | 'needs_reauth' | 'error';
  if (credentialsPresentation.isExpired) {
    connectionHealthStatus = 'needs_reauth';
  } else if (service.syncStatus.state === 'error') {
    connectionHealthStatus = 'error';
  } else {
    connectionHealthStatus = 'healthy';
  }

  const daysSinceConnected = Math.floor(
    (Date.now() - service.connectedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    id: service.id,
    userId: service.userId,
    serviceType: service.serviceType,
    credentials: credentialsPresentation,
    permissions: toServicePermissionsPresentation(service.permissions),
    syncStatus: toSyncStatusPresentation(service.syncStatus),
    metadata: toServiceMetadataPresentation(service.metadata),
    isActive: service.isActive,
    isPaused: service.isPaused,
    connectedAt: service.connectedAt.toISOString(),
    lastSyncAt: service.lastSyncAt?.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
    // Computed
    connectionHealthStatus,
    daysSinceConnected,
  };
}
