import { faker } from '@faker-js/faker';
import { PlanPosition } from '../plan-position.types.js';
import { planPositionFromPersistence } from '../plan-position.factory.js';

/**
 * Creates a mock PlanPosition using the official factory
 */
export function createPlanPositionFixture(overrides?: Partial<PlanPosition>): PlanPosition {
  const data: PlanPosition = {
    week: faker.number.int({ min: 1, max: 12 }),
    day: faker.number.int({ min: 0, max: 6 }),
    ...overrides,
  };

  return planPositionFromPersistence(data).value;
}
