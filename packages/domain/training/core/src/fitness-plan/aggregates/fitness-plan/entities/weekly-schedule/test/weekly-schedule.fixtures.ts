import { faker } from '@faker-js/faker';
import { WeeklySchedule } from '../weekly-schedule.types.js';
import { createWorkoutTemplateFixture } from '../../workout-template/test/workout-template.fixtures.js';

export function createWeeklyScheduleFixture(overrides?: Partial<WeeklySchedule>): WeeklySchedule {
  const weekNumber = overrides?.weekNumber ?? faker.number.int({ min: 1, max: 12 });

  return {
    id: faker.string.uuid(),
    weekNumber,
    planId: faker.string.uuid(),
    startDate: faker.date.future(),
    endDate: faker.date.future(),
    focus: faker.company.catchPhrase(),
    targetWorkouts: faker.number.int({ min: 3, max: 6 }),
    workouts: [
      createWorkoutTemplateFixture({ dayOfWeek: 1, weekNumber }),
      createWorkoutTemplateFixture({ dayOfWeek: 3, weekNumber }),
      createWorkoutTemplateFixture({ dayOfWeek: 5, weekNumber }),
    ],
    workoutsCompleted: 0,
    notes: faker.lorem.sentence(),
    ...overrides,
  };
}
