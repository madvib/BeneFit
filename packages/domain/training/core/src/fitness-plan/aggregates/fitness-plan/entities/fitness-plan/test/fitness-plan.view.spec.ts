import { describe, it, expect } from 'vitest';
import { toFitnessPlanView } from '../fitness-plan.view.js';
import { createFitnessPlanFixture } from './fitness-plan.fixtures.js';

describe('FitnessPlan View Mapper', () => {
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
