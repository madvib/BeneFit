// workout-plan.commands.ts
import { Result } from '@shared';
import { WorkoutPlan } from './workout-plan.types.js';
import {
  PlanStateError,
  PlanActivationError,
  PlanCompletionError,
  WorkoutNotFoundError,
} from '../../../../errors/workout-plan-errors.js';
import { WeeklySchedule } from '../weekly-schedule/weekly-schedule.types.js';

/** Helper function to update the updatedAt timestamp */
function touch(plan: WorkoutPlan): WorkoutPlan {
  return { ...plan, updatedAt: new Date() };
}

/**
 * COMMAND: Adds a new week to the plan.
 */
export function addWeek(plan: WorkoutPlan, week: WeeklySchedule): Result<WorkoutPlan> {
  if (plan.status === 'completed' || plan.status === 'abandoned') {
    return Result.fail(new PlanStateError('Cannot modify completed or abandoned plan', { currentStatus: plan.status, planId: plan.id }));
  }

  const expectedWeekNumber = plan.weeks.length + 1;
  if (week.weekNumber !== expectedWeekNumber) {
    return Result.fail(new PlanStateError(
      `Expected week ${ expectedWeekNumber }, got ${ week.weekNumber }`,
      { expectedWeekNumber, actualWeekNumber: week.weekNumber, planId: plan.id }
    ));
  }

  // Pure update: create new weeks array
  const newWeeks = [...plan.weeks, week];

  const updatedPlan: WorkoutPlan = {
    ...plan,
    weeks: newWeeks,
  };

  return Result.ok(touch(updatedPlan));
}

/**
 * COMMAND: Transitions the plan status from 'draft' to 'active'.
 */
export function activatePlan(plan: WorkoutPlan): Result<WorkoutPlan> {
  if (plan.status !== 'draft') {
    return Result.fail(new PlanActivationError('Can only activate draft plans', { currentStatus: plan.status, planId: plan.id }));
  }

  if (plan.weeks.length === 0) {
    return Result.fail(new PlanActivationError('Cannot activate plan with no weeks', { planId: plan.id }));
  }

  const updatedPlan: WorkoutPlan = {
    ...plan,
    status: 'active',
  };

  return Result.ok(touch(updatedPlan));
}

/**
 * COMMAND: Handles the completion of a workout, incrementing the week's count.
 */
export function completeWorkout(
  plan: WorkoutPlan,
  workoutId: string,
  completedWorkoutId: string
): Result<WorkoutPlan> {
  if (plan.status !== 'active') {
    return Result.fail(new PlanCompletionError('Can only complete workouts in active plans', { currentStatus: plan.status, planId: plan.id }));
  }

  // Find the week and workout (Read logic remains the same)
  const weekIndex = plan.weeks.findIndex(week => week.findWorkout(workoutId));
  if (weekIndex === -1) {
    return Result.fail(new WorkoutNotFoundError('Workout not found in plan', { workoutId, planId: plan.id }));
  }

  const targetWeek = plan.weeks[weekIndex];
  const targetWorkout = targetWeek.findWorkout(workoutId)!;

  // --- APPLY CHANGES IMMUTABLY ---

  // 1. Mark the workout complete (assumes workout-template has functional commands too)
  const workoutResult = targetWorkout.markComplete(completedWorkoutId);
  if (workoutResult.isFailure) return workoutResult;
  // NOTE: This assumes WorkoutTemplate is still mutable or its functional command returns a Result<WorkoutTemplate>

  // 2. Increment completed count on the *target week* (assumes functional conversion here too)
  const updatedTargetWeek = targetWeek.incrementCompletedWorkouts(); // Assuming functional update returns new week

  // 3. Create a NEW array of weeks with the updated week
  const newWeeks = [
    ...plan.weeks.slice(0, weekIndex),
    updatedTargetWeek,
    ...plan.weeks.slice(weekIndex + 1),
  ];

  const updatedPlan: WorkoutPlan = {
    ...plan,
    weeks: newWeeks,
  };

  return Result.ok(touch(updatedPlan));
}

/**
 * COMMAND: Advances the plan position (day/week).
 */
export function advanceDay(plan: WorkoutPlan): Result<WorkoutPlan> {
  if (plan.status !== 'active') {
    return Result.fail(new PlanStateError('Can only advance active plans', { currentStatus: plan.status, planId: plan.id }));
  }

  const nextPosition = plan.currentPosition.advanceDay(); // Assumes PlanPosition is still a class/VO
  const nextWeekExists = plan.weeks.find(w => w.weekNumber === nextPosition.week);

  if (!nextWeekExists) {
    // Plan Completion Logic
    const updatedPlan: WorkoutPlan = {
      ...plan,
      status: 'completed',
      endDate: new Date().toISOString(),
    };
    return Result.ok(touch(updatedPlan));
  }

  // Standard Advancement Logic
  const updatedPlan: WorkoutPlan = {
    ...plan,
    currentPosition: nextPosition,
  };

  return Result.ok(touch(updatedPlan));
}