import { faker } from '@faker-js/faker';
import { ProgressionStrategy, ProgressionType } from '../progression-strategy.types.js';
import { progressionStrategyFromPersistence } from '../progression-strategy.factory.js';

/**
 * Creates a mock ProgressionStrategy using the official factory
 */
export function createProgressionStrategyFixture(
  overrides?: Partial<ProgressionStrategy>,
): ProgressionStrategy {
  const data: ProgressionStrategy = {
    type: faker.helpers.arrayElement(['linear', 'undulating', 'adaptive'] as ProgressionType[]),
    weeklyIncrease: faker.number.float({ min: 0.01, max: 0.1, fractionDigits: 3 }),
    deloadWeeks: [],
    testWeeks: [],
    ...overrides,
  };

  return progressionStrategyFromPersistence(data).value;
}
