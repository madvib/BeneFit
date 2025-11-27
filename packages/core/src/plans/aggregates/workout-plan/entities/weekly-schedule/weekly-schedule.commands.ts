// weekly-schedule.commands.ts
import { Result } from '@shared';
import { WeeklySchedule } from './weekly-schedule.types.js';
import { ScheduleConflictError, WorkoutNotFoundError, ScheduleModificationError } from '../../../../errors/workout-plan-errors.js';
import { WorkoutTemplate } from '../workout-template/workout-template.types.js';

/**
 * COMMAND: Adds a workout to the schedule.
 * Returns the updated schedule object or a failure result.
 */
export function addWorkout(schedule: WeeklySchedule, workout: WorkoutTemplate): Result<WeeklySchedule> {
  // 1. Validation Logic (identical to the class method)
  if (workout.planId !== schedule.planId) {
    return Result.fail(new ScheduleConflictError('Workout does not belong to this plan', { workoutPlanId: workout.planId, schedulePlanId: schedule.planId }));
  }
  // ... all other validation logic for week number, day slot, date range ...

  // 2. Pure State Update: Create a NEW object with the updated workout array
  const newWorkouts = [...schedule.workouts, workout];

  return Result.ok({
    ...schedule,
    workouts: newWorkouts,
  });
}

/**
 * COMMAND: Removes a workout from the schedule.
 */
export function removeWorkout(schedule: WeeklySchedule, workoutId: string): Result<WeeklySchedule> {
  const index = schedule.workouts.findIndex(w => w.id === workoutId);

  if (index === -1) {
    return Result.fail(new WorkoutNotFoundError('Workout not found in this week', { workoutId, weekNumber: schedule.weekNumber }));
  }

  const workout = schedule.workouts[index];

  if (workout?.status === 'completed') {
    return Result.fail(new ScheduleModificationError('Cannot remove completed workouts', { workoutId, workoutStatus: 'completed' }));
  }

  // Pure State Update: Create a new array without the target workout
  const newWorkouts = schedule.workouts.filter(w => w.id !== workoutId);

  return Result.ok({
    ...schedule,
    workouts: newWorkouts,
  });
}

/**
 * COMMAND: Increments completed workouts.
 */
export function incrementCompletedWorkouts(schedule: WeeklySchedule): WeeklySchedule {
  // Pure State Update
  return {
    ...schedule,
    workoutsCompleted: schedule.workoutsCompleted + 1,
  };
}