import { z } from 'zod';
import { type DomainBrandTag, SESSION_STATES } from '@bene/shared';
import {
  LiveActivityProgressSchema,
  SessionParticipantSchema,
  SessionConfigurationSchema,
  WorkoutActivitySchema,
  ActivityPerformanceSchema,
  SessionFeedItemSchema,
} from '../../value-objects/index.js';

export const SessionStateSchema = z.enum(SESSION_STATES);
export type SessionState = z.infer<typeof SessionStateSchema>;

/**
 * 1. DEFINE CORE SCHEMA
 */
export const WorkoutSessionSchema = z.object({
  id: z.uuid(),
  ownerId: z.uuid(),

  // Source workout (if from a plan)
  planId: z.uuid().optional(),
  workoutTemplateId: z.uuid().optional(),

  // Workout structure
  workoutType: z.string().min(1).max(50),
  activities: z.array(WorkoutActivitySchema).min(1),

  // Session state
  state: SessionStateSchema,
  currentActivityIndex: z.number().int().min(0).max(100),
  liveProgress: LiveActivityProgressSchema.optional(),

  // Performance tracking
  completedActivities: z.array(ActivityPerformanceSchema),

  // Multiplayer
  configuration: SessionConfigurationSchema,
  participants: z.array(SessionParticipantSchema),
  activityFeed: z.array(SessionFeedItemSchema),

  // Timing
  startedAt: z.coerce.date<Date>().optional(),
  pausedAt: z.coerce.date<Date>().optional(),
  resumedAt: z.coerce.date<Date>().optional(),
  completedAt: z.coerce.date<Date>().optional(),
  abandonedAt: z.coerce.date<Date>().optional(),
  totalPausedSeconds: z.number().int().min(0).max(86400),

  // Metadata
  createdAt: z.coerce.date<Date>(),
  updatedAt: z.coerce.date<Date>(),
}).brand<DomainBrandTag>();

/**
 * 2. INFER TYPES
 */
export type WorkoutSession = Readonly<z.infer<typeof WorkoutSessionSchema>>;
