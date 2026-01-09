import { z } from 'zod';
import { WorkoutActivitySchema } from './workout-activity.js';
import { LiveActivityProgressSchema } from './live-activity-progress.js';
import { SessionConfigurationSchema } from './session-configuration.js';
import { SessionParticipantSchema } from './session-participant.js';
import { SessionFeedItemSchema } from './session-feed-item.js';
import { ActivityPerformanceSchema } from './workout-performance.js';

// Workout Session Schemas

export const SessionStateSchema = z.enum([
  'preparing',  // Created but not started
  'in_progress', // Active workout
  'paused',     // Temporarily paused
  'completed',  // Finished successfully
  'abandoned',  // Stopped early
]);

export const WorkoutSessionSchema = z.object({
  id: z.string(),
  // Source workout (if from a plan)
  planId: z.string().optional(),
  workoutTemplateId: z.string().optional(),
  // Workout structure
  workoutType: z.string(), // "Upper Body", "5K Run", etc.
  activities: z.array(WorkoutActivitySchema),
  // Session state
  state: SessionStateSchema,
  currentActivityIndex: z.number(),
  liveProgress: LiveActivityProgressSchema.optional(),
  // Performance tracking
  completedActivities: z.array(ActivityPerformanceSchema),
  // Multiplayer
  configuration: SessionConfigurationSchema,
  participants: z.array(SessionParticipantSchema),
  activityFeed: z.array(SessionFeedItemSchema),
  // Timing
  startedAt: z.string().optional(), // ISO date string - when workout actually started
  pausedAt: z.string().optional(), // ISO date string
  resumedAt: z.string().optional(), // ISO date string
  completedAt: z.string().optional(), // ISO date string
  abandonedAt: z.string().optional(), // ISO date string
  totalPausedSeconds: z.number(),
});

// Export inferred types
export type SessionState = z.infer<typeof SessionStateSchema>;
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;
