import { faker } from '@faker-js/faker';
import { FitnessGoals, PrimaryFitnessGoal } from '../fitness-goals.types.js';

export function createFitnessGoalsFixture(overrides?: Partial<FitnessGoals>): FitnessGoals {
  return {
    primary: faker.helpers.arrayElement([
      'strength', 'hypertrophy', 'endurance', 'weight_loss',
      'weight_gain', 'general_fitness', 'sport_specific',
      'mobility', 'rehabilitation'
    ] as PrimaryFitnessGoal[]),
    secondary: faker.helpers.arrayElements(['mobility', 'endurance'], { min: 0, max: 2 }),
    targetWeight: {
      current: faker.number.int({ min: 60, max: 100 }),
      target: faker.number.int({ min: 70, max: 90 }),
      unit: 'kg',
    },
    targetBodyFat: faker.number.int({ min: 10, max: 25 }),
    targetDate: faker.date.future(),
    motivation: faker.lorem.sentence(),
    successCriteria: [faker.lorem.sentence()],
    ...overrides,
  };
}
