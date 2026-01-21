import { faker } from '@faker-js/faker';
import { WeeklySchedule } from '../weekly-schedule.types.js';
import { createWorkoutTemplateFixture } from '../../workout-template/test/workout-template.fixtures.js';
import { weeklyScheduleFromPersistence } from '../weekly-schedule.factory.js';

export function createWeeklyScheduleFixture(overrides: Partial<WeeklySchedule> = {}): WeeklySchedule {
  const weekNumber = overrides.weekNumber ?? faker.number.int({ min: 1, max: 12 });
  const startDate = overrides.startDate ?? faker.date.future();
  const endDate = overrides.endDate ?? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  const data = {
    id: faker.string.uuid(),
    weekNumber,
    planId: faker.string.uuid(),
    startDate,
    endDate,
    focus: faker.company.catchPhrase(),
    targetWorkouts: faker.number.int({ min: 3, max: 6 }),
    workouts: overrides.workouts ?? [
      createWorkoutTemplateFixture({ dayOfWeek: 1, weekNumber }),
      createWorkoutTemplateFixture({ dayOfWeek: 3, weekNumber }),
      createWorkoutTemplateFixture({ dayOfWeek: 5, weekNumber }),
    ],
    workoutsCompleted: 0,
    notes: faker.lorem.sentence(),
    ...overrides,
  };

  const result = weeklyScheduleFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create WeeklySchedule fixture: ${ result.error }`);
  }

  return result.value;
}
