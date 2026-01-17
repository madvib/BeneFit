import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { ConnectedServiceRepository } from '@app/index.js';

// Deprecated original interface - preserve for potential rollback


// Zod schema for request validation
export const GetConnectedServicesRequestSchema = z.object({
  userId: z.string(),
});

// Zod inferred type with original name
export type GetConnectedServicesRequest = z.infer<
  typeof GetConnectedServicesRequestSchema
>;

// Response-only DTO schemas (not shared - specific to this use case)
const ServiceSchema = z.object({
  id: z.string(),
  serviceType: z.string().min(1).max(50),
  isActive: z.boolean(),
  isPaused: z.boolean(),
  lastSyncAt: z.date().optional(),
  syncStatus: z.string().min(1).max(50),
});

export const GetConnectedServicesResponseSchema = z.object({
  services: z.array(ServiceSchema),
});

// Zod inferred type with original name
export type GetConnectedServicesResponse = z.infer<
  typeof GetConnectedServicesResponseSchema
>;

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

    return Result.ok({
      services: services.map((s) => ({
        id: s.id,
        serviceType: s.serviceType,
        isActive: s.isActive,
        isPaused: s.isPaused,
        lastSyncAt: s.lastSyncAt,
        syncStatus: s.syncStatus?.state || 'idle',
      })),
    });
  }
}
