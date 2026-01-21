import { faker } from '@faker-js/faker';
import { createActivityStructureFixture } from '@/fixtures.js';
import { WorkoutActivity, ActivityType } from '../workout-activity.types.js';
import { workoutActivityFromPersistence } from '../workout-activity.factory.js';

/**
 * Creates a mock WorkoutActivity using workoutActivityFromPersistence.
 */
export function createWorkoutActivityFixture(overrides?: Partial<WorkoutActivity>): WorkoutActivity {
  const type = faker.helpers.arrayElement(['warmup', 'main', 'cooldown', 'interval', 'circuit'] as ActivityType[]);

  // Conditionally create structure if needed by type
  const structure = (type === 'interval' || type === 'circuit')
    ? createActivityStructureFixture({
      intervals: type === 'interval' ? Array.from({ length: 3 }, () => ({ duration: 60, intensity: 'hard' as const, rest: 30 })) : undefined,
      exercises: type === 'circuit' ? Array.from({ length: 3 }, () => ({ name: 'Exercise', sets: 3, reps: 10, rest: 60 })) : undefined
    })
    : undefined;

  // Build unbranded data with faker
  const data = {
    name: faker.helpers.arrayElement(['Pushups', 'Squats', 'Running', 'Bench Press', 'Yoga Flow']),
    type,
    order: faker.number.int({ min: 1, max: 10 }),
    instructions: [faker.lorem.sentence(), faker.lorem.sentence()],
    duration: faker.number.int({ min: 5, max: 60 }),
    distance: type === 'main' ? faker.number.float({ min: 100, max: 10000 }) : undefined,
    pace: type === 'main' ? faker.helpers.arrayElement(['easy', 'moderate', 'hard', '5:00/km']) : undefined,
    videoUrl: 'https://example.com/video',
    equipment: faker.helpers.arrayElements(['Dumbbells', 'Mat', 'Barbell'], { min: 0, max: 2 }),
    alternativeExercises: faker.helpers.arrayElements(['Burpees', 'Lunges'], { min: 0, max: 1 }),
    structure,
    ...overrides,
  };

  // Rehydrate through fromPersistence
  const result = workoutActivityFromPersistence(data);

  if (result.isFailure) {
    const errorMsg = Array.isArray(result.error)
      ? result.error.map(e => e.message).join(', ')
      : result.error?.message || String(result.error);
    throw new Error(`Failed to create WorkoutActivity fixture: ${ errorMsg }`);
  }

  return result.value;
}
