import { Result } from '@bene/shared';
import type { CoachContext, PerformanceTrends } from '../../core/index.js';
import { CoachErrors } from '../../core/index.js';
import type { FitnessPlan, CompletedWorkout } from '@bene/training-core';
import { FitnessPlanQueries, WeeklyScheduleQueries } from '@bene/training-core';
import type {
  UserProfileRepository,
  CompletedWorkoutRepository,
  FitnessPlanRepository,
} from '@bene/training-application';

const TREND_MAPS = {
  quantity: {
    1: 'increasing',
    0: 'stable',
    [-1]: 'decreasing',
  } as const,
  relative: {
    1: 'high',
    0: 'medium',
    [-1]: 'low',
  } as const,
  subjective: {
    1: 'improving',
    0: 'stable',
    [-1]: 'declining',
  } as const,
} as const;

/**
 * Implementation of CoachContextBuilder that aggregates user data
 * from various repositories to build comprehensive coaching context
 */
export class CoachContextBuilder {
  constructor(
    private userProfileRepo: UserProfileRepository,
    private completedWorkoutRepo: CompletedWorkoutRepository,
    private workoutPlanRepo: FitnessPlanRepository,
  ) {}

  async buildContext(userId: string): Promise<Result<CoachContext>> {
    try {
      // Fetch the user profile
      const profileResult = await this.userProfileRepo.findById(userId);
      if (profileResult.isFailure) {
        return Result.fail(
          new CoachErrors.ContextUpdateError(
            `Failed to get user profile: ${profileResult.error}`,
          ),
        );
      }
      const userProfile = profileResult.value;

      // Fetch the current active plan
      const activePlanResult = await this.workoutPlanRepo.findActiveByUserId(userId);
      const currentPlan = activePlanResult.isSuccess ? activePlanResult.value : undefined;

      // Fetch recent workouts (last 30 days)
      const recentWorkoutsResult = await this.completedWorkoutRepo.findByUserId(userId, 30);
      const recentWorkouts = recentWorkoutsResult.isSuccess ? recentWorkoutsResult.value : [];

      // Build the context
      const context: CoachContext = {
        ...userProfile,

        currentPlan: currentPlan
          ? {
              planId: currentPlan.id,
              planName: currentPlan.title,
              weekNumber: currentPlan.currentPosition.week,
              dayNumber: 0, // Would be calculated from current date and plan start
              totalWeeks: currentPlan.weeks.length,
              adherenceRate: this.calculateAdherence(currentPlan, recentWorkouts),
              completionRate: this.calculateCompletion(currentPlan),
            }
          : undefined,

        recentWorkouts: recentWorkouts.map((w) => ({
          workoutId: w.id,
          date: w.recordedAt,
          type: w.workoutType,
          durationMinutes: w.performance?.durationMinutes || 0,
          perceivedExertion: w.performance?.perceivedExertion || 0,
          enjoyment: w.performance?.enjoyment || 0,
          difficultyRating: w.performance?.difficultyRating || 'moderate',
          completed: true,
          notes: w.performance?.notes,
        })),

        userGoals: userProfile.fitnessGoals,
        userConstraints: userProfile.trainingConstraints,
        experienceLevel: userProfile.experienceProfile?.level || 'beginner',

        trends: this.calculateTrends(recentWorkouts),

        daysIntoCurrentWeek: this.getDaysIntoWeek(),
        workoutsThisWeek: this.countWorkoutsThisWeek(recentWorkouts),
        plannedWorkoutsThisWeek:
          currentPlan?.weeks[currentPlan.currentPosition.week]?.workouts.length!,
        reportedInjuries: userProfile.trainingConstraints?.injuries
          ? Array.from(userProfile.trainingConstraints?.injuries)
          : [],
        energyLevel: this.inferEnergyLevel(recentWorkouts),
        stressLevel: undefined,
        sleepQuality: undefined,
      };

      return Result.ok(context);
    } catch (error) {
      return Result.fail(new Error(`Failed to build coaching context: ${error}`));
    }
  }

  private calculateAdherence(plan: FitnessPlan, workouts: CompletedWorkout[]): number {
    FitnessPlanQueries.getWorkoutSummary(plan).total;
    // Calculate % of scheduled workouts completed

    const completedCount = FitnessPlanQueries.getWorkoutSummary(plan).completed;
    const expectedByNow = this.getExpectedWorkoutsByNow(plan);

    if (expectedByNow === 0) return 1.0;

    return Math.min(completedCount / expectedByNow, 1.0);
  }

  private getExpectedWorkoutsByNow(plan: FitnessPlan): number {
    if (!plan.startDate) return 0;

    const daysSinceStart = Math.floor(
      (Date.now() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24),
    );

    const weeksSinceStart = daysSinceStart / 7;
    const workoutsPerWeek = FitnessPlanQueries.getWorkoutSummary(plan).total / plan.weeks.length;

    return Math.floor(weeksSinceStart * workoutsPerWeek);
  }

  private calculateCompletion(plan: FitnessPlan): number {
    return (
      (FitnessPlanQueries.getWorkoutSummary(plan).completed || 0) /
      FitnessPlanQueries.getWorkoutSummary(plan).total
    );
  }

  private calculateTrends(workouts: CompletedWorkout[]): PerformanceTrends {
    if (workouts.length < 3) {
      return {
        volumeTrend: 'stable',
        adherenceTrend: 'stable',
        energyTrend: 'medium',
        exertionTrend: 'stable',
        enjoymentTrend: 'stable',
      };
    }

    // Split workouts into recent and older for comparison
    const midpoint = Math.floor(workouts.length / 2);
    const recentWorkouts = workouts.slice(0, midpoint);
    const olderWorkouts = workouts.slice(midpoint);

    // Calculate average exertion
    const recentAvgExertion = this.averageExertion(recentWorkouts);
    const olderAvgExertion = this.averageExertion(olderWorkouts);

    // Calculate average enjoyment
    const recentAvgEnjoyment = this.averageEnjoyment(recentWorkouts);
    const olderAvgEnjoyment = this.averageEnjoyment(olderWorkouts);

    return {
      volumeTrend:
        TREND_MAPS.quantity[this.determineTrend(recentWorkouts.length, olderWorkouts.length)],
      adherenceTrend: 'stable', // Would calculate based on planned vs actual
      energyTrend: this.inferEnergyLevel(recentWorkouts),
      exertionTrend:
        TREND_MAPS.quantity[this.determineTrend(recentAvgExertion, olderAvgExertion)],
      enjoymentTrend:
        TREND_MAPS.subjective[this.determineTrend(recentAvgEnjoyment, olderAvgEnjoyment)],
    };
  }

  private averageExertion(workouts: CompletedWorkout[]): number {
    if (workouts.length === 0) return 0;

    const sum = workouts.reduce((acc, w) => acc + (w.performance?.perceivedExertion || 0), 0);

    return sum / workouts.length;
  }

  private averageEnjoyment(workouts: CompletedWorkout[]): number {
    if (workouts.length === 0) return 0;

    const sum = workouts.reduce((acc, w) => acc + (w.performance?.enjoyment || 0), 0);

    return sum / workouts.length;
  }

  private determineTrend(recent: number, older: number): -1 | 0 | 1 {
    const threshold = 0.1; // 10% change threshold
    const percentChange = older === 0 ? 0 : (recent - older) / older;

    if (percentChange > threshold) return 1;
    if (percentChange < -threshold) return -1;
    return 0;
  }

  private getDaysIntoWeek(): number {
    const now = new Date();
    return now.getDay();
  }

  private countWorkoutsThisWeek(workouts: CompletedWorkout[]): number {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return workouts.filter((w) => new Date(w.recordedAt) >= weekStart).length;
  }

  private inferEnergyLevel(workouts: CompletedWorkout[]): 'low' | 'medium' | 'high' {
    if (workouts.length === 0) return 'medium';

    const recent = workouts.slice(0, 5);
    const avgExertion =
      recent.reduce((sum, w) => sum + (w.performance?.perceivedExertion || 0), 0) / recent.length;

    // Higher exertion might indicate lower energy (struggling more)
    if (avgExertion > 8) return 'low';
    if (avgExertion < 6) return 'high';
    return 'medium';
  }
}
