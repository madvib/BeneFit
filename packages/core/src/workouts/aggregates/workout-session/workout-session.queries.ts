import { SessionFeedItem } from '../../value-objects/session-feed-item/session-feed-item.types.js';
import { SessionParticipant } from '../../value-objects/session-participant/session-participant.types.js';
import { WorkoutActivity } from '../../value-objects/workout-activity/workout-activity.types.js';
import { WorkoutSession } from './workout-session.types.js';

export function getActiveDuration(session: WorkoutSession): number {
  if (!session.startedAt) {
    return 0;
  }

  const endTime = session.completedAt || session.abandonedAt || new Date();
  const totalSeconds = Math.floor(
    (endTime.getTime() - session.startedAt.getTime()) / 1000,
  );

  return totalSeconds - session.totalPausedSeconds;
}

export function getCurrentActivity(session: WorkoutSession): WorkoutActivity | null {
  if (session.currentActivityIndex >= session.activities.length) {
    return null;
  }

  return session.activities[session.currentActivityIndex] ?? null;
}

export function getCompletionPercentage(session: WorkoutSession): number {
  const totalActivities = session.activities.length;
  const completed = session.completedActivities.length;

  return Math.round((completed / totalActivities) * 100);
}

export function getActiveParticipants(session: WorkoutSession): SessionParticipant[] {
  return session.participants.filter((p) => p.status === 'active');
}

export function isParticipantInSession(
  session: WorkoutSession,
  userId: string,
): boolean {
  return session.participants.some((p) => p.userId === userId && p.status !== 'left');
}

export function canJoin(session: WorkoutSession): boolean {
  return (
    session.configuration.isMultiplayer &&
    session.state !== 'completed' &&
    session.state !== 'abandoned' &&
    session.participants.length < session.configuration.maxParticipants
  );
}

export function getRecentFeedItems(
  session: WorkoutSession,
  count: number = 20,
): SessionFeedItem[] {
  return session.activityFeed.slice(-count);
}
