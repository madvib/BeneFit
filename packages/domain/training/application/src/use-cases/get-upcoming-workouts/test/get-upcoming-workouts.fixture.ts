import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import {
  createWorkoutTemplateListFixture,
} from '@bene/training-core/fixtures';
import { toWorkoutTemplateView } from '@bene/training-core';
import type { GetUpcomingWorkoutsResponse } from '../get-upcoming-workouts.js';

export type GetUpcomingWorkoutsFixtureOptions = BaseFixtureOptions<GetUpcomingWorkoutsResponse>;

export function buildGetUpcomingWorkoutsResponse(
  options: GetUpcomingWorkoutsFixtureOptions = {}
): Result<GetUpcomingWorkoutsResponse> {
  const { overrides, success } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to fetch upcoming workouts');
  if (errorResult) return errorResult;

  if (success === false) {
    return Result.ok({
      workouts: [],
      ...overrides,
    });
  }

  const workouts = createWorkoutTemplateListFixture(2);
  return Result.ok({
    workouts: workouts.map(toWorkoutTemplateView),
    ...overrides,
  });
}
