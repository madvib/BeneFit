import { z } from 'zod';

// Shared workout schemas used across multiple use cases

// Activity schema for planned workouts
export const ActivitySchema = z.object({
  type: z.enum(['warmup', 'main', 'cooldown']),
  instructions: z.string(),
  durationMinutes: z.number(),
  description: z.string().optional(),
});

// Schema for completed workouts summary (for lists/history view)
export const CompletedWorkoutSummarySchema = z.object({
  id: z.string(),
  type: z.string(),
  date: z.date(),
  durationMinutes: z.number(),
  perceivedExertion: z.number(),
  enjoyment: z.number(),
  verified: z.boolean(),
  reactionCount: z.number(),
});

// Schema for today's/daily workout
export const DailyWorkoutSchema = z.object({
  workoutId: z.string(),
  planId: z.string(),
  type: z.string(),
  description: z.string().optional(),
  durationMinutes: z.number(),
  activities: z.array(ActivitySchema),
});

// Schema for upcoming workouts
export const UpcomingWorkoutSchema = z.object({
  workoutId: z.string(),
  day: z.string(),
  type: z.string(),
  durationMinutes: z.number(),
  status: z.string(),
});

// Summary schema for workouts within a plan/week
export const WorkoutSummarySchema = z.object({
  id: z.string(),
  type: z.string(),
  dayOfWeek: z.number(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'skipped', 'rescheduled']),
  durationMinutes: z.number().optional(),
});

// Export inferred types
export type Activity = z.infer<typeof ActivitySchema>;
export type CompletedWorkoutSummary = z.infer<typeof CompletedWorkoutSummarySchema>;
export type DailyWorkout = z.infer<typeof DailyWorkoutSchema>;
export type UpcomingWorkout = z.infer<typeof UpcomingWorkoutSchema>;
export type WorkoutSummary = z.infer<typeof WorkoutSummarySchema>;
