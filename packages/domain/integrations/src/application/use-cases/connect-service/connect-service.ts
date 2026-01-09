import { z } from 'zod';
import { Result, type EventBus, BaseUseCase, ValidationError, UseCaseError } from '@bene/shared';
import {
  createConnectedService,
  OAuthCredentials,
} from '@core/index.js';
import { ConnectedServiceRepository } from '@app/ports/connected-service-repository.js';
import { IntegrationClient } from '@app/ports/integration-client.js';
import { ServiceConnectedEvent } from '@app/events/service-connected.event.js';

// Single request schema with ALL fields
export const ConnectServiceRequestSchema = z.object({
  // Server context
  userId: z.string(),

  // Client data

  serviceType: z.enum(['strava', 'garmin']),
  authorizationCode: z.string(),
  redirectUri: z.string(),
});

// Zod inferred type with original name
export type ConnectServiceRequest = z.infer<typeof ConnectServiceRequestSchema>;

// Zod schema for response validation
export const ConnectServiceResponseSchema = z.object({
  serviceId: z.string(),
  serviceType: z.string(),
  connected: z.boolean(),
  permissions: z.unknown(), // ServicePermissions - using z.unknown to allow proper typing at runtime
});

// Zod inferred type with original name
export type ConnectServiceResponse = z.infer<typeof ConnectServiceResponseSchema>;

export class ConnectServiceUseCase extends BaseUseCase<
  ConnectServiceRequest,
  ConnectServiceResponse
> {
  constructor(
    private serviceRepository: ConnectedServiceRepository,
    private integrationClients: Map<string, IntegrationClient>,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
    request: ConnectServiceRequest,
  ): Promise<Result<ConnectServiceResponse>> {
    // 1. Get appropriate integration client
    const client = this.integrationClients.get(request.serviceType);
    if (!client) {
      return Result.fail(new ValidationError(`Unsupported service type: ${ request.serviceType }`, 'UNSUPPORTED_SERVICE', { serviceType: request.serviceType }));
    }

    // 2. Exchange authorization code for access token
    const tokenResult = await client.exchangeAuthCode(
      request.authorizationCode,
      request.redirectUri,
    );

    if (tokenResult.isFailure) {
      const error = Array.isArray(tokenResult.error) ? tokenResult.error[0] : tokenResult.error;
      return Result.fail(new UseCaseError(`OAuth exchange failed: ${ error }`, 'OAUTH_EXCHANGE_FAILED', { serviceType: request.serviceType }, error));
    }

    const tokens = tokenResult.value;

    // 3. Get user profile from service
    const profileResult = await client.getUserProfile(tokens.accessToken);
    if (profileResult.isFailure) {
      const error = Array.isArray(profileResult.error) ? profileResult.error[0] : profileResult.error;
      return Result.fail(
        new UseCaseError(`Failed to get user profile: ${ error }`, 'PROFILE_FETCH_FAILED', { serviceType: request.serviceType }, error),
      );
    }

    const externalProfile = profileResult.value;

    // 4. Create ConnectedService aggregate
    const credentials: OAuthCredentials = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      scopes: tokens.scopes,
      tokenType: 'Bearer',
    };

    const serviceResult = createConnectedService({
      userId: request.userId,
      serviceType: request.serviceType,
      credentials,
      permissions: tokens.permissions,
      metadata: {
        externalUserId: externalProfile.id,
        externalUsername: externalProfile.username,
        profileUrl: externalProfile.profileUrl,
        units: externalProfile.units,
        supportsWebhooks: client.supportsWebhooks,
        webhookRegistered: false,
      },
    });

    if (serviceResult.isFailure) {
      return Result.fail(serviceResult.error);
    }

    const service = serviceResult.value;

    // 5. Save to repository
    await this.serviceRepository.save(service);

    // 6. Emit event (triggers initial sync)
    await this.eventBus.publish(
      new ServiceConnectedEvent({
        userId: request.userId,
        serviceId: service.id,
        serviceType: request.serviceType,
      }),
    );

    return Result.ok({
      serviceId: service.id,
      serviceType: service.serviceType,
      connected: true,
      permissions: service.permissions,
    });
  }
}
