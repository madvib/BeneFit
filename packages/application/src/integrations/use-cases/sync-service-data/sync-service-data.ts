import { Result, UseCase } from '@bene/core/shared';
import { ConnectedService, ConnectedServiceCommands } from '@bene/core/integrations';
import { ConnectedServiceRepository } from '../../repositories/connected-service-repository.js';
import { IntegrationClient } from '../../services/integration-client.js';
import { EventBus } from '../../../shared/event-bus.js';

export interface SyncServiceDataRequest {
  serviceId: string;
}

export interface SyncServiceDataResponse {
  serviceId: string;
  success: boolean;
  workoutsSynced: number;
  activitiesSynced: number;
  error?: string;
}

export class SyncServiceDataUseCase
  implements UseCase<SyncServiceDataRequest, SyncServiceDataResponse> {
  constructor(
    private serviceRepository: ConnectedServiceRepository,
    private integrationClients: Map<string, IntegrationClient>,
    private eventBus: EventBus,
  ) { }

  async execute(
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
        return Result.fail(new Error(`Credential refresh failed: ${ refreshResult.error }`));
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
        message: typeof activitiesResult.error === 'string' ? activitiesResult.error : activitiesResult.error.message,
        occurredAt: new Date(),
        retriesRemaining: 3,
      });

      if (errorResult.isFailure) {
        return Result.fail(errorResult.error);
      }

      await this.serviceRepository.save(errorResult.value);

      return Result.fail(activitiesResult.error);
    }

    const activities = activitiesResult.value;

    // 7. Map to CompletedWorkouts and save
    // (This would call CompletedWorkoutRepository in real implementation)
    const workoutsSynced = activities.filter((a: any) => a.type === 'workout').length;
    const activitiesSynced = activities.length;

    // 8. Record success
    const syncSuccessService = ConnectedServiceCommands.recordSyncSuccess(service, {
      workouts: workoutsSynced,
      activities: activitiesSynced,
    });

    await this.serviceRepository.save(syncSuccessService);

    // 9. Emit event
    await this.eventBus.publish({
      type: 'ServiceSynced',
      userId: service.userId,
      serviceId: service.id,
      workoutsSynced,
      timestamp: new Date(),
    });

    return Result.ok({
      serviceId: request.serviceId,
      success: true,
      workoutsSynced,
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
