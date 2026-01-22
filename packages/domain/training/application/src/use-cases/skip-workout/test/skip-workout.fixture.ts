import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { faker } from '@faker-js/faker';
import type { SkipWorkoutResponse } from '../skip-workout.js';


export function buildSkipWorkoutResponse(
  options: BaseFixtureOptions<SkipWorkoutResponse> = {}
): Result<SkipWorkoutResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to skip workout');
  if (errorResult) return errorResult;

  return Result.ok({
    planId: faker.string.uuid(),
    skippedWorkoutId: faker.string.uuid(),
    message: 'Workout skipped. Your coach may adjust your plan.',
    ...overrides,
  });
}
