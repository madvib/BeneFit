// workout-plan.queries.ts
import { WorkoutTemplate } from '../workout-template/index.js';
import { WeeklySchedule } from '../weekly-schedule/index.js';
import { WorkoutPlan } from './workout-plan.types.js';

/**
 * QUERY: Gets the workout scheduled for the current day and week.
 */
export function getCurrentWorkout(plan: WorkoutPlan): WorkoutTemplate | undefined {
  const currentWeek = plan.weeks.find(w => w.weekNumber === plan.currentPosition.week);
  // Assumes WeeklySchedule has been converted to functional pattern
  // If WeeklySchedule is functional, this would be: 
  // return getWorkoutForDay(currentWeek, plan.currentPosition.day);
  return currentWeek?.workouts.find(w => w.dayOfWeek === plan.currentPosition.day);
}

/**
 * QUERY: Gets the WeeklySchedule entity for the current week.
 */
export function getCurrentWeek(plan: WorkoutPlan): WeeklySchedule | undefined {
  return plan.weeks.find(w => w.weekNumber === plan.currentPosition.week);
}

/**
 * QUERY: Checks if the plan is completed.
 */
export function isPlanComplete(plan: WorkoutPlan): boolean {
  return plan.status === 'completed';
}

