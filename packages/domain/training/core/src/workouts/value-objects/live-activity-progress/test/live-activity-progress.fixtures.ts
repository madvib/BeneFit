import { faker } from '@faker-js/faker';
import { LiveActivityProgress, IntervalProgress, ExerciseProgress } from '../live-activity-progress.types.js';
import { createLiveActivityProgress } from '../live-activity-progress.factory.js';

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
 * Creates a mock LiveActivityProgress using the official factory
 */
export function createLiveActivityProgressFixture(overrides?: Partial<LiveActivityProgress>): LiveActivityProgress {
  const activityType = faker.helpers.arrayElement(['warmup', 'main', 'cooldown', 'interval', 'circuit'] as const);
  const totalActivities = 6;

  const result = createLiveActivityProgress({
    activityType,
    activityIndex: faker.number.int({ min: 0, max: totalActivities - 1 }),
    totalActivities,
    intervalProgress: activityType === 'interval' ? createIntervalProgressFixture() : undefined,
    exerciseProgress: activityType === 'main' ? [createExerciseProgressFixture()] : undefined,
  });

  if (result.isFailure) {
    throw new Error(`Failed to create LiveActivityProgress fixture: ${ result.error }`);
  }

  return {
    ...result.value,
    activityStartedAt: faker.date.recent(),
    elapsedSeconds: faker.number.int({ min: 0, max: 1800 }),
    estimatedRemainingSeconds: faker.number.int({ min: 0, max: 1800 }),
    ...overrides,
  };
}
