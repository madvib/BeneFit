import { faker } from '@faker-js/faker';
import { PlanPosition } from '../plan-position.types.js';
import { createPlanPosition } from '../plan-position.factory.js';

/**
 * Creates a mock PlanPosition using the official factory
 */
export function createPlanPositionFixture(overrides?: Partial<PlanPosition>): PlanPosition {
  const result = createPlanPosition({
    week: faker.number.int({ min: 1, max: 12 }),
    day: faker.number.int({ min: 0, max: 6 }),
    ...overrides,
  });

  if (result.isFailure) {
    const errorMsg = Array.isArray(result.error)
      ? result.error.map(e => e.message).join(', ')
      : result.error?.message || String(result.error);
    throw new Error(`Failed to create PlanPosition fixture: ${ errorMsg }`);
  }

  return result.value;
}
