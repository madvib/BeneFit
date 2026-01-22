import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { createWorkoutTemplateFixture } from '@bene/training-core/fixtures';
import { toWorkoutTemplateView } from '@bene/training-core';
import type { GetTodaysWorkoutResponse } from '../get-todays-workout.js';


export function buildGetTodaysWorkoutResponse(
  options: BaseFixtureOptions<GetTodaysWorkoutResponse> = {}
): Result<GetTodaysWorkoutResponse> {
  const { overrides, success } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to fetch today\'s workout');
  if (errorResult) return errorResult;

  if (success === false) {
    return Result.ok({
      hasWorkout: false,
      ...overrides,
    });
  }

  const workout = createWorkoutTemplateFixture();
  return Result.ok({
    hasWorkout: true,
    workout: toWorkoutTemplateView(workout),
    ...overrides,
  });
}
