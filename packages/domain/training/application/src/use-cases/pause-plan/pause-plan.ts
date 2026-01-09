import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { FitnessPlanCommands } from '@bene/training-core';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { PlanPausedEvent } from '../../events/plan-paused.event.js';

// Single request schema with ALL fields
export const PausePlanRequestSchema = z.object({
  // Server context
  userId: z.string(),

  // Client data
  planId: z.string(),
  reason: z.string().optional(),
});

// Zod inferred type with original name
export type PausePlanRequest = z.infer<typeof PausePlanRequestSchema>;


// Zod schema for response validation
export const PausePlanResponseSchema = z.object({
  planId: z.string(),
  status: z.string(),
  pausedAt: z.date(),
});

// Zod inferred type with original name
export type PausePlanResponse = z.infer<typeof PausePlanResponseSchema>;

export class PausePlanUseCase extends BaseUseCase<PausePlanRequest, PausePlanResponse> {
  constructor(
    private planRepository: FitnessPlanRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(request: PausePlanRequest): Promise<Result<PausePlanResponse>> {
    const planResult = await this.planRepository.findById(request.planId);
    if (planResult.isFailure) {
      return Result.fail(new Error('Plan not found'));
    }
    const plan = planResult.value;

    if (plan.userId !== request.userId) {
      return Result.fail(new Error('Not authorized'));
    }

    const pausedPlanResult = FitnessPlanCommands.pausePlan(plan, request.reason);
    if (pausedPlanResult.isFailure) {
      return Result.fail(pausedPlanResult.error);
    }

    const pausedPlan = pausedPlanResult.value;
    await this.planRepository.save(pausedPlan);

    await this.eventBus.publish(
      new PlanPausedEvent({
        userId: request.userId,
        planId: plan.id,
        reason: request.reason,
      }),
    );

    return Result.ok({
      planId: pausedPlan.id,
      status: pausedPlan.status,
      pausedAt: new Date(),
    });
  }
}
