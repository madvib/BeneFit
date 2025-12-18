import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared-domain';
import { WorkoutSessionCommands } from '@bene/training-core';
import { UserJoinedWorkoutEvent } from '@/events/index.js';
import type { WorkoutSessionRepository } from '@/repositories/workout-session-repository.js';

// Client-facing schema (what comes in the request body)
export const JoinMultiplayerWorkoutRequestClientSchema = z.object({
  userName: z.string(),
  userAvatar: z.string().optional(),
  sessionId: z.string(),
});

export type JoinMultiplayerWorkoutRequestClient = z.infer<typeof JoinMultiplayerWorkoutRequestClientSchema>;

// Complete use case input schema (client data + server context)
export const JoinMultiplayerWorkoutRequestSchema = JoinMultiplayerWorkoutRequestClientSchema.extend({
  userId: z.string(),
});

// Zod inferred type with original name
export type JoinMultiplayerWorkoutRequest = z.infer<
  typeof JoinMultiplayerWorkoutRequestSchema
>;

// Zod schema for response validation
const ParticipantSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  status: z.string(),
});

const CurrentActivitySchema = z.object({
  type: z.string(),
  instructions: z.array(z.string()),
});

export const JoinMultiplayerWorkoutResponseSchema = z.object({
  sessionId: z.string(),
  workoutType: z.string(),
  participants: z.array(ParticipantSchema),
  currentActivity: CurrentActivitySchema,
});

// Zod inferred type with original name
export type JoinMultiplayerWorkoutResponse = z.infer<
  typeof JoinMultiplayerWorkoutResponseSchema
>;

export class JoinMultiplayerWorkoutUseCase implements UseCase<
  JoinMultiplayerWorkoutRequest,
  JoinMultiplayerWorkoutResponse
> {
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
    await this.eventBus.publish(
      new UserJoinedWorkoutEvent({
        sessionId: session.id,
        userId: request.userId,
        userName: request.userName,
      }),
    );

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
// Deprecated original interface - preserve for potential rollback
/** @deprecated Use JoinMultiplayerWorkoutRequest type instead */
export interface JoinMultiplayerWorkoutRequest_Deprecated {
  userId: string;
  userName: string;
  userAvatar?: string;
  sessionId: string;
}
// Deprecated original interface - preserve for potential rollback
/** @deprecated Use JoinMultiplayerWorkoutResponse type instead */
export interface JoinMultiplayerWorkoutResponse_Deprecated {
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
