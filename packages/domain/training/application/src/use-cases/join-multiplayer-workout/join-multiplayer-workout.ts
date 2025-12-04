import { Result, UseCase } from '@bene/shared-domain';
import { WorkoutSessionCommands } from '@bene/training-core';
import type { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import type { EventBus } from '@bene/shared-domain';

export interface JoinMultiplayerWorkoutRequest {
  userId: string;
  userName: string;
  userAvatar?: string;
  sessionId: string;
}

export interface JoinMultiplayerWorkoutResponse {
  sessionId: string;
  workoutType: string;
  participants: Array<{
    userId: string;
    userName: string;
    status: string;
  }>;
  currentActivity: {
    type: string;
    instructions: string[];
  };
}

export class JoinMultiplayerWorkoutUseCase
  implements UseCase<JoinMultiplayerWorkoutRequest, JoinMultiplayerWorkoutResponse>
{
  constructor(
    private sessionRepository: WorkoutSessionRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: JoinMultiplayerWorkoutRequest,
  ): Promise<Result<JoinMultiplayerWorkoutResponse>> {
    // 1. Load session
    const sessionResult = await this.sessionRepository.findById(request.sessionId);
    if (sessionResult.isFailure) {
      return Result.fail(new Error('Session not found'));
    }
    const session = sessionResult.value;

    // 2. Verify can join
    if (!session.configuration.isMultiplayer) {
      return Result.fail(new Error('Session is not multiplayer'));
    }

    if (!session.configuration.isPublic && session.ownerId !== request.userId) {
      return Result.fail(new Error('Session is private'));
    }

    if (session.participants.length >= session.configuration.maxParticipants) {
      return Result.fail(new Error('Session is full'));
    }

    // 3. Join session
    const joinedSessionResult = WorkoutSessionCommands.joinSession(
      session,
      request.userId,
      request.userName,
      request.userAvatar,
    );

    if (joinedSessionResult.isFailure) {
      return Result.fail(joinedSessionResult.error);
    }

    const joinedSession = joinedSessionResult.value;

    // 4. Save
    await this.sessionRepository.save(joinedSession);

    // 5. Emit event (for real-time updates to other participants)
    await this.eventBus.publish({
      type: 'UserJoinedWorkout',
      sessionId: session.id,
      userId: request.userId,
      userName: request.userName,
      timestamp: new Date(),
    });

    // 6. Return session details
    const currentActivity =
      joinedSession.activities[joinedSession.currentActivityIndex];

    return Result.ok({
      sessionId: joinedSession.id,
      workoutType: joinedSession.workoutType,
      participants: joinedSession.participants.map((p) => ({
        userId: p.userId,
        userName: p.userName,
        status: p.status,
      })),
      currentActivity: {
        type: currentActivity ? currentActivity.type : 'warmup',
        instructions:
          currentActivity && currentActivity.instructions
            ? [...currentActivity.instructions]
            : [],
      },
    });
  }
}
