import { describe, it, expect } from 'vitest';
import { toCoachActionView } from '../coach-action.view.js';
import { createCoachActionFixture } from './coach-action.fixtures.js';

describe('CoachAction Presentation', () => {
  it('should map a valid coach action to presentation DTO', () => {
    const action = createCoachActionFixture();
    const presentation = toCoachActionView(action);


    expect(presentation.type).toBe(action.type);
    expect(presentation.details).toBe(action.details);
    expect(presentation.planChangeId).toBe(action.planChangeId);
  });

  it('should convert appliedAt Date to ISO string', () => {
    const action = createCoachActionFixture({
      appliedAt: new Date('2024-01-15T10:30:00Z'),
    });
    const presentation = toCoachActionView(action);

    expect(typeof presentation.appliedAt).toBe('string');
    expect(presentation.appliedAt).toBe('2024-01-15T10:30:00.000Z');
  });

  it('should handle optional planChangeId', () => {
    const actionWithPlanChange = createCoachActionFixture({
      planChangeId: '550e8400-e29b-41d4-a716-446655440003',
    });
    const actionWithoutPlanChange = createCoachActionFixture({
      planChangeId: undefined,
    });

    const presentationWith = toCoachActionView(actionWithPlanChange);
    const presentationWithout = toCoachActionView(actionWithoutPlanChange);

    expect(presentationWith.planChangeId).toBe('550e8400-e29b-41d4-a716-446655440003');
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
      const presentation = toCoachActionView(action);
      expect(presentation.type).toBe(type);
    });
  });
});
