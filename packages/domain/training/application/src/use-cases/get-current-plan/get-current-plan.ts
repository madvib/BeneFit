import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
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
  plan: FitnessPlanView;
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
      console.log(`[GetCurrentPlan] No active plan found for user ${ request.userId }. Reason: ${ planResult.error }`);
      return Result.fail(new Error('No active plan found'));
    }

    const plan = planResult.value;
    console.log(`[GetCurrentPlan] Found active plan ${ plan.id } for user ${ request.userId }`);

    // 2. Convert to view model
    return Result.ok({
      plan: toFitnessPlanView(plan),
    });
  }
}
