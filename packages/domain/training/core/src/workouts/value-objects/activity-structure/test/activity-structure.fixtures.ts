import { faker } from '@faker-js/faker';
import { ActivityStructure, Exercise, Interval, IntensityLevel } from '../activity-structure.types.js';
import { activityStructureFromPersistence } from '../activity-structure.factory.js';

/**
 * Creates a mock Exercise structure
 */
export function createExerciseFixture(overrides?: Partial<Exercise>): Exercise {
  return {
    name: faker.helpers.arrayElement(['Pushups', 'Squats', 'Plank', 'Bench Press', 'Lunges']),
    sets: faker.number.int({ min: 1, max: 5 }),
    reps: faker.helpers.arrayElement([8, 10, 12, 'to failure']),
    weight: faker.number.int({ min: 0, max: 100 }),
    rest: faker.number.int({ min: 30, max: 120 }),
    notes: faker.lorem.sentence(),
    ...overrides,
  };
}

/**
 * Creates a mock Interval structure
 */
export function createIntervalFixture(overrides?: Partial<Interval>): Interval {
  return {
    duration: faker.number.int({ min: 30, max: 300 }),
    intensity: faker.helpers.arrayElement(['easy', 'moderate', 'hard', 'sprint'] as IntensityLevel[]),
    rest: faker.number.int({ min: 15, max: 60 }),
    ...overrides,
  };
}

/**
 * Creates a mock ActivityStructure using activityStructureFromPersistence.
 * Ensures domain invariants (like not having both intervals and exercises) are respected.
 */
export function createActivityStructureFixture(overrides?: Partial<ActivityStructure>): ActivityStructure {
  const isInterval = faker.datatype.boolean();

  // Build unbranded data with faker
  const data = {
    intervals: isInterval ? Array.from({ length: 3 }, () => createIntervalFixture()) : undefined,
    rounds: isInterval ? faker.number.int({ min: 1, max: 5 }) : 1,
    exercises: !isInterval ? Array.from({ length: 3 }, () => createExerciseFixture()) : undefined,
    ...overrides,
  };

  // Rehydrate through fromPersistence
  const result = activityStructureFromPersistence(data);

  if (result.isFailure) {
    const errorMsg = Array.isArray(result.error)
      ? result.error.map(e => e.message).join(', ')
      : result.error?.message || String(result.error);
    throw new Error(`Failed to create ActivityStructure fixture: ${ errorMsg }`);
  }

  return result.value;
}
