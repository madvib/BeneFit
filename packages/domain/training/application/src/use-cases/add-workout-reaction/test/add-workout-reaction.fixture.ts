import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { faker } from '@faker-js/faker';
import type { AddWorkoutReactionResponse } from '../add-workout-reaction.js';


export function buildAddWorkoutReactionResponse(
  options: BaseFixtureOptions<AddWorkoutReactionResponse> = {}
): Result<AddWorkoutReactionResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to add workout reaction');
  if (errorResult) return errorResult;

  return Result.ok({
    workoutId: faker.string.uuid(),
    totalReactions: faker.number.int({ min: 1, max: 10 }),
    ...overrides,
  });
}
