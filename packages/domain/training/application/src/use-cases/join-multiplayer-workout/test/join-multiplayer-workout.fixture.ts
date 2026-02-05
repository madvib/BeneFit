import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { createWorkoutSessionFixture } from '@bene/training-core/fixtures';
import { toWorkoutSessionView } from '@bene/training-core';
import type { JoinMultiplayerWorkoutResponse } from '../join-multiplayer-workout.js';


export function buildJoinMultiplayerWorkoutResponse(
  options: BaseFixtureOptions<JoinMultiplayerWorkoutResponse> = {}
): Result<JoinMultiplayerWorkoutResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to join multiplayer workout');
  if (errorResult) return errorResult;

  const session = createWorkoutSessionFixture();
  return Result.ok({
    session: toWorkoutSessionView(session),
    ...overrides,
  });
}
