import { describe, it, expect } from 'vitest';
import { createWorkoutActivity } from '@/workouts/index.js';
import {
  createDurationWorkout,
  createWorkoutGoals,
  createVolumeWorkout,
} from '../../../../../../fitness-plan/value-objects/workout-goals/workout-goals.factory.js';
import { createWorkoutTemplate } from '../../workout-template/workout-template.factory.js';
import { createWeeklySchedule } from '../weekly-schedule.factory.js';

describe('WeeklySchedule', () => {
  describe('create', () => {
    it('should create a weekly schedule with valid properties', () => {
      // First, create valid WorkoutGoals
      const goalsResult = createDurationWorkout(
        30,
        {
          mustComplete: true,
          autoVerifiable: false,
        },
        'moderate',
      );

      // Always check if the Result succeeded
      expect(goalsResult.isSuccess).toBe(true);

      // Now we can safely access .value
      const goals = goalsResult.value;

      // Create a workout template
      const sampleActivity = createWorkoutActivity({
        name: 'Jog',
        type: 'main',
        order: 1,
      }).value;

      const workoutResult = createWorkoutTemplate({
        id: 'workout-1',
        planId: 'plan-1',
        weekNumber: 1,
        dayOfWeek: 1,
        scheduledDate: '2025-11-26',
        title: 'Morning Run',
        type: 'running',
        category: 'cardio',
        goals: goals, // This is now guaranteed to be WorkoutGoals, not undefined
        activities: [sampleActivity],
        importance: 'key',
      });

      expect(workoutResult.isSuccess).toBe(true);

      // Now create weekly schedule
      const scheduleResult = createWeeklySchedule({
        weekNumber: 1,
        planId: 'plan-1',
        startDate: '2025-11-25',
        endDate: '2025-12-01',
        focus: 'Base Building',
        targetWorkouts: 3,
        workouts: workoutResult.isSuccess ? [workoutResult.value] : [],
      });

      expect(scheduleResult.isSuccess).toBe(true);
    });

    it('should fail when WorkoutGoals.create fails', () => {
      // This will fail because no goal type is specified
      const goalsResult = createWorkoutGoals({
        completionCriteria: {
          mustComplete: true,
          autoVerifiable: false,
        },
      });

      // The Result will be a failure
      expect(goalsResult.isFailure).toBe(true);

      // DO NOT access .value on a failed Result
      // This would cause: Type 'undefined' is not assignable to type 'WorkoutGoals'
      // const goals = goalsResult.value; // ❌ WRONG!

      // Instead, handle the error:
      if (goalsResult.isFailure) {
        expect(goalsResult.error).toBeDefined();
      }
    });

    it('should demonstrate the correct pattern for using Result types', () => {
      const goalsResult = createVolumeWorkout(3, 10, {
        mustComplete: false,
        autoVerifiable: true,
      });

      // Pattern 1: Check isSuccess before accessing value
      if (goalsResult.isSuccess) {
        const goals = goalsResult.value; // ✅ Type-safe!
        expect(goals).toBeDefined();
        expect(goals.volume).toBeDefined();
      }

      // Pattern 2: Use early return for error cases
      if (goalsResult.isFailure) {
        throw new Error('Should not fail');
      }

      const goals = goalsResult.value; // ✅ Type-safe after guard!
      expect(goals).toBeDefined();
    });
  });
});
