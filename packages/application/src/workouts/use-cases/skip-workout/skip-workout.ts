import { Result, UseCase } from '@bene/core/shared';
import type { WorkoutPlanRepository } from '../../../planning/repositories/workout-plan-repository.js';
import type { EventBus } from '../../../shared/event-bus.js';

export interface SkipWorkoutRequest {
  userId: string;
  planId: string;
  workoutId: string;
  reason: string;
}

export interface SkipWorkoutResponse {
  planId: string;
  skippedWorkoutId: string;
  message: string;
}

export class SkipWorkoutUseCase
  implements UseCase<SkipWorkoutRequest, SkipWorkoutResponse> {
  constructor(
    private planRepository: WorkoutPlanRepository,
    private eventBus: EventBus,
  ) { }

  async execute(request: SkipWorkoutRequest): Promise<Result<SkipWorkoutResponse>> {
    // 1. Load plan
    const planResult = await this.planRepository.findById(request.planId);
    if (planResult.isFailure) {
      return Result.fail(new Error('Plan not found'));
    }
    const plan = planResult.value;

    if (plan.userId !== request.userId) {
      return Result.fail(new Error('Not authorized'));
    }

    // 2. Skip workout
    const updatedPlanResult = plan.skipWorkout(request.workoutId, request.reason);
    if (updatedPlanResult.isFailure) {
      return Result.fail(updatedPlanResult.error);
    }

    // 3. Save
    await this.planRepository.save(updatedPlanResult.value);

    // 4. Emit event (for AI coach to potentially respond)
    await this.eventBus.publish({
      type: 'WorkoutSkipped',
      userId: request.userId,
      planId: request.planId,
      workoutId: request.workoutId,
      reason: request.reason,
      timestamp: new Date(),
    });

    return Result.ok({
      planId: plan.id,
      skippedWorkoutId: request.workoutId,
      message: 'Workout skipped. Your coach may adjust your plan.',
    });
  }
}
