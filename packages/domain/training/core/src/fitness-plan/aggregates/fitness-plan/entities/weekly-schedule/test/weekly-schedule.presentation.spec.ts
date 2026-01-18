import { describe, it, expect } from 'vitest';
import { WeeklyScheduleSchema, toWeeklyScheduleSchema } from '../weekly-schedule.schema.js';
import { createWeeklyScheduleFixture } from './weekly-schedule.fixtures.js';

describe('WeeklySchedule Presentation', () => {
  it('should map a valid weekly schedule entity to presentation DTO', () => {
    const schedule = createWeeklyScheduleFixture();
    const presentation = toWeeklyScheduleSchema(schedule);

    const result = WeeklyScheduleSchema.safeParse(presentation);

    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }

    expect(result.success).toBe(true);
    expect(presentation.id).toBe(schedule.id);
    expect(presentation.weekNumber).toBe(schedule.weekNumber);
    expect(presentation.workouts.length).toBe(schedule.workouts.length);
  });

  it('should correctly map nested workouts', () => {
    const schedule = createWeeklyScheduleFixture();
    const presentation = toWeeklyScheduleSchema(schedule);

    expect(presentation.workouts).toHaveLength(schedule.workouts.length);
    if (presentation.workouts.length > 0 && schedule.workouts[0]) {
      expect(presentation.workouts[0]!.id).toBe(schedule.workouts[0].id);
      expect(presentation.workouts[0]!.title).toBe(schedule.workouts[0].title);
    }
  });
});
