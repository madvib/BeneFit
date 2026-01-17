import { describe, it, expect } from 'vitest';
import { WorkoutSessionSchema, toWorkoutSessionSchema } from '../workout-session.presentation.js';
import { createWorkoutSessionFixture } from './workout-session.fixtures.js';

describe('WorkoutSession Presentation', () => {
  it('should map a valid workout session entity to presentation DTO', () => {
    const session = createWorkoutSessionFixture();
    const presentation = toWorkoutSessionSchema(session);

    const result = WorkoutSessionSchema.safeParse(presentation);

    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }

    expect(result.success).toBe(true);
    expect(presentation.id).toBe(session.id);
    expect(presentation.ownerId).toBe(session.ownerId);
    expect(presentation.activities).toHaveLength(session.activities.length);
    expect(presentation.configuration.isMultiplayer).toBe(session.configuration.isMultiplayer);

    // Computed Fields
    expect(presentation.activeDuration).toBeTypeOf('number');
    expect(presentation.completionPercentage).toBeTypeOf('number');
    expect(presentation).toHaveProperty('activeDuration');
    expect(presentation).toHaveProperty('completionPercentage');
  });

  it('should handle optional fields correctly', () => {
    const session = createWorkoutSessionFixture({
      planId: undefined,
      startedAt: undefined
    });
    const presentation = toWorkoutSessionSchema(session);

    expect(presentation.planId).toBeUndefined();
    expect(presentation.startedAt).toBeUndefined();
  });
});
