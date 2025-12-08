import { EventBus } from '@bene/shared-domain';
import { Result, UseCase } from '@bene/shared-domain';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { FitnessPlanCommands } from '@bene/training-core';

export interface PausePlanRequest {
  userId: string;
  planId: string;
  reason?: string;
}

export interface PausePlanResponse {
  planId: string;
  status: string;
  pausedAt: Date;
}

export class PausePlanUseCase implements UseCase<PausePlanRequest, PausePlanResponse> {
  constructor(
    private planRepository: FitnessPlanRepository,
    private eventBus: EventBus,
  ) {}

  async execute(request: PausePlanRequest): Promise<Result<PausePlanResponse>> {
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

    await this.eventBus.publish({
      type: 'PlanPaused',
      userId: request.userId,
      planId: plan.id,
      reason: request.reason,
      timestamp: new Date(),
    });

    return Result.ok({
      planId: pausedPlan.id,
      status: pausedPlan.status,
      pausedAt: new Date(),
    });
  }
}
