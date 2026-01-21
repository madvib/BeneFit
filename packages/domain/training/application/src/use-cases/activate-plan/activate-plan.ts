import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { FitnessPlanCommands } from '@bene/training-core';
import type { FitnessPlanView } from '@bene/training-core';
import { toFitnessPlanView } from '@bene/training-core';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { PlanActivatedEvent } from '../../events/plan-activated.event.js';

// Single request schema with ALL fields
export const ActivatePlanRequestSchema = z.object({
  userId: z.uuid(),
  planId: z.uuid(),
  startDate: z.date().optional(),
});

export type ActivatePlanRequest = z.infer<typeof ActivatePlanRequestSchema>;

export interface ActivatePlanResponse {
  plan: FitnessPlanView;
}

export class ActivatePlanUseCase extends BaseUseCase<
  ActivatePlanRequest,
  ActivatePlanResponse
> {
  constructor(
    private planRepository: FitnessPlanRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(request: ActivatePlanRequest): Promise<Result<ActivatePlanResponse>> {
    // 1. Load plan
    const planResult = await this.planRepository.findById(request.planId);
    if (planResult.isFailure) {
      return Result.fail(new Error('Plan not found'));
    }
    const plan = planResult.value;

    // 2. Verify ownership
    if (plan.userId !== request.userId) {
      return Result.fail(new Error('Not authorized to activate this plan'));
    }

    // 3. Activate plan using functional command
    const activatedPlanResult = FitnessPlanCommands.activatePlan(plan);
    if (activatedPlanResult.isFailure) {
      return Result.fail(new Error(activatedPlanResult.errorMessage));
    }
    const activatedPlan = activatedPlanResult.value;

    // 4. Save
    await this.planRepository.save(activatedPlan);

    // 5. Emit event
    const startDateStr = request.startDate
      ? request.startDate.toISOString()
      : new Date().toISOString();
    await this.eventBus.publish(
      new PlanActivatedEvent({
        userId: request.userId,
        planId: plan.id,
        startDate: startDateStr,
      }),
    );

    // 6. Return full plan view
    return Result.ok({
      plan: toFitnessPlanView(activatedPlan),
    });
  }
}
