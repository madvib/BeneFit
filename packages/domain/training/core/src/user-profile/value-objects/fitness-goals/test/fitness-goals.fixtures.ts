import { faker } from '@faker-js/faker';
import { FitnessGoals, PrimaryFitnessGoal } from '../fitness-goals.types.js';
import { fitnessGoalsFromPersistence } from '../fitness-goals.factory.js';

export function createFitnessGoalsFixture(overrides?: Partial<FitnessGoals>): FitnessGoals {
  const data = {
    primary: faker.helpers.arrayElement([
      'strength', 'hypertrophy', 'endurance', 'weight_loss',
      'weight_gain', 'general_fitness', 'sport_specific',
      'mobility', 'rehabilitation'
    ] as PrimaryFitnessGoal[]),
    secondary: faker.helpers.arrayElements(['mobility', 'endurance'], { min: 0, max: 2 }),
    targetWeight: {
      current: faker.number.int({ min: 60, max: 100 }),
      target: faker.number.int({ min: 70, max: 90 }),
      unit: 'kg' as const,
    },
    targetBodyFat: faker.number.int({ min: 10, max: 25 }),
    targetDate: faker.date.future(),
    motivation: faker.lorem.sentence(),
    successCriteria: [faker.lorem.sentence()],
    ...overrides,
  };

  const result = fitnessGoalsFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create FitnessGoals fixture: ${ result.error }`);
  }

  return result.value;
}
