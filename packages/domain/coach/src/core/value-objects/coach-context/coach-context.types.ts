import { z } from 'zod';
import { FitnessGoalsSchema, TrainingConstraintsSchema, InjuryPropsSchema, ExperienceLevelSchema } from '@bene/training-core';
import { DomainBrandTag } from '@bene/shared';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
export const CurrentPlanContextSchema = z.object({
  planId: z.uuid(),
  planName: z.string().min(1).max(200),
  weekNumber: z.number().int().min(1).max(52),
  dayNumber: z.number().int().min(0).max(6),
  totalWeeks: z.number().int().min(1).max(52),
  adherenceRate: z.number().min(0).max(1),
  completionRate: z.number().min(0).max(1),
});

export const DifficultyRatingSchema = z.enum(['too_easy', 'just_right', 'too_hard']);

export const RecentWorkoutSummarySchema = z.object({
  workoutId: z.uuid(),
  date: z.coerce.date<Date>(),
  type: z.string().min(1).max(100),
  durationMinutes: z.number().int().min(0).max(600),
  perceivedExertion: z.number().int().min(1).max(10),
  enjoyment: z.number().int().min(1).max(5),
  difficultyRating: DifficultyRatingSchema,
  completed: z.boolean(),
  notes: z.string().max(500).optional(),
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

export const EnergyLevelSchema = z.enum(['low', 'medium', 'high']);
export const StressLevelSchema = z.enum(['low', 'medium', 'high']);
export const SleepQualitySchema = z.enum(['poor', 'fair', 'good']);

export const CoachContextSchema = z
  .object({
    currentPlan: CurrentPlanContextSchema.optional(),
    recentWorkouts: z.array(RecentWorkoutSummarySchema),
    userGoals: FitnessGoalsSchema,
    userConstraints: TrainingConstraintsSchema,
    experienceLevel: ExperienceLevelSchema,
    trends: PerformanceTrendsSchema,
    daysIntoCurrentWeek: z.number().int().min(0).max(6),
    workoutsThisWeek: z.number().int().min(0).max(20),
    plannedWorkoutsThisWeek: z.number().int().min(0).max(20),
    reportedInjuries: z.array(InjuryPropsSchema).optional(),
    energyLevel: EnergyLevelSchema,
    stressLevel: StressLevelSchema.optional(),
    sleepQuality: SleepQualitySchema.optional(),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type CurrentPlanContext = z.infer<typeof CurrentPlanContextSchema>;
export type DifficultyRating = z.infer<typeof DifficultyRatingSchema>;
export type RecentWorkoutSummary = z.infer<typeof RecentWorkoutSummarySchema>;
export type QuantityTrend = z.infer<typeof QuantityTrendSchema>;
export type RelativeTrend = z.infer<typeof RelativeTrendSchema>;
export type SubjectiveTrend = z.infer<typeof SubjectiveTrendSchema>;
export type PerformanceTrends = z.infer<typeof PerformanceTrendsSchema>;
export type EnergyLevel = z.infer<typeof EnergyLevelSchema>;
export type StressLevel = z.infer<typeof StressLevelSchema>;
export type SleepQuality = z.infer<typeof SleepQualitySchema>;
export type CoachContext = Readonly<z.infer<typeof CoachContextSchema>>;
