import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared';
import { ConnectedServiceCommands } from '@core/index.js';
import { ConnectedServiceRepository } from '@app/ports/connected-service-repository.js';
import { ServiceDisconnectedEvent } from '@app/events/service-disconnected.event.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use DisconnectServiceRequest type instead */
export interface DisconnectServiceRequest_Deprecated {
  userId: string;
  serviceId: string;
}

// Client-facing schema (what comes in the request body)
export const DisconnectServiceRequestClientSchema = z.object({
  serviceId: z.string(),
});

export type DisconnectServiceRequestClient = z.infer<
  typeof DisconnectServiceRequestClientSchema
>;

// Complete use case input schema (client data + server context)
export const DisconnectServiceRequestSchema =
  DisconnectServiceRequestClientSchema.extend({
    userId: z.string(),
  });

// Zod inferred type with original name
export type DisconnectServiceRequest = z.infer<typeof DisconnectServiceRequestSchema>;

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use DisconnectServiceResponse type instead */
export interface DisconnectServiceResponse_Deprecated {
  serviceId: string;
  disconnected: boolean;
}

// Zod schema for response validation
export const DisconnectServiceResponseSchema = z.object({
  serviceId: z.string(),
  disconnected: z.boolean(),
});

// Zod inferred type with original name
export type DisconnectServiceResponse = z.infer<typeof DisconnectServiceResponseSchema>;

export class DisconnectServiceUseCase implements UseCase<
  DisconnectServiceRequest,
  DisconnectServiceResponse
> {
  constructor(
    private serviceRepository: ConnectedServiceRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: DisconnectServiceRequest,
  ): Promise<Result<DisconnectServiceResponse>> {
    // 1. Load service
    const serviceResult = await this.serviceRepository.findById(request.serviceId);
    if (serviceResult.isFailure) {
      return Result.fail(serviceResult.error);
    }

    const service = serviceResult.value;

    // 2. Verify ownership
    if (service.userId !== request.userId) {
      return Result.fail(new Error('Not authorized'));
    }

    // 3. Disconnect
    const disconnectedService = ConnectedServiceCommands.disconnectService(service);

    // 4. Save
    await this.serviceRepository.save(disconnectedService);

    // 5. Emit event
    await this.eventBus.publish(
      new ServiceDisconnectedEvent({
        userId: request.userId,
        serviceId: service.id,
        serviceType: service.serviceType,
      }),
    );

    return Result.ok({
      serviceId: request.serviceId,
      disconnected: true,
    });
  }
}
