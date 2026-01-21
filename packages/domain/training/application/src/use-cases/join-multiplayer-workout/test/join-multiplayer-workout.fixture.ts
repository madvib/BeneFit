import { createWorkoutSessionFixture } from '@bene/training-core/fixtures';
import { toWorkoutSessionView } from '@bene/training-core';
import type { JoinMultiplayerWorkoutResponse } from '../join-multiplayer-workout.js';

export function buildJoinMultiplayerWorkoutResponse(
  overrides?: Partial<JoinMultiplayerWorkoutResponse>
): JoinMultiplayerWorkoutResponse {
  const session = createWorkoutSessionFixture();
  return {
    session: toWorkoutSessionView(session),
    ...overrides,
  };
}
