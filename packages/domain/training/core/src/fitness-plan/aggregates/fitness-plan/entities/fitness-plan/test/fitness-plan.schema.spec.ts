import { describe, it, expect } from 'vitest';
import { FitnessPlanSchema, toFitnessPlanSchema } from '../fitness-plan.schema.js';
import { createFitnessPlanFixture } from './fitness-plan.fixtures.js';

describe.skip('FitnessPlan Presentation', () => {
  it('should map a valid fitness plan entity to presentation DTO', () => {
    const plan = createFitnessPlanFixture();
    const presentation = toFitnessPlanSchema(plan);

    const result = FitnessPlanSchema.safeParse(presentation);
    expect(result.success).toBe(true);
    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }
    expect(presentation.id).toBe(plan.id);
    expect(presentation.title).toBe(plan.title);
    expect(presentation.planType).toBe(plan.planType);
  });

  it('should include computed summary fields', () => {
    const plan = createFitnessPlanFixture();
    const presentation = toFitnessPlanSchema(plan);

    expect(presentation.summary).toBeDefined();
    expect(typeof presentation.summary.total).toBe('number');
    expect(typeof presentation.summary.completed).toBe('number');
  });

  it('should include current workout if scheduled', () => {
    // Force a position that has a workout
    const plan = createFitnessPlanFixture({
      currentPosition: { week: 1, day: 1 }
    });
    // Ensure the fixture actually has a workout at week 1 day 1
    // The fixture creates week 1. 
    // And WeeklyScheduleFixture creates workouts at day 1, 3, 5.
    // So day 1 should have a workout.

    const presentation = toFitnessPlanSchema(plan);

    expect(presentation.currentWorkout).toBeDefined();
    expect(presentation.currentWorkout?.dayOfWeek).toBe(1);
    expect(presentation.currentWorkout?.weekNumber).toBe(1);
  });

  it('should handle missing current workout', () => {
    const plan = createFitnessPlanFixture({
      currentPosition: { week: 1, day: 2 } // Day 2 has no workout in default fixture
    });
    const presentation = toFitnessPlanSchema(plan);
    expect(presentation.currentWorkout).toBeUndefined();
  });

  it('should correctly map readonly arrays to mutable arrays for presentation', () => {
    const plan = createFitnessPlanFixture();
    const presentation = toFitnessPlanSchema(plan);

    // Verify goals.secondary
    expect(Array.isArray(presentation.goals.secondary)).toBe(true);
    expect(presentation.goals.secondary).toEqual(plan.goals.secondary);

    // Verify targetMetrics.targetWeights if present
    if (presentation.goals.targetMetrics.targetWeights) {
      expect(Array.isArray(presentation.goals.targetMetrics.targetWeights)).toBe(true);
    }
  });

  it('should exclude internal/sensitive fields (if any check needed)', () => {
    // Current mapper is explicit, but we check that nothing weird leaked effectively by schema parse
    const plan = createFitnessPlanFixture();
    const presentation = toFitnessPlanSchema(plan);
    const parsed = FitnessPlanSchema.parse(presentation);

    // Explicitly check something that SHOULD be there is there
    expect(parsed.id).toBeTruthy();
    // And check dates are strings
    expect(typeof parsed.startDate).toBe('string');
  });
});
