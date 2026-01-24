import { z } from 'zod';

import {
  CreateCompletedWorkoutSchema,
  type WorkoutPerformance,
  WorkoutPerformanceSchema,
  WorkoutVerificationSchema,
  UserProfileCommands,
  FitnessPlanCommands,
  toCompletedWorkoutView,
  CompletedWorkoutQueries,
  toAchievementView,
  toUserStatsView,
  AchievementView,
  UserStatsView,
  CompletedWorkoutView,
  type CompletedWorkout,
  type Achievement,
  WorkoutType,
} from '@bene/training-core';
import {
  Result, type EventBus,
  BaseUseCase, EntityNotFoundError, UseCaseError, mapZodError
} from '@bene/shared';
import type {
  UserProfileRepository,
  CompletedWorkoutRepository,
  WorkoutSessionRepository,
  FitnessPlanRepository,
} from '../../repositories/index.js';

import { WorkoutCompletedEvent } from '../../events/index.js';

/**
 * Request schema
 */
export const CompleteWorkoutRequestSchema = z.object({
  userId: z.uuid(),
  sessionId: z.uuid(),
  performance: WorkoutPerformanceSchema,
  verification: WorkoutVerificationSchema,
  shareToFeed: z.boolean().optional(),
  title: z.string().min(1).max(200),
});

export type CompleteWorkoutRequest = z.infer<typeof CompleteWorkoutRequestSchema>;

// Response Interface
export interface CompleteWorkoutResponse {
  workout: CompletedWorkoutView;
  newStreak?: number;
  achievementsEarned: AchievementView[];
  stats: Pick<UserStatsView, 'totalWorkouts' | 'totalVolume' | 'totalMinutes'>;
}

export class CompleteWorkoutUseCase extends BaseUseCase<
  CompleteWorkoutRequest,
  CompleteWorkoutResponse
> {
  constructor(
    private sessionRepository: WorkoutSessionRepository,
    private completedWorkoutRepository: CompletedWorkoutRepository,
    private profileRepository: UserProfileRepository,
    private fitnessPlanRepository: FitnessPlanRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
    request: CompleteWorkoutRequest,
  ): Promise<Result<CompleteWorkoutResponse>> {
    // Validate request and coerce types (e.g. string dates -> Date objects)
    const validatedRequest = CompleteWorkoutRequestSchema.parse(request);

    // 1. Load session
    const sessionResult = await this.sessionRepository.findById(validatedRequest.sessionId);
    if (sessionResult.isFailure) {
      return Result.fail(new EntityNotFoundError('WorkoutSession', validatedRequest.sessionId));
    }
    const session = sessionResult.value;

    // Verify ownership
    if (session.ownerId !== validatedRequest.userId) {
      return Result.fail(new UseCaseError('Not authorized to complete this workout', 'UNAUTHORIZED', { sessionId: validatedRequest.sessionId, userId: validatedRequest.userId }));
    }

    if (session.state !== 'in_progress' && session.state !== 'paused') {
      return Result.fail(
        new UseCaseError(`Cannot complete workout in ${ session.state } state`, 'INVALID_STATE', { sessionId: validatedRequest.sessionId, currentState: session.state }),
      );
    }

    // 2. Create CompletedWorkout
    const completedWorkoutParseResult = CreateCompletedWorkoutSchema.safeParse({
      userId: validatedRequest.userId,
      workoutType: session.workoutType as WorkoutType,
      title: validatedRequest.title,
      performance: validatedRequest.performance as WorkoutPerformance,
      verification: validatedRequest.verification,
      planId: session.planId,
      workoutTemplateId: session.workoutTemplateId,
      multiplayerSessionId: session.id,
      isPublic: validatedRequest.shareToFeed ?? false,
    });

    if (!completedWorkoutParseResult.success) {
      return Result.fail(mapZodError(completedWorkoutParseResult.error));
    }
    const completedWorkout = completedWorkoutParseResult.data;

    // 3. Save to repository
    await this.completedWorkoutRepository.save(completedWorkout);

    // 4. Update plan if from a plan
    if (session.planId && session.workoutTemplateId) {
      const planResult = await this.fitnessPlanRepository.findById(session.planId);
      if (planResult.isSuccess) {
        const plan = planResult.value;
        const updatedPlanResult = FitnessPlanCommands.completeWorkout(
          plan,
          session.workoutTemplateId,
          completedWorkout.id,
        );

        if (updatedPlanResult.isSuccess) {
          await this.fitnessPlanRepository.save(updatedPlanResult.value);
        }
      }
    }

    // 5. Update user profile stats
    const profileResult = await this.profileRepository.findById(validatedRequest.userId);
    if (profileResult.isSuccess) {
      const profile = profileResult.value;
      const volume = CompletedWorkoutQueries.getTotalVolume(completedWorkout);

      const updatedProfile = UserProfileCommands.recordWorkoutCompleted(
        profile,
        validatedRequest.performance.completedAt as Date,
        validatedRequest.performance.durationMinutes,
        volume,
      );

      await this.profileRepository.save(updatedProfile);
    }

    // 6. Check for achievements
    const achievements = await this.checkAchievements(validatedRequest.userId, completedWorkout);

    // 7. Clean up session
    await this.sessionRepository.delete(session.id);

    // 8. Emit events
    await this.eventBus.publish(
      new WorkoutCompletedEvent({
        userId: validatedRequest.userId,
        workoutId: completedWorkout.id,
        planId: session.planId,
      }),
    );

    // 9. Get updated stats and return view
    const updatedProfileResult = await this.profileRepository.findById(validatedRequest.userId);
    const stats = updatedProfileResult.isSuccess ? updatedProfileResult.value.stats : null;
    const statsView = stats ? toUserStatsView(stats) : null;

    return Result.ok({
      workout: toCompletedWorkoutView(completedWorkout),
      newStreak: stats?.currentStreak,
      achievementsEarned: achievements,
      stats: statsView
        ? {
          totalWorkouts: statsView.totalWorkouts,
          totalVolume: statsView.totalVolume,
          totalMinutes: statsView.totalMinutes,
        }
        : { totalWorkouts: 0, totalVolume: 0, totalMinutes: 0 },
    });
  }


  private async checkAchievements(userId: string, _workout: CompletedWorkout): Promise<AchievementView[]> {
    const achievements: AchievementView[] = [];
    const profileResult = await this.profileRepository.findById(userId);

    // Simple logic for first workout achievement
    if (profileResult.isSuccess && profileResult.value.stats.totalWorkouts === 1) {
      const achievement: Achievement = {
        id: crypto.randomUUID(),
        type: 'first_workout',
        name: 'First Steps',
        description: 'Completed your first workout!',
        earnedAt: new Date(),
      };
      achievements.push(toAchievementView(achievement));
    }

    return achievements;
  }
}
