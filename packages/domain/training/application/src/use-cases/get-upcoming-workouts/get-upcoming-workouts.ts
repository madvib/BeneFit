import { z } from 'zod';
import { FitnessPlanQueries } from '@bene/training-core';
import { Result, BaseUseCase } from '@bene/shared';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';

// Client-facing schema (what comes in the request body)
export const GetUpcomingWorkoutsRequestClientSchema = z.object({
  days: z.number().optional(), // Default to 7
});

export type GetUpcomingWorkoutsRequestClient = z.infer<
  typeof GetUpcomingWorkoutsRequestClientSchema
>;

// Complete use case input schema (client data + server context)
export const GetUpcomingWorkoutsRequestSchema =
  GetUpcomingWorkoutsRequestClientSchema.extend({
    userId: z.string(),
  });

// Zod inferred type with original name
export type GetUpcomingWorkoutsRequest = z.infer<
  typeof GetUpcomingWorkoutsRequestSchema
>;

// Zod schema for response validation
const WorkoutSchema = z.object({
  workoutId: z.string(),
  day: z.string(),
  type: z.string(),
  durationMinutes: z.number(),
  status: z.string(),
});

export const GetUpcomingWorkoutsResponseSchema = z.object({
  workouts: z.array(WorkoutSchema),
});

// Zod inferred type with original name
export type GetUpcomingWorkoutsResponse = z.infer<
  typeof GetUpcomingWorkoutsResponseSchema
>;

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
      workouts: upcomingWorkouts.map((workout) => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNames[workout.dayOfWeek || 0] || 'Unknown';

        return {
          workoutId: workout.id,
          day: dayName,
          type: workout.type,
          status: workout.status,
          durationMinutes:
            (workout.activities as { duration?: number }[]).reduce(
              (sum: number, a) => sum + (a.duration || 10),
              0,
            ) || 30,
        };
      }),
    });
  }
}
