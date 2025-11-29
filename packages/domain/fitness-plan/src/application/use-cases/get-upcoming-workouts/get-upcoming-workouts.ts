import { WorkoutPlanQueries } from '@core/index.js';
import { Result, UseCase } from '@bene/domain-shared';
import { WorkoutPlanRepository } from '../../repositories/workout-plan-repository.js';

export interface GetUpcomingWorkoutsRequest {
  userId: string;
  days?: number; // Default to 7
}

export interface GetUpcomingWorkoutsResponse {
  workouts: Array<{
    workoutId: string;
    day: string;
    type: string;
    durationMinutes: number;
    status: string;
  }>;
}

export class GetUpcomingWorkoutsUseCase
  implements UseCase<GetUpcomingWorkoutsRequest, GetUpcomingWorkoutsResponse>
{
  constructor(private planRepository: WorkoutPlanRepository) {}

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
      const upcomingWorkouts = WorkoutPlanQueries.getUpcomingWorkouts(
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
            workout.activities.reduce((sum: number, a: any) => sum + (a.duration || 10), 0) || 30,
        };
      }),
    });
  }
}
