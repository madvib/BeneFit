import { Result, UseCase } from '@bene/shared-domain';
import type { EventBus } from '@bene/shared-domain';
import { WorkoutPlanRepository } from '../../repositories/workout-plan-repository.js';
import {
  AIPlanGenerator,
  GeneratePlanInput,
} from '../../services/ai-plan-generator.js';
import { PlanGoals, UserProfile } from '@bene/training-core';
import { UserProfileRepository } from 'src/repositories/user-profile-repository.js';

export interface GeneratePlanFromGoalsRequest {
  userId: string;
  goals: PlanGoals;
  customInstructions?: string; // "I want more cardio", "Focus on upper body", etc.
}

export interface GeneratePlanFromGoalsResponse {
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

export class GeneratePlanFromGoalsUseCase
  implements UseCase<GeneratePlanFromGoalsRequest, GeneratePlanFromGoalsResponse>
{
  constructor(
    private planRepository: WorkoutPlanRepository,
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
      goals: request.goals,
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
    await this.eventBus.publish({
      type: 'PlanGenerated',
      userId: request.userId,
      planId: plan.id,
      goals: request.goals,
      timestamp: new Date(),
    });

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
