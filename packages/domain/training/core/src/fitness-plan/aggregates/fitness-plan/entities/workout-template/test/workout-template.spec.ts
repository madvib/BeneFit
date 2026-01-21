import { describe, it, expect } from 'vitest';
import { createWorkoutActivityFixture } from '@/workouts/index.js';
import {
  createDurationWorkout,
  createVolumeWorkout,
} from '@/fitness-plan/value-objects/index.js';
import {
  startWorkout,
  markComplete,
  skipWorkout,
  updateGoals,
  rescheduleWorkout,
} from '../workout-template.commands.js';
import { WORKOUT_TEMPLATE_ERRORS } from '../workout-template.types.js';
import { CreateWorkoutTemplateSchema } from '../workout-template.factory.js';
import * as WorkoutTemplateQueries from '../workout-template.queries.js';
import { toWorkoutTemplateView } from '../workout-template.view.js';
import { createWorkoutTemplateFixture } from './workout-template.fixtures.js';

describe('WorkoutTemplate Aggegrate', () => {

  // ============================================
  // FACTORY & COMMANDS
  // ============================================

  describe('creation', () => {
    it('should create valid workout template with correct defaults', () => {
      // Arrange & Act
      const template = createWorkoutTemplateFixture({
        title: 'Morning Run',
        status: 'scheduled',
      });

      // Assert
      expect(template.id).toBeDefined();
      expect(template.title).toBe('Morning Run');
      expect(template.status).toBe('scheduled');
    });

    it('should create a workout template with duration goals', () => {
      // Arrange
      const goals = createDurationWorkout(30, {
        mustComplete: true,
        autoVerifiable: false
      }, 'moderate').value;

      const sampleActivity = createWorkoutActivityFixture({ name: 'Jog' });

      // Act
      const template = createWorkoutTemplateFixture({
        title: 'Morning Run',
        goals,
        activities: [sampleActivity],
      });

      // Assert
      expect(template.title).toBe('Morning Run');
      expect(template.goals).toEqual(goals);
      expect(template.activities).toContain(sampleActivity);
    });

    it('should create a workout template with volume goals for strength training', () => {
      // Arrange
      const goals = createVolumeWorkout(15, 45, {
        mustComplete: false,
        minimumEffort: 80,
        autoVerifiable: true,
      }).value;

      const sampleActivity = createWorkoutActivityFixture({ name: 'Strength Exercise' });

      // Act
      const template = createWorkoutTemplateFixture({
        title: 'Upper Body Strength',
        type: 'strength',
        category: 'strength',
        goals,
        activities: [sampleActivity],
      });

      // Assert
      expect(template.goals.volume?.totalSets).toBe(15);
    });

    it('should create rest day workout without activities', () => {
      // Arrange & Act
      const template = createWorkoutTemplateFixture({
        type: 'rest',
        category: 'recovery',
        activities: [],
      });

      // Assert
      expect(template.type).toBe('rest');
      expect(template.activities).toHaveLength(0);
    });
  });

  describe('validation', () => {
    it('should fail when dayOfWeek is invalid', () => {
      // Arrange
      const invalidInput = {
        ...createWorkoutTemplateFixture(),
        dayOfWeek: 7, // Invalid - must be 0-6
      };

      // Act
      const parseResult = CreateWorkoutTemplateSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);

    });

    it('should fail when weekNumber is < 1', () => {
      // Arrange
      const invalidInput = {
        ...createWorkoutTemplateFixture(),
        weekNumber: 0, // Invalid - must be >= 1
      };

      // Act
      const parseResult = CreateWorkoutTemplateSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when non-rest workout has no activities', () => {
      // Arrange
      const invalidInput = {
        ...createWorkoutTemplateFixture({ type: 'strength' }),
        activities: [], // Invalid for strength
      };

      // Act
      const parseResult = CreateWorkoutTemplateSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
      if (!parseResult.success) {
        expect(parseResult.error.message).toContain(WORKOUT_TEMPLATE_ERRORS.MISSING_ACTIVITIES);
      }
    });
  });

  describe('state transitions', () => {
    it('should allow starting a scheduled workout', () => {
      // Arrange
      const workout = createWorkoutTemplateFixture({
        status: 'scheduled',
      });

      // Act
      const startResult = startWorkout(workout);

      // Assert
      expect(startResult.isSuccess).toBe(true);
      if (startResult.isSuccess) {
        expect(startResult.value.status).toBe('in_progress');
      }
    });

    it('should allow completing an in-progress workout', () => {
      // Arrange
      const workout = createWorkoutTemplateFixture({
        status: 'scheduled',
      });
      const inProgress = startWorkout(workout).value;

      // Act
      const completeResult = markComplete(inProgress, 'completed-id');

      // Assert
      expect(completeResult.isSuccess).toBe(true);
      if (completeResult.isSuccess) {
        expect(completeResult.value.status).toBe('completed');
        expect(completeResult.value.completedWorkoutId).toBe('completed-id');
      }
    });

    it('should allow skipping a scheduled workout', () => {
      // Arrange
      const workout = createWorkoutTemplateFixture({
        status: 'scheduled',
      });

      // Act
      const skipResult = skipWorkout(workout, 'Feeling unwell');

      // Assert
      expect(skipResult.isSuccess).toBe(true);
      if (skipResult.isSuccess) {
        expect(skipResult.value.status).toBe('skipped');
      }
    });

    it('should allow rescheduling a scheduled workout with valid date', () => {
      // Arrange
      const workout = createWorkoutTemplateFixture();
      const newDate = '2027-12-01T10:00:00Z';

      // Act
      const result = rescheduleWorkout(workout, newDate);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.status).toBe('rescheduled');
        expect(result.value.rescheduledTo).toBeInstanceOf(Date);
        expect(result.value.rescheduledTo?.toISOString()).toBe('2027-12-01T10:00:00.000Z');
      }
    });

    it('should fail rescheduling with invalid date format', () => {
      // Arrange
      const workout = createWorkoutTemplateFixture();

      // Act
      const result = rescheduleWorkout(workout, 'not-a-date');

      // Assert
      expect(result.isFailure).toBe(true);
    });
  });

  describe('intensity adjustment', () => {
    it('should reduce workout intensity correctly', () => {
      // Arrange
      const originalGoals = createDurationWorkout(60, { mustComplete: true, autoVerifiable: false }, 'hard').value;
      const workout = createWorkoutTemplateFixture({ goals: originalGoals });

      // Act
      const adjustedGoals = createDurationWorkout(48, { mustComplete: true, autoVerifiable: false }, 'moderate').value;
      const updatedWorkoutResult = updateGoals(workout, adjustedGoals);

      // Assert
      expect(updatedWorkoutResult.isSuccess).toBe(true);
      if (updatedWorkoutResult.isSuccess) {
        expect(updatedWorkoutResult.value.goals.duration?.value).toBe(48);
      }
    });
  });

  describe('View Mapper', () => {
    it('should map a valid workout template entity to view model with enriched fields', () => {
      // Arrange
      const template = createWorkoutTemplateFixture({
        activities: [
          createWorkoutActivityFixture({ duration: 10 }),
          createWorkoutActivityFixture({ duration: 20 }),
        ],
        scheduledDate: new Date('2025-01-20T10:00:00Z'),
      });

      // Act
      const view = toWorkoutTemplateView(template);

      // Assert
      expect(view.id).toBe(template.id);
      expect(view.title).toBe(template.title);
      expect(view.scheduledDate).toBe('2025-01-20T10:00:00.000Z');

      // Check enriched fields
      expect(view.estimatedDuration).toBe(30);
      expect(typeof view.isPastDue).toBe('boolean');
      expect(typeof view.isCompleted).toBe('boolean');
    });

    it('should handle optional fields correctly', () => {
      // Arrange
      const template = createWorkoutTemplateFixture({
        description: undefined,
        userNotes: undefined,
        alternatives: undefined,
        activities: [],
      });

      // Act
      const view = toWorkoutTemplateView(template);

      // Assert
      expect(view.description).toBeUndefined();
      expect(view.userNotes).toBeUndefined();
      expect(view.alternatives).toBeUndefined();
      expect(view.estimatedDuration).toBe(0);
    });
  });

  describe('queries', () => {
    it('should calculate total estimated duration from activities', () => {
      // Arrange
      const template = createWorkoutTemplateFixture({
        activities: [
          createWorkoutActivityFixture({ duration: 15 }),
          createWorkoutActivityFixture({ duration: 30 }),
          createWorkoutActivityFixture({ duration: 10 }),
        ],
      });

      // Act
      const duration = WorkoutTemplateQueries.getEstimatedDuration(template);

      // Assert
      expect(duration).toBe(55);
    });

    it('should identify completed status correctly', () => {
      // Arrange
      const completed = createWorkoutTemplateFixture({ status: 'completed' });
      const scheduled = createWorkoutTemplateFixture({ status: 'scheduled' });

      // Act & Assert
      expect(WorkoutTemplateQueries.isCompleted(completed)).toBe(true);
      expect(WorkoutTemplateQueries.isCompleted(scheduled)).toBe(false);
    });

    it('should identify past due workouts correctly', () => {
      // Arrange
      const past = new Date();
      past.setDate(past.getDate() - 1);

      const future = new Date();
      future.setDate(future.getDate() + 1);

      const overdue = createWorkoutTemplateFixture({
        status: 'scheduled',
        scheduledDate: past
      });
      const upcoming = createWorkoutTemplateFixture({
        status: 'scheduled',
        scheduledDate: future
      });
      const inProgress = createWorkoutTemplateFixture({
        status: 'in_progress',
        scheduledDate: past
      });

      // Act & Assert
      expect(WorkoutTemplateQueries.isPastDue(overdue)).toBe(true);
      expect(WorkoutTemplateQueries.isPastDue(upcoming)).toBe(false);
      expect(WorkoutTemplateQueries.isPastDue(inProgress)).toBe(false); // Only scheduled can be overdue
    });

    it('should provide correct display info summary', () => {
      // Arrange
      const date = new Date('2025-01-20T10:00:00Z');
      const template = createWorkoutTemplateFixture({
        title: 'Test Workout',
        status: 'scheduled',
        scheduledDate: date,
        activities: [createWorkoutActivityFixture({ duration: 25 })],
      });

      // Act
      const info = WorkoutTemplateQueries.getDisplayInfo(template);

      // Assert
      expect(info).toMatchObject({
        title: 'Test Workout',
        status: 'scheduled',
        scheduledDate: date.toISOString(),
        estimatedDuration: 25,
      });
    });
  });
});
