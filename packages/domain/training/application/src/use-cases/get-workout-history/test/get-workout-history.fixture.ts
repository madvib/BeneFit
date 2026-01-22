import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { createWorkoutListFixture } from '@bene/training-core/fixtures';
import { toCompletedWorkoutView } from '@bene/training-core';
import type { GetWorkoutHistoryResponse } from '../get-workout-history.js';

export function buildGetWorkoutHistoryResponse(
  options: BaseFixtureOptions<GetWorkoutHistoryResponse> = {}
): Result<GetWorkoutHistoryResponse> {
  const { overrides, success } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to fetch workout history');
  if (errorResult) return errorResult;

  if (success === false) {
    return Result.ok({
      workouts: [],
      total: 0,
      ...overrides,
    });
  }

  const workouts = createWorkoutListFixture(5);
  return Result.ok({
    workouts: workouts.map(toCompletedWorkoutView),
    total: workouts.length,
    ...overrides,
  });
}
