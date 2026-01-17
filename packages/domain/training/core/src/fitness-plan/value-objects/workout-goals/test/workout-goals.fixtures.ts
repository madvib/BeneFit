import { faker } from '@faker-js/faker';
import { WorkoutGoals, CompletionCriteria } from '../workout-goals.types.js';
import { createWorkoutGoals } from '../workout-goals.factory.js';

/**
 * Creates mock CompletionCriteria
 */
export function createCompletionCriteriaFixture(overrides?: Partial<CompletionCriteria>): CompletionCriteria {
  return {
    mustComplete: faker.datatype.boolean(),
    autoVerifiable: faker.datatype.boolean(),
    minimumEffort: faker.number.float({ min: 0, max: 1 }),
    ...overrides,
  };
}

/**
 * Creates mock WorkoutGoals using the official factory
 */
export function createWorkoutGoalsFixture(overrides?: Partial<WorkoutGoals>): WorkoutGoals {
  const result = createWorkoutGoals({
    completionCriteria: createCompletionCriteriaFixture(),
    duration: {
      value: faker.number.int({ min: 30, max: 60 }),
      intensity: faker.helpers.arrayElement(['easy', 'moderate', 'hard', 'max'] as const),
    },
    ...overrides,
  });

  if (result.isFailure) {
    const errorMsg = Array.isArray(result.error)
      ? result.error.map(e => e.message).join(', ')
      : result.error?.message || String(result.error);
    throw new Error(`Failed to create WorkoutGoals fixture: ${ errorMsg }`);
  }

  return result.value;
}
