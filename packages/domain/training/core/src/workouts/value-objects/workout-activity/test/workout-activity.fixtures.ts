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
    name: faker.helpers.arrayElement([
      'Pushups', 'Squats', 'Running', 'Bench Press', 'Yoga Flow',
      'Cycling', 'Swimming', 'Plank', 'Lunges', 'Deadlift'
    ]),
    type,
    order: faker.number.int({ min: 0, max: 20 }),
    instructions: faker.helpers.multiple(() => faker.lorem.sentence(), { count: { min: 1, max: 5 } }),
    duration: faker.number.int({ min: 1, max: 90 }),
    distance: type === 'main' ? faker.number.float({ min: 100, max: 20000 }) : undefined,
    pace: type === 'main' ? faker.helpers.arrayElement(['easy', 'moderate', 'hard', '4:30/km', '5:00/km', '6:00/km']) : undefined,
    videoUrl: faker.internet.url(),
    equipment: faker.helpers.arrayElements(['Dumbbells', 'Mat', 'Barbell', 'Kettlebell', 'Bench'], { min: 0, max: 3 }),
    alternativeExercises: faker.helpers.arrayElements(['Burpees', 'Lunges', 'Mountain Climbers'], { min: 0, max: 2 }),
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
