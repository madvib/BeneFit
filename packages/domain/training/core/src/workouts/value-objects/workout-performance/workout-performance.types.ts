import { z } from 'zod';
import {
  ENERGY_LEVELS,
  PERFORMANCE_DIFFICULTY_RATINGS,
  ACTIVITY_TYPES
} from '@bene/shared';

export const HeartRateDataSchema = z.object({
  average: z.number().int().min(30).max(220).optional(),
  max: z.number().int().min(30).max(220).optional(),
  zones: z.record(z.string(), z.number().int().min(0)).optional(),
});
export type HeartRateData = z.infer<typeof HeartRateDataSchema>;

export const ExercisePerformanceSchema = z.object({
  name: z.string().min(1).max(200),
  setsCompleted: z.number().int().min(0).max(100),
  setsPlanned: z.number().int().min(0).max(100),
  reps: z.array(z.number().int().min(0).max(1000)).optional(),
  weight: z.array(z.number().min(0).max(1000)).optional(),
  distance: z.number().min(0).max(1000).optional(),
  duration: z.number().int().min(0).max(86400).optional(),
});
export type ExercisePerformance = z.infer<typeof ExercisePerformanceSchema>;

export const ActivityPerformanceSchema = z.object({
  activityType: z.enum(ACTIVITY_TYPES),
  completed: z.boolean(),
  durationMinutes: z.number().int().min(0).max(1440),
  notes: z.string().max(1000).optional(),
  intervalsCompleted: z.number().int().min(0).max(1000).optional(),
  intervalsPlanned: z.number().int().min(0).max(1000).optional(),
  exercises: z.array(ExercisePerformanceSchema).optional(),
});
export type ActivityPerformance = z.infer<typeof ActivityPerformanceSchema>;

export const EnergyLevelSchema = z.enum(ENERGY_LEVELS);
export const DifficultyRatingSchema = z.enum(PERFORMANCE_DIFFICULTY_RATINGS);

export const WorkoutPerformanceSchema = z.object({
  startedAt: z.coerce.date<Date>(),
  completedAt: z.coerce.date<Date>(),
  durationMinutes: z.number().int().min(0).max(1440),
  activities: z.array(ActivityPerformanceSchema),
  perceivedExertion: z.number().int().min(1).max(10),
  energyLevel: EnergyLevelSchema,
  enjoyment: z.number().int().min(1).max(5),
  difficultyRating: DifficultyRatingSchema,
  heartRate: HeartRateDataSchema.optional(),
  caloriesBurned: z.number().int().min(0).max(10000).optional(),
  notes: z.string().max(2000).optional(),
  injuries: z.array(z.string().max(200)).optional(),
  modifications: z.array(z.string().max(200)).optional(),
});

export type WorkoutPerformance = Readonly<z.infer<typeof WorkoutPerformanceSchema>>;
