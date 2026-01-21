import { faker } from '@faker-js/faker';
import { WorkoutPreview } from '../workout-preview.types.js';
import { createWorkoutPreview } from '../workout-preview.factory.js';

export function createWorkoutPreviewFixture(overrides?: Partial<WorkoutPreview>): WorkoutPreview {
  return createWorkoutPreview({
    weekNumber: faker.number.int({ min: 1, max: 52 }),
    dayOfWeek: faker.number.int({ min: 0, max: 6 }),
    workoutSummary: faker.lorem.sentence(),
    type: faker.helpers.arrayElement(['strength', 'cardio', 'flexibility', 'hybrid', 'running', 'cycling', 'yoga', 'hiit']),
    ...overrides,
  }).value;
}

export function createWorkoutPreviewListFixture(count: number, overrides?: Partial<WorkoutPreview>): WorkoutPreview[] {
  return Array.from({ length: count }, () => createWorkoutPreviewFixture(overrides));
}
