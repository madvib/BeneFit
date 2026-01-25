import { z } from 'zod';
import { Result, BaseUseCase, EntityNotFoundError } from '@bene/shared';
import type { FitnessPlanView } from '@bene/training-core';
import { toFitnessPlanView } from '@bene/training-core';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';

// ============================================
// Request (Zod validation for user input)
// ============================================

export const GetCurrentPlanRequestSchema = z.object({
  userId: z.uuid(),
});

export type GetCurrentPlanRequest = z.infer<typeof GetCurrentPlanRequestSchema>;

// ============================================
// Response (Plain TypeScript)
// ============================================

export interface GetCurrentPlanResponse {
  plan: FitnessPlanView | null;
  hasActivePlan: boolean;
}

// ============================================
// Use Case
// ============================================

export class GetCurrentPlanUseCase extends BaseUseCase<
  GetCurrentPlanRequest,
  GetCurrentPlanResponse
> {
  constructor(private planRepository: FitnessPlanRepository) {
    super();
  }

  protected async performExecution(
    request: GetCurrentPlanRequest,
  ): Promise<Result<GetCurrentPlanResponse>> {
    // 1. Find active plan
    const planResult = await this.planRepository.findActiveByUserId(request.userId);

    if (planResult.isFailure) {
      const error = planResult.error;

      // Only treat "Not Found" as a valid empty state
      // All other errors (DB connection, timeouts, etc.) should fail hard
      if (error instanceof EntityNotFoundError) {
        return Result.ok({
          plan: null,
          hasActivePlan: false,
        });
      }

      return Result.fail(error);
    }

    const plan = planResult.value;

    // 2. Convert to view model
    return Result.ok({
      plan: toFitnessPlanView(plan),
      hasActivePlan: true,
    });
  }
}
