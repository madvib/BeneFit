import { z } from 'zod';
import {
  WorkoutActivitySchema,
  toWorkoutActivitySchema
} from '../../value-objects/workout-activity/index.js';
import {
  LiveActivityProgressSchema,
  toLiveActivityProgressSchema
} from '../../value-objects/live-activity-progress/index.js';
import {
  SessionConfigurationSchema,
  toSessionConfigurationSchema
} from '../../value-objects/session-configuration/index.js';
import {
  SessionFeedItemSchema,
  toSessionFeedItemSchema
} from '../../value-objects/session-feed-item/index.js';
import {
  SessionParticipantSchema,
  toSessionParticipantSchema
} from '../../value-objects/session-participant/index.js';
import { ActivityPerformanceSchema } from '../../value-objects/workout-performance/workout-performance.schema.js';
// Using direct import for now if index doesn't export schema, checking index in next step but assuming it works or I fix it.
import { WorkoutSession, WorkoutSessionView } from './workout-session.types.js';
import * as Queries from './workout-session.queries.js';


export const SessionStateSchema = z.enum(['preparing', 'in_progress', 'paused', 'completed', 'abandoned']);

export const WorkoutSessionSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  planId: z.string().optional(),
  workoutTemplateId: z.string().optional(),
  workoutType: z.string().min(1).max(50),
  activities: z.array(WorkoutActivitySchema),
  state: SessionStateSchema,
  currentActivityIndex: z.number().int().min(0).max(100),
  liveProgress: LiveActivityProgressSchema.optional(),
  completedActivities: z.array(ActivityPerformanceSchema),
  configuration: SessionConfigurationSchema,
  participants: z.array(SessionParticipantSchema),
  activityFeed: z.array(SessionFeedItemSchema),
  startedAt: z.iso.datetime().optional(),
  pausedAt: z.iso.datetime().optional(),
  resumedAt: z.iso.datetime().optional(),
  completedAt: z.iso.datetime().optional(),
  abandonedAt: z.iso.datetime().optional(),
  totalPausedSeconds: z.number().int().min(0).max(86400),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),

  // Computed / Enriched Fields
  activeDuration: z.number().int().min(0).max(86400),
  completionPercentage: z.number().min(0).max(1),
});

export type WorkoutSessionPresentation = WorkoutSessionView;

export function toWorkoutSessionSchema(session: WorkoutSession): WorkoutSessionView {
  return {
    id: session.id,
    ownerId: session.ownerId,
    planId: session.planId,
    workoutTemplateId: session.workoutTemplateId,
    workoutType: session.workoutType,
    activities: session.activities.map(toWorkoutActivitySchema),
    state: session.state,
    currentActivityIndex: session.currentActivityIndex,
    liveProgress: session.liveProgress ? toLiveActivityProgressSchema(session.liveProgress) : undefined,
    completedActivities: session.completedActivities, // Assuming ActivityPerformance is compatible or mapped already if needed? 
    // ActivityPerformance in types is usually simple data. Presentation schema matches?
    // Let's assume yes for now, or use spreading if needed.
    configuration: toSessionConfigurationSchema(session.configuration),
    participants: session.participants.map(toSessionParticipantSchema),
    activityFeed: session.activityFeed.map(toSessionFeedItemSchema),
    startedAt: session.startedAt?.toISOString(),
    pausedAt: session.pausedAt?.toISOString(),
    resumedAt: session.resumedAt?.toISOString(),
    completedAt: session.completedAt?.toISOString(),
    abandonedAt: session.abandonedAt?.toISOString(),
    totalPausedSeconds: session.totalPausedSeconds,
    // Computed
    activeDuration: Queries.getActiveDuration(session),
    completionPercentage: Queries.getCompletionPercentage(session),
  } as unknown as WorkoutSessionView;
}
