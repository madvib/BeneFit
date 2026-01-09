import { z } from 'zod';
import { FitnessGoalsSchema } from '../training/fitness-goals.js';
import { TrainingConstraintsSchema } from '../training/training-constraints.js';
import { ExperienceLevelSchema } from '../training/experience-profile.js';

// Coach Context Schemas

export const CurrentPlanContextSchema = z.object({
  planId: z.string(),
  planName: z.string(),
  weekNumber: z.number(),
  dayNumber: z.number(),
  totalWeeks: z.number(),
  adherenceRate: z.number(), // 0-1
  completionRate: z.number(), // 0-1
});

export const RecentWorkoutSummarySchema = z.object({
  workoutId: z.string(),
  date: z.string(), // ISO date string
  type: z.string(),
  durationMinutes: z.number(),
  perceivedExertion: z.number(), // 1-10
  enjoyment: z.number(), // 1-5
  difficultyRating: z.enum(['too_easy', 'just_right', 'too_hard']),
  completed: z.boolean(),
  notes: z.string().optional(),
});

export const QuantityTrendSchema = z.enum(['increasing', 'stable', 'decreasing']);
export const RelativeTrendSchema = z.enum(['high', 'medium', 'low']);
export const SubjectiveTrendSchema = z.enum(['improving', 'stable', 'declining']);

export const PerformanceTrendsSchema = z.object({
  volumeTrend: QuantityTrendSchema,
  adherenceTrend: SubjectiveTrendSchema,
  energyTrend: RelativeTrendSchema,
  exertionTrend: QuantityTrendSchema,
  enjoymentTrend: SubjectiveTrendSchema,
});

export const CoachContextSchema = z.object({
  // Current plan state
  currentPlan: CurrentPlanContextSchema.optional(),
  // Recent workout history
  recentWorkouts: z.array(RecentWorkoutSummarySchema),
  // User profile (at time of conversation)
  userGoals: FitnessGoalsSchema,
  userConstraints: TrainingConstraintsSchema,
  experienceLevel: ExperienceLevelSchema,
  // Performance trends
  trends: PerformanceTrendsSchema,
  // Current state
  daysIntoCurrentWeek: z.number(),
  workoutsThisWeek: z.number(),
  plannedWorkoutsThisWeek: z.number(),
  // Health signals
  reportedInjuries: z.array(z.object({
    bodyPart: z.string(),
    severity: z.enum(['minor', 'moderate', 'serious']),
    notes: z.string().optional(),
  })).optional(),
  energyLevel: z.enum(['low', 'medium', 'high']),
  stressLevel: z.enum(['low', 'medium', 'high']).optional(),
  sleepQuality: z.enum(['poor', 'fair', 'good']).optional(),
});

// Export inferred types
export type CurrentPlanContext = z.infer<typeof CurrentPlanContextSchema>;
export type RecentWorkoutSummary = z.infer<typeof RecentWorkoutSummarySchema>;
export type QuantityTrend = z.infer<typeof QuantityTrendSchema>;
export type RelativeTrend = z.infer<typeof RelativeTrendSchema>;
export type SubjectiveTrend = z.infer<typeof SubjectiveTrendSchema>;
export type PerformanceTrends = z.infer<typeof PerformanceTrendsSchema>;
export type CoachContext = z.infer<typeof CoachContextSchema>;
