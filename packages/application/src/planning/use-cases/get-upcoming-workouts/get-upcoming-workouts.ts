import { WorkoutPlanQueries } from '@bene/core/plans/index.js';
import { Result, UseCase } from '@bene/core/shared';
import { WorkoutPlanRepository } from '../../repositories/workout-plan-repository.js';

export interface GetUpcomingWorkoutsRequest {
  userId: string;
  days?: number; // Defaults to 7
}

export interface GetUpcomingWorkoutsResponse {
  workouts: Array<{
    date: Date;
    dayName: string;
    workout?: {
      workoutId: string;
      type: string;
      durationMinutes: number;
      status: string;
    };
    isRestDay: boolean;
  }>;
}

export class GetUpcomingWorkoutsUseCase
  implements UseCase<GetUpcomingWorkoutsRequest, GetUpcomingWorkoutsResponse> {
  constructor(private planRepository: WorkoutPlanRepository) { }

  async execute(
    request: GetUpcomingWorkoutsRequest,
  ): Promise<Result<GetUpcomingWorkoutsResponse>> {
    const planResult = await this.planRepository.findActiveByUserId(request.userId);

    if (planResult.isFailure) {
      return Result.ok({ workouts: [] });
    }

    const plan = planResult.value;
    const days = request.days || 7;
    const workouts = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()] || 'Unknown';

      // Use the new query function to get workout for the specific date
      const workout = WorkoutPlanQueries.getWorkoutForDate(plan, date);

      // Calculate duration from activities if workout exists
      let durationMinutes = 30; // default
      if (workout && workout.activities) {
        durationMinutes = workout.activities.reduce((sum, a) => sum + (a.duration || 10), 0) || 30;
      }

      workouts.push({
        date,
        dayName,
        workout: workout
          ? {
            workoutId: workout.id,
            type: workout.type,
            durationMinutes,
            status: workout.status || 'scheduled',
          }
          : undefined,
        isRestDay: !workout,
      });
    }

    return Result.ok({ workouts });
  }
}
