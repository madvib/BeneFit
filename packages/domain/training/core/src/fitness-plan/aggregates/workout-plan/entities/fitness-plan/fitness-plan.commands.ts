// workout-plan.commands.ts
import { Result } from '@bene/shared-domain';
import { FitnessPlan } from './fitness-plan.types.js';

import { WeeklySchedule } from '../weekly-schedule/weekly-schedule.types.js';
import { WorkoutTemplate } from '../workout-template/workout-template.types.js';
import {
  PlanStateError,
  PlanActivationError,
  PlanCompletionError,
  WorkoutNotFoundError,
} from '@/fitness-plan/errors/fitness-plan-errors.js';
import { PlanPositionCommands } from '@/fitness-plan/value-objects/index.js';

/** Helper function to update the updatedAt timestamp */
function touch(plan: FitnessPlan): FitnessPlan {
  return { ...plan, updatedAt: new Date() };
}

/**
 * COMMAND: Adds a new week to the plan.
 */
export function addWeek(plan: FitnessPlan, week: WeeklySchedule): Result<FitnessPlan> {
  if (plan.status === 'completed' || plan.status === 'abandoned') {
    return Result.fail(
      new PlanStateError('Cannot modify completed or abandoned plan', {
        currentStatus: plan.status,
        planId: plan.id,
      }),
    );
  }

  const expectedWeekNumber = plan.weeks.length + 1;
  if (week.weekNumber !== expectedWeekNumber) {
    return Result.fail(
      new PlanStateError(
        `Expected week ${expectedWeekNumber}, got ${week.weekNumber}`,
        { expectedWeekNumber, actualWeekNumber: week.weekNumber, planId: plan.id },
      ),
    );
  }

  // Pure update: create new weeks array
  const newWeeks = [...plan.weeks, week];

  const updatedPlan: FitnessPlan = {
    ...plan,
    weeks: newWeeks,
  };

  return Result.ok(touch(updatedPlan));
}

/**
 * COMMAND: Transitions the plan status from 'draft' to 'active'.
 */
export function activatePlan(plan: FitnessPlan): Result<FitnessPlan> {
  if (plan.status !== 'draft') {
    return Result.fail(
      new PlanActivationError('Can only activate draft plans', {
        currentStatus: plan.status,
        planId: plan.id,
      }),
    );
  }

  if (plan.weeks.length === 0) {
    return Result.fail(
      new PlanActivationError('Cannot activate plan with no weeks', {
        planId: plan.id,
      }),
    );
  }

  const updatedPlan: FitnessPlan = {
    ...plan,
    status: 'active',
  };

  return Result.ok(touch(updatedPlan));
}

/**
 * COMMAND: Handles the completion of a workout, incrementing the week's count.
 */
export function completeWorkout(
  plan: FitnessPlan,
  workoutId: string,
  completedWorkoutId: string,
): Result<FitnessPlan> {
  if (plan.status !== 'active') {
    return Result.fail(
      new PlanCompletionError('Can only complete workouts in active plans', {
        currentStatus: plan.status,
        planId: plan.id,
      }),
    );
  }

  // Find the week and workout (Read logic remains the same)
  const weekIndex = plan.weeks.findIndex((week) =>
    week.workouts.some((workout) => workout.id === workoutId),
  );
  if (weekIndex === -1) {
    return Result.fail(
      new WorkoutNotFoundError('Workout not found in plan', {
        workoutId,
        planId: plan.id,
      }),
    );
  }

  const targetWeek = plan.weeks[weekIndex];
  if (!targetWeek) {
    return Result.fail(
      new WorkoutNotFoundError('Target week not found', { workoutId, planId: plan.id }),
    );
  }

  const targetWorkoutIndex = targetWeek.workouts.findIndex(
    (workout) => workout.id === workoutId,
  );
  if (targetWorkoutIndex === -1) {
    return Result.fail(
      new WorkoutNotFoundError('Workout not found in week', {
        workoutId,
        planId: plan.id,
      }),
    );
  }

  const targetWorkout = targetWeek.workouts[targetWorkoutIndex];

  // --- APPLY CHANGES IMMUTABLY ---

  // 1. Mark the workout complete (Update the workout status)
  const updatedWorkout = {
    ...targetWorkout,
    status: 'completed',
    completedWorkoutId,
  } as WorkoutTemplate;

  // 2. Update the workouts array in the target week
  const updatedWeekWorkouts = [
    ...targetWeek.workouts.slice(0, targetWorkoutIndex),
    updatedWorkout,
    ...targetWeek.workouts.slice(targetWorkoutIndex + 1),
  ] as WorkoutTemplate[];

  // 3. Increment completed count on the *target week*
  const updatedTargetWeek = {
    ...targetWeek,
    workouts: updatedWeekWorkouts,
    workoutsCompleted: targetWeek.workoutsCompleted + 1,
  } as WeeklySchedule;

  // 4. Create a NEW array of weeks with the updated week
  const newWeeks = [
    ...plan.weeks.slice(0, weekIndex),
    updatedTargetWeek,
    ...plan.weeks.slice(weekIndex + 1),
  ] as WeeklySchedule[];

  const updatedPlan: FitnessPlan = {
    ...plan,
    weeks: newWeeks,
  };

  return Result.ok(touch(updatedPlan));
}

/**
 * COMMAND: Transitions the plan status from 'active' to 'paused'.
 */
export interface PausePlanOptions {
  reason?: string;
}

export function pausePlan(plan: FitnessPlan, reason?: string): Result<FitnessPlan> {
  if (plan.status !== 'active') {
    return Result.fail(
      new PlanStateError('Can only pause active plans', {
        currentStatus: plan.status,
        planId: plan.id,
      }),
    );
  }

  const updatedPlan: FitnessPlan = {
    ...plan,
    status: 'paused',
  };

  // Use the reason parameter to potentially trigger additional logic
  if (reason) {
    console.log(`Plan paused for reason: ${reason}`); // Use the reason parameter
  }

  return Result.ok(touch(updatedPlan));
}

/**
 * COMMAND: Advances the plan position (day/week).
 */
export function advanceDay(plan: FitnessPlan): Result<FitnessPlan> {
  if (plan.status !== 'active') {
    return Result.fail(
      new PlanStateError('Can only advance active plans', {
        currentStatus: plan.status,
        planId: plan.id,
      }),
    );
  }

  const nextPosition = PlanPositionCommands.advanceDay(plan.currentPosition);
  const nextWeekExists = plan.weeks.find((w) => w.weekNumber === nextPosition.week);

  if (!nextWeekExists) {
    // Plan Completion Logic
    const updatedPlan: FitnessPlan = {
      ...plan,
      status: 'completed',
      endDate: new Date().toISOString(),
    };
    return Result.ok(touch(updatedPlan));
  }

  // Standard Advancement Logic
  const updatedPlan: FitnessPlan = {
    ...plan,
    currentPosition: nextPosition,
  };

  return Result.ok(touch(updatedPlan));
}
