import { z } from 'zod';
import { DIFFICULTY_RATINGS } from '../../constants/index.js';

// Workout Performance Schemas

export const ExercisePerformanceSchema = z.object({
  name: z.string(),
  setsCompleted: z.number(),
  setsPlanned: z.number(),
  weight: z.array(z.number()).optional(),
  reps: z.array(z.number()).optional(),
  duration: z.number().optional(), // seconds
  distance: z.number().optional(), // meters
  rpe: z.number().optional(), // Rate of Perceived Exertion
  rir: z.number().optional(), // Reps in Reserve
});

export const ActivityPerformanceSchema = z.object({
  activityType: z.enum(['warmup', 'main', 'cooldown']),
  completed: z.boolean(),
  durationMinutes: z.number(),
  notes: z.string().optional(),
  // For interval-based activities
  intervalsCompleted: z.number().optional(),
  intervalsPlanned: z.number().optional(),
  // For exercise-based activities
  exercises: z.array(ExercisePerformanceSchema).optional(),
});

export const EnergyLevelSchema = z.enum(['low', 'medium', 'high']);

export const DifficultyRatingSchema = z.enum(DIFFICULTY_RATINGS);

export const HeartRateDataSchema = z.object({
  average: z.number().optional(),
  max: z.number().optional(),
  zones: z.record(z.string(), z.number()).optional(), // Time in seconds per zone
});

export const WorkoutPerformanceSchema = z.object({
  // Timing
  startedAt: z.string(), // ISO date string
  completedAt: z.string(), // ISO date string
  durationMinutes: z.number(),
  // Activity completion
  activities: z.array(ActivityPerformanceSchema),
  // Subjective metrics
  perceivedExertion: z.number(), // RPE scale 1-10
  energyLevel: EnergyLevelSchema,
  enjoyment: z.number(), // 1-5 stars
  difficultyRating: DifficultyRatingSchema,
  // Physical metrics (optional, from wearables)
  heartRate: HeartRateDataSchema.optional(),
  caloriesBurned: z.number().optional(),
  // Notes and feedback
  notes: z.string().optional(),
  injuries: z.array(z.string()).optional(), // Any issues that came up
  modifications: z.array(z.string()).optional(), // Changes made during workout
});

export type ExercisePerformance = z.infer<typeof ExercisePerformanceSchema>;
export type ActivityPerformance = z.infer<typeof ActivityPerformanceSchema>;
export type EnergyLevel = z.infer<typeof EnergyLevelSchema>;
export type HeartRateData = z.infer<typeof HeartRateDataSchema>;
export type WorkoutPerformance = z.infer<typeof WorkoutPerformanceSchema>;

