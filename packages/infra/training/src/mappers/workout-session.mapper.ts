import {
  WorkoutSession,
  SessionState,
  ActivityPerformance,
  LiveActivityProgress,
  SessionConfiguration,
  SessionParticipant,
  SessionFeedItem,
  WorkoutActivity
} from '@bene/training-core';
import type { SessionMetadata, NewSessionMetadata } from '@bene/persistence';

export function toDatabase(session: WorkoutSession): NewSessionMetadata {
  return {
    id: session.id,
    createdByUserId: session.ownerId,

    // Workout reference
    workoutId: session.id, // TODO: Verify correct mapping for workoutId
    planId: session.planId ?? null, // Use null for nullable fields
    workoutTemplateId: session.workoutTemplateId ?? null,
    workoutType: session.workoutType,

    // Workout structure
    activitiesJson: session.activities,

    // Session configuration
    configurationJson: session.configuration,

    // State
    status: session.state as SessionState | null, // Cast might need adjustment to match enum
    currentActivityIndex: session.currentActivityIndex,

    // Live progress
    liveProgressJson: session.liveProgress,

    // Performance tracking
    completedActivitiesJson: session.completedActivities,

    // Activity feed
    activityFeedJson: session.activityFeed,

    // Timing
    startedAt: session.startedAt ?? null,
    pausedAt: session.pausedAt ?? null,
    resumedAt: session.resumedAt ?? null,
    completedAt: session.completedAt ?? null,
    abandonedAt: session.abandonedAt ?? null,
    totalPausedSeconds: session.totalPausedSeconds,

    // Timestamps
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

export function toDomain(row: SessionMetadata): WorkoutSession {
  return {
    id: row.id,
    ownerId: row.createdByUserId,

    // Workout reference
    planId: row.planId || undefined,
    workoutTemplateId: row.workoutTemplateId || undefined,

    // Workout structure
    workoutType: row.workoutType,
    activities: row.activitiesJson as WorkoutActivity[],

    // Session configuration
    configuration: row.configurationJson as SessionConfiguration,

    // Session state
    state: row.status as SessionState,
    currentActivityIndex: row.currentActivityIndex ?? 0,

    // Live progress
    liveProgress: row.liveProgressJson as LiveActivityProgress,

    // Performance tracking
    completedActivities: row.completedActivitiesJson as ActivityPerformance[],

    // Multiplayer elements (these may need to be populated separately)
    participants: [] as SessionParticipant[], // Participants might be in a separate table
    activityFeed: row.activityFeedJson as SessionFeedItem[],

    // Timing
    startedAt: row.startedAt ?? undefined,
    pausedAt: row.pausedAt ?? undefined,
    resumedAt: row.resumedAt ?? undefined,
    completedAt: row.completedAt ?? undefined,
    abandonedAt: row.abandonedAt ?? undefined,
    totalPausedSeconds: row.totalPausedSeconds ?? 0,

    // Metadata
    createdAt: row.createdAt ?? new Date(),
    updatedAt: row.updatedAt ?? new Date(),
  };
}