import { Guard, Result } from '@bene/shared';

import { SessionState, WorkoutSession } from './workout-session.types.js';
import {
  CreateSessionParticipantSchema,
  CreateLiveActivityProgressSchema,
  CreateSessionFeedItemSchema,
  ParticipantRole,
  ActivityPerformance,
  LiveActivityProgress,
  ExerciseProgress,
} from '../../value-objects/index.js';

export function startSession(
  session: WorkoutSession,
  ownerName: string,
  ownerAvatar?: string,
): Result<WorkoutSession> {
  const guardResult = Guard.combine([
    Guard.isTrue(session.state === 'preparing', 'Session must be in preparing state'),
    Guard.againstEmptyString(ownerName, 'ownerName'),
  ]);
  if (guardResult.isFailure) return Result.fail(guardResult.error);
  // Add owner as first participant
  const ownerResult = CreateSessionParticipantSchema.safeParse({
    userId: session.ownerId,
    userName: ownerName,
    avatar: ownerAvatar,
    role: 'owner',
  });

  if (!ownerResult.success) {
    return Result.fail(new Error(ownerResult.error.message));
  }

  const firstActivity = session.activities[0];
  if (!firstActivity) {
    return Result.fail(new Error('No activities in session'));
  }
  const liveProgressResult = CreateLiveActivityProgressSchema.safeParse({
    activityType: firstActivity.type,
    activityIndex: 0,
    totalActivities: session.activities.length,
  });
  if (!liveProgressResult.success) return Result.fail(new Error('Invalid live progress data'));

  const feedItemResult = CreateSessionFeedItemSchema.safeParse({
    type: 'user_joined',
    userId: session.ownerId,
    userName: ownerName,
    content: `${ ownerName } started the workout`,
  });
  if (!feedItemResult.success) return Result.fail(new Error('Invalid feed item data'));

  const now = new Date();

  return Result.ok({
    ...session,
    state: 'in_progress',
    participants: [ownerResult.data],
    liveProgress: liveProgressResult.data,
    activityFeed: [feedItemResult.data],
    startedAt: now,
    updatedAt: now,
  });
}

export function joinSession(
  session: WorkoutSession,
  userId: string,
  userName: string,
  avatar?: string,
  role: ParticipantRole = 'participant',
): Result<WorkoutSession> {
  const guardResult = Guard.combine([
    Guard.isTrue(
      session.state === 'preparing' || session.state === 'in_progress',
      'Cannot join completed or abandoned session',
    ),
    Guard.isTrue(session.configuration.isMultiplayer, 'Cannot join solo session'),
    Guard.isTrue(
      session.participants.length < session.configuration.maxParticipants,
      'Session is full',
    ),
    Guard.againstEmptyString(userId, 'userId'),
    Guard.againstEmptyString(userName, 'userName'),
  ]);

  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  // Check if already in session
  const existingParticipant = session.participants.find(
    (p: { userId: string }) => p.userId === userId,
  );
  if (existingParticipant) {
    throw new Error('User is already in session');
  }

  // Use schema for creation/validation
  const participantResult = CreateSessionParticipantSchema.safeParse({
    userId,
    userName,
    avatar,
    role,
  });

  if (!participantResult.success) {
    return Result.fail(new Error(participantResult.error.message)); // Simplified error handling or mapZodError
  }

  const feedItemResult = CreateSessionFeedItemSchema.safeParse({
    type: 'user_joined',
    userId,
    userName,
    content: `${ userName } joined the workout`,
  });
  if (!feedItemResult.success) return Result.fail(new Error('Invalid feed item data'));

  return Result.ok({
    ...session,
    participants: [...session.participants, participantResult.data],
    activityFeed: [...session.activityFeed, feedItemResult.data],
    updatedAt: new Date(),
  });
}

export function leaveSession(
  session: WorkoutSession,
  userId: string,
): Result<WorkoutSession> {
  const guards = [Guard.againstEmptyString(userId, 'userId')];

  const participantIndex = session.participants.findIndex(
    (p: { userId: string }) => p.userId === userId,
  );
  guards.push(Guard.isTrue(participantIndex >= 0, 'User is not in session'));

  const participant = session.participants[participantIndex];
  if (!participant) {
    return Result.fail(new Error('Participant not found'));
  }
  guards.push(
    Guard.isTrue(
      participant.role !== 'owner' || session.participants.length === 1,
      'Owner cannot leave while others are present',
    ),
  );
  const guardResult = Guard.combine(guards);
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  const updatedParticipant = {
    ...participant,
    status: 'left' as const,
    leftAt: new Date(),
  };

  const updatedParticipants = [...session.participants];
  updatedParticipants[participantIndex] = updatedParticipant;

  const feedItemResult = CreateSessionFeedItemSchema.safeParse({
    type: 'user_left',
    userId,
    userName: participant.userName,
    content: `${ participant.userName } left the workout`,
  });
  if (!feedItemResult.success) return Result.fail(new Error('Invalid feed item data'));

  return Result.ok({
    ...session,
    participants: updatedParticipants,
    activityFeed: [...session.activityFeed, feedItemResult.data],
    updatedAt: new Date(),
  });
}

export function pauseSession(session: WorkoutSession): Result<WorkoutSession> {
  const guardResult = Guard.isTrue(
    session.state === 'in_progress',
    'Session is not in progress',
  );
  if (guardResult.isFailure) return Result.fail(guardResult.error);
  return Result.ok({
    ...session,
    state: 'paused',
    pausedAt: new Date(),
    updatedAt: new Date(),
  });
}

export function resumeSession(session: WorkoutSession): Result<WorkoutSession> {
  const guardResult = Guard.combine([
    Guard.isTrue(session.state === 'paused', 'Session is not paused'),
    Guard.againstNullOrUndefined(session.pausedAt, 'pausedAt'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  const now = new Date();
  const pauseDuration = Math.floor(
    (now.getTime() - session.pausedAt!.getTime()) / 1000,
  );

  return Result.ok({
    ...session,
    state: 'in_progress',
    resumedAt: now,
    totalPausedSeconds: session.totalPausedSeconds + pauseDuration,
    pausedAt: undefined,
    updatedAt: now,
  });
}

export function completeActivity(
  session: WorkoutSession,
  activityPerformance: ActivityPerformance,
): Result<WorkoutSession> {
  const guardResult = Guard.combine([
    Guard.isTrue(session.state === 'in_progress', 'Session is not in progress'),
    Guard.againstNullOrUndefined(activityPerformance, 'activityPerformance'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }

  const completedActivities = [...session.completedActivities, activityPerformance];
  const nextActivityIndex = session.currentActivityIndex + 1;
  const isLastActivity = nextActivityIndex >= session.activities.length;

  let newState: SessionState = session.state;
  let liveProgress: LiveActivityProgress | undefined = session.liveProgress;

  if (isLastActivity) {
    // Workout complete
    newState = 'completed';
    liveProgress = undefined;
  } else {
    // Move to next activity
    const nextActivity = session.activities[nextActivityIndex];
    if (!nextActivity) {
      return Result.fail(new Error('Next activity not found'));
    }
    const liveProgressResult = CreateLiveActivityProgressSchema.safeParse({
      activityType: nextActivity.type,
      activityIndex: nextActivityIndex,
      totalActivities: session.activities.length,
    });
    if (!liveProgressResult.success) return Result.fail(new Error('Invalid live progress data'));
    liveProgress = liveProgressResult.data;
  }

  const feedItemResult = CreateSessionFeedItemSchema.safeParse({
    type: 'activity_completed',
    userId: session.ownerId,
    userName: 'You', // Would need participant context
    content: `Completed ${ activityPerformance.activityType }`,
    metadata: {
      durationMinutes: activityPerformance.durationMinutes,
    },
  });
  if (!feedItemResult.success) return Result.fail(new Error('Invalid feed item data'));

  return Result.ok({
    ...session,
    state: newState,
    currentActivityIndex: nextActivityIndex,
    liveProgress,
    completedActivities,
    activityFeed: [...session.activityFeed, feedItemResult.data],
    completedAt: isLastActivity ? new Date() : session.completedAt,
    updatedAt: new Date(),
  });
}

export function abandonSession(
  session: WorkoutSession,
  reason?: string,
): Result<WorkoutSession> {
  const guardResult = Guard.isTrue(
    session.state === 'in_progress' || session.state === 'paused',
    'Can only abandon active sessions',
  );
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  const feedItemResult = CreateSessionFeedItemSchema.safeParse({
    type: 'user_left',
    userId: session.ownerId,
    userName: 'You',
    content: reason || 'Workout ended early',
    metadata: { reason },
  });
  if (!feedItemResult.success) return Result.fail(new Error('Invalid feed item data'));

  return Result.ok({
    ...session,
    state: 'abandoned',
    liveProgress: undefined,
    activityFeed: [...session.activityFeed, feedItemResult.data],
    abandonedAt: new Date(),
    updatedAt: new Date(),
  });
}

export function updateLiveProgress(
  session: WorkoutSession,
  elapsedSeconds: number,
  exerciseProgress?: ExerciseProgress[],
): Result<WorkoutSession> {
  const guardResult = Guard.combine([
    Guard.isTrue(session.state === 'in_progress', 'Session is not in progress'),
    Guard.againstNullOrUndefined(session.liveProgress, 'liveProgress'),
    Guard.againstNegative(elapsedSeconds, 'elapsedSeconds'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  return Result.ok({
    ...session,
    liveProgress: {
      ...session.liveProgress!,
      elapsedSeconds,
      exerciseProgress: exerciseProgress || session.liveProgress!.exerciseProgress,
    },
    updatedAt: new Date(),
  });
}

export function addChatMessage(
  session: WorkoutSession,
  userId: string,
  userName: string,
  message: string,
): Result<WorkoutSession> {
  const guardResult = Guard.combine([
    Guard.isTrue(session.configuration.enableChat, 'Chat is not enabled'),
    Guard.againstEmptyString(message, 'message'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  const feedItemResult = CreateSessionFeedItemSchema.safeParse({
    type: 'chat_message',
    userId,
    userName,
    content: message,
  });
  if (!feedItemResult.success) return Result.fail(new Error('Invalid feed item data'));

  return Result.ok({
    ...session,
    activityFeed: [...session.activityFeed, feedItemResult.data],
    updatedAt: new Date(),
  });
}

export function sendEncouragement(
  session: WorkoutSession,
  fromUserId: string,
  fromUserName: string,
  toUserId: string,
  message: string,
): Result<WorkoutSession> {
  const guardResult = Guard.againstEmptyString(message, 'message');
  if (guardResult.isFailure) return Result.fail(guardResult.error);
  const feedItemResult = CreateSessionFeedItemSchema.safeParse({
    type: 'encouragement',
    userId: fromUserId,
    userName: fromUserName,
    content: message,
    metadata: { toUserId },
  });
  if (!feedItemResult.success) return Result.fail(new Error('Invalid feed item data'));

  return Result.ok({
    ...session,
    activityFeed: [...session.activityFeed, feedItemResult.data],
    updatedAt: new Date(),
  });
}
