import { z } from 'zod';
import { Result, BaseUseCase, FitnessPlanSchema } from '@bene/shared';
import { FitnessPlanQueries } from '@bene/training-core';
import type { Injury } from '@bene/training-core';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';

export const GetCurrentPlanRequestSchema = z.object({
  userId: z.string(),
});

export type GetCurrentPlanRequest = z.infer<typeof GetCurrentPlanRequestSchema>;

export const GetCurrentPlanResponseSchema = z.object({
  hasPlan: z.boolean(),
  plan: FitnessPlanSchema.optional(),
  message: z.string().optional(),
});

export type GetCurrentPlanResponse = z.infer<typeof GetCurrentPlanResponseSchema>;

export class GetCurrentPlanUseCase extends BaseUseCase<
  GetCurrentPlanRequest,
  GetCurrentPlanResponse
> {
  constructor(private planRepository: FitnessPlanRepository) {
    super();
  }

  protected async performExecution(
    request: GetCurrentPlanRequest,
  ): Promise<Result<GetCurrentPlanResponse>> {
    // 1. Find active plan
    const planResult = await this.planRepository.findActiveByUserId(request.userId);

    if (planResult.isFailure) {
      // Log explicitly why we failed finding a plan - this addresses the user's specific concern about disappearing plans
      console.log(`[GetCurrentPlan] No active plan found for user ${ request.userId }. Reason: ${ planResult.error }`);

      return Result.ok({
        hasPlan: false,
        message: 'No active plan. Create a plan to get started!',
      });
    }

    const plan = planResult.value;
    console.log(`[GetCurrentPlan] Found active plan ${ plan.id } for user ${ request.userId }`);

    // 2. Use entity queries to get data - business logic lives in the entity
    const summary = FitnessPlanQueries.getWorkoutSummary(plan);

    // 3. Map weeks to enriched response format
    const weeks = plan.weeks.map((week, index) => ({
      id: week.id,
      weekNumber: index + 1,
      startDate: week.startDate,
      endDate: week.endDate,
      focus: week.focus || `Week ${ index + 1 }`,
      targetWorkouts: week.workouts.length,
      workoutsCompleted: week.workouts.filter(w => w.status === 'completed').length,
      notes: week.notes,
      workouts: week.workouts.map((w) => {
        const duration =
          w.activities?.reduce((sum, a) => sum + (a.duration || 0), 0) || 30;

        return {
          id: w.id,
          type: w.type, // Already a string from WorkoutType
          description: w.description,
          dayOfWeek: w.dayOfWeek || 0,
          status: w.status, // Already matches WorkoutStatus enum
          durationMinutes: duration,
        };
      }),
    }));

    // 4. Return enriched plan details
    return Result.ok({
      hasPlan: true,
      plan: {
        id: plan.id,
        title: plan.title,
        description: plan.description,
        planType: plan.planType,
        durationWeeks: plan.weeks.length,
        currentWeek: plan.currentPosition.week,
        currentPosition: {
          week: plan.currentPosition.week,
          day: plan.currentPosition.day,
        },
        status: plan.status,
        startDate: plan.startDate,
        endDate: plan.endDate,
        startedAt: plan.startDate,
        weeks,
        summary,
        goals: {
          primary: plan.goals.primary,
          secondary: [...plan.goals.secondary],
          targetMetrics: {
            ...plan.goals.targetMetrics,
            targetWeights: plan.goals.targetMetrics.targetWeights
              ? [...plan.goals.targetMetrics.targetWeights]
              : undefined,
          },
          targetDate: plan.goals.targetDate ? plan.goals.targetDate.toISOString() : undefined,
        },
        progression: {
          type: plan.progression.type,
          weeklyIncrease: plan.progression.weeklyIncrease,
          deloadWeeks: plan.progression.deloadWeeks ? [...plan.progression.deloadWeeks] : undefined,
          maxIncrease: plan.progression.maxIncrease,
          minIncrease: plan.progression.minIncrease,
          testWeeks: plan.progression.testWeeks ? [...plan.progression.testWeeks] : undefined,
        },
        constraints: {
          availableDays: [...plan.constraints.availableDays],
          preferredTime: plan.constraints.preferredTime,
          maxDuration: plan.constraints.maxDuration,
          location: plan.constraints.location,
          availableEquipment: [...plan.constraints.availableEquipment],
          injuries: plan.constraints.injuries ? plan.constraints.injuries.map((inj: Injury) => ({
            ...inj,
            avoidExercises: [...inj.avoidExercises],
          })) : [],
        },
      },
    });
  }
}
