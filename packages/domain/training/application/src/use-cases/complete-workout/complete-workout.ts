import { z } from 'zod';
import { Result, type EventBus, BaseUseCase, EntityNotFoundError, UseCaseError } from '@bene/shared';
import {
  createCompletedWorkout,
  type WorkoutPerformance,
  type CompletedWorkout,
  UserProfileCommands,
  WorkoutType,
  FitnessPlanCommands,
} from '@bene/training-core';
import type {
  UserProfileRepository,
  CompletedWorkoutRepository,
  WorkoutSessionRepository,
  FitnessPlanRepository,
} from '../../repositories/index.js';
import {
  WorkoutPerformanceSchema,
  WorkoutVerificationSchema,
  type WorkoutPerformance as WorkoutPerformanceType,
  type WorkoutVerification as WorkoutVerificationType,
} from '@bene/shared';
import { WorkoutCompletedEvent } from '../../events/index.js';
import {
  toDomainWorkoutPerformance,
  toDomainWorkoutVerification,
} from '../../mappers/index.js';

// Single request schema with ALL fields
export const CompleteWorkoutRequestSchema = z.object({
  // Server context
  userId: z.string(),

  // Client data
  sessionId: z.string(),
  performance: WorkoutPerformanceSchema,
  verification: WorkoutVerificationSchema,
  shareToFeed: z.boolean().optional(),
});

export type CompleteWorkoutRequest = {
  userId: string;
  sessionId: string;
  performance: WorkoutPerformanceType;
  verification: WorkoutVerificationType;
  shareToFeed?: boolean;
};



// Zod schema for response validation
const AchievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

const StatsSchema = z.object({
  totalWorkouts: z.number(),
  totalVolume: z.number(),
  totalMinutes: z.number(),
});

export const CompleteWorkoutResponseSchema = z.object({
  workoutId: z.string(),
  // planUpdated: z.boolean(), // commented in original
  newStreak: z.number().optional(),
  achievementsEarned: z.array(AchievementSchema),
  stats: StatsSchema,
});

// Zod inferred type with original name
export type CompleteWorkoutResponse = z.infer<typeof CompleteWorkoutResponseSchema>;

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
    // 1. Load session
    const sessionResult = await this.sessionRepository.findById(request.sessionId);
    if (sessionResult.isFailure) {
      return Result.fail(new EntityNotFoundError('WorkoutSession', request.sessionId));
    }
    const session = sessionResult.value;

    // Verify ownership
    if (session.ownerId !== request.userId) {
      return Result.fail(new UseCaseError('Not authorized to complete this workout', 'UNAUTHORIZED', { sessionId: request.sessionId, userId: request.userId }));
    }

    if (session.state !== 'in_progress' && session.state !== 'paused') {
      return Result.fail(
        new UseCaseError(`Cannot complete workout in ${ session.state } state`, 'INVALID_STATE', { sessionId: request.sessionId, currentState: session.state }),
      );
    }
    // 2. Create CompletedWorkout
    const domainPerformance = toDomainWorkoutPerformance(request.performance);
    const domainVerification = toDomainWorkoutVerification(request.verification);

    const completedWorkoutResult = createCompletedWorkout({
      userId: request.userId,
      workoutType: session.workoutType as WorkoutType,
      performance: domainPerformance,
      verification: domainVerification,
      planId: session.planId,
      workoutTemplateId: session.workoutTemplateId,
      multiplayerSessionId: session.id,
      isPublic: request.shareToFeed ?? false,
    });

    if (completedWorkoutResult.isFailure) {
      return Result.fail(completedWorkoutResult.error);
    }
    const completedWorkout = completedWorkoutResult.value;

    // 3. Save to D1
    await this.completedWorkoutRepository.save(completedWorkout);

    //Circular dependency...perhaps use queues or something
    // 4. Update plan if from a plan
    let planUpdated = false;
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
          planUpdated = true;
        }
      }
    }

    // 5. Update user profile stats
    const profileResult = await this.profileRepository.findById(request.userId);
    if (profileResult.isSuccess) {
      const profile = profileResult.value;
      const volume = this.calculateVolume(domainPerformance);

      const updatedProfile = UserProfileCommands.recordWorkoutCompleted(
        profile,
        new Date(request.performance.completedAt), // Convert string to Date
        request.performance.durationMinutes,
        volume,
      );

      await this.profileRepository.save(updatedProfile);
    }

    // 6. Check for achievements
    const achievements = await this.checkAchievements(request.userId, completedWorkout);

    // 7. Clean up session (mark as completed, keep for replay?)
    await this.sessionRepository.delete(session.id);

    // 8. Emit events
    await this.eventBus.publish(
      new WorkoutCompletedEvent({
        userId: request.userId,
        workoutId: completedWorkout.id,
        planId: session.planId,
      }),
    );

    // 9. Get updated stats
    const updatedProfile = await this.profileRepository.findById(request.userId);
    const stats = updatedProfile.isSuccess ? updatedProfile.value.stats : null;

    return Result.ok({
      workoutId: completedWorkout.id,
      // planUpdated,
      newStreak: stats?.currentStreak,
      achievementsEarned: achievements,
      stats: stats
        ? {
          totalWorkouts: stats.totalWorkouts,
          totalVolume: stats.totalVolume,
          totalMinutes: stats.totalMinutes,
        }
        : { totalWorkouts: 0, totalVolume: 0, totalMinutes: 0 },
    });
  }

  private calculateVolume(performance: WorkoutPerformance): number {
    let volume = 0;
    for (const activity of performance.activities) {
      if (activity.exercises) {
        for (const exercise of activity.exercises) {
          if (exercise.weight && exercise.reps) {
            for (let i = 0; i < exercise.setsCompleted; i++) {
              volume += (exercise.weight[i] || 0) * (exercise.reps[i] || 0);
            }
          }
        }
      }
    }
    return volume;
  }

  private async checkAchievements(userId: string, workout: CompletedWorkout) {
    // Would check various achievement conditions
    const achievements = [];

    // Example: First workout
    const profileResult = await this.profileRepository.findById(userId);
    if (profileResult.isSuccess && profileResult.value.stats.totalWorkouts === 1) {
      achievements.push({
        id: 'first_workout',
        name: 'First Steps',
        description: 'Completed your first workout!',
      });
    }

    // Use the workout parameter (example: check workout type for achievements)
    if (workout.workoutType === 'cardio') {
    }

    return achievements;
  }
}
