import { faker } from '@faker-js/faker';
import { ProgressionStrategy, ProgressionType } from '../progression-strategy.types.js';
import { createProgressionStrategy } from '../progression-strategy.factory.js';

/**
 * Creates a mock ProgressionStrategy using the official factory
 */
export function createProgressionStrategyFixture(overrides?: Partial<ProgressionStrategy>): ProgressionStrategy {
  const result = createProgressionStrategy({
    type: faker.helpers.arrayElement(['linear', 'undulating', 'adaptive'] as ProgressionType[]),
    weeklyIncrease: faker.number.float({ min: 0.01, max: 0.1 }),
    deloadWeeks: [],
    testWeeks: [],
    ...overrides,
  });

  if (result.isFailure) {
    const errorMsg = Array.isArray(result.error)
      ? result.error.map(e => e.message).join(', ')
      : result.error?.message || String(result.error);
    throw new Error(`Failed to create ProgressionStrategy fixture: ${ errorMsg }`);
  }

  return result.value;
}
