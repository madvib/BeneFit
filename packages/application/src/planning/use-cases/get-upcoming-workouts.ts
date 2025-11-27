import { Result } from '@bene/core/shared';
import { UseCase } from '../../shared/use-case';
import { WorkoutPlan, WorkoutPlanQueries } from '@bene/core/plans';
import { WorkoutTemplate } from '@bene/core/plans';
import { WorkoutPlanRepository } from '../repositories/workout-plan-repository';

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
  implements UseCase<GetUpcomingWorkoutsRequest, GetUpcomingWorkoutsResponse>
{
  constructor(private planRepository: WorkoutPlanRepository) {}

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

      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];

      // Use the new query function to get workout for the specific date
      const workout = WorkoutPlanQueries.getWorkoutForDate(plan, date);

      workouts.push({
        date,
        dayName,
        workout: workout
          ? {
              workoutId: workout.id,
              type: workout.type,
              durationMinutes: workout.duration || 30,
              status: workout.status || 'scheduled',
            }
          : undefined,
        isRestDay: !workout,
      });
    }

    return Result.ok({ workouts });
  }
}