// workout-plan.queries.ts
import { WorkoutTemplate } from '../workout-template/index.js';
import { WeeklySchedule } from '../weekly-schedule/index.js';
import { FitnessPlan } from './fitness-plan.types.js';

/**
 * QUERY: Gets the workout scheduled for the current day and week.
 */
export function getCurrentWorkout(plan: FitnessPlan): WorkoutTemplate | undefined {
  const currentWeek = plan.weeks.find(
    (w) => w.weekNumber === plan.currentPosition.week,
  );
  // Assumes WeeklySchedule has been converted to functional pattern
  // If WeeklySchedule is functional, this would be:
  // return getWorkoutForDay(currentWeek, plan.currentPosition.day);
  return currentWeek?.workouts.find((w) => w.dayOfWeek === plan.currentPosition.day);
}

/**
 * QUERY: Gets the WeeklySchedule entity for the current week.
 */
export function getCurrentWeek(plan: FitnessPlan): WeeklySchedule | undefined {
  return plan.weeks.find((w) => w.weekNumber === plan.currentPosition.week);
}


/**
 * QUERY: Checks if the plan is completed.
 */
export function isPlanComplete(plan: FitnessPlan): boolean {
  return plan.status === 'completed';
}

/**
 * QUERY: Gets the workout scheduled for a specific date based on plan structure.
 * This is a simplified approach - in a real implementation, this would map calendar dates
 * to planned workout positions based on the plan's start date.
 */
export function getWorkoutForDate(
  plan: FitnessPlan,
  date: Date,
): WorkoutTemplate | undefined {
  // This is a simplified implementation that assumes the plan started recently.
  // In a real implementation, we would calculate the week/day offset from the plan's start date
  if (!plan.startDate) {
    return undefined;
  }

  // Calculate the number of days since the plan started
  const planStartDate = new Date(plan.startDate);
  const timeDiff = date.getTime() - planStartDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (daysDiff < 0) {
    return undefined; // Date is before plan start
  }

  // Calculate which week and day this date corresponds to
  const weekIndex = Math.floor(daysDiff / 7);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  if (weekIndex >= plan.weeks.length) {
    return undefined; // Date is beyond the plan's end
  }

  const targetWeek = plan.weeks[weekIndex];
  if (!targetWeek) {
    return undefined;
  }

  // Find workout for the specific day of the week
  return targetWeek.workouts.find((w) => w.dayOfWeek === dayOfWeek);
}

/**
 * QUERY: Gets upcoming workouts for the specified number of days.
 */
export function getUpcomingWorkouts(
  plan: FitnessPlan,
  days: number = 7,
): WorkoutTemplate[] {
  if (!plan.startDate || days <= 0) {
    return [];
  }

  const startDate = new Date(plan.startDate);
  const upcomingWorkouts: WorkoutTemplate[] = [];

  // Iterate through the next 'days' days
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    // Calculate day offset from plan start
    const timeDiff = date.getTime() - startDate.getTime();
    const daysSinceStart = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysSinceStart < 0) {
      continue; // Skip dates before plan started
    }

    // Calculate which week and day this date corresponds to
    const weekIndex = Math.floor(daysSinceStart / 7);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

    if (weekIndex >= plan.weeks.length) {
      continue; // Skip dates beyond the plan's end
    }

    const targetWeek = plan.weeks[weekIndex];
    if (!targetWeek) {
      continue;
    }

    // Find workout for the specific day of the week
    const workout = targetWeek.workouts.find((w) => w.dayOfWeek === dayOfWeek);
    if (workout) {
      upcomingWorkouts.push(workout);
    }
  }

  return upcomingWorkouts;
}

/**
 * QUERY: Gets sum of completed and total workouts.
 */
export function getWorkoutSummary(plan: FitnessPlan): {
  total: number;
  completed: number;
} {
  return plan.weeks.reduce(
    (accumulator, week) => {
      accumulator.total += week.targetWorkouts;
      accumulator.completed += week.workoutsCompleted;
      return accumulator;
    },
    { total: 0, completed: 0 },
  );
}

/**
 * QUERY: Generates a preview of the plan (typically the first week).
 */
export function getPlanPreview(plan: FitnessPlan): import('./fitness-plan.types.js').PlanPreview {
  const firstWeek = plan.weeks[0] || { workouts: [] };

  return {
    weekNumber: 1,
    workouts: firstWeek.workouts.map((w) => {
      // Calculate duration from activities
      const duration =
        (w.activities as { duration?: number }[])?.reduce(
          (sum: number, a) => sum + (a.duration || 10),
          0,
        ) || 30;

      return {
        weekNumber: 1,
        dayOfWeek: w.dayOfWeek || 0,
        type: w.type,
        workoutSummary: `${ w.type } workout - ${ duration } minutes`,
      };
    }),
  };
}

