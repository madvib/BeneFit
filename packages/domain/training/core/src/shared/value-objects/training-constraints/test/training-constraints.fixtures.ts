import { faker } from '@faker-js/faker';
import { TrainingConstraints, Injury } from '../training-constraints.types.js';
import { trainingConstraintsFromPersistence } from '../training-constraints.factory.js';

/**
 * Creates a mock Injury object
 */
export function createInjuryFixture(overrides?: Partial<Injury>): Injury {
  return {
    bodyPart: faker.lorem.word(),
    severity: faker.helpers.arrayElement(['minor', 'moderate', 'serious'] as const),
    avoidExercises: faker.helpers.arrayElements(['Squats', 'Deadlifts', 'Running', 'Jumping'], { min: 1, max: 2 }),
    reportedDate: faker.date.recent(),
    notes: faker.lorem.sentence(),
    ...overrides,
  };
}

/**
 * Creates a mock TrainingConstraints object using the official factory
 */
export function createTrainingConstraintsFixture(
  overrides?: Partial<TrainingConstraints>,
): TrainingConstraints {
  const data = {
    availableDays: faker.helpers.arrayElements(
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      { min: 1, max: 5 },
    ),
    preferredTime: faker.helpers.arrayElement(['morning', 'afternoon', 'evening'] as const),
    maxDuration: faker.number.int({ min: 15, max: 120 }),
    availableEquipment: faker.helpers.arrayElements(
      ['Dumbbells', 'Barbell', 'Resistance Bands', 'Kettlebell', 'Bench'],
      { min: 0, max: 4 },
    ),
    location: faker.helpers.arrayElement(['home', 'gym', 'outdoor', 'mixed'] as const),
    injuries: [],
    ...overrides,
  };

  return trainingConstraintsFromPersistence(data).value;
}
