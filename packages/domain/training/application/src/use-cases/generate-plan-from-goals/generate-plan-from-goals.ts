import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { UserProfile, TrainingConstraints, PlanGoalsSchema, FitnessPlanQueries, type PlanPreview } from '@bene/training-core';
import {
  FitnessPlanRepository,
  UserProfileRepository,
} from '../../repositories/index.js';
import {
  AIPlanGenerator,
  GeneratePlanInput,
} from '../../services/ai-plan-generator.js';
import { PlanGeneratedEvent } from '../../events/plan-generated.event.js';

// Helper function to convert from schema format to domain format (pass-through for now)
const toDomainPlanGoals = (goals: z.infer<typeof PlanGoalsSchema>) => goals;



// Single request schema with ALL fields
export const GeneratePlanFromGoalsRequestSchema = z.object({
  // Server context
  userId: z.string(),

  // Client data
  goals: PlanGoalsSchema,
  customInstructions: z.string().optional(),
});

// Zod inferred type with original name
export type GeneratePlanFromGoalsRequest = z.infer<
  typeof GeneratePlanFromGoalsRequestSchema
>;

// Response Interface using domain types
export interface GeneratePlanFromGoalsResponse {
  planId: string;
  name: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  preview: PlanPreview;
}

export class GeneratePlanFromGoalsUseCase extends BaseUseCase<
  GeneratePlanFromGoalsRequest,
  GeneratePlanFromGoalsResponse
> {
  constructor(
    private planRepository: FitnessPlanRepository,
    private profileRepository: UserProfileRepository,
    private aiGenerator: AIPlanGenerator,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
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
      userId: request.userId,
      goals: toDomainPlanGoals(request.goals),
      constraints: profile.trainingConstraints || {
        availableDays: [],
        availableEquipment: [],
        location: 'home',
        maxDuration: 60,
        injuries: [],
      } as TrainingConstraints,
      experienceLevel: profile.experienceProfile?.level || 'beginner',
      customInstructions: request.customInstructions,
    };

    const planResult = await this.aiGenerator.generatePlan(planInput);

    if (planResult.isFailure) {
      return Result.fail(new Error(`Failed to generate plan: ${ planResult.error }`));
    }
    const plan = planResult.value;

    // 4. Save plan (in draft state)
    const saveResult = await this.planRepository.save(plan);
    if (saveResult.isFailure) {
      return Result.fail(new Error(`Failed to save plan: ${ saveResult.error }`));
    }

    // 5. Emit event
    await this.eventBus.publish(
      new PlanGeneratedEvent({
        userId: request.userId,
        planId: plan.id,
        goals: toDomainPlanGoals(request.goals),
      }),
    );

    // 6. Return DTO with preview from domain query
    return Result.ok({
      planId: plan.id,
      name: plan.title,
      durationWeeks: plan.weeks.length,
      workoutsPerWeek: plan.weeks[0]?.workouts.length || 0,
      preview: FitnessPlanQueries.getPlanPreview(plan),
    });
  }
}
