import { z } from 'zod';

// Workout completion form schemas
// Simplified variants optimized for UI forms (differs from full entity schemas)

export const WorkoutPerformanceFormSchema = z.object({
  rpe: z.number().min(1).max(10),
  durationActual: z.number().min(1),
  feedback: z.string(),
});

export const WorkoutVerificationFormSchema = z.object({
  type: z.enum(['manual_input', 'gps', 'photo', 'wearable']),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const CompleteWorkoutFormSchema = z.object({
  performance: WorkoutPerformanceFormSchema,
  verification: WorkoutVerificationFormSchema,
  shareToFeed: z.boolean().default(true),
});

export type WorkoutPerformanceFormValues = z.infer<typeof WorkoutPerformanceFormSchema>;
export type WorkoutVerificationFormValues = z.infer<typeof WorkoutVerificationFormSchema>;
export type CompleteWorkoutFormValues = z.infer<typeof CompleteWorkoutFormSchema>;
