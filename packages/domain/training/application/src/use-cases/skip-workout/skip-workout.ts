import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { WorkoutTemplateCommands } from '@bene/training-core';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { WorkoutSkippedEvent } from '../../events/workout-skipped.event.js';



// Single request schema with ALL fields
export const SkipWorkoutRequestSchema = z.object({
  // Server context
  userId: z.string(),

  // Client data
  planId: z.string(),
  workoutId: z.string(),
  reason: z.string(),
});

// Zod inferred type with original name
export type SkipWorkoutRequest = z.infer<typeof SkipWorkoutRequestSchema>;



// Zod schema for response validation
export const SkipWorkoutResponseSchema = z.object({
  planId: z.string(),
  skippedWorkoutId: z.string(),
  message: z.string(),
});

// Zod inferred type with original name
export type SkipWorkoutResponse = z.infer<typeof SkipWorkoutResponseSchema>;

export class SkipWorkoutUseCase extends BaseUseCase<
  SkipWorkoutRequest,
  SkipWorkoutResponse
> {
  constructor(
    private planRepository: FitnessPlanRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(request: SkipWorkoutRequest): Promise<Result<SkipWorkoutResponse>> {
    // 1. Load plan
    const planResult = await this.planRepository.findById(request.planId);
    if (planResult.isFailure) {
      return Result.fail(new Error('Plan not found'));
    }
    const plan = planResult.value;

    if (plan.userId !== request.userId) {
      return Result.fail(new Error('Not authorized'));
    }

    // 2. Find the workout in the plan
    let workoutFound = false;
    let updatedPlan = plan;

    const weeks = plan.weeks || [];
    for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
      const week = weeks[weekIndex];
      if (!week) continue;

      const workouts = week.workouts || [];
      const workoutIndex = workouts.findIndex((w) => w.id === request.workoutId);

      if (workoutIndex !== -1) {
        const workout = workouts[workoutIndex];
        if (!workout) continue;

        // Skip the workout using the command
        const skippedWorkoutResult = WorkoutTemplateCommands.skipWorkout(
          workout,
          request.reason,
        );
        if (skippedWorkoutResult.isFailure) {
          return Result.fail(skippedWorkoutResult.error);
        }

        // Update the plan with the skipped workout
        const updatedWorkouts = [
          ...workouts.slice(0, workoutIndex),
          skippedWorkoutResult.value,
          ...workouts.slice(workoutIndex + 1),
        ];

        const updatedWeek = {
          ...week,
          workouts: updatedWorkouts,
        };

        const updatedWeeks = [
          ...weeks.slice(0, weekIndex),
          updatedWeek,
          ...weeks.slice(weekIndex + 1),
        ];

        updatedPlan = {
          ...plan,
          weeks: updatedWeeks,
          updatedAt: new Date(),
        };

        workoutFound = true;
        break;
      }
    }

    if (!workoutFound) {
      return Result.fail(new Error('Workout not found in plan'));
    }

    // 3. Save
    await this.planRepository.save(updatedPlan);

    // 4. Emit event (for AI coach to potentially respond)
    await this.eventBus.publish(
      new WorkoutSkippedEvent({
        userId: request.userId,
        planId: request.planId,
        workoutId: request.workoutId,
        reason: request.reason,
      }),
    );

    return Result.ok({
      planId: plan.id,
      skippedWorkoutId: request.workoutId,
      message: 'Workout skipped. Your coach may adjust your plan.',
    });
  }
}
