import { weeklySchedules } from './weekly_schedules.js';
import { workoutTemplates } from './workout_templates.js';
import { activeFitnessPlan } from './active_workout_plan.js';

export * from './weekly_schedules.js';
export * from './workout_templates.js';
export * from './active_workout_plan.js';

export const fitness_plan_schema = {
  weeklySchedules,
  workoutTemplates,
  activeFitnessPlan,
};
