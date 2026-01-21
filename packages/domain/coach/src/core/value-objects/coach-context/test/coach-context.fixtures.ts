import { faker } from '@faker-js/faker';
import {
  createFitnessGoalsFixture,
  createTrainingConstraintsFixture
} from '@bene/training-core/fixtures';
import { CoachContext, CurrentPlanContext, RecentWorkoutSummary, PerformanceTrends } from '../coach-context.types.js';
import { coachContextFromPersistence } from '../coach-context.factory.js';

/**
 * Creates a CurrentPlanContext fixture for testing.
 */
export function createCurrentPlanContextFixture(
  overrides?: Partial<CurrentPlanContext>
): CurrentPlanContext {
  return {
    planId: faker.string.uuid(),
    planName: faker.lorem.words(3),
    weekNumber: faker.number.int({ min: 1, max: 12 }),
    dayNumber: faker.number.int({ min: 1, max: 7 }),
    totalWeeks: faker.number.int({ min: 8, max: 16 }),
    adherenceRate: faker.number.float({ min: 0.5, max: 1, fractionDigits: 2 }),
    completionRate: faker.number.float({ min: 0.4, max: 1, fractionDigits: 2 }),
    ...overrides,
  };
}

/**
 * Creates a RecentWorkoutSummary fixture for testing.
 */
export function createRecentWorkoutSummaryFixture(
  overrides?: Partial<RecentWorkoutSummary>
): RecentWorkoutSummary {
  return {
    workoutId: faker.string.uuid(),
    date: faker.date.recent({ days: 14 }),
    type: faker.helpers.arrayElement(['strength', 'cardio', 'mobility', 'hiit']),
    durationMinutes: faker.number.int({ min: 20, max: 90 }),
    perceivedExertion: faker.number.int({ min: 1, max: 10 }),
    enjoyment: faker.number.int({ min: 1, max: 5 }),
    difficultyRating: faker.helpers.arrayElement(['too_easy', 'just_right', 'too_hard'] as const),
    completed: faker.datatype.boolean({ probability: 0.8 }),
    notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    ...overrides,
  };
}

/**
 * Creates a PerformanceTrends fixture for testing.
 */
export function createPerformanceTrendsFixture(
  overrides?: Partial<PerformanceTrends>
): PerformanceTrends {
  return {
    volumeTrend: faker.helpers.arrayElement(['increasing', 'stable', 'decreasing'] as const),
    adherenceTrend: faker.helpers.arrayElement(['improving', 'stable', 'declining'] as const),
    energyTrend: faker.helpers.arrayElement(['high', 'medium', 'low'] as const),
    exertionTrend: faker.helpers.arrayElement(['increasing', 'stable', 'decreasing'] as const),
    enjoymentTrend: faker.helpers.arrayElement(['improving', 'stable', 'declining'] as const),
    ...overrides,
  };
}

/**
 * Creates a CoachContext fixture for testing.
 * Uses coachContextFromPersistence to ensure branding and type safety.
 */
export function createCoachContextFixture(overrides?: Partial<CoachContext>): CoachContext {
  const userGoals = createFitnessGoalsFixture();
  const userConstraints = createTrainingConstraintsFixture();

  const data = {
    currentPlan: faker.datatype.boolean() ? createCurrentPlanContextFixture() : undefined,
    recentWorkouts: faker.helpers.multiple(() => createRecentWorkoutSummaryFixture(), {
      count: { min: 3, max: 10 },
    }),
    userGoals,
    userConstraints,
    experienceLevel: faker.helpers.arrayElement([
      'beginner',
      'intermediate',
      'advanced',
      'elite',
    ] as const),
    trends: createPerformanceTrendsFixture(),
    daysIntoCurrentWeek: faker.number.int({ min: 0, max: 7 }),
    workoutsThisWeek: faker.number.int({ min: 0, max: 6 }),
    plannedWorkoutsThisWeek: faker.number.int({ min: 3, max: 6 }),
    reportedInjuries: userConstraints.injuries ? [...userConstraints.injuries] : undefined,
    energyLevel: faker.helpers.arrayElement(['low', 'medium', 'high'] as const),
    stressLevel: faker.helpers.arrayElement(['low', 'medium', 'high'] as const),
    sleepQuality: faker.helpers.arrayElement(['poor', 'fair', 'good'] as const),
    ...overrides,
  };

  const result = coachContextFromPersistence(data as CoachContext);

  if (result.isFailure) {
    throw new Error(`Failed to create CoachContext fixture: ${ result.error }`);
  }

  return result.value;
}
