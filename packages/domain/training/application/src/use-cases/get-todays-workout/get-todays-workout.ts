import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { FitnessPlanQueries, toWorkoutTemplateView } from '@bene/training-core';
import type { WorkoutTemplateView } from '@bene/training-core';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
export const GetTodaysWorkoutRequestSchema = z.object({
  userId: z.uuid(),
});

export type GetTodaysWorkoutRequest = z.infer<typeof GetTodaysWorkoutRequestSchema>;

export interface GetTodaysWorkoutResponse {
  hasWorkout: boolean;
  workout?: WorkoutTemplateView;
  message?: string;
}


export class GetTodaysWorkoutUseCase extends BaseUseCase<
  GetTodaysWorkoutRequest,
  GetTodaysWorkoutResponse
> {
  constructor(private planRepository: FitnessPlanRepository) {
    super();
  }

  protected async performExecution(
    request: GetTodaysWorkoutRequest,
  ): Promise<Result<GetTodaysWorkoutResponse>> {
    // 1. Find active plan
    const planResult = await this.planRepository.findActiveByUserId(request.userId);

    if (planResult.isFailure) {
      return Result.ok({
        hasWorkout: false,
        message: 'No active plan. Create a plan to get started!',
      });
    }

    const plan = planResult.value;

    // 2. Get today's workout using functional query
    const todaysWorkout = FitnessPlanQueries.getCurrentWorkout(plan);

    if (!todaysWorkout) {
      return Result.ok({
        hasWorkout: false,
        message: 'Rest day! Enjoy your recovery.',
      });
    }

    // 3. Check if already completed
    if (todaysWorkout.status === 'completed') {
      return Result.ok({
        hasWorkout: false,
        message: "Already completed today's workout! Great job!",
      });
    }

    // 4. Return workout details
    return Result.ok({
      hasWorkout: true,
      workout: toWorkoutTemplateView(todaysWorkout),
    });
  }
}
