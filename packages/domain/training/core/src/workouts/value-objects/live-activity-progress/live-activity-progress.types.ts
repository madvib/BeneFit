import { z } from 'zod';
import type { CreateView } from '@bene/shared';

export const IntervalProgressSchema = z.object({
  intervalNumber: z.number().int().min(1).max(100),
  totalIntervals: z.number().int().min(1).max(100),
  intervalDurationSeconds: z.number().int().min(1).max(3600),
  elapsedSeconds: z.number().int().min(0).max(3600),
  isResting: z.boolean(),
});
export type IntervalProgress = z.infer<typeof IntervalProgressSchema>;

export const ExerciseProgressSchema = z.object({
  exerciseName: z.string().min(1).max(100),
  currentSet: z.number().int().min(1).max(50),
  totalSets: z.number().int().min(1).max(50),
  repsCompleted: z.number().int().min(0).max(500).optional(),
  targetReps: z.number().int().min(1).max(500).optional(),
  weightUsed: z.number().min(0).max(1000).optional(),
  restTimeRemaining: z.number().int().min(0).max(3600).optional(),
});
export type ExerciseProgress = z.infer<typeof ExerciseProgressSchema>;

/**
 * 1. DEFINE PROPS SCHEMA
 */
export const LiveActivityProgressSchema = z.object({
  activityType: z.enum(['warmup', 'main', 'cooldown', 'interval', 'circuit']),
  activityIndex: z.number().int().min(0).max(100),
  totalActivities: z.number().int().min(1).max(100),
  intervalProgress: IntervalProgressSchema.optional(),
  exerciseProgress: z.array(ExerciseProgressSchema).optional(),
  activityStartedAt: z.coerce.date<Date>(),
  elapsedSeconds: z.number().int().min(0).max(86400),
  estimatedRemainingSeconds: z.number().int().min(0).max(86400).optional(),
});

/**
 * 2. INFER TYPES
 */
export type LiveActivityProgressProps = z.infer<typeof LiveActivityProgressSchema>;
export type LiveActivityProgress = Readonly<LiveActivityProgressProps>;

/**
 * 3. VIEW TYPES
 */
export type LiveActivityProgressView = CreateView<LiveActivityProgress>;

