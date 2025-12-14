import type { ConnectedService } from '@bene/integrations-domain';
import { createOAuthCredentials } from '@bene/integrations-domain';
import { createServicePermissions } from '@bene/integrations-domain';
import { createInitialSyncStatus, type SyncStatus } from '@bene/integrations-domain';
import { createServiceMetadata } from '@bene/integrations-domain';
import type { TokenData } from './token-manager.js';

/**
 * Service permissions structure
 */
export interface ServicePermissions {
  read: string[];
  write: string[];
}

/**
 * Mapper utilities for integration services
 */
export class IntegrationMapper {
  /**
   * Create a ConnectedService from token data
   */
  static toConnectedService(
    serviceType: 'strava' | 'garmin',
    tokens: TokenData,
    metadata: Record<string, unknown>,
    permissions: ServicePermissions,
  ): ConnectedService {
    // Create OAuth credentials from token data
    const oauthCredentialsResult = createOAuthCredentials({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt ? new Date(tokens.expiresAt) : undefined,
      scopes: tokens.scope ? tokens.scope.split(',') : [],
      tokenType: tokens.tokenType,
    });

    if (oauthCredentialsResult.isFailure) {
      throw new Error(
        `Failed to create OAuth credentials: ${oauthCredentialsResult.error}`,
      );
    }
    const oauthCredentials = oauthCredentialsResult.value;

    // Convert the incoming permissions to the domain format
    const domainPermissions = createServicePermissions({
      readWorkouts: permissions.read.includes('workouts'),
      readHeartRate: permissions.read.includes('heartrate'),
      readSleep: permissions.read.includes('sleep'),
      readNutrition: permissions.read.includes('nutrition'),
      readBodyMetrics: permissions.read.includes('body_metrics'),
      writeWorkouts: permissions.write.includes('workouts'),
    });

    // Create sync status with initial state
    const syncStatus = createInitialSyncStatus();

    // Create service metadata
    const serviceMetadata = createServiceMetadata({
      externalUserId: metadata.externalUserId as string | undefined,
      externalUsername: metadata.externalUsername as string | undefined,
      profileUrl: metadata.profileUrl as string | undefined,
      athleteType: metadata.athleteType as string | undefined,
      units: metadata.units as 'metric' | 'imperial' | undefined,
      supportsWebhooks: metadata.supportsWebhooks as boolean,
      webhookRegistered: (metadata.webhookRegistered as boolean) || false,
      webhookUrl: metadata.webhookUrl as string | undefined,
    });

    return {
      id: `${serviceType}_${metadata.userId || Date.now()}`,
      userId: '', // Set by calling code
      serviceType,
      credentials: oauthCredentials,
      permissions: domainPermissions,
      syncStatus: {
        ...syncStatus,
        state: 'synced', // Default state after connection
      },
      metadata: serviceMetadata,
      isActive: true,
      isPaused: false,
      connectedAt: new Date(),
      lastSyncAt: undefined,
      updatedAt: new Date(),
    };
  }

  /**
   * Update sync status on a ConnectedService
   */
  static updateSyncStatus(
    service: ConnectedService,
    status: 'success' | 'error' | 'syncing',
    error?: string,
  ): void {
    const newState =
      status === 'success' ? 'synced' : status === 'error' ? 'error' : 'syncing';

    const updatedSyncStatus: SyncStatus = {
      ...service.syncStatus,
      state: newState,
      lastAttemptAt: new Date(),
      lastSuccessAt:
        status === 'success' ? new Date() : service.syncStatus.lastSuccessAt,
      error: error
        ? {
            code: 'sync_error',
            message: error,
            occurredAt: new Date(),
            retriesRemaining: 3, // Default value
          }
        : undefined,
      consecutiveFailures:
        status === 'error' ? (service.syncStatus.consecutiveFailures || 0) + 1 : 0,
    };

    // Cast to mutable type to update readonly properties
    // This assumes the caller will persist these changes
    const mutableService = service as {
      syncStatus: SyncStatus;
      lastSyncAt: Date;
      updatedAt: Date;
    };

    mutableService.syncStatus = updatedSyncStatus;
    mutableService.lastSyncAt = new Date();
    mutableService.updatedAt = new Date();
  }

  /**
   * Mark service as successfully synced
   */
  static markSyncSuccess(service: ConnectedService): void {
    IntegrationMapper.updateSyncStatus(service, 'success');
  }

  /**
   * Mark service sync as failed
   */
  static markSyncError(service: ConnectedService, error: string): void {
    IntegrationMapper.updateSyncStatus(service, 'error', error);
  }
}
