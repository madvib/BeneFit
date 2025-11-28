import { Result } from '@bene/core/shared';
import { UseCase } from '../../shared/use-case';
import { ConnectedService, ConnectedServiceCommands } from '@bene/core/integrations';
import { ConnectedServiceRepository } from '../repositories/connected-service-repository';
import { EventBus } from '../../shared/event-bus';

export interface DisconnectServiceRequest {
  userId: string;
  serviceId: string;
}

export interface DisconnectServiceResponse {
  serviceId: string;
  disconnected: boolean;
}

export class DisconnectServiceUseCase
  implements UseCase<DisconnectServiceRequest, DisconnectServiceResponse>
{
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
      return Result.fail('Service not found');
    }

    const service = serviceResult.value;

    // 2. Verify ownership
    if (service.userId !== request.userId) {
      return Result.fail('Not authorized');
    }

    // 3. Disconnect
    const disconnectedService = ConnectedServiceCommands.disconnectService(service);
    const disconnectedResult = Result.ok(disconnectedService); // disconnectService is a pure function, not returning Result

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