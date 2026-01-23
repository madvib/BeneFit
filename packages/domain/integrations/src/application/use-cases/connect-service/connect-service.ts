import { z } from 'zod';
import { Result, type EventBus, BaseUseCase, ValidationError, UseCaseError, mapZodError } from '@bene/shared';
import {
  ServiceTypeSchema,
  CreateConnectedServiceSchema,
  CreateOAuthCredentialsSchema,
  toConnectedServiceView,
  type ConnectedServiceView,
} from '@/core/index.js';
import { ConnectedServiceRepository } from '@/application/ports/connected-service-repository.js';
import { IntegrationClient } from '@/application/ports/integration-client.js';
import { ServiceConnectedEvent } from '@/application/events/service-connected.event.js';

/**
 * Input schema - composes from domain schemas
 */
export const ConnectServiceRequestSchema = z.object({
  userId: z.uuid(),
  serviceType: ServiceTypeSchema, // ✅ Compose from domain schema
  authorizationCode: z.string().min(1),
  redirectUri: z.url(),
});

export type ConnectServiceRequest = z.infer<typeof ConnectServiceRequestSchema>;

/**
 * Response type - uses domain view
 */
export type ConnectServiceResponse = ConnectedServiceView;

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
      return Result.fail(
        new ValidationError(
          `Unsupported service type: ${ request.serviceType }`,
          'UNSUPPORTED_SERVICE',
          { serviceType: request.serviceType }
        )
      );
    }

    // 2. Exchange authorization code for access token
    const tokenResult = await client.exchangeAuthCode(
      request.authorizationCode,
      request.redirectUri,
    );

    if (tokenResult.isFailure) {
      const error = Array.isArray(tokenResult.error) ? tokenResult.error[0] : tokenResult.error;
      return Result.fail(
        new UseCaseError(
          `OAuth exchange failed: ${ error }`,
          'OAUTH_EXCHANGE_FAILED',
          { serviceType: request.serviceType },
          error
        )
      );
    }

    const tokens = tokenResult.value;

    // 3. Get user profile from service
    const profileResult = await client.getUserProfile(tokens.accessToken);
    if (profileResult.isFailure) {
      const error = Array.isArray(profileResult.error) ? profileResult.error[0] : profileResult.error;
      return Result.fail(
        new UseCaseError(
          `Failed to get user profile: ${ error }`,
          'PROFILE_FETCH_FAILED',
          { serviceType: request.serviceType },
          error
        )
      );
    }

    const externalProfile = profileResult.value;

    // 4. Create OAuthCredentials value object
    const credentialsResult = CreateOAuthCredentialsSchema.safeParse({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      scopes: tokens.scopes,
      tokenType: 'Bearer',
    });

    if (!credentialsResult.success) {
      return Result.fail(mapZodError(credentialsResult.error));
    }

    // 5. Create ConnectedService aggregate
    const serviceResult = CreateConnectedServiceSchema.safeParse({
      userId: request.userId,
      serviceType: request.serviceType,
      credentials: credentialsResult.data,
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

    if (!serviceResult.success) {
      return Result.fail(mapZodError(serviceResult.error));
    }

    const service = serviceResult.data;

    // 6. Save to repository
    await this.serviceRepository.save(service);

    // 7. Emit event (triggers initial sync)
    await this.eventBus.publish(
      new ServiceConnectedEvent({
        userId: request.userId,
        serviceId: service.id,
        serviceType: request.serviceType,
      }),
    );

    // 8. Map to view and return
    return Result.ok(toConnectedServiceView(service));
  }
}
