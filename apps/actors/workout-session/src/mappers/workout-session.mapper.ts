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
import { NewSessionMetadata, SessionMetadata, NewParticipant, NewSessionChat } from '../data/schema';

export function toDatabase(session: WorkoutSession): NewSessionMetadata {
  return {
    id: session.id,
    createdByUserId: session.ownerId,

    // Workout reference
    workoutId: session.id, // TODO: Verify correct mapping for workoutId
    planId: session.planId ?? null,
    workoutTemplateId: session.workoutTemplateId ?? null,
    workoutType: session.workoutType,

    // Workout structure
    activitiesJson: session.activities,

    // Session configuration
    configurationJson: session.configuration,

    status: session.state as SessionMetadata['status'],
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
  // Parse nested dates in liveProgressJson
  const liveProgress = row.liveProgressJson as LiveActivityProgress | null;
  const hydratedLiveProgress = liveProgress ? {
    ...liveProgress,
    activityStartedAt: new Date(liveProgress.activityStartedAt),
  } : undefined;

  // Parse nested dates in activityFeedJson
  const activityFeedRaw = (row.activityFeedJson as SessionFeedItem[] | null) || [];
  const hydratedActivityFeed = activityFeedRaw.map((item) => ({
    ...item,
    timestamp: new Date(item.timestamp),
  }));

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
    liveProgress: hydratedLiveProgress,

    // Performance tracking
    completedActivities: row.completedActivitiesJson as ActivityPerformance[],

    // Multiplayer elements
    participants: [] as SessionParticipant[], // Participants are in a separate table
    activityFeed: hydratedActivityFeed,

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

export function toParticipantDatabase(participant: SessionParticipant): NewParticipant {
  return {
    id: `part_${ participant.userId }`,
    userId: participant.userId,
    displayName: participant.userName,
    avatarUrl: participant.avatar,
    joinedAt: participant.joinedAt,
    lastHeartbeatAt: new Date(),
    status: participant.status === 'left' ? 'disconnected' : 'active',
  };
}

export function toChatDatabase(sessionId: string, participantId: string, item: SessionFeedItem): NewSessionChat {
  return {
    id: item.id,
    participantId: participantId,
    message: item.content,
    createdAt: item.timestamp,
  };
}