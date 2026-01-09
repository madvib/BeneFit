import { z } from 'zod';

// Live Activity Progress Schemas

export const IntervalProgressSchema = z.object({
  intervalNumber: z.number(),
  totalIntervals: z.number(),
  intervalDurationSeconds: z.number(),
  elapsedSeconds: z.number(),
  isResting: z.boolean(), // True if in rest period
});

export const ExerciseProgressSchema = z.object({
  exerciseName: z.string(),
  currentSet: z.number(),
  totalSets: z.number(),
  repsCompleted: z.number().optional(),
  targetReps: z.number().optional(),
  weightUsed: z.number().optional(),
  restTimeRemaining: z.number().optional(), // Seconds
});

export const LiveActivityProgressSchema = z.object({
  activityType: z.enum(['warmup', 'main', 'cooldown', 'interval', 'circuit']),
  activityIndex: z.number(),
  totalActivities: z.number(),
  // For interval-based activities
  intervalProgress: IntervalProgressSchema.optional(),
  // For exercise-based activities
  exerciseProgress: z.array(ExerciseProgressSchema).optional(),
  // Timing
  activityStartedAt: z.string(), // ISO date string
  elapsedSeconds: z.number(),
  estimatedRemainingSeconds: z.number().optional(),
});

// Export inferred types
export type IntervalProgress = z.infer<typeof IntervalProgressSchema>;
export type ExerciseProgress = z.infer<typeof ExerciseProgressSchema>;
export type LiveActivityProgress = z.infer<typeof LiveActivityProgressSchema>;
