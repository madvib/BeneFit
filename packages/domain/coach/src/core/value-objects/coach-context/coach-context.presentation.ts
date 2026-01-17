import { z } from 'zod';
import { CoachContext } from './coach-context.types.js';

// Define FitnessGoals presentation schema locally since it's not exported from training-core
export const PrimaryFitnessGoalSchema = z.enum([
  'strength',
  'hypertrophy',
  'endurance',
  'weight_loss',
  'weight_gain',
  'general_fitness',
  'sport_specific',
  'mobility',
  'rehabilitation',
]);

export const TargetWeightSchema = z.object({
  current: z.number().min(30).max(500),
  target: z.number().min(30).max(500),
  unit: z.enum(['kg', 'lbs']),
});

export const FitnessGoalsPresentationSchema = z.object({
  primary: PrimaryFitnessGoalSchema,
  secondary: z.array(z.string().min(1).max(100)),
  targetWeight: TargetWeightSchema.optional(),
  targetBodyFat: z.number().min(3).max(60).optional(),
  targetDate: z.iso.datetime().optional(),
  motivation: z.string().min(1).max(500),
  successCriteria: z.array(z.string().min(1).max(200)),
});


export const CurrentPlanContextSchema = z.object({
  planId: z.string(),
  planName: z.string().min(1).max(100),
  weekNumber: z.number().int().min(1).max(52),
  dayNumber: z.number().int().min(1).max(365),
  totalWeeks: z.number().int().min(1).max(52),
  adherenceRate: z.number().min(0).max(1),
  completionRate: z.number().min(0).max(1),
});

export const DifficultyRatingSchema = z.enum(['too_easy', 'just_right', 'too_hard']);

export const RecentWorkoutSummarySchema = z.object({
  workoutId: z.string(),
  date: z.iso.datetime(),
  type: z.string().min(1).max(50),
  durationMinutes: z.number().int().min(1).max(480),
  perceivedExertion: z.number().int().min(1).max(10),
  enjoyment: z.number().int().min(1).max(10),
  difficultyRating: DifficultyRatingSchema,
  completed: z.boolean(),
  notes: z.string().min(1).max(1000).optional(),
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

export const UserExperienceLevelSchema = z.enum([
  'beginner',
  'intermediate',
  'advanced',
  'elite',
]);

export const EnergyLevelSchema = z.enum(['low', 'medium', 'high']);
export const StressLevelSchema = z.enum(['low', 'medium', 'high']);
export const SleepQualitySchema = z.enum(['poor', 'fair', 'good']);

// Note: TrainingConstraints and Injury types come from @bene/training-core
// We'll use a simplified schema here for presentation
export const InjurySchema = z.object({
  bodyPart: z.string().min(1).max(100),
  severity: z.enum(['minor', 'moderate', 'serious']),
  reportedDate: z.iso.datetime(),
  avoidExercises: z.array(z.string().min(1).max(100)),
});

export const TrainingConstraintsSchema = z.object({
  availableDays: z.array(z.string()),
  availableEquipment: z.array(z.string()),
  location: z.enum(['home', 'gym', 'outdoor', 'mixed']),
  injuries: z.array(InjurySchema).optional(),
});

export const CoachContextPresentationSchema = z.object({
  currentPlan: CurrentPlanContextSchema.optional(),
  recentWorkouts: z.array(RecentWorkoutSummarySchema),
  userGoals: FitnessGoalsPresentationSchema,
  userConstraints: TrainingConstraintsSchema,
  experienceLevel: UserExperienceLevelSchema,
  trends: PerformanceTrendsSchema,
  daysIntoCurrentWeek: z.number().int().min(1).max(7),
  workoutsThisWeek: z.number().int().min(0).max(21),
  plannedWorkoutsThisWeek: z.number().int().min(0).max(21),
  reportedInjuries: z.array(InjurySchema).optional(),
  energyLevel: EnergyLevelSchema,
  stressLevel: StressLevelSchema.optional(),
  sleepQuality: SleepQualitySchema.optional(),
});

export type CoachContextPresentation = z.infer<typeof CoachContextPresentationSchema>;

export function toCoachContextPresentation(context: CoachContext): CoachContextPresentation {
  return {
    currentPlan: context.currentPlan,
    recentWorkouts: context.recentWorkouts.map((workout) => ({
      ...workout,
      date: workout.date.toISOString(),
    })),
    userGoals: {
      primary: context.userGoals.primary,
      secondary: [...context.userGoals.secondary],
      targetWeight: context.userGoals.targetWeight
        ? { ...context.userGoals.targetWeight }
        : undefined,
      targetBodyFat: context.userGoals.targetBodyFat,
      targetDate: context.userGoals.targetDate?.toISOString(),
      motivation: context.userGoals.motivation,
      successCriteria: [...context.userGoals.successCriteria],
    },
    userConstraints: {
      availableDays: [...context.userConstraints.availableDays],
      availableEquipment: [...context.userConstraints.availableEquipment],
      location: context.userConstraints.location,
      injuries: context.userConstraints.injuries?.map((injury) => ({
        bodyPart: injury.bodyPart,
        severity: injury.severity,
        reportedDate: injury.reportedDate,
        avoidExercises: [...injury.avoidExercises],
      })),
    },
    experienceLevel: context.experienceLevel,
    trends: context.trends,
    daysIntoCurrentWeek: context.daysIntoCurrentWeek,
    workoutsThisWeek: context.workoutsThisWeek,
    plannedWorkoutsThisWeek: context.plannedWorkoutsThisWeek,
    reportedInjuries: context.reportedInjuries?.map((injury) => ({
      bodyPart: injury.bodyPart,
      severity: injury.severity,
      reportedDate: injury.reportedDate,
      avoidExercises: [...injury.avoidExercises],
    })),
    energyLevel: context.energyLevel,
    stressLevel: context.stressLevel,
    sleepQuality: context.sleepQuality,
  };
}
