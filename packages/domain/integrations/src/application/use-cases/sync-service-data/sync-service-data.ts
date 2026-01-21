import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { ConnectedService, ConnectedServiceCommands } from '@core/index.js';
import { ConnectedServiceRepository } from '@app/ports/connected-service-repository.js';
import { IntegrationClient } from '@app/ports/integration-client.js';
import { ServiceSyncedEvent } from '@app/events/service-synced.event.js';
import { ActivitiesSyncedEvent } from '@app/events/activities-synced.event.js';

// Type for activity normalizer functions (Strava, Garmin, etc.)
type ActivityNormalizer = (activities: unknown[]) => import('@core/normalized-activity.js').NormalizedActivity[];

/**
 * Input schema
 */
export const SyncServiceDataRequestSchema = z.object({
  serviceId: z.uuid(),
});

export type SyncServiceDataRequest = z.infer<typeof SyncServiceDataRequestSchema>;

/**
 * Response type - custom for sync operation
 * Note: Returns sync-specific metrics, not the full service view
 */
export type SyncServiceDataResponse = {
  serviceId: string;
  success: boolean;
  activitiesSynced: number;
  error?: string;
};

/**
 * Use case for syncing data from external services.
 * 
 * RESPONSIBILITIES:
 * - Fetch activities from external service
 * - Normalize activities to common structure
 * - Update sync status on ConnectedService
 * - Emit ActivitiesSyncedEvent for other domains to consume
 * 
 * DOES NOT:
 * - Map or persist domain-specific models (e.g., CompletedWorkout)
 * - This is handled by event subscribers in the Training domain
 */
export class SyncServiceDataUseCase extends BaseUseCase<
  SyncServiceDataRequest,
  SyncServiceDataResponse
> {
  constructor(
    private serviceRepository: ConnectedServiceRepository,
    private integrationClients: Map<string, IntegrationClient>,
    private eventBus: EventBus,
    private activityNormalizers?: Map<string, ActivityNormalizer>,
  ) {
    super();
  }

  protected async performExecution(
    request: SyncServiceDataRequest,
  ): Promise<Result<SyncServiceDataResponse>> {
    // 1. Load service
    const serviceResult = await this.serviceRepository.findById(request.serviceId);
    if (serviceResult.isFailure) {
      return Result.fail(new Error('Service not found'));
    }

    let service = serviceResult.value;

    // 2. Check if can sync
    if (!service.isActive || service.isPaused) {
      return Result.fail(new Error('Service is not active'));
    }

    // 3. Get client
    const client = this.integrationClients.get(service.serviceType);
    if (!client) {
      return Result.fail(new Error(`No client for ${ service.serviceType }`));
    }

    // 4. Refresh credentials if needed
    if (this.needsRefresh(service)) {
      const refreshResult = await this.refreshServiceCredentials(service, client);
      if (refreshResult.isFailure) {
        return Result.fail(
          new Error(`Credential refresh failed: ${ refreshResult.error }`),
        );
      }
      service = refreshResult.value;
    }

    // 5. Start sync
    const startedResult = ConnectedServiceCommands.startSync(service);
    if (startedResult.isFailure) {
      return Result.fail(startedResult.error);
    }
    await this.serviceRepository.save(startedResult.value);

    // 6. Fetch activities since last sync
    const activitiesResult = await client.getActivitiesSince(
      service.credentials.accessToken,
      service.lastSyncAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
    );

    if (activitiesResult.isFailure) {
      // Record error
      const errorResult = ConnectedServiceCommands.recordSyncError(service, {
        code: 'sync_failed',
        message:
          typeof activitiesResult.error === 'string'
            ? activitiesResult.error
            : activitiesResult.errorMessage,
        occurredAt: new Date(),
        retriesRemaining: 3,
      });

      if (errorResult.isFailure) {
        return Result.fail(errorResult.error);
      }

      await this.serviceRepository.save(errorResult.value);

      return Result.fail(activitiesResult.error);
    }

    const rawActivities = activitiesResult.value;

    // 7. Normalize activities using service-specific normalizer
    const normalizer = this.activityNormalizers?.get(service.serviceType);
    const normalizedActivities = normalizer ? normalizer(rawActivities) : [];

    const activitiesSynced = rawActivities.length;

    // 8. Record success (before emitting events)
    const syncSuccessService = ConnectedServiceCommands.recordSyncSuccess(service, {
      workouts: 0, // Will be updated by Training domain event handlers
      activities: activitiesSynced,
    });

    await this.serviceRepository.save(syncSuccessService);

    // 9. Emit ActivitiesSyncedEvent with normalized data
    // Training domain will listen to this and create CompletedWorkouts
    await this.eventBus.publish(
      new ActivitiesSyncedEvent({
        userId: service.userId,
        serviceId: service.id,
        serviceType: service.serviceType,
        activities: normalizedActivities, // Normalized contract
        syncedAt: new Date().toISOString(),
      }),
    );

    // 10. Emit service-level sync event (for UI updates, notifications, etc.)
    await this.eventBus.publish(
      new ServiceSyncedEvent({
        userId: service.userId,
        serviceId: service.id,
        workoutsSynced: 0, // Training domain will emit granular workout events
      }),
    );

    return Result.ok({
      serviceId: request.serviceId,
      success: true,
      activitiesSynced,
    });
  }

  private needsRefresh(service: ConnectedService): boolean {
    if (!service.credentials.expiresAt) return false;
    const now = new Date();
    const expiresIn = service.credentials.expiresAt.getTime() - now.getTime();
    return expiresIn < 5 * 60 * 1000; // Refresh if expires in < 5 minutes
  }

  private async refreshServiceCredentials(
    service: ConnectedService,
    client: IntegrationClient,
  ): Promise<Result<ConnectedService>> {
    if (!service.credentials.refreshToken) {
      return Result.fail(new Error('No refresh token available'));
    }

    const refreshResult = await client.refreshAccessToken(
      service.credentials.refreshToken,
    );

    if (refreshResult.isFailure) {
      return Result.fail(refreshResult.error);
    }

    const newTokens = refreshResult.value;
    const updatedServiceResult = ConnectedServiceCommands.refreshCredentials(
      service,
      newTokens,
    );

    if (updatedServiceResult.isFailure) {
      return Result.fail(updatedServiceResult.error);
    }

    await this.serviceRepository.save(updatedServiceResult.value);

    return updatedServiceResult;
  }
}
