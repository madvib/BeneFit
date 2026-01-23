import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import {
  CreatePlanGoalsSchema,
  createEventTraining,
  createStrengthBuilding,
  createHabitBuilding,
} from '../plan-goals.factory.js';
import { toPlanGoalsView } from '../plan-goals.view.js';
import { createPlanGoalsFixture } from '@/fixtures.js';
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
  withUpdatedTargetPace,
} from '../plan-goals.commands.js';

describe('PlanGoals', () => {
  describe('creation', () => {
    it('should create valid plan goals with primary and secondary goals', () => {
      // Arrange & Act
      const primary = 'Test primary goal';
      const secondary = ['Test secondary goal 1', 'Test secondary goal 2'];
      const goals = createPlanGoalsFixture({
        primary,
        secondary,
      });

      // Assert
      expect(goals.primary).toBe(primary);
      expect(goals.secondary).toHaveLength(2);
      expect(goals.secondary).toEqual(secondary);
    });

    it('should create plan goals with target date', () => {
      // Arrange
      const targetDate = faker.date.future();

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
      const pastDate = faker.date.past();

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
          targetWeights: [{ exercise: 'Test Exercise', weight: -100 }],
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
      const targetDate = faker.date.future();
      const eventName = 'Test Event Name';
      const result = createEventTraining(eventName, 42195, targetDate, 300);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isEventTraining(result.value)).toBe(true);
        expect(hasTargetDistance(result.value)).toBe(true);
        expect(hasTargetPace(result.value)).toBe(true);
        expect(result.value.primary).toContain(eventName);
      }
    });

    it('should create strength building goals', () => {
      const targetWeights = [
        { exercise: 'Bench Press', weight: 140 },
        { exercise: 'Squat', weight: 100 },
        { exercise: 'Deadlift', weight: 180 },
      ];
      const goalName = 'strength';
      const result = createStrengthBuilding(goalName, targetWeights);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isStrengthFocused(result.value)).toBe(true);
        expect(hasTargetWeights(result.value)).toBe(true);
      }
    });

    it('should create habit building goals', () => {
      const streak = 30;
      const result = createHabitBuilding('Build consistent workout routine', streak);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isConsistencyFocused(result.value)).toBe(true);
        expect(result.value.targetMetrics.minStreakDays).toBe(streak);
      }
    });
  });

  describe('withNewTargetDate', () => {
    it('should update target date', () => {
      // Arrange
      const goals = createPlanGoalsFixture();
      const newDate = faker.date.future();

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
      const pastDate = faker.date.past();

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
      const newGoal = 'Updated goal';

      // Act
      const updatedResult = withUpdatedPrimaryGoal(goals, newGoal);

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        expect(updatedResult.value.primary).toBe(newGoal);
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
      const existing = 'Existing goal';
      const goals = createPlanGoalsFixture({ secondary: [existing] });
      const newGoal = 'New goal';

      // Act
      const updatedResult = withAdditionalSecondaryGoal(goals, newGoal);

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        expect(updatedResult.value.secondary).toContain(newGoal);
        expect(updatedResult.value.secondary).toHaveLength(2);
      }
    });

    it('should not add duplicate secondary goal', () => {
      // Arrange
      const existing = 'Existing goal';
      const goals = createPlanGoalsFixture({ secondary: [existing] });

      // Act
      const updatedResult = withAdditionalSecondaryGoal(goals, existing);

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
      const newPace = 250;

      // Act
      const updatedResult = withUpdatedTargetPace(goals, newPace);

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        expect(updatedResult.value.targetMetrics.targetPace).toBe(newPace);
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
