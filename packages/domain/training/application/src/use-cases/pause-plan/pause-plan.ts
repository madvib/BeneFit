import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared-domain';
import { FitnessPlanCommands } from '@bene/training-core';
import { FitnessPlanRepository } from '@/repositories/fitness-plan-repository.js';
import { PlanPausedEvent } from '@/events/plan-paused.event.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use PausePlanRequest type instead */
export interface PausePlanRequest_Deprecated {
  userId: string;
  planId: string;
  reason?: string;
}

// Client-facing schema (what comes in the request body)
export const PausePlanRequestClientSchema = z.object({
  planId: z.string(),
  reason: z.string().optional(),
});

export type PausePlanRequestClient = z.infer<typeof PausePlanRequestClientSchema>;

// Complete use case input schema (client data + server context)
export const PausePlanRequestSchema = PausePlanRequestClientSchema.extend({
  userId: z.string(),
});

// Zod inferred type with original name
export type PausePlanRequest = z.infer<typeof PausePlanRequestSchema>;

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use PausePlanResponse type instead */
export interface PausePlanResponse_Deprecated {
  planId: string;
  status: string;
  pausedAt: Date;
}

// Zod schema for response validation
export const PausePlanResponseSchema = z.object({
  planId: z.string(),
  status: z.string(),
  pausedAt: z.date(),
});

// Zod inferred type with original name
export type PausePlanResponse = z.infer<typeof PausePlanResponseSchema>;

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
