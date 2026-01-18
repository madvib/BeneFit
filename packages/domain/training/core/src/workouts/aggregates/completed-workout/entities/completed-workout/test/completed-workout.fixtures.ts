import { fake } from 'zod-schema-faker/v4';
import { faker } from '@faker-js/faker';
import { SEED_USERS } from '@bene/shared';
import { createUnverifiedWorkoutFixture, createMinimalPerformanceFixture } from '@/workouts/value-objects/index.js';
import { createFireReactionFixture, createStrongReactionFixture } from '../../reaction/index.js';
import { CompletedWorkout } from '../completed-workout.types.js';
import { CompletedWorkoutSchema } from '../completed-workout.presentation.js';
import { createCompletedWorkout } from '../completed-workout.factory.js';

/**
 * Canonical Fixtures for CompletedWorkout
 * 
 * Located in core domain because:
 * - Used by repository tests (DB mapper validation)
 * - Used for seed data (tests persistence round-trips)
 * - Never needed by frontend (they use gateway fixtures)
 * - Single source of truth for entity structure
 */

/**
 * Create a minimal valid CompletedWorkout for testing
 */
export function createMinimalCompletedWorkoutFixture(overrides?: Partial<CompletedWorkout>): CompletedWorkout {
  // Use value object fixtures!
  const performance = createMinimalPerformanceFixture();
  const verification = createUnverifiedWorkoutFixture();

  // Pick random user from seeds or generate
  const user = faker.helpers.arrayElement(SEED_USERS);

  const result = createCompletedWorkout({
    userId: user.id,
    workoutType: faker.helpers.arrayElement(['strength', 'cardio', 'flexibility']),
    title: faker.word.words(3),
    performance,
    verification,
    isPublic: faker.datatype.boolean(),
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}

/**
 * Create a CompletedWorkout with plan reference
 */
export function createPlanWorkoutFixture(overrides?: Partial<CompletedWorkout>): CompletedWorkout {
  return createMinimalCompletedWorkoutFixture({
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
export function createMultiplayerWorkoutFixture(overrides?: Partial<CompletedWorkout>): CompletedWorkout {
  return createMinimalCompletedWorkoutFixture({
    multiplayerSessionId: faker.string.uuid(),
    isPublic: true,
    ...overrides,
  });
}

/**
 * Create a CompletedWorkout with reactions
 */
export function createWorkoutWithReactionsFixture(overrides?: Partial<CompletedWorkout>): CompletedWorkout {
  const workout = createMinimalCompletedWorkoutFixture(overrides);

  // Use reaction fixtures!
  const reaction1 = createFireReactionFixture({
    createdAt: new Date(),
  });

  const reaction2 = createStrongReactionFixture({
    createdAt: new Date(),
  });

  return {
    ...workout,
    reactions: [reaction1, reaction2],
  };
}

/**
 * Generate a random CompletedWorkout response using zod-schema-faker
 * 
 * Useful for:
 * - Fuzz testing
 * - Generating large datasets
 * - Testing edge cases
 */
export function generateRandomWorkoutResponse() {
  return fake(CompletedWorkoutSchema);
}

/**
 * Create a list of CompletedWorkouts for testing
 */
export function createWorkoutListFixture(count: number): CompletedWorkout[] {
  return Array.from({ length: count }, (_, i) =>
    createMinimalCompletedWorkoutFixture({
      title: `Workout ${ i + 1 }`,
    })
  );
}
