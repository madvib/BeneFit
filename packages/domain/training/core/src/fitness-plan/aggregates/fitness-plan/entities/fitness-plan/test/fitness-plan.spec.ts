import { describe, it, expect } from 'vitest';
import { createTrainingConstraints } from '@/shared/value-objects/index.js';
import {
  createDraftFitnessPlan,
  toFitnessPlanView,
} from '../fitness-plan.factory.js';
import {
  createPlanGoals,
  createProgressionStrategy,
} from '@/fitness-plan/value-objects/index.js';
import { createFitnessPlanFixture } from './fitness-plan.fixtures.js';

describe('FitnessPlan Aggregate', () => {
  // ============================================
  // FACTORY (Creation & Validation)
  // ============================================
  describe('Factory', () => {
    const validGoalsResult = createPlanGoals({
      primary: 'Run 5k',
      secondary: [],
      targetMetrics: {},
    });

    const validProgressionResult = createProgressionStrategy({
      type: 'linear',
    });

    const validConstraintsResult = createTrainingConstraints({
      availableDays: ['Monday'],
      availableEquipment: [],
      location: 'outdoor',
    });

    // Check that all creation results are successful before using values
    expect(validGoalsResult.isSuccess).toBe(true);
    expect(validProgressionResult.isSuccess).toBe(true);
    expect(validConstraintsResult.isSuccess).toBe(true);

    const validGoals = validGoalsResult.value;
    const validProgression = validProgressionResult.value;
    const validConstraints = validConstraintsResult.value;

    const validProps = {
      id: 'plan-123',
      userId: 'user-123',
      title: 'My Plan',
      description: 'A test plan',
      planType: 'event_training' as const,
      goals: validGoals,
      progression: validProgression,
      constraints: validConstraints,
      startDate: new Date().toISOString(),
    };

    it('should create a valid plan', () => {
      const result = createDraftFitnessPlan(validProps);
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const plan = result.value;
        expect(plan.title).toBe('My Plan');
        expect(plan.status).toBe('draft');
      }
    });

    it('should fail if title is empty', () => {
      const result = createDraftFitnessPlan({
        userId: 'user-123',
        title: '',
        description: 'A test plan',
        planType: 'event_training' as const,
        goals: validGoals,
        progression: validProgression,
        constraints: validConstraints,
        startDate: new Date().toISOString(),
      });
      expect(result.isFailure).toBe(true);
    });
  });

  // ============================================
  // VIEW MAPPER (API Conversion)
  // ============================================
  describe('View Mapper', () => {
    it('should map a valid fitness plan entity to view model', () => {
      const plan = createFitnessPlanFixture();
      const view = toFitnessPlanView(plan);

      // Basic fields
      expect(view.id).toBe(plan.id);
      expect(view.title).toBe(plan.title);
      expect(view.planType).toBe(plan.planType);

      // Type checks
      expect(typeof view.id).toBe('string');
      expect(typeof view.title).toBe('string');
    });

    it('should serialize dates as ISO strings', () => {
      const plan = createFitnessPlanFixture();
      const view = toFitnessPlanView(plan);

      // Dates should be strings
      expect(typeof view.startDate).toBe('string');
      expect(typeof view.createdAt).toBe('string');
      expect(typeof view.updatedAt).toBe('string');

      // Should be valid ISO format
      expect(() => new Date(view.startDate)).not.toThrow();
      expect(() => new Date(view.createdAt)).not.toThrow();
    });

    it('should include computed summary fields', () => {
      const plan = createFitnessPlanFixture();
      const view = toFitnessPlanView(plan);

      expect(view.summary).toBeDefined();
      expect(typeof view.summary.total).toBe('number');
      expect(typeof view.summary.completed).toBe('number');
      expect(view.summary.completed).toBeGreaterThanOrEqual(0);
      expect(view.summary.completed).toBeLessThanOrEqual(view.summary.total);
    });

    it('should include current workout if scheduled', () => {
      // Force a position that has a workout
      const plan = createFitnessPlanFixture({
        currentPosition: { week: 1, day: 1 }
      });
      // The fixture creates workouts at day 1, 3, 5

      const view = toFitnessPlanView(plan);

      expect(view.currentWorkout).toBeDefined();
      expect(view.currentWorkout?.dayOfWeek).toBe(1);
      expect(view.currentWorkout?.weekNumber).toBe(1);
    });

    it('should handle missing current workout', () => {
      const plan = createFitnessPlanFixture({
        currentPosition: { week: 1, day: 2 } // Day 2 has no workout in default fixture
      });
      const view = toFitnessPlanView(plan);

      expect(view.currentWorkout).toBeUndefined();
    });

    it('should correctly map arrays', () => {
      const plan = createFitnessPlanFixture();
      const view = toFitnessPlanView(plan);

      // Verify goals.secondary
      expect(Array.isArray(view.goals.secondary)).toBe(true);
      expect(view.goals.secondary).toEqual(plan.goals.secondary);

      // Verify targetMetrics.targetWeights if present
      if (view.goals.targetMetrics.targetWeights) {
        expect(Array.isArray(view.goals.targetMetrics.targetWeights)).toBe(true);
      }

      // Verify weeks array
      expect(Array.isArray(view.weeks)).toBe(true);
      expect(view.weeks.length).toBe(plan.weeks.length);
    });

    it('should omit internal fields', () => {
      const plan = createFitnessPlanFixture({ templateId: 'internal-template-123' });
      const view = toFitnessPlanView(plan);

      // templateId should NOT be in view
      expect('templateId' in view).toBe(false);
    });

    it('should include current week', () => {
      const plan = createFitnessPlanFixture({
        currentPosition: { week: 1, day: 1 }
      });
      const view = toFitnessPlanView(plan);

      expect(view.currentWeek).toBeDefined();
      expect(view.currentWeek?.weekNumber).toBe(1);
    });
  });
});
