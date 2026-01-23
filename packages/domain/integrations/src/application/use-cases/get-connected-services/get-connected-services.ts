import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { toConnectedServiceView, type ConnectedServiceView } from '@/core/index.js';
import { ConnectedServiceRepository } from '@/application/index.js';

/**
 * Input schema
 */
export const GetConnectedServicesRequestSchema = z.object({
  userId: z.uuid(),
});

export type GetConnectedServicesRequest = z.infer<
  typeof GetConnectedServicesRequestSchema
>;

/**
 * Response type - array of domain views
 */
export type GetConnectedServicesResponse = {
  services: ConnectedServiceView[];
};

export class GetConnectedServicesUseCase extends BaseUseCase<
  GetConnectedServicesRequest,
  GetConnectedServicesResponse
> {
  constructor(private serviceRepository: ConnectedServiceRepository) {
    super();
  }

  protected async performExecution(
    request: GetConnectedServicesRequest,
  ): Promise<Result<GetConnectedServicesResponse>> {
    const servicesResult = await this.serviceRepository.findByUserId(request.userId);
    if (servicesResult.isFailure) {
      return Result.fail(servicesResult.error);
    }

    const services = servicesResult.value;

    // Map all services to views
    return Result.ok({
      services: services.map(toConnectedServiceView),
    });
  }
}
