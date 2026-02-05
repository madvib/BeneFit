import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { createWorkoutSessionFixture, } from '@bene/training-core/fixtures';
import { toWorkoutSessionView } from '@bene/training-core';
import type { StartWorkoutResponse } from '../start-workout.js';

export function buildStartWorkoutResponse(
  options: BaseFixtureOptions<StartWorkoutResponse> = {}
): Result<StartWorkoutResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to start workout session');
  if (errorResult) return errorResult;

  const session = createWorkoutSessionFixture();
  return Result.ok({
    session: toWorkoutSessionView(session),
    ...overrides,
  });
}
