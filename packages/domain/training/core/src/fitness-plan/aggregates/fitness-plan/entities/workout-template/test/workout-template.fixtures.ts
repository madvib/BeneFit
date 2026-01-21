import { faker } from '@faker-js/faker';
import { createWorkoutGoalsFixture } from '@/fitness-plan/value-objects/workout-goals/test/workout-goals.fixtures.js';
import { createWorkoutActivityFixture } from '@/workouts/value-objects/workout-activity/test/workout-activity.fixtures.js';
import {
  WorkoutTemplate,
  WorkoutCategory,
  WorkoutImportance,
  WorkoutStatus
} from '../workout-template.types.js';
import { workoutTemplateFromPersistence } from '../workout-template.factory.js';

/**
 * ============================================================================
 * WORKOUT TEMPLATE FIXTURES (Canonical Pattern)
 * ============================================================================
 * 
 * Uses rehydration factory + realistic faker data.
 */

// ============================================================================
// GENERIC FIXTURE
// ============================================================================

export function createWorkoutTemplateFixture(overrides: Partial<WorkoutTemplate> = {}): WorkoutTemplate {
  const type = overrides.type ?? faker.helpers.arrayElement([
    'strength',
    'cardio',
    'flexibility',
    'hybrid',
    'running',
    'cycling',
    'yoga',
    'hiit',
    'rest',
    'custom',
  ] as const);

  const data = {
    id: faker.string.uuid(),
    planId: faker.string.uuid(),
    weekNumber: faker.number.int({ min: 1, max: 12 }),
    dayOfWeek: faker.number.int({ min: 0, max: 6 }),
    scheduledDate: faker.date.future(),
    rescheduledTo: undefined,
    title: faker.word.words(3),
    description: faker.lorem.sentence(),
    type,
    category: faker.helpers.arrayElement(['cardio', 'strength', 'recovery'] as WorkoutCategory[]),
    goals: createWorkoutGoalsFixture(),
    activities: type === 'rest' ? [] : faker.helpers.multiple(() => createWorkoutActivityFixture(), { count: 3 }),
    status: 'scheduled' as WorkoutStatus,
    completedWorkoutId: undefined,
    userNotes: faker.helpers.maybe(() => faker.lorem.sentence()),
    coachNotes: faker.helpers.maybe(() => faker.lorem.sentence()),
    importance: faker.helpers.arrayElement(['optional', 'recommended', 'key', 'critical'] as WorkoutImportance[]),
    alternatives: [],
    ...overrides,
  };

  const result = workoutTemplateFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create WorkoutTemplate fixture: ${ result.error }`);
  }

  return result.value;
}

// ============================================================================
// SPECIFIC STATUS FIXTURES
// ============================================================================

export function createCompletedWorkoutTemplateFixture(overrides?: Partial<WorkoutTemplate>): WorkoutTemplate {
  return createWorkoutTemplateFixture({
    status: 'completed',
    completedWorkoutId: faker.string.uuid(),
    ...overrides,
  });
}

export function createSkippedWorkoutTemplateFixture(overrides?: Partial<WorkoutTemplate>): WorkoutTemplate {
  return createWorkoutTemplateFixture({
    status: 'skipped',
    userNotes: 'Feeling a bit under the weather today.',
    ...overrides,
  });
}

export function createRestDayFixture(overrides?: Partial<WorkoutTemplate>): WorkoutTemplate {
  return createWorkoutTemplateFixture({
    type: 'rest',
    category: 'recovery',
    activities: [],
    title: 'Rest & Recovery',
    ...overrides,
  });
}

/**
 * Create a list of WorkoutTemplates for testing
 */
export function createWorkoutTemplateListFixture(count: number): WorkoutTemplate[] {
  return Array.from({ length: count }, (_, i) =>
    createWorkoutTemplateFixture({
      title: `Workout ${ i + 1 }`,
    }),
  );
}
