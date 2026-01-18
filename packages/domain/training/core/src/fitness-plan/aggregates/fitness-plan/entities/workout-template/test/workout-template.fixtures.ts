import { faker } from '@faker-js/faker';
import { createWorkoutGoalsFixture } from '@/fitness-plan/value-objects/workout-goals/test/workout-goals.fixtures.js';
import { WorkoutTemplate, WorkoutTemplateData, WorkoutCategory, WorkoutImportance } from '../workout-template.types.js';
import { createWorkoutActivityFixture } from '@/workouts/value-objects/workout-activity/test/workout-activity.fixtures.js';

export function createWorkoutTemplateFixture(overrides?: Partial<WorkoutTemplateData>): WorkoutTemplate {
  return {
    id: faker.string.uuid(),
    planId: faker.string.uuid(),
    weekNumber: faker.number.int({ min: 1, max: 12 }),
    dayOfWeek: faker.number.int({ min: 0, max: 6 }),
    scheduledDate: faker.date.future(),
    title: faker.word.words(3),
    description: faker.lorem.sentence(),
    type: 'strength', // stringified WorkoutType
    category: faker.helpers.arrayElement(['cardio', 'strength', 'recovery'] as WorkoutCategory[]),
    goals: createWorkoutGoalsFixture(),
    activities: faker.helpers.multiple(() => createWorkoutActivityFixture(), { count: 5 }),
    status: 'scheduled',
    importance: faker.helpers.arrayElement(['optional', 'recommended', 'key', 'critical'] as WorkoutImportance[]),
    ...overrides,
  };
}
