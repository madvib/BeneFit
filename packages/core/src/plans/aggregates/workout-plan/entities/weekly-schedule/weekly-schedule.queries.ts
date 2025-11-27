// weekly-schedule.queries.ts
import { WeeklySchedule } from './weekly-schedule.types.js';
import { WorkoutTemplate } from '../workout-template/workout-template.deprecated.js';

/**
 * QUERY: Finds a workout by its ID.
 */
export function findWorkout(schedule: WeeklySchedule, workoutId: string): WorkoutTemplate | undefined {
  return schedule.workouts.find(w => w.id === workoutId);
}

/**
 * QUERY: Calculates the completion rate.
 */
export function getCompletionRate(schedule: WeeklySchedule): number {
  if (schedule.workouts.length === 0) {
    return 0;
  }
  return schedule.workoutsCompleted / schedule.workouts.length;
}

/**
 * QUERY: Gets the current status of the week for coaching assessment.
 */
export function getWeekStatus(schedule: WeeklySchedule): {
  onTrack: boolean;
  completionRate: number;
  workoutsRemaining: number;
  daysRemaining: number;
} {
  const now = new Date();
  const weekEnd = new Date(schedule.endDate);
  const daysRemaining = Math.max(0, Math.ceil((weekEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const workoutsRemaining = Math.max(0, schedule.targetWorkouts - schedule.workoutsCompleted);
  const completionRate = getCompletionRate(schedule); // Use the pure function

  // Logic remains the same
  const onTrack = daysRemaining === 0
    ? workoutsRemaining === 0
    : workoutsRemaining <= daysRemaining;

  return {
    onTrack,
    completionRate,
    workoutsRemaining,
    daysRemaining,
  };
}