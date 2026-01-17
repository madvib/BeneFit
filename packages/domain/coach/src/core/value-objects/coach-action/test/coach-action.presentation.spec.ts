import { describe, it, expect } from 'vitest';
import { CoachActionPresentationSchema, toCoachActionPresentation } from '../coach-action.presentation.js';
import { createCoachActionFixture } from './coach-action.fixtures.js';

describe('CoachAction Presentation', () => {
  it('should map a valid coach action to presentation DTO', () => {
    const action = createCoachActionFixture();
    const presentation = toCoachActionPresentation(action);

    const result = CoachActionPresentationSchema.safeParse(presentation);
    expect(result.success).toBe(true);
    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }
    expect(presentation.type).toBe(action.type);
    expect(presentation.details).toBe(action.details);
    expect(presentation.planChangeId).toBe(action.planChangeId);
  });

  it('should convert appliedAt Date to ISO string', () => {
    const action = createCoachActionFixture({
      appliedAt: new Date('2024-01-15T10:30:00Z'),
    });
    const presentation = toCoachActionPresentation(action);

    expect(typeof presentation.appliedAt).toBe('string');
    expect(presentation.appliedAt).toBe('2024-01-15T10:30:00.000Z');
  });

  it('should handle optional planChangeId', () => {
    const actionWithPlanChange = createCoachActionFixture({
      planChangeId: 'plan-123',
    });
    const actionWithoutPlanChange = createCoachActionFixture({
      planChangeId: undefined,
    });

    const presentationWith = toCoachActionPresentation(actionWithPlanChange);
    const presentationWithout = toCoachActionPresentation(actionWithoutPlanChange);

    expect(presentationWith.planChangeId).toBe('plan-123');
    expect(presentationWithout.planChangeId).toBeUndefined();
  });

  it('should validate all action types', () => {
    const actionTypes = [
      'adjusted_plan',
      'suggested_rest_day',
      'encouraged',
      'scheduled_followup',
      'recommended_deload',
      'modified_exercise',
      'celebrated_win',
    ] as const;

    actionTypes.forEach((type) => {
      const action = createCoachActionFixture({ type });
      const presentation = toCoachActionPresentation(action);
      const result = CoachActionPresentationSchema.safeParse(presentation);
      expect(result.success).toBe(true);
    });
  });
});
