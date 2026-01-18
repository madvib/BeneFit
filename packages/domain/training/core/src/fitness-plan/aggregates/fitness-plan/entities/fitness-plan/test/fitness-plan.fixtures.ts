import { faker } from '@faker-js/faker';
import { createTrainingConstraintsFixture } from '@/shared/value-objects/training-constraints/index.js';
import { createPlanGoalsFixture, createProgressionStrategyFixture, createPlanPositionFixture } from '@/fitness-plan/value-objects/index.js';
import { createWeeklyScheduleFixture } from '../../weekly-schedule/test/weekly-schedule.fixtures.js';
import { FitnessPlan, PlanType } from '../fitness-plan.types.js';


export function createFitnessPlanFixture(overrides?: Partial<FitnessPlan>): FitnessPlan {
  const weeks = [
    createWeeklyScheduleFixture({ weekNumber: 1 }),
    createWeeklyScheduleFixture({ weekNumber: 2 }),
  ];

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    planType: faker.helpers.arrayElement(['event_training', 'habit_building', 'strength_program', 'general_fitness'] as PlanType[]),
    goals: createPlanGoalsFixture(),
    progression: createProgressionStrategyFixture(),
    constraints: createTrainingConstraintsFixture(),
    weeks: weeks,
    status: 'active',
    currentPosition: createPlanPositionFixture(),
    startDate: faker.date.past(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ...overrides,
  };
}

export function createFitnessPlanListFixture(count: number, overrides?: Partial<FitnessPlan>): FitnessPlan[] {
  return Array.from({ length: count }, () => createFitnessPlanFixture(overrides));
}
