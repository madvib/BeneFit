// workout-template.queries.ts
import { WorkoutType } from '@/workouts/index.js';
import { WorkoutTemplate, WorkoutStatus } from './workout-template.types.js';

/**
 * QUERY: Checks if the workout is currently in a completed state.
 */
export function isCompleted(template: WorkoutTemplate): boolean {
  return template.status === 'completed';
}

/**
 * QUERY: Calculates the total estimated duration.
 */
export function getEstimatedDuration(template: WorkoutTemplate): number {
  return template.activities.reduce((total, activity) => {
    return total + (activity.duration || 0);
  }, 0);
}

/**
 * QUERY: Checks if the workout is overdue.
 */
export function isPastDue(template: WorkoutTemplate): boolean {
  if (template.status !== 'scheduled') {
    return false;
  }
  const scheduled = new Date(template.scheduledDate);
  const now = new Date();
  return now > scheduled;
}

/**
 * QUERY: Returns key information for display purposes.
 */
export function getDisplayInfo(template: WorkoutTemplate): {
  title: string;
  type: WorkoutType;
  status: WorkoutStatus;
  scheduledDate: string;
  estimatedDuration: number;
  isPastDue: boolean;
} {
  return {
    title: template.title,
    type: template.type,
    status: template.status,
    scheduledDate: template.scheduledDate,
    estimatedDuration: getEstimatedDuration(template),
    isPastDue: isPastDue(template),
  };
}
