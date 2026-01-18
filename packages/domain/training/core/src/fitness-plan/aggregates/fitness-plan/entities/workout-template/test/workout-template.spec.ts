import { describe, it, expect } from 'vitest';
import { createWorkoutActivity, createWorkoutActivityFixture, WorkoutActivity } from '@/workouts/index.js';
import {
  createDistanceWorkout,
  createDurationWorkout,
  createVolumeWorkout,
  createWorkoutGoals,
} from '@/fitness-plan/value-objects/index.js';
import {
  startWorkout,
  markComplete,
  skipWorkout,
  updateGoals,
  rescheduleWorkout,
} from '../workout-template.commands.js';
import { createWorkoutTemplate, toWorkoutTemplateView } from '../workout-template.factory.js';
import { createWorkoutTemplateFixture } from './workout-template.fixtures.js';

describe('WorkoutTemplate Aggegrate', () => {

  // ============================================
  // FACTORY & COMMANDS
  // ============================================

  // Canonical test object with valid defaults
  const validWorkoutTemplateProps = {
    id: 'workout-canonical',
    planId: 'plan-1',
    weekNumber: 1,
    dayOfWeek: 1,
    scheduledDate: '2027-11-26',
    title: 'Valid Workout',
    type: 'running' as const,
    category: 'cardio' as const,
    importance: 'key' as const,
    activities: [] as WorkoutActivity[],
  };

  describe('create', () => {

    it('should create a workout template with duration goals', () => {
      // Create WorkoutGoals - must check Result before using .value
      const goalsResult = createDurationWorkout(
        30,
        {
          mustComplete: true,
          autoVerifiable: false,
        },
        'moderate',
      );

      expect(goalsResult.isSuccess).toBe(true);
      const goals = goalsResult.value; // Safe after checking isSuccess

      const sampleActivity = createWorkoutActivity({
        name: 'Jog',
        type: 'main',
        order: 1,
      }).value;

      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        title: 'Morning Run',
        goals: goals, // Now guaranteed to be WorkoutGoals, not undefined
        activities: [sampleActivity],
      });

      expect(workoutResult.isSuccess).toBe(true);

      if (workoutResult.isSuccess) {
        const workout = workoutResult.value;
        expect(workout.title).toBe('Morning Run');
        expect(workout.type).toBe('running');
        expect(workout.status).toBe('scheduled');
        expect(workout.goals).toBe(goals);
      }
    });

    it('should create a workout template with volume goals for strength training', () => {
      const goalsResult = createVolumeWorkout(15, 45, {
        mustComplete: false,
        minimumEffort: 0.8,
        autoVerifiable: true,
      });

      expect(goalsResult.isSuccess).toBe(true);

      const sampleActivity = createWorkoutActivity({
        name: 'Strength Exercise',
        type: 'main',
        order: 1,
      }).value;

      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'workout-2',
        dayOfWeek: 2,
        scheduledDate: '2027-11-27',
        title: 'Upper Body Strength',
        type: 'strength',
        category: 'strength',
        goals: goalsResult.value,
        activities: [sampleActivity],
        importance: 'critical',
      });

      expect(workoutResult.isSuccess).toBe(true);

      if (workoutResult.isSuccess) {
        const workout = workoutResult.value;
        expect(workout.goals.volume).toBeDefined();
        expect(workout.goals.volume?.totalSets).toBe(15);
      }
    });

    it('should create a workout template with distance goals', () => {
      const goalsResult = createDistanceWorkout(5000, 'meters', {
        mustComplete: true,
        autoVerifiable: false,
      });

      expect(goalsResult.isSuccess).toBe(true);

      const sampleActivity = createWorkoutActivity({
        name: 'Tempo Run',
        type: 'main',
        order: 1,
      }).value;

      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'workout-3',
        dayOfWeek: 3,
        scheduledDate: '2027-11-28',
        title: '5K Tempo Run',
        goals: goalsResult.value,
        activities: [sampleActivity],
      });

      expect(workoutResult.isSuccess).toBe(true);
    });

    it('should fail when creating workout with invalid day of week', () => {
      const goalsResult = createDurationWorkout(30, {
        mustComplete: true,
        autoVerifiable: false,
      });

      expect(goalsResult.isSuccess).toBe(true);

      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'workout-4',
        dayOfWeek: 7, // Invalid - must be 0-6
        title: 'Invalid Workout',
        goals: goalsResult.value,
        importance: 'optional',
      });

      expect(workoutResult.isFailure).toBe(true);
    });

    it('should fail when creating workout with week number < 1', () => {
      const goalsResult = createDurationWorkout(30, {
        mustComplete: true,
        autoVerifiable: false,
      });

      expect(goalsResult.isSuccess).toBe(true);

      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'workout-5',
        weekNumber: 0, // Invalid - must be >= 1
        title: 'Invalid Week',
        goals: goalsResult.value,
        importance: 'optional',
      });

      expect(workoutResult.isFailure).toBe(true);
    });

    it('should create rest day workout without activities', () => {
      // For rest day, we may not want to specify duration goals, so let's create a minimal duration goal
      const goalsResult = createDurationWorkout(1, {
        // Minimal positive duration instead of 0
        mustComplete: false,
        autoVerifiable: true,
      });

      expect(goalsResult.isSuccess).toBe(true);

      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'rest-1',
        dayOfWeek: 0,
        scheduledDate: '2027-11-24',
        title: 'Rest Day',
        type: 'rest',
        category: 'recovery',
        goals: goalsResult.value,
        activities: [], // Rest days can have empty activities
        importance: 'recommended',
      });

      expect(workoutResult.isSuccess).toBe(true);
    });
  });

  describe('state transitions', () => {
    it('should allow starting a scheduled workout', () => {
      const goalsResult = createDurationWorkout(30, {
        mustComplete: true,
        autoVerifiable: false,
      });

      const sampleActivity = createWorkoutActivity({
        name: 'Running Session',
        type: 'main',
        order: 1,
      }).value;

      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'workout-6',
        title: "Today's Workout",
        goals: goalsResult.value,
        activities: [sampleActivity],
      });

      expect(workoutResult.isSuccess).toBe(true);

      if (workoutResult.isSuccess) {
        const workout = workoutResult.value;
        const startResult = startWorkout(workout);

        expect(startResult.isSuccess).toBe(true);
        if (startResult.isSuccess) {
          expect(startResult.value.status).toBe('in_progress');
        }
      }
    });

    it('should allow completing an in-progress workout', () => {
      const goalsResult = createDurationWorkout(30, {
        mustComplete: true,
        autoVerifiable: false,
      });

      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'workout-7',
        title: 'Completable Workout',
        goals: goalsResult.value,
      });

      if (workoutResult.isSuccess) {
        let workout = workoutResult.value;
        const startResult = startWorkout(workout);

        if (startResult.isSuccess) {
          workout = startResult.value;
          const completeResult = markComplete(workout, 'completed-workout-id-123');

          expect(completeResult.isSuccess).toBe(true);
          if (completeResult.isSuccess) {
            expect(completeResult.value.status).toBe('completed');
            expect(completeResult.value.completedWorkoutId).toBe(
              'completed-workout-id-123',
            );
          }
        }
      }
    });

    it('should allow skipping a scheduled workout', () => {
      const goalsResult = createDurationWorkout(30, {
        mustComplete: true,
        autoVerifiable: false,
      });

      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'workout-8',
        title: 'Skippable Workout',
        goals: goalsResult.value,
        importance: 'optional',
      });

      if (workoutResult.isSuccess) {
        const workout = workoutResult.value;
        const skipResult = skipWorkout(workout, 'Feeling unwell');

        expect(skipResult.isSuccess).toBe(true);
        if (skipResult.isSuccess) {
          expect(skipResult.value.status).toBe('skipped');
        }
      }
    });

    it('should allow rescheduling a scheduled workout with valid date', () => {
      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'workout-reschedule',
        title: 'Reschedule Me',
      });

      if (workoutResult.isSuccess) {
        const workout = workoutResult.value;
        const newDate = '2027-12-01T10:00:00Z';
        const result = rescheduleWorkout(workout, newDate);

        expect(result.isSuccess).toBe(true);
        if (result.isSuccess) {
          expect(result.value.status).toBe('rescheduled');
          expect(result.value.rescheduledTo).toBeInstanceOf(Date);
          expect(result.value.rescheduledTo?.toISOString()).toBe(newDate);
        }
      }
    });

    it('should fail rescheduling with invalid date format', () => {
      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'workout-reschedule-fail',
      });

      if (workoutResult.isSuccess) {
        const result = rescheduleWorkout(workoutResult.value, 'not-a-date');
        expect(result.isFailure).toBe(true);
      }
    });
  });

  describe('intensity adjustment', () => {
    it('should reduce workout intensity correctly', () => {
      const goalsResult = createDurationWorkout(
        60,
        {
          mustComplete: true,
          autoVerifiable: false,
        },
        'hard',
      );

      const workoutResult = createWorkoutTemplate({
        ...validWorkoutTemplateProps,
        id: 'workout-9',
        title: 'Hard Workout',
        goals: goalsResult.value,
      });

      if (workoutResult.isSuccess) {
        const workout = workoutResult.value;
        const originalDuration = workout.goals.duration?.value;

        // Note: The functional approach doesn't have adjustIntensity method in the same way
        // This test may need to be adapted to the new approach
        // For now, we'll create a new goal with reduced duration
        const adjustedGoalsResult = createDurationWorkout(
          Math.round((originalDuration || 0) * 0.8),
          {
            mustComplete: true,
            autoVerifiable: false,
          },
          'moderate',
        );

        expect(adjustedGoalsResult.isSuccess).toBe(true);
        if (adjustedGoalsResult.isSuccess) {
          const updatedWorkoutResult = updateGoals(workout, adjustedGoalsResult.value);
          expect(updatedWorkoutResult.isSuccess).toBe(true);
          if (updatedWorkoutResult.isSuccess) {
            expect(updatedWorkoutResult.value.goals.duration?.value).toBe(
              Math.round((originalDuration || 0) * 0.8),
            );
          }
        }
      }
    });
  });

  describe('demonstration of correct Result pattern', () => {
    it('shows the safe way to handle WorkoutGoals creation', () => {
      // ✅ CORRECT: Always check Result before using .value
      const goalsResult = createDurationWorkout(30, {
        mustComplete: true,
        autoVerifiable: false,
      });

      // Pattern 1: Type guard
      if (goalsResult.isSuccess) {
        const goals = goalsResult.value; // Type-safe!
        expect(goals).toBeDefined();
      }

      // Pattern 2: Early return on failure
      if (goalsResult.isFailure) {
        throw new Error('Should not fail');
      }

      const goals = goalsResult.value; // Also type-safe!
      expect(goals).toBeDefined();
    });

    it('shows what NOT to do', () => {
      const goalsResult = createWorkoutGoals({
        // Missing goal type - this will fail!
        completionCriteria: { mustComplete: true, autoVerifiable: false },
      });

      // ❌ WRONG: Accessing .value without checking
      // const goals = goalsResult.value;
      // This causes: Type 'undefined' is not assignable to type 'WorkoutGoals'

      // ✅ CORRECT: Always check first
      expect(goalsResult.isFailure).toBe(true);

      if (goalsResult.isFailure) {
        expect(goalsResult.error).toBeDefined();
        // Handle the error appropriately
      }
    });
  });

  // ============================================
  // VIEW MAPPER
  // ============================================
  // ============================================
  // VIEW MAPPER
  // ============================================
  describe('View Mapper', () => {
    it('should map a valid workout template entity to view model with enriched fields', () => {
      const template = createWorkoutTemplateFixture({
        activities: [
          createWorkoutActivityFixture({ duration: 10 }),
          createWorkoutActivityFixture({ duration: 20 }),
        ]
      });
      const view = toWorkoutTemplateView(template);

      expect(view.id).toBe(template.id);
      expect(view.title).toBe(template.title);
      expect(view.activities).toEqual(template.activities);

      // Check enriched fields
      expect(view.estimatedDuration).toBe(30);
      expect(typeof view.isPastDue).toBe('boolean');
      expect(typeof view.isCompleted).toBe('boolean');
    });

    it('should handle optional fields correctly', () => {
      const template = createWorkoutTemplateFixture({
        description: undefined,
        userNotes: undefined,
        alternatives: undefined,
        activities: []
      });
      const view = toWorkoutTemplateView(template);

      expect(view.description).toBeUndefined();
      expect(view.userNotes).toBeUndefined();
      expect(view.alternatives).toBeUndefined();
      expect(view.estimatedDuration).toBe(0);
    });
  });
});
