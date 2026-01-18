import { createWorkoutSessionFixture, toWorkoutSessionSchema } from '@bene/training-core';
import type { JoinMultiplayerWorkoutResponse } from '@bene/training-application';

export function buildJoinMultiplayerWorkoutResponse(
  overrides?: Partial<JoinMultiplayerWorkoutResponse>
): JoinMultiplayerWorkoutResponse {
  const session = createWorkoutSessionFixture({
    participants: [
      { userId: 'user-1', userName: 'User 1', status: 'active', joinedAt: new Date() },
      { userId: 'user-2', userName: 'User 2', status: 'active', joinedAt: new Date() },
    ] as any
  });

  const response: JoinMultiplayerWorkoutResponse = {
    session: toWorkoutSessionSchema(session),
  };

  return { ...response, ...overrides };
}
