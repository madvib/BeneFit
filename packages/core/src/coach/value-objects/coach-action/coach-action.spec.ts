import { describe, it, expect } from 'vitest';
import { createCoachAction } from './coach-action.factory.js';

describe('CoachAction Value Object', () => {
  it('should create a valid coach action', () => {
    const result = createCoachAction({
      type: 'encouraged',
      details: 'Keep up the good work!',
      planChangeId: 'change-123'
    });

    expect(result.isSuccess).toBe(true);
    const action = result.value;
    expect(action.type).toBe('encouraged');
    expect(action.details).toBe('Keep up the good work!');
    expect(action.planChangeId).toBe('change-123');
    expect(action.appliedAt).toBeInstanceOf(Date);
  });

  it('should fail if type is missing', () => {
    const result = createCoachAction({
      type: null as any,
      details: 'Details'
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if details is missing', () => {
    const result = createCoachAction({
      type: 'adjusted_plan',
      details: null as any
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if details is empty', () => {
    const result = createCoachAction({
      type: 'adjusted_plan',
      details: ''
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if details is too long', () => {
    const longDetails = 'a'.repeat(501);
    const result = createCoachAction({
      type: 'adjusted_plan',
      details: longDetails
    });

    expect(result.isFailure).toBe(true);
  });
});
