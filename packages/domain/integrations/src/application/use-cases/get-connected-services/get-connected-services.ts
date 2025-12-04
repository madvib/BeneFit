import { Result, UseCase } from '@bene/shared-domain';
import { ConnectedServiceRepository } from '../../index.js';

export interface GetConnectedServicesRequest {
  userId: string;
}

export interface GetConnectedServicesResponse {
  services: Array<{
    id: string;
    serviceType: string;
    isActive: boolean;
    isPaused: boolean;
    lastSyncAt?: Date;
    syncStatus: string;
  }>;
}

export class GetConnectedServicesUseCase
  implements UseCase<GetConnectedServicesRequest, GetConnectedServicesResponse>
{
  constructor(private serviceRepository: ConnectedServiceRepository) {}

  async execute(
    request: GetConnectedServicesRequest,
  ): Promise<Result<GetConnectedServicesResponse>> {
    const servicesResult = await this.serviceRepository.findByUserId(request.userId);
    if (servicesResult.isFailure) {
      return Result.fail(servicesResult.error);
    }

    const services = servicesResult.value;

    return Result.ok({
      services: services.map((s) => ({
        id: s.id,
        serviceType: s.serviceType,
        isActive: s.isActive,
        isPaused: s.isPaused,
        lastSyncAt: s.lastSyncAt,
        syncStatus: s.syncStatus.state,
      })),
    });
  }
}
