import { describe, it, expect } from 'vitest';
import {
  createPlanGoals,
  createEventTraining,
  createStrengthBuilding, createHabitBuilding,
  toPlanGoalsView,
} from '../../index.js';
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
  describe('create', () => {
    it('should create plan goals with primary and secondary goals', () => {
      const result = createPlanGoals({
        primary: 'Build strength',
        secondary: ['Improve flexibility', 'Increase endurance'],
        targetMetrics: {},
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.primary).toBe('Build strength');
        expect(result.value.secondary.length).toBe(2);
      }
    });

    it('should create plan goals with target date', () => {
      const targetDate = new Date('2027-12-31');
      const result = createPlanGoals({
        primary: 'Marathon training',
        secondary: [],
        targetMetrics: {
          targetDistance: 42195,
        },
        targetDate,
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.targetDate).toEqual(targetDate);
      }
    });

    it('should fail with empty primary goal', () => {
      const result = createPlanGoals({
        primary: '',
        secondary: [],
        targetMetrics: {},
      });

      expect(result.isFailure).toBe(true);
    });

    it('should validate target metrics', () => {
      const result = createPlanGoals({
        primary: 'Build strength',
        secondary: [],
        targetMetrics: {
          targetWeights: [{ exercise: 'Squat', weight: -100 }],
        },
      });

      expect(result.isFailure).toBe(true);
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
      const goalsResult = createPlanGoals({
        primary: 'Training',
        secondary: [],
        targetMetrics: {},
      });

      if (goalsResult.isSuccess) {
        const newDate = new Date('2027-01-01');
        const updatedResult = withNewTargetDate(goalsResult.value, newDate);

        expect(updatedResult.isSuccess).toBe(true);
        if (updatedResult.isSuccess) {
          expect(updatedResult.value.targetDate).toEqual(newDate);
        }
      }
    });

    it('should fail with past date', () => {
      const oldDate = new Date('2020-01-01');
      const goalsResult = createPlanGoals({
        primary: 'Training',
        secondary: [],
        targetMetrics: {},
      });

      if (goalsResult.isSuccess) {
        const result = withNewTargetDate(goalsResult.value, oldDate);

        expect(result.isFailure).toBe(true);
      }
    });
  });

  describe('withUpdatedPrimaryGoal', () => {
    it('should update primary goal', () => {
      const goalsResult = createPlanGoals({
        primary: 'Original Goal',
        secondary: [],
        targetMetrics: {},
      });

      if (goalsResult.isSuccess) {
        const updatedResult = withUpdatedPrimaryGoal(goalsResult.value, 'New Goal');

        expect(updatedResult.isSuccess).toBe(true);
        if (updatedResult.isSuccess) {
          expect(updatedResult.value.primary).toBe('New Goal');
        }
      }
    });

    it('should fail with empty string', () => {
      const goalsResult = createPlanGoals({
        primary: 'Original Goal',
        secondary: [],
        targetMetrics: {},
      });

      if (goalsResult.isSuccess) {
        const result = withUpdatedPrimaryGoal(goalsResult.value, '');

        expect(result.isFailure).toBe(true);
      }
    });
  });

  describe('withAdditionalSecondaryGoal', () => {
    it('should add secondary goal', () => {
      const goalsResult = createPlanGoals({
        primary: 'Main Goal',
        secondary: ['Existing Goal'],
        targetMetrics: {},
      });

      if (goalsResult.isSuccess) {
        const updatedResult = withAdditionalSecondaryGoal(goalsResult.value, 'New Goal');

        expect(updatedResult.isSuccess).toBe(true);
        if (updatedResult.isSuccess) {
          expect(updatedResult.value.secondary).toContain('New Goal');
          expect(updatedResult.value.secondary.length).toBe(2);
        }
      }
    });

    it('should not add duplicate secondary goal', () => {
      const goalsResult = createPlanGoals({
        primary: 'Main Goal',
        secondary: ['Existing Goal'],
        targetMetrics: {},
      });

      if (goalsResult.isSuccess) {
        const updatedResult = withAdditionalSecondaryGoal(goalsResult.value, 'Existing Goal');

        expect(updatedResult.isSuccess).toBe(true);
        if (updatedResult.isSuccess) {
          expect(updatedResult.value.secondary.length).toBe(1);
        }
      }
    });
  });

  describe('withUpdatedTargetPace', () => {
    it('should update target pace', () => {
      const goalsResult = createPlanGoals({
        primary: 'Running Goal',
        secondary: [],
        targetMetrics: { targetPace: 300 },
      });

      if (goalsResult.isSuccess) {
        const updatedResult = withUpdatedTargetPace(goalsResult.value, 270);

        expect(updatedResult.isSuccess).toBe(true);
        if (updatedResult.isSuccess) {
          expect(updatedResult.value.targetMetrics.targetPace).toBe(270);
        }
      }
    });

    it('should fail with invalid pace', () => {
      const goalsResult = createPlanGoals({
        primary: 'Running Goal',
        secondary: [],
        targetMetrics: { targetPace: 300 },
      });

      if (goalsResult.isSuccess) {
        const result = withUpdatedTargetPace(goalsResult.value, 0);

        expect(result.isFailure).toBe(true);
      }
    });
  });

  // More tests for withUpdatedTargetWeight, withAdjustedTargetMetrics, etc...
  describe('toPlanGoalsView', () => {
    it('should serialize targetDate to string', () => {
      const targetDate = new Date('2026-01-01T12:00:00Z');
      const result = createPlanGoals({
        primary: 'Test',
        secondary: [],
        targetMetrics: {},
        targetDate,
      });

      if (result.isSuccess) {
        const view = toPlanGoalsView(result.value);

        expect(view.targetDate).toBe('2026-01-01T12:00:00.000Z');
        expect(typeof view.targetDate).toBe('string');
      }
    });

    it('should handle missing targetDate', () => {
      const result = createPlanGoals({
        primary: 'Test',
        secondary: [],
        targetMetrics: {},
      });

      if (result.isSuccess) {
        const view = toPlanGoalsView(result.value);

        expect(view.targetDate).toBeUndefined();
      }
    });
  });
});