import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { WorkoutSessionCommands, toWorkoutSessionView } from '@bene/training-core';
import type { WorkoutSessionView } from '@bene/training-core';
import { UserJoinedWorkoutEvent } from '../../events/index.js';
import type { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';

// Single request schema with ALL fields
export const JoinMultiplayerWorkoutRequestSchema = z.object({
  // Server context
  userId: z.uuid(),

  // Client data
  userName: z.string().min(1).max(100),
  userAvatar: z.url().optional(),
  sessionId: z.uuid(),
});

// Zod inferred type with original name
export type JoinMultiplayerWorkoutRequest = z.infer<
  typeof JoinMultiplayerWorkoutRequestSchema
>;

export interface JoinMultiplayerWorkoutResponse {
  session: WorkoutSessionView;
}

export class JoinMultiplayerWorkoutUseCase extends BaseUseCase<
  JoinMultiplayerWorkoutRequest,
  JoinMultiplayerWorkoutResponse
> {
  constructor(
    private sessionRepository: WorkoutSessionRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
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
    await this.eventBus.publish(
      new UserJoinedWorkoutEvent({
        sessionId: session.id,
        userId: request.userId,
        userName: request.userName,
      }),
    );

    // 6. Return session details
    return Result.ok({
      session: toWorkoutSessionView(joinedSession),
    });
  }
}

