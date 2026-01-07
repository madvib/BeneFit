import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { FitnessPlanQueries } from '@bene/training-core';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';

export const GetCurrentPlanRequestClientSchema = z.object({});

export type GetCurrentPlanRequestClient = z.infer<
  typeof GetCurrentPlanRequestClientSchema
>;

export const GetCurrentPlanRequestSchema = z.object({
  userId: z.string(),
});

export type GetCurrentPlanRequest = z.infer<typeof GetCurrentPlanRequestSchema>;

const WorkoutSummarySchema = z.object({
  id: z.string(),
  type: z.string(), // WorkoutType from domain
  dayOfWeek: z.number(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'skipped', 'rescheduled']), // Matches WorkoutStatus
  durationMinutes: z.number().optional(),
});

const WeekSchema = z.object({
  weekNumber: z.number(),
  workouts: z.array(WorkoutSummarySchema),
});

const PlanSummarySchema = z.object({
  total: z.number(),
  completed: z.number(),
});

export const GetCurrentPlanResponseSchema = z.object({
  hasPlan: z.boolean(),
  plan: z
    .object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      durationWeeks: z.number(),
      currentWeek: z.number(),
      status: z.enum(['draft', 'active', 'paused', 'completed', 'abandoned']),
      startedAt: z.string().optional(), // ISO date string
      weeks: z.array(WeekSchema),
      summary: PlanSummarySchema,
    })
    .optional(),
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
    const currentWeek = plan.currentPosition.week;
    const summary = FitnessPlanQueries.getWorkoutSummary(plan);

    // 3. Map weeks to response format
    const weeks = plan.weeks.map((week, index) => ({
      weekNumber: index + 1,
      workouts: week.workouts.map((w) => {
        const duration =
          w.activities?.reduce((sum, a) => sum + (a.duration || 0), 0) || 30;

        return {
          id: w.id,
          type: w.type, // Already a string from WorkoutType
          dayOfWeek: w.dayOfWeek || 0,
          status: w.status, // Already matches WorkoutStatus enum
          durationMinutes: duration,
        };
      }),
    }));

    // 4. Return plan details
    return Result.ok({
      hasPlan: true,
      plan: {
        id: plan.id,
        title: plan.title,
        description: plan.description,
        durationWeeks: plan.weeks.length,
        currentWeek,
        status: plan.status,
        startedAt: plan.startDate,
        weeks,
        summary,
      },
    });
  }
}
