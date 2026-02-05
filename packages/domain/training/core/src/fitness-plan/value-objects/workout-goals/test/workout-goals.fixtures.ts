import { faker } from '@faker-js/faker';
import { WorkoutGoals, CompletionCriteria } from '../workout-goals.types.js';
import { workoutGoalsFromPersistence } from '../workout-goals.factory.js';

/**
 * Creates mock CompletionCriteria
 */
export function createCompletionCriteriaFixture(
  overrides?: Partial<CompletionCriteria>,
): CompletionCriteria {
  return {
    mustComplete: faker.datatype.boolean(),
    autoVerifiable: faker.datatype.boolean(),
    minimumEffort: faker.number.int({ min: 0, max: 100 }),
    ...overrides,
  };
}

/**
 * Creates mock WorkoutGoals using the official factory
 */
export function createWorkoutGoalsFixture(overrides?: Partial<WorkoutGoals>): WorkoutGoals {
  const data: WorkoutGoals = {
    completionCriteria: createCompletionCriteriaFixture(),
    duration: {
      value: faker.number.int({ min: 30, max: 60 }),
      intensity: faker.helpers.arrayElement(['easy', 'moderate', 'hard', 'max'] as const),
    },
    ...overrides,
  };

  return workoutGoalsFromPersistence(data).value;
}
