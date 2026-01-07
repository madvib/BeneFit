import { z } from 'zod';

export const WorkoutPerformanceSchema = z.object({
  rpe: z.number().min(1).max(10),
  durationActual: z.number().min(1),
  feedback: z.string(),
});

export const WorkoutVerificationSchema = z.object({
  type: z.enum(['manual_input', 'gps', 'photo', 'wearable']),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const CompleteWorkoutSchema = z.object({
  performance: WorkoutPerformanceSchema,
  verification: WorkoutVerificationSchema,
  shareToFeed: z.boolean().default(true),
});

export type CompleteWorkoutFormValues = z.infer<typeof CompleteWorkoutSchema>;
