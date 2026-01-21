import { faker } from '@faker-js/faker';
import { LiveActivityProgress, IntervalProgress, ExerciseProgress } from '../live-activity-progress.types.js';
import { liveActivityProgressFromPersistence } from '../live-activity-progress.factory.js';

/**
 * Creates a mock IntervalProgress
 */
export function createIntervalProgressFixture(overrides?: Partial<IntervalProgress>): IntervalProgress {
  return {
    intervalNumber: faker.number.int({ min: 1, max: 8 }),
    totalIntervals: 8,
    intervalDurationSeconds: 60,
    elapsedSeconds: faker.number.int({ min: 0, max: 60 }),
    isResting: faker.datatype.boolean(),
    ...overrides,
  };
}

/**
 * Creates a mock ExerciseProgress
 */
export function createExerciseProgressFixture(overrides?: Partial<ExerciseProgress>): ExerciseProgress {
  return {
    exerciseName: faker.helpers.arrayElement(['Pushups', 'Squats', 'Plank']),
    currentSet: faker.number.int({ min: 1, max: 3 }),
    totalSets: 3,
    repsCompleted: faker.number.int({ min: 5, max: 15 }),
    targetReps: 15,
    weightUsed: faker.number.int({ min: 0, max: 50 }),
    restTimeRemaining: faker.number.int({ min: 0, max: 90 }),
    ...overrides,
  };
}

/**
 * Creates a mock LiveActivityProgress using liveActivityProgressFromPersistence.
 */
export function createLiveActivityProgressFixture(overrides?: Partial<LiveActivityProgress>): LiveActivityProgress {
  const activityType = faker.helpers.arrayElement(['warmup', 'main', 'cooldown', 'interval', 'circuit'] as const);
  const totalActivities = 6;

  // Build unbranded data with faker
  const data = {
    activityType,
    activityIndex: faker.number.int({ min: 0, max: totalActivities - 1 }),
    totalActivities,
    intervalProgress: activityType === 'interval' ? createIntervalProgressFixture() : undefined,
    exerciseProgress: activityType === 'main' ? [createExerciseProgressFixture()] : undefined,
    activityStartedAt: faker.date.recent(),
    elapsedSeconds: faker.number.int({ min: 0, max: 1800 }),
    estimatedRemainingSeconds: faker.number.int({ min: 0, max: 1800 }),
    ...overrides,
  };

  // Rehydrate through fromPersistence
  const result = liveActivityProgressFromPersistence(data);

  if (result.isFailure) {
    const errorMsg = Array.isArray(result.error)
      ? result.error.map(e => e.message).join(', ')
      : result.error?.message || String(result.error);
    throw new Error(`Failed to create LiveActivityProgress fixture: ${ errorMsg }`);
  }

  return result.value;
}
