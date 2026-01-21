import { CreateView } from '@bene/shared';
import { WeeklySchedule } from './weekly-schedule.types.js';
import { toWorkoutTemplateView, WorkoutTemplateView } from '../workout-template/index.js';
import { getWeekStatus } from './weekly-schedule.queries.js';

/**
 * VIEW INTERFACE (API Presentation)
 */
export type WeeklyScheduleView = CreateView<
  WeeklySchedule,
  'workouts',
  {
    workouts: WorkoutTemplateView[];
    startDate: string;
    endDate: string;
    progress: {
      onTrack: boolean;
      completionRate: number;
      workoutsRemaining: number;
      daysRemaining: number;
    };
  }
>;

/**
 * Map WeeklySchedule entity to view model (API presentation)
 */
export function toWeeklyScheduleView(schedule: WeeklySchedule): WeeklyScheduleView {
  return {
    ...schedule,
    startDate: schedule.startDate.toISOString(),
    endDate: schedule.endDate.toISOString(),
    // Workouts mapped to their view representation
    workouts: schedule.workouts.map(toWorkoutTemplateView),
    progress: getWeekStatus(schedule),
  };
}
