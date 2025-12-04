import { Result, UseCase } from '@bene/shared-domain';
import { WorkoutPlanRepository } from '../../repositories/workout-plan-repository.js';
import { WorkoutPlanQueries } from '@bene/training-core';

export interface GetTodaysWorkoutRequest {
  userId: string;
}

export interface GetTodaysWorkoutResponse {
  hasWorkout: boolean;
  workout?: {
    workoutId: string;
    planId: string;
    type: string;
    durationMinutes: number;
    activities: Array<{
      type: 'warmup' | 'main' | 'cooldown';
      instructions: string;
      durationMinutes: number;
    }>;
  };
  message?: string; // "Rest day!" or "No active plan"
}

export class GetTodaysWorkoutUseCase
  implements UseCase<GetTodaysWorkoutRequest, GetTodaysWorkoutResponse>
{
  constructor(private planRepository: WorkoutPlanRepository) {}

  async execute(
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
    const todaysWorkout = WorkoutPlanQueries.getCurrentWorkout(plan);

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
    const activities =
      todaysWorkout.activities?.map((a) => {
        // Handle the case where a.instructions could be an array or a string
        let instructionsText = '';
        if (Array.isArray(a.instructions)) {
          instructionsText = a.instructions.join('. ');
        } else if (typeof a.instructions === 'string') {
          instructionsText = a.instructions;
        }
        return {
          type: (a.type as 'warmup' | 'main' | 'cooldown') || 'main',
          instructions: instructionsText,
          durationMinutes: a.duration || 10,
        };
      }) || [];

    const totalDuration =
      activities.reduce(
        (sum: number, a: { durationMinutes: number }) => sum + a.durationMinutes,
        0,
      ) || 30;

    return Result.ok({
      hasWorkout: true,
      workout: {
        workoutId: todaysWorkout.id,
        planId: plan.id,
        type: todaysWorkout.type,
        durationMinutes: totalDuration,
        activities,
      },
    });
  }
}
