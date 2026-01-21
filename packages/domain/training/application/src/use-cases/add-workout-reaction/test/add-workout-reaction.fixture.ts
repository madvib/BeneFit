import type { AddWorkoutReactionResponse } from '../add-workout-reaction.js';
import { faker } from '@faker-js/faker';

export function buildAddWorkoutReactionResponse(
  overrides?: Partial<AddWorkoutReactionResponse>
): AddWorkoutReactionResponse {
  return {
    workoutId: faker.string.uuid(),
    totalReactions: faker.number.int({ min: 1, max: 10 }),
    ...overrides,
  };
}
