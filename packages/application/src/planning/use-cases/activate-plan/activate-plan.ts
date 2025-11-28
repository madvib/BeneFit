import { EventBus } from '@bene/application/shared/event-bus.js';
import { WorkoutPlanCommands, WorkoutPlanQueries } from '@bene/core/plans/index.js';
import { Result, UseCase } from '@bene/core/shared';
import { WorkoutPlanRepository } from '../../repositories/workout-plan-repository.js';

export interface ActivatePlanRequest {
  userId: string;
  planId: string;
  startDate?: Date; // Defaults to today
}

export interface ActivatePlanResponse {
  planId: string;
  status: string;
  startDate: Date;
  todaysWorkout?: {
    workoutId: string;
    type: string;
    durationMinutes: number;
  };
}

export class ActivatePlanUseCase
  implements UseCase<ActivatePlanRequest, ActivatePlanResponse> {
  constructor(
    private planRepository: WorkoutPlanRepository,
    private eventBus: EventBus,
  ) { }

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
    const activatedPlanResult = WorkoutPlanCommands.activatePlan(plan);
    if (activatedPlanResult.isFailure) {
      return Result.fail(new Error(activatedPlanResult.error));
    }
    const activatedPlan = activatedPlanResult.value;

    // 4. Save
    await this.planRepository.save(activatedPlan);

    // 5. Emit event
    const startDate = request.startDate || new Date();
    await this.eventBus.publish({
      type: 'PlanActivated',
      userId: request.userId,
      planId: plan.id,
      startDate,
      timestamp: new Date(),
    });

    // 6. Get today's workout if available using functional query
    const todaysWorkout = WorkoutPlanQueries.getCurrentWorkout(activatedPlan);

    return Result.ok({
      planId: activatedPlan.id,
      status: activatedPlan.status,
      startDate: startDate,
      todaysWorkout: todaysWorkout
        ? {
          workoutId: todaysWorkout.id,
          type: todaysWorkout.type,
          durationMinutes: todaysWorkout.duration || 30,
        }
        : undefined,
    });
  }
}
