import { faker } from '@faker-js/faker';
import { createFireReactionFixture, createMinimalPerformanceFixture, createStrongReactionFixture, createUnverifiedWorkoutFixture } from '@/fixtures.js';
import { CompletedWorkout } from '../completed-workout.types.js';
import { completedWorkoutFromPersistence } from '../completed-workout.factory.js';

/**
 * Canonical Fixtures for CompletedWorkout
 */

/**
 * Main fixture for CompletedWorkout.
 * Follows the canonical pattern using fromPersistence and faker.
 */
export function createCompletedWorkoutFixture(
  overrides?: Partial<CompletedWorkout>,
): CompletedWorkout {
  const performance = createMinimalPerformanceFixture();
  const now = new Date();

  const data = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    title: faker.word.words({ count: { min: 2, max: 4 } }),
    description: faker.lorem.sentence(),
    workoutType: faker.helpers.arrayElement(['strength', 'cardio', 'flexibility'] as const),
    performance,
    verification: createUnverifiedWorkoutFixture(),
    isPublic: faker.datatype.boolean(),
    reactions: [],
    createdAt: now,
    recordedAt: performance.completedAt || now,
    ...overrides,
  };

  const result = completedWorkoutFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create CompletedWorkout fixture: ${ result.error }`);
  }

  return result.value;
}

/**
 * Create a CompletedWorkout with plan reference
 */
export function createPlanWorkoutFixture(
  overrides?: Partial<CompletedWorkout>,
): CompletedWorkout {
  return createCompletedWorkoutFixture({
    planId: faker.string.uuid(),
    workoutTemplateId: faker.string.uuid(),
    weekNumber: faker.number.int({ min: 1, max: 12 }),
    dayNumber: faker.number.int({ min: 1, max: 7 }),
    ...overrides,
  });
}

/**
 * Create a CompletedWorkout with multiplayer session
 */
export function createMultiplayerWorkoutFixture(
  overrides?: Partial<CompletedWorkout>,
): CompletedWorkout {
  return createCompletedWorkoutFixture({
    multiplayerSessionId: faker.string.uuid(),
    isPublic: true,
    ...overrides,
  });
}

/**
 * Create a CompletedWorkout with reactions
 */
export function createWorkoutWithReactionsFixture(
  overrides?: Partial<CompletedWorkout>,
): CompletedWorkout {
  const reaction1 = createFireReactionFixture({
    createdAt: new Date(),
  });

  const reaction2 = createStrongReactionFixture({
    createdAt: new Date(),
  });

  return createCompletedWorkoutFixture({
    reactions: [reaction1, reaction2],
    ...overrides,
  });
}

/**
 * Create a list of CompletedWorkouts for testing
 */
export function createWorkoutListFixture(count: number): CompletedWorkout[] {
  return Array.from({ length: count }, (_, i) =>
    createCompletedWorkoutFixture({
      title: `Workout ${ i + 1 }`,
    }),
  );
}

