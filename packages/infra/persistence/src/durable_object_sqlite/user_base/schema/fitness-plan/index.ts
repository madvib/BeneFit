import { weeklySchedules } from './weekly_schedules';
import { workoutTemplates } from './workout_templates';
import { activeFitnessPlan } from './active_workout_plan';

export * from './weekly_schedules';
export * from './workout_templates';
export * from './active_workout_plan';

export const fitnessPlanSchema = {
  weeklySchedules,
  workoutTemplates,
  activeFitnessPlan,
};
