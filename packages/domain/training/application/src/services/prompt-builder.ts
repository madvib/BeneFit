import {
  UserProfile,
  FitnessPlan,
  CompletedWorkout,
  FitnessPlanQueries as queries,
} from '@bene/training-core';

/**
 * Reusable prompt building utilities for AI services
 */
export class PromptBuilder {
  /**
   * Format user profile information for AI context
   */
  static formatUserProfile(profile: UserProfile): string {
    let context = `USER PROFILE:\n`;
    context += `- Name: ${profile.displayName || 'User'}\n`;

    if (profile.experienceProfile?.level) {
      context += `- Experience Level: ${profile.experienceProfile.level}\n`;
    }

    if (profile.fitnessGoals) {
      context += `- Goals: ${JSON.stringify(profile.fitnessGoals)}\n`;
    }

    if (profile.trainingConstraints) {
      context += `- Constraints: ${JSON.stringify(profile.trainingConstraints)}\n`;
    }

    if (profile.preferences) {
      context += `- Preferences: ${JSON.stringify(profile.preferences)}\n`;
    }

    return context;
  }
  /**
   * Format workout plan context for AI
   */
  static formatPlanContext(plan: FitnessPlan): string {
    let context = `CURRENT PLAN:\n`;
    context += `- Name: ${plan.title}\n`;
    context += `- Status: ${plan.status}\n`;
    context += `- Week ${queries.getCurrentWeek(plan)} of ${plan.weeks}\n`;
    context += `- Completed Workouts: ${queries.getWorkoutSummary(plan).completed}/${queries.getWorkoutSummary(plan).total}\n`;
    context += `- Goals: ${JSON.stringify(plan.goals)}\n`;

    return context;
  }

  /**
   * Format workout history for AI context
   */
  static formatWorkoutHistory(workouts: CompletedWorkout[]): string {
    if (workouts.length === 0) {
      return 'RECENT WORKOUTS: None\n';
    }

    let context = `RECENT WORKOUTS (Last ${workouts.length}):\n`;

    workouts.forEach((workout, index) => {
      context += `${index + 1}. ${workout.workoutType} on ${new Date(workout.recordedAt).toLocaleDateString()}\n`;

      if (workout.performance) {
        if (workout.performance.perceivedExertion) {
          context += `   - Exertion: ${workout.performance.perceivedExertion}/10\n`;
        }
        if (workout.performance.enjoyment) {
          context += `   - Enjoyment: ${workout.performance.enjoyment}/5\n`;
        }
        if (workout.performance.difficultyRating) {
          context += `   - Difficulty: ${workout.performance.difficultyRating}\n`;
        }
        if (workout.performance.notes) {
          context += `   - Notes: ${workout.performance.notes}\n`;
        }
      }
    });

    return context;
  }

  /**
   * Format performance metrics for AI analysis
   */
  static formatPerformanceMetrics(metrics: {
    totalWorkouts?: number;
    avgPerWeek?: number;
    favoriteWorkoutTypes?: string[];
    totalMinutes?: number;
    avgIntensity?: number;
  }): string {
    let context = `PERFORMANCE METRICS:\n`;

    if (metrics.totalWorkouts !== undefined) {
      context += `- Total Workouts: ${metrics.totalWorkouts}\n`;
    }

    if (metrics.avgPerWeek !== undefined) {
      context += `- Average Per Week: ${metrics.avgPerWeek.toFixed(1)}\n`;
    }

    if (metrics.favoriteWorkoutTypes && metrics.favoriteWorkoutTypes.length > 0) {
      context += `- Favorite Types: ${metrics.favoriteWorkoutTypes.join(', ')}\n`;
    }

    if (metrics.totalMinutes !== undefined) {
      context += `- Total Minutes: ${metrics.totalMinutes}\n`;
    }

    if (metrics.avgIntensity !== undefined) {
      context += `- Average Intensity: ${metrics.avgIntensity.toFixed(1)}/10\n`;
    }

    return context;
  }

  /**
   * Build a system prompt with coaching personality
   */
  static buildCoachSystemPrompt(): string {
    return `You are an expert fitness coach with deep knowledge of exercise science, behavior change, and motivation.
Your role is to provide helpful, encouraging, and evidence-based guidance to help users achieve their fitness goals.

Key principles:
- Be supportive and motivating
- Provide specific, actionable advice
- Consider the user's experience level and constraints
- Focus on sustainable habits and long-term progress
- Acknowledge challenges and celebrate wins
- Keep responses concise but helpful (under 200 words unless more detail is requested)`;
  }

  /**
   * Build a system prompt for plan generation
   */
  static buildPlanGenerationSystemPrompt(): string {
    return `You are an expert fitness plan generator. Create personalized workout plans based on user profiles and goals.

Key principles:
1. Match the user's experience level
2. Progress appropriately over time
3. Respect constraints (time, equipment, injuries)
4. Include variety to maintain engagement
5. Balance intensity with recovery
6. Be specific and actionable

Always output structured JSON plans with the specified format.`;
  }
}
