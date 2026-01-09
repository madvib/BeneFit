import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { ConnectedServiceCommands } from '@core/index.js';
import { ConnectedServiceRepository } from '@app/ports/connected-service-repository.js';
import { ServiceDisconnectedEvent } from '@app/events/service-disconnected.event.js';

// Single request schema with ALL fields
export const DisconnectServiceRequestSchema = z.object({
  // Server context
  userId: z.string(),

  // Client data
  serviceId: z.string(),
});

export type DisconnectServiceRequest = z.infer<typeof DisconnectServiceRequestSchema>;

export const DisconnectServiceResponseSchema = z.object({
  serviceId: z.string(),
  disconnected: z.boolean(),
});

// Zod inferred type with original name
export type DisconnectServiceResponse = z.infer<typeof DisconnectServiceResponseSchema>;

export class DisconnectServiceUseCase extends BaseUseCase<
  DisconnectServiceRequest,
  DisconnectServiceResponse
> {
  constructor(
    private serviceRepository: ConnectedServiceRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
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
