import { faker } from '@faker-js/faker';
import { createTrainingConstraintsFixture, createPlanGoalsFixture, createProgressionStrategyFixture, createPlanPositionFixture, createWeeklyScheduleFixture } from '@/fixtures.js';
import { type FitnessPlan, type PlanType } from '../fitness-plan.types.js';
import { fitnessPlanFromPersistence } from '../fitness-plan.factory.js';

export function createFitnessPlanFixture(overrides?: Partial<FitnessPlan>): FitnessPlan {
  const weeks = overrides?.weeks ?? faker.helpers.multiple(
    (_, i) => createWeeklyScheduleFixture({ weekNumber: i + 1 }),
    { count: { min: 4, max: 12 } }
  );

  const data = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    planType: faker.helpers.arrayElement(['event_training', 'habit_building', 'strength_program', 'general_fitness'] as PlanType[]),
    goals: createPlanGoalsFixture(),
    progression: createProgressionStrategyFixture(),
    constraints: createTrainingConstraintsFixture(),
    weeks: weeks,
    status: 'active' as const,
    currentPosition: createPlanPositionFixture(),
    startDate: faker.date.past(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };

  const result = fitnessPlanFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create FitnessPlan fixture: ${ result.error }`);
  }

  return result.value;
}

export function createFitnessPlanListFixture(count: number, overrides?: Partial<FitnessPlan>): FitnessPlan[] {
  return Array.from({ length: count }, () => createFitnessPlanFixture(overrides));
}
