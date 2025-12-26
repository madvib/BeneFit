import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared';
import { PlanGoals, UserProfile } from '@bene/training-core';
import {
  FitnessPlanRepository,
  UserProfileRepository,
} from '../../repositories/index.js';
import {
  AIPlanGenerator,
  GeneratePlanInput,
} from '../../services/ai-plan-generator.js';
import { PlanGoalsSchema } from '../../schemas/index.js';
import { PlanGeneratedEvent } from '../../events/plan-generated.event.js';
import { toDomainPlanGoals } from '../../utils/type-converters.js';

// Client-facing schema (what comes in the request body)
export const GeneratePlanFromGoalsRequestClientSchema = z.object({
  goals: PlanGoalsSchema,
  customInstructions: z.string().optional(), // "I want more cardio", "Focus on upper body", etc.
});

export type GeneratePlanFromGoalsRequestClient = z.infer<
  typeof GeneratePlanFromGoalsRequestClientSchema
>;

// Complete use case input schema (client data + server context)
export const GeneratePlanFromGoalsRequestSchema =
  GeneratePlanFromGoalsRequestClientSchema.extend({
    userId: z.string(),
  });

// Zod inferred type with original name
export type GeneratePlanFromGoalsRequest = z.infer<
  typeof GeneratePlanFromGoalsRequestSchema
>;

// Zod schema for response validation
const WorkoutPreviewSchema = z.object({
  day: z.string(),
  type: z.string(),
  summary: z.string(),
});

const PreviewSchema = z.object({
  weekNumber: z.number(),
  workouts: z.array(WorkoutPreviewSchema),
});

export const GeneratePlanFromGoalsResponseSchema = z.object({
  planId: z.string(),
  name: z.string(),
  durationWeeks: z.number(),
  workoutsPerWeek: z.number(),
  preview: PreviewSchema,
});

// Zod inferred type with original name
export type GeneratePlanFromGoalsResponse = z.infer<
  typeof GeneratePlanFromGoalsResponseSchema
>;

export class GeneratePlanFromGoalsUseCase implements UseCase<
  GeneratePlanFromGoalsRequest,
  GeneratePlanFromGoalsResponse
> {
  constructor(
    private planRepository: FitnessPlanRepository,
    private profileRepository: UserProfileRepository,
    private aiGenerator: AIPlanGenerator,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: GeneratePlanFromGoalsRequest,
  ): Promise<Result<GeneratePlanFromGoalsResponse>> {
    // 1. Load user profile for context
    const profileResult = await this.profileRepository.findById(request.userId);
    if (profileResult.isFailure) {
      return Result.fail(new Error('User profile not found'));
    }
    const profile = profileResult.value as UserProfile;

    // 2. Validate user has no active plan
    const activePlanResult = await this.planRepository.findActiveByUserId(
      request.userId,
    );
    if (activePlanResult.isSuccess) {
      return Result.fail(
        new Error('User already has an active plan. Pause or abandon it first.'),
      );
    }

    // 3. Generate plan using AI
    const planInput: GeneratePlanInput = {
      goals: toDomainPlanGoals(request.goals),
      constraints: profile.trainingConstraints || {
        equipment: [],
        injuries: [],
        timeConstraints: [],
      },
      experienceLevel: profile.experienceProfile?.level || 'beginner',
      customInstructions: request.customInstructions,
    };

    const planResult = await this.aiGenerator.generatePlan(planInput);

    if (planResult.isFailure) {
      return Result.fail(new Error(`Failed to generate plan: ${planResult.error}`));
    }
    const plan = planResult.value;

    // 4. Save plan (in draft state)
    const saveResult = await this.planRepository.save(plan);
    if (saveResult.isFailure) {
      return Result.fail(new Error(`Failed to save plan: ${saveResult.error}`));
    }

    // 5. Emit event
    await this.eventBus.publish(
      new PlanGeneratedEvent({
        userId: request.userId,
        planId: plan.id,
        goals: toDomainPlanGoals(request.goals),
      }),
    );

    // 6. Return DTO with preview
    const firstWeek = plan.weeks[0] || { workouts: [] };

    return Result.ok({
      planId: plan.id,
      name: plan.title,
      durationWeeks: plan.weeks.length,
      workoutsPerWeek: plan.weeks[0]?.workouts.length || 0,
      preview: {
        weekNumber: 1,
        workouts: firstWeek.workouts.map((w) => {
          // Calculate duration from activities
          const duration =
            (w.activities as { duration?: number }[])?.reduce(
              (sum: number, a) => sum + (a.duration || 10),
              0,
            ) || 30;
          return {
            day:
              ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][w.dayOfWeek || 0] ||
              'Unknown',
            type: w.type,
            summary: `${w.type} workout - ${duration} minutes`,
          };
        }),
      },
    });
  }
}

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use GeneratePlanFromGoalsRequest type instead */
export interface GeneratePlanFromGoalsRequest_Deprecated {
  userId: string;
  goals: PlanGoals;
  customInstructions?: string; // "I want more cardio", "Focus on upper body", etc.
}

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use GeneratePlanFromGoalsResponse type instead */
export interface GeneratePlanFromGoalsResponse_Deprecated {
  planId: string;
  name: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  preview: {
    weekNumber: number;
    workouts: Array<{
      day: string;
      type: string;
      summary: string;
    }>;
  };
}
