import { z } from 'zod';
import { LiveActivityProgress } from './live-activity-progress.types.js';

export const IntervalProgressSchema = z.object({
  intervalNumber: z.number().int().min(1).max(50),
  totalIntervals: z.number().int().min(1).max(50),
  intervalDurationSeconds: z.number().int().min(1).max(3600),
  elapsedSeconds: z.number().int().min(0).max(3600),
  isResting: z.boolean(),
});

export const ExerciseProgressSchema = z.object({
  exerciseName: z.string().min(1).max(100),
  currentSet: z.number().int().min(1).max(20),
  totalSets: z.number().int().min(1).max(20),
  repsCompleted: z.number().int().min(0).max(100).optional(),
  targetReps: z.number().int().min(1).max(100).optional(),
  weightUsed: z.number().min(0).max(1000).optional(),
  restTimeRemaining: z.number().int().min(0).max(600).optional(),
});

export const LiveActivityProgressSchema = z.object({
  activityType: z.enum(['warmup', 'main', 'cooldown', 'interval', 'circuit']),
  activityIndex: z.number().int().min(0).max(100),
  totalActivities: z.number().int().min(1).max(100),
  intervalProgress: IntervalProgressSchema.optional(),
  exerciseProgress: z.array(ExerciseProgressSchema).optional(),
  activityStartedAt: z.iso.datetime(),
  elapsedSeconds: z.number().int().min(0).max(86400),
  estimatedRemainingSeconds: z.number().int().min(0).max(86400).optional(),
});

export type LiveActivityProgressPresentation = z.infer<typeof LiveActivityProgressSchema>;

export function toLiveActivityProgressSchema(progress: LiveActivityProgress): LiveActivityProgressPresentation {
  return {
    activityType: progress.activityType,
    activityIndex: progress.activityIndex,
    totalActivities: progress.totalActivities,
    intervalProgress: progress.intervalProgress,
    exerciseProgress: progress.exerciseProgress ? progress.exerciseProgress.map(e => ({ ...e })) : undefined,
    activityStartedAt: progress.activityStartedAt.toISOString(),
    elapsedSeconds: progress.elapsedSeconds,
    estimatedRemainingSeconds: progress.estimatedRemainingSeconds,
  };
}
