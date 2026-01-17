import { z } from 'zod';
import type {
  WorkoutPerformance,
  ActivityPerformance,
  HeartRateData
} from './workout-performance.types.js';

// Sub-schemas matching domain types

export const ExercisePerformanceSchema = z.object({
  name: z.string().min(1).max(100),
  setsCompleted: z.number().int().min(0).max(50),
  setsPlanned: z.number().int().min(0).max(50),
  reps: z.array(z.number().int().min(0).max(100)).optional(),
  weight: z.array(z.number().min(0).max(1000)).optional(), // kg
  distance: z.number().min(0).max(100000).optional(), // meters
  duration: z.number().int().min(0).max(7200).optional(), // seconds
});

export const ActivityPerformanceSchema = z.object({
  activityType: z.enum(['warmup', 'main', 'cooldown']),
  completed: z.boolean(),
  durationMinutes: z.number().int().min(0).max(240),
  notes: z.string().min(1).max(500).optional(),
  intervalsCompleted: z.number().int().min(0).max(100).optional(),
  intervalsPlanned: z.number().int().min(0).max(100).optional(),
  exercises: z.array(ExercisePerformanceSchema).optional(),
});

export const HeartRateDataSchema = z.object({
  average: z.number().int().min(40).max(220).optional(), // BPM
  max: z.number().int().min(40).max(220).optional(), // BPM
  zones: z.record(z.string(), z.number().int().min(0).max(7200)).optional(), // seconds in each zone
});

export const EnergyLevelSchema = z.enum(['low', 'medium', 'high']);
export const DifficultyRatingSchema = z.enum(['too_easy', 'just_right', 'too_hard']);

// Main Schema
export const WorkoutPerformanceSchema = z.object({
  startedAt: z.iso.datetime(),
  completedAt: z.iso.datetime(),
  durationMinutes: z.number().int().min(0).max(240),

  activities: z.array(ActivityPerformanceSchema),

  perceivedExertion: z.number().int().min(1).max(10),
  energyLevel: EnergyLevelSchema,
  enjoyment: z.number().int().min(1).max(10),
  difficultyRating: DifficultyRatingSchema,

  heartRate: HeartRateDataSchema.optional(),
  caloriesBurned: z.number().int().min(0).max(10000).optional(),

  notes: z.string().min(1).max(1000).optional(),
  injuries: z.array(z.string().min(1).max(100)).optional(),
  modifications: z.array(z.string().min(1).max(100)).optional(),
});

export type WorkoutPerformancePresentation = z.infer<typeof WorkoutPerformanceSchema>;

// Converter functions

export function fromWorkoutPerformanceSchema(
  schema: WorkoutPerformancePresentation
): WorkoutPerformance {
  return {
    ...schema,
    startedAt: new Date(schema.startedAt),
    completedAt: new Date(schema.completedAt),
    // Ensure nested arrays are cast correctly if necessary, though Zod types should match mostly
    activities: schema.activities as ActivityPerformance[],
    heartRate: schema.heartRate as HeartRateData | undefined,
  } as WorkoutPerformance;
}

export function toWorkoutPerformanceSchema(
  domain: WorkoutPerformance
): WorkoutPerformancePresentation {
  return {
    ...domain,
    startedAt: domain.startedAt.toISOString(),
    completedAt: domain.completedAt.toISOString(),
  };
}
