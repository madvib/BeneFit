import { weeklySchedules } from './weekly_schedules.ts';
import { workoutTemplates } from './workout_templates.ts';
import { activeFitnessPlan } from './active_workout_plan.ts';

export * from './weekly_schedules.ts';
export * from './workout_templates.ts';
export * from './active_workout_plan.ts';

export const fitnessPlanSchema = {
  weeklySchedules,
  workoutTemplates,
  activeFitnessPlan,
};
