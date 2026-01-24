import { z } from 'zod';
import { ENERGY_LEVELS, PERFORMANCE_DIFFICULTY_RATINGS, VERIFICATION_METHODS } from '@bene/shared';

export const WorkoutPerformanceFormSchema = z.object({
  perceivedExertion: z.number().min(1).max(10),
  durationMinutes: z.number().min(1),
  notes: z.string().max(2000),
  energyLevel: z.enum(ENERGY_LEVELS).default('medium'),
  difficultyRating: z.enum(PERFORMANCE_DIFFICULTY_RATINGS).default('just_right'),
});

export const WorkoutVerificationFormSchema = z.object({
  type: z.enum(VERIFICATION_METHODS),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const CompleteWorkoutFormSchema = z.object({
  performance: WorkoutPerformanceFormSchema,
  verification: WorkoutVerificationFormSchema,
  shareToFeed: z.boolean().default(true),
  title: z.string().min(1).max(200),
});

export type WorkoutPerformanceFormValues = z.infer<typeof WorkoutPerformanceFormSchema>;
export type WorkoutVerificationFormValues = z.infer<typeof WorkoutVerificationFormSchema>;
export type CompleteWorkoutFormValues = z.infer<typeof CompleteWorkoutFormSchema>;
