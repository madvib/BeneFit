import { z } from 'zod';
import { FitnessPlanQueries } from '@bene/training-core';
import { Result, UseCase } from '@bene/shared-domain';
import { FitnessPlanRepository } from '@/repositories/fitness-plan-repository.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use GetUpcomingWorkoutsRequest type instead */
export interface GetUpcomingWorkoutsRequest_Deprecated {
  userId: string;
  days?: number; // Default to 7
}

// Client-facing schema (what comes in the request body)
export const GetUpcomingWorkoutsRequestClientSchema = z.object({
  days: z.number().optional(), // Default to 7
});

export type GetUpcomingWorkoutsRequestClient = z.infer<typeof GetUpcomingWorkoutsRequestClientSchema>;

// Complete use case input schema (client data + server context)
export const GetUpcomingWorkoutsRequestSchema = GetUpcomingWorkoutsRequestClientSchema.extend({
  userId: z.string(),
});

// Zod inferred type with original name
export type GetUpcomingWorkoutsRequest = z.infer<
  typeof GetUpcomingWorkoutsRequestSchema
>;

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use GetUpcomingWorkoutsResponse type instead */
export interface GetUpcomingWorkoutsResponse_Deprecated {
  workouts: Array<{
    workoutId: string;
    day: string;
    type: string;
    durationMinutes: number;
    status: string;
  }>;
}

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

export class GetUpcomingWorkoutsUseCase implements UseCase<
  GetUpcomingWorkoutsRequest,
  GetUpcomingWorkoutsResponse
> {
  constructor(private planRepository: FitnessPlanRepository) {}

  async execute(
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
