import type { WeeklySchedule } from './weekly-schedule.types.js';

// TODO: Add WeeklyScheduleView interface to weekly-schedule.types.ts
// For now, just pass through (no transformation needed)
export type WeeklyScheduleView = WeeklySchedule;

export function toWeeklyScheduleView(schedule: WeeklySchedule): WeeklyScheduleView {
  // TODO: Implement proper view mapping when view interface is defined
  return schedule as WeeklyScheduleView;
}
