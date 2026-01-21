import { describe, it, expect } from 'vitest';
import {
  CreatePlanGoalsSchema,
  createEventTraining,
  createStrengthBuilding,
  createHabitBuilding,
} from '../plan-goals.factory.js';
import { toPlanGoalsView } from '../plan-goals.view.js';
import { createPlanGoalsFixture } from './plan-goals.fixtures.js';
import {
  hasTargetWeights,
  hasTargetPace,
  hasTargetDistance,
  isEventTraining,
  isStrengthFocused,
  isConsistencyFocused,
  withNewTargetDate,
  withUpdatedPrimaryGoal,
  withAdditionalSecondaryGoal,
  withUpdatedTargetPace
} from '../plan-goals.commands.js';

describe('PlanGoals', () => {
  describe('creation', () => {
    it('should create valid plan goals with primary and secondary goals', () => {
      // Arrange & Act
      const goals = createPlanGoalsFixture({
        primary: 'Build strength',
        secondary: ['Improve flexibility', 'Increase endurance'],
      });

      // Assert
      expect(goals.primary).toBe('Build strength');
      expect(goals.secondary).toHaveLength(2);
    });

    it('should create plan goals with target date', () => {
      // Arrange
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 30);

      // Act
      const goals = createPlanGoalsFixture({
        targetDate,
      });

      // Assert
      expect(goals.targetDate).toEqual(targetDate);
    });
  });

  describe('validation', () => {
    it('should fail with empty primary goal', () => {
      // Arrange
      const invalidInput = {
        ...createPlanGoalsFixture(),
        primary: '',
      };

      // Act
      const parseResult = CreatePlanGoalsSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail with past target date', () => {
      // Arrange
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const invalidInput = {
        ...createPlanGoalsFixture(),
        targetDate: pastDate,
      };

      // Act
      const parseResult = CreatePlanGoalsSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail with invalid target weights', () => {
      // Arrange
      const invalidInput = {
        ...createPlanGoalsFixture(),
        targetMetrics: {
          targetWeights: [{ exercise: 'Squat', weight: -100 }],
        },
      };

      // Act
      const parseResult = CreatePlanGoalsSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });

  describe('factory methods', () => {
    it('should create event training goals', () => {
      const targetDate = new Date('2026-10-15'); // Future date
      const result = createEventTraining('Marathon', 42195, targetDate, 300); // Note: original has date before pace

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isEventTraining(result.value)).toBe(true);
        expect(hasTargetDistance(result.value)).toBe(true);
        expect(hasTargetPace(result.value)).toBe(true);
      }
    });

    it('should create strength building goals', () => {
      const targetWeights = [
        { exercise: 'Squat', weight: 140 },
        { exercise: 'Bench Press', weight: 100 },
        { exercise: 'Deadlift', weight: 180 },
      ];
      const result = createStrengthBuilding('Powerlifting', targetWeights);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isStrengthFocused(result.value)).toBe(true);
        expect(hasTargetWeights(result.value)).toBe(true);
      }
    });

    it('should create habit building goals', () => {
      const result = createHabitBuilding('Consistency', 30);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isConsistencyFocused(result.value)).toBe(true);
        expect(result.value.targetMetrics.minStreakDays).toBe(30);
      }
    });
  });

  describe('withNewTargetDate', () => {
    it('should update target date', () => {
      // Arrange
      const goals = createPlanGoalsFixture();
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 45);

      // Act
      const updatedResult = withNewTargetDate(goals, newDate);

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        expect(updatedResult.value.targetDate).toEqual(newDate);
      }
    });

    it('should fail with past date', () => {
      // Arrange
      const goals = createPlanGoalsFixture();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      // Act
      const result = withNewTargetDate(goals, pastDate);

      // Assert
      expect(result.isFailure).toBe(true);
    });
  });

  describe('withUpdatedPrimaryGoal', () => {
    it('should update primary goal', () => {
      // Arrange
      const goals = createPlanGoalsFixture({ primary: 'Original Goal' });

      // Act
      const updatedResult = withUpdatedPrimaryGoal(goals, 'New Goal');

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        expect(updatedResult.value.primary).toBe('New Goal');
      }
    });

    it('should fail with empty string', () => {
      // Arrange
      const goals = createPlanGoalsFixture();

      // Act
      const result = withUpdatedPrimaryGoal(goals, '');

      // Assert
      expect(result.isFailure).toBe(true);
    });
  });

  describe('withAdditionalSecondaryGoal', () => {
    it('should add secondary goal', () => {
      // Arrange
      const goals = createPlanGoalsFixture({ secondary: ['Existing Goal'] });

      // Act
      const updatedResult = withAdditionalSecondaryGoal(goals, 'New Goal');

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        expect(updatedResult.value.secondary).toContain('New Goal');
        expect(updatedResult.value.secondary).toHaveLength(2);
      }
    });

    it('should not add duplicate secondary goal', () => {
      // Arrange
      const goals = createPlanGoalsFixture({ secondary: ['Existing Goal'] });

      // Act
      const updatedResult = withAdditionalSecondaryGoal(goals, 'Existing Goal');

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        expect(updatedResult.value.secondary).toHaveLength(1);
      }
    });
  });

  describe('withUpdatedTargetPace', () => {
    it('should update target pace', () => {
      // Arrange
      const goals = createPlanGoalsFixture({ targetMetrics: { targetPace: 300 } });

      // Act
      const updatedResult = withUpdatedTargetPace(goals, 270);

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        expect(updatedResult.value.targetMetrics.targetPace).toBe(270);
      }
    });

    it('should fail with invalid pace', () => {
      // Arrange
      const goals = createPlanGoalsFixture({ targetMetrics: { targetPace: 300 } });

      // Act
      const result = withUpdatedTargetPace(goals, 0);

      // Assert
      expect(result.isFailure).toBe(true);
    });
  });

  // More tests for withUpdatedTargetWeight, withAdjustedTargetMetrics, etc...
  describe('toPlanGoalsView', () => {
    it('should serialize targetDate to string', () => {
      // Arrange
      const targetDate = new Date('2026-01-01T12:00:00Z');
      const goals = createPlanGoalsFixture({ targetDate });

      // Act
      const view = toPlanGoalsView(goals);

      // Assert
      expect(view.targetDate).toBe('2026-01-01T12:00:00.000Z');
      expect(typeof view.targetDate).toBe('string');
    });

    it('should handle missing targetDate', () => {
      // Arrange
      const goals = createPlanGoalsFixture({ targetDate: undefined });

      // Act
      const view = toPlanGoalsView(goals);

      // Assert
      expect(view.targetDate).toBeUndefined();
    });
  });
});