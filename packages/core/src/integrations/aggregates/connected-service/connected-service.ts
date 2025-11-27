import { OAuthCredentials } from "../../value-objects/oauth-credentials/oauth-credentials.js";
import { ServiceMetadata } from "../../value-objects/service-metadata/service-metadata.js";
import { ServicePermissions } from "../../value-objects/service-permissions/service-permission.js";
import { SyncStatus } from "../../value-objects/sync-status/sync-status.js";


export type ServiceType =
  | 'strava'
  | 'garmin'
  | 'apple_health'
  | 'fitbit'
  | 'whoop'
  | 'peloton'
  | 'polar'
  | 'coros'
  | 'google_fit';

export interface ConnectedService {
  id: string;
  userId: string;
  serviceType: ServiceType;

  // OAuth credentials (should be encrypted in storage)
  credentials: OAuthCredentials;

  // Permissions granted
  permissions: ServicePermissions;

  // Sync status
  syncStatus: SyncStatus;

  // Service metadata
  metadata: ServiceMetadata;

  // State
  isActive: boolean;
  isPaused: boolean;

  // Timestamps
  connectedAt: Date;
  lastSyncAt?: Date;
  updatedAt: Date;
}
