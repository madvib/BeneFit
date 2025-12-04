import { Result } from '@bene/domain';
import type { CoachingContext, UserProfile } from '@bene/domain/coaching';
import type { WorkoutPlan } from '@bene/domain/planning';
import type { CompletedWorkout } from '@bene/domain/workouts';
import type {
  UserProfileRepository,
  CompletedWorkoutRepository,
  WorkoutPlanRepository,
} from '@bene/application';

export class CoachingContextBuilder {
  constructor(
    private userProfileRepo: UserProfileRepository,
    private completedWorkoutRepo: CompletedWorkoutRepository,
    private workoutPlanRepo: WorkoutPlanRepository,
  ) {}

  async buildContext(userId: string): Promise<Result<CoachingContext>> {
    try {
      // Fetch the user profile
      const profileResult = await this.userProfileRepo.findById(userId);
      if (profileResult.isFailure) {
        return Result.fail(`Failed to get user profile: ${profileResult.error}`);
      }
      const userProfile = profileResult.value;

      // Fetch the current active plan
      const activePlanResult = await this.workoutPlanRepo.findActiveByUserId(userId);
      const currentPlan = activePlanResult.isSuccess
        ? activePlanResult.value
        : undefined;

      // Fetch recent workouts (last 30 days)
      const recentWorkoutsResult = await this.completedWorkoutRepo.findRecentByUserId(
        userId,
        30,
      );
      const recentWorkouts = recentWorkoutsResult.isSuccess
        ? recentWorkoutsResult.value
        : [];

      // Calculate workout statistics
      const workoutStats = this.calculateWorkoutStats(recentWorkouts);

      // Build the context
      const context: CoachingContext = {
        userProfile,
        currentPlan,
        recentWorkouts,
        workoutStats,
        preferences: userProfile.preferences,
        fitnessGoals: userProfile.fitnessGoals,
        // Additional context could be added here
        lastWorkout: recentWorkouts[0] || undefined,
        currentStreak: userProfile.stats.currentStreak,
        upcomingWorkouts: this.getUpcomingWorkouts(currentPlan),
      };

      return Result.ok(context);
    } catch (error) {
      return Result.fail(`Failed to build coaching context: ${error}`);
    }
  }

  private calculateWorkoutStats(recentWorkouts: CompletedWorkout[]): any {
    // In a real implementation, this would have a proper type
    if (recentWorkouts.length === 0) {
      return {
        totalWorkouts: 0,
        avgPerWeek: 0,
        favoriteWorkoutTypes: [],
        totalMinutes: 0,
        avgIntensity: 0,
      };
    }

    const totalWorkouts = recentWorkouts.length;
    const totalMinutes = recentWorkouts.reduce((sum, workout) => {
      // Attempt to calculate based on workout duration or performance metrics
      // This is a simplified approach - real implementation would use more sophisticated metrics
      return sum + (workout.performance?.duration || 30); // Default to 30 minutes if not specified
    }, 0);

    // Calculate workouts per week
    const daysSpan = this.getDaysSpan(recentWorkouts);
    const weeks = daysSpan / 7;
    const avgPerWeek = weeks > 0 ? totalWorkouts / weeks : 0;

    // Determine favorite workout types
    const typeCounts: { [key: string]: number } = {};
    recentWorkouts.forEach((workout) => {
      const type = workout.workoutType;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const favoriteWorkoutTypes = Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type]) => type)
      .slice(0, 3); // Top 3 favorite types

    return {
      totalWorkouts,
      avgPerWeek,
      favoriteWorkoutTypes,
      totalMinutes,
      avgIntensity: 0, // Would calculate based on performance data
    };
  }

  private getDaysSpan(recentWorkouts: CompletedWorkout[]): number {
    if (recentWorkouts.length < 2) return recentWorkouts.length > 0 ? 1 : 0;

    const sortedWorkouts = [...recentWorkouts].sort(
      (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
    );

    const lastWorkoutDate = sortedWorkouts[0].recordedAt;
    const firstWorkoutDate = sortedWorkouts[sortedWorkouts.length - 1].recordedAt;

    const timeDiff =
      new Date(lastWorkoutDate).getTime() - new Date(firstWorkoutDate).getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert to days
  }

  private getUpcomingWorkouts(currentPlan?: WorkoutPlan): any[] {
    // In a real implementation, this would have a proper type
    // This would typically access the UserAgent DO for full plan structure
    // For now, return empty array as placeholder
    return currentPlan?.structure
      ? this.extractUpcomingFromStructure(currentPlan.structure)
      : [];
  }

  private extractUpcomingFromStructure(planStructure: any): any[] {
    // In a real implementation, this would have a proper type
    // Extract upcoming workouts from the plan structure
    // This is a simplified implementation - real one would parse the actual structure
    return [];
  }
}
