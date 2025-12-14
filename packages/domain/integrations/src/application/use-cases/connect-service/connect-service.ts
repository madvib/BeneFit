import { Result, UseCase } from '@bene/shared-domain';

import { ConnectedServiceRepository } from '../../ports/connected-service-repository.js';
import { IntegrationClient } from '../../ports/integration-client.js';
import { EventBus } from '@bene/shared-domain';
import {
  createConnectedService,
  OAuthCredentials,
  ServicePermissions,
} from '@core/index.js';

export interface ConnectServiceRequest {
  userId: string;
  serviceType: 'strava' | 'garmin';
  authorizationCode: string;
  redirectUri: string;
}

export interface ConnectServiceResponse {
  serviceId: string;
  serviceType: string;
  connected: boolean;
  permissions: ServicePermissions;
}

export class ConnectServiceUseCase implements UseCase<
  ConnectServiceRequest,
  ConnectServiceResponse
> {
  constructor(
    private serviceRepository: ConnectedServiceRepository,
    private integrationClients: Map<string, IntegrationClient>,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: ConnectServiceRequest,
  ): Promise<Result<ConnectServiceResponse>> {
    // 1. Get appropriate integration client
    const client = this.integrationClients.get(request.serviceType);
    if (!client) {
      return Result.fail(new Error(`Unsupported service type: ${request.serviceType}`));
    }

    // 2. Exchange authorization code for access token
    const tokenResult = await client.exchangeAuthCode(
      request.authorizationCode,
      request.redirectUri,
    );

    if (tokenResult.isFailure) {
      return Result.fail(new Error(`OAuth exchange failed: ${tokenResult.error}`));
    }

    const tokens = tokenResult.value;

    // 3. Get user profile from service
    const profileResult = await client.getUserProfile(tokens.accessToken);
    if (profileResult.isFailure) {
      return Result.fail(
        new Error(`Failed to get user profile: ${profileResult.error}`),
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
    await this.eventBus.publish({
      type: 'ServiceConnected',
      userId: request.userId,
      serviceId: service.id,
      serviceType: request.serviceType,
      timestamp: new Date(),
    });

    return Result.ok({
      serviceId: service.id,
      serviceType: service.serviceType,
      connected: true,
      permissions: service.permissions,
    });
  }
}
