import { z } from 'zod';
import { FitnessPlanQueries, toWorkoutTemplateView } from '@bene/training-core';
import type { WorkoutTemplateView } from '@bene/training-core';
import { Result, BaseUseCase } from '@bene/shared';
// TODO: Create UpcomingWorkoutSchema in training-core
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';

// Single request schema with ALL fields
export const GetUpcomingWorkoutsRequestSchema = z.object({
  // Server context
  userId: z.string(),

  // Client data
  days: z.number().optional(), // Default to 7
});

// Zod inferred type with original name
export type GetUpcomingWorkoutsRequest = z.infer<
  typeof GetUpcomingWorkoutsRequestSchema
>;

export interface GetUpcomingWorkoutsResponse {
  workouts: WorkoutTemplateView[];
}


export class GetUpcomingWorkoutsUseCase extends BaseUseCase<
  GetUpcomingWorkoutsRequest,
  GetUpcomingWorkoutsResponse
> {
  constructor(private planRepository: FitnessPlanRepository) {
    super();
  }

  protected async performExecution(
    request: GetUpcomingWorkoutsRequest,
  ): Promise<Result<GetUpcomingWorkoutsResponse>> {
    // 1. Find active plan
    const planResult = await this.planRepository.findActiveByUserId(request.userId);

    if (planResult.isFailure) {
      return Result.ok({ workouts: [] });
    }

    const plan = planResult.value;

    // 2. Get upcoming workouts
    const upcomingWorkouts = FitnessPlanQueries.getUpcomingWorkouts(
      plan,
      request.days || 7,
    );

    // 3. Map to DTO
    return Result.ok({
      workouts: upcomingWorkouts.map(toWorkoutTemplateView),
    });
  }
}
