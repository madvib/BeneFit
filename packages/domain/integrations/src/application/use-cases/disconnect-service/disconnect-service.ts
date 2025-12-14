import { Result, UseCase } from '@bene/shared-domain';
import { ConnectedServiceCommands } from '@core/index.js';
import { ConnectedServiceRepository } from '../../ports/connected-service-repository.js';
import { EventBus } from '@bene/shared-domain';

export interface DisconnectServiceRequest {
  userId: string;
  serviceId: string;
}

export interface DisconnectServiceResponse {
  serviceId: string;
  disconnected: boolean;
}

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
    await this.eventBus.publish({
      type: 'ServiceDisconnected',
      userId: request.userId,
      serviceId: service.id,
      serviceType: service.serviceType,
      timestamp: new Date(),
    });

    return Result.ok({
      serviceId: request.serviceId,
      disconnected: true,
    });
  }
}
