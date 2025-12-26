import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared';
import { FitnessPlanCommands, FitnessPlanQueries } from '@bene/training-core';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { PlanActivatedEvent } from '../../events/plan-activated.event.js';

// Client-facing schema (what comes in the request body)
export const ActivatePlanRequestClientSchema = z.object({
  planId: z.string(),
  startDate: z.date().optional(), // Defaults to today
});

export type ActivatePlanRequestClient = z.infer<typeof ActivatePlanRequestClientSchema>;

// Complete use case input schema (client data + server context)
export const ActivatePlanRequestSchema = ActivatePlanRequestClientSchema.extend({
  userId: z.string(),
});

// Zod inferred type with original name
export type ActivatePlanRequest = z.infer<typeof ActivatePlanRequestSchema>;

// Zod schema for response validation
export const ActivatePlanResponseSchema = z.object({
  planId: z.string(),
  status: z.string(),
  startDate: z.date(),
  todaysWorkout: z
    .object({
      workoutId: z.string(),
      type: z.string(),
      durationMinutes: z.number(),
    })
    .optional(),
});

// Zod inferred type with original name
export type ActivatePlanResponse = z.infer<typeof ActivatePlanResponseSchema>;

export class ActivatePlanUseCase implements UseCase<
  ActivatePlanRequest,
  ActivatePlanResponse
> {
  constructor(
    private planRepository: FitnessPlanRepository,
    private eventBus: EventBus,
  ) {}

  async execute(request: ActivatePlanRequest): Promise<Result<ActivatePlanResponse>> {
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
    const startDate = request.startDate || new Date();
    await this.eventBus.publish(
      new PlanActivatedEvent({
        userId: request.userId,
        planId: plan.id,
        startDate,
      }),
    );

    // 6. Get today's workout if available using functional query
    const todaysWorkout = FitnessPlanQueries.getCurrentWorkout(activatedPlan);

    return Result.ok({
      planId: activatedPlan.id,
      status: activatedPlan.status,
      startDate: startDate,
      todaysWorkout: todaysWorkout
        ? {
            workoutId: todaysWorkout.id,
            type: todaysWorkout.type,
            durationMinutes:
              (todaysWorkout.activities as { duration?: number }[]).reduce(
                (sum: number, a) => sum + (a.duration || 10),
                0,
              ) || 30,
          }
        : undefined,
    });
  }
}

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use ActivatePlanResponse type instead */
export interface ActivatePlanResponse_Deprecated {
  planId: string;
  status: string;
  startDate: Date;
  todaysWorkout?: {
    workoutId: string;
    type: string;
    durationMinutes: number;
  };
}

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use ActivatePlanRequest type instead */
export interface ActivatePlanRequest_Deprecated {
  userId: string;
  planId: string;
  startDate?: Date; // Defaults to today
}
