import { faker } from '@faker-js/faker';
import type { SkipWorkoutResponse } from '../skip-workout.js';

export function buildSkipWorkoutResponse(
  overrides?: Partial<SkipWorkoutResponse>
): SkipWorkoutResponse {
  return {
    planId: faker.string.uuid(),
    skippedWorkoutId: faker.string.uuid(),
    message: 'Workout skipped. Your coach may adjust your plan.',
    ...overrides,
  };
}
