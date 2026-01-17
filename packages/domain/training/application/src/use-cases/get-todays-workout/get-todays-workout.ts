import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { FitnessPlanQueries } from '@bene/training-core';
// TODO: Create DailyWorkoutSchema in training-core
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
export const GetTodaysWorkoutRequestSchema = z.object({
  userId: z.string(),
});

export type GetTodaysWorkoutRequest = z.infer<typeof GetTodaysWorkoutRequestSchema>;

export const GetTodaysWorkoutResponseSchema = z.object({
  hasWorkout: z.boolean(),
  workout: z.object({
    workoutId: z.string(),
    planId: z.string(),
    type: z.string().min(1).max(50),
    description: z.string().min(1).max(500).optional(),
    durationMinutes: z.number().int().min(1).max(480),
    activities: z.array(z.object({
      type: z.enum(['warmup', 'main', 'cooldown']),
      instructions: z.string().min(1).max(1000),
      durationMinutes: z.number().int().min(1).max(120),
    })),
  }).optional(),
  message: z.string().min(1).max(200).optional(), // "Rest day!" or "No active plan"
});

// Zod inferred type with original name
export type GetTodaysWorkoutResponse = z.infer<typeof GetTodaysWorkoutResponseSchema>;


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
        description: todaysWorkout.description,
        durationMinutes: totalDuration,
        activities,
      },
    });
  }
}
