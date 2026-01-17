import { faker } from '@faker-js/faker';
import { PlanGoals, TargetMetrics } from '../plan-goals.types.js';
import { createPlanGoals } from '../plan-goals.factory.js';

export function createTargetMetricsFixture(overrides?: Partial<TargetMetrics>): TargetMetrics {
  return {
    targetDistance: faker.number.int({ min: 5000, max: 42195 }),
    targetPace: faker.number.int({ min: 240, max: 600 }),
    totalWorkouts: faker.number.int({ min: 12, max: 48 }),
    ...overrides,
  };
}

export function createPlanGoalsFixture(overrides?: Partial<PlanGoals>): PlanGoals {
  const primary = faker.company.catchPhrase();
  const secondary = [faker.company.buzzPhrase(), faker.hacker.phrase()];
  const targetMetrics = createTargetMetricsFixture();

  const result = createPlanGoals({
    primary,
    secondary,
    targetMetrics,
    targetDate: faker.date.future(),
    ...overrides,
  });

  if (result.isFailure) {
    throw new Error(`Failed to create PlanGoals fixture: ${ result.error }`);
  }
  return result.value;
}
