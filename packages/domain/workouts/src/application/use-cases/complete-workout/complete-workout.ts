import { Result, UseCase } from '@bene/domain-shared';
import {
  createCompletedWorkout,
  type WorkoutPerformance,
  type WorkoutVerification,
  type CompletedWorkout,
} from '@core/index.js';
import type { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import type { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';
import {
  UserProfileCommands,
  type UserProfileRepository,
} from '@bene/domain-user-profile';
import type { EventBus } from '@bene/domain-shared';

export interface CompleteWorkoutRequest {
  userId: string;
  sessionId: string;
  performance: WorkoutPerformance;
  verification: WorkoutVerification;
  shareToFeed?: boolean;
}

export interface CompleteWorkoutResponse {
  workoutId: string;
  // planUpdated: boolean;
  newStreak?: number;
  achievementsEarned: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  stats: {
    totalWorkouts: number;
    totalVolume: number;
    totalMinutes: number;
  };
}

export class CompleteWorkoutUseCase
  implements UseCase<CompleteWorkoutRequest, CompleteWorkoutResponse>
{
  constructor(
    private sessionRepository: WorkoutSessionRepository,
    private completedWorkoutRepository: CompletedWorkoutRepository,
    private profileRepository: UserProfileRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: CompleteWorkoutRequest,
  ): Promise<Result<CompleteWorkoutResponse>> {
    // 1. Load session
    const sessionResult = await this.sessionRepository.findById(request.sessionId);
    if (sessionResult.isFailure) {
      return Result.fail(new Error('Session not found'));
    }
    const session = sessionResult.value;

    // Verify ownership
    if (session.ownerId !== request.userId) {
      return Result.fail(new Error('Not authorized'));
    }

    if (session.state !== 'in_progress' && session.state !== 'paused') {
      return Result.fail(
        new Error(`Cannot complete workout in ${session.state} state`),
      );
    }

    // 2. Create CompletedWorkout
    const completedWorkoutResult = createCompletedWorkout({
      userId: request.userId,
      workoutType: session.workoutType,
      performance: request.performance,
      verification: request.verification,
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
    // let planUpdated = false;
    // if (session.planId && session.workoutTemplateId) {
    //   const planResult = await this.planRepository.findById(session.planId);
    //   if (planResult.isSuccess) {
    //     const plan = planResult.value;
    //     const updatedPlanResult = WorkoutPlanCommands.completeWorkout(
    //       plan,
    //       session.workoutTemplateId,
    //       completedWorkout.id,
    //     );

    //     if (updatedPlanResult.isSuccess) {
    //       await this.planRepository.save(updatedPlanResult.value);
    //       planUpdated = true;
    //     }
    //   }
    // }

    // 5. Update user profile stats
    const profileResult = await this.profileRepository.findById(request.userId);
    if (profileResult.isSuccess) {
      const profile = profileResult.value;
      const volume = this.calculateVolume(request.performance);

      const updatedProfile = UserProfileCommands.recordWorkoutCompleted(
        profile,
        request.performance.completedAt,
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
    await this.eventBus.publish({
      type: 'WorkoutCompleted',
      userId: request.userId,
      workoutId: completedWorkout.id,
      planId: session.planId,
      timestamp: new Date(),
    });

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
    if (workout.workoutType === 'marathon') {
      // Award marathon achievement
    }

    return achievements;
  }
}
