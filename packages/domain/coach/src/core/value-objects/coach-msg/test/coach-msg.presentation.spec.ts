import { describe, it, expect } from 'vitest';
import { CoachMsgPresentationSchema, toCoachMsgPresentation } from '../coach-msg.presentation.js';
import { createCoachMsgFixture } from './coach-msg.fixtures.js';

describe('CoachMsg Presentation', () => {
  it('should map a valid coach message to presentation DTO', () => {
    const msg = createCoachMsgFixture();
    const presentation = toCoachMsgPresentation(msg);

    const result = CoachMsgPresentationSchema.safeParse(presentation);
    expect(result.success).toBe(true);
    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }
    expect(presentation.id).toBe(msg.id);
    expect(presentation.role).toBe(msg.role);
    expect(presentation.content).toBe(msg.content);
  });

  it('should convert timestamp Date to ISO string', () => {
    const msg = createCoachMsgFixture({
      timestamp: new Date('2024-01-15T10:30:00Z'),
    });
    const presentation = toCoachMsgPresentation(msg);

    expect(typeof presentation.timestamp).toBe('string');
    expect(presentation.timestamp).toBe('2024-01-15T10:30:00.000Z');
  });

  it('should redact tokens field from presentation', () => {
    const msg = createCoachMsgFixture({
      tokens: 250,
    });
    const presentation = toCoachMsgPresentation(msg);

    expect('tokens' in presentation).toBe(false);
    expect((presentation as any).tokens).toBeUndefined();
  });

  it('should map nested coach actions to presentation', () => {
    const msg = createCoachMsgFixture({
      role: 'coach',
    });
    const presentation = toCoachMsgPresentation(msg);

    if (presentation.actions) {
      expect(Array.isArray(presentation.actions)).toBe(true);
      presentation.actions.forEach((action) => {
        expect(typeof action.appliedAt).toBe('string');
        expect(action.type).toBeDefined();
      });
    }
  });

  it('should handle messages without actions', () => {
    const msg = createCoachMsgFixture({
      role: 'user',
      actions: undefined,
    });
    const presentation = toCoachMsgPresentation(msg);

    expect(presentation.actions).toBeUndefined();
  });

  it('should validate all message roles', () => {
    const roles = ['user', 'coach', 'system'] as const;

    roles.forEach((role) => {
      const msg = createCoachMsgFixture({ role });
      const presentation = toCoachMsgPresentation(msg);
      const result = CoachMsgPresentationSchema.safeParse(presentation);
      expect(result.success).toBe(true);
    });
  });

  it('should handle optional checkInId', () => {
    const msgWithCheckIn = createCoachMsgFixture({
      checkInId: 'check-in-123',
    });
    const msgWithoutCheckIn = createCoachMsgFixture({
      checkInId: undefined,
    });

    const presentationWith = toCoachMsgPresentation(msgWithCheckIn);
    const presentationWithout = toCoachMsgPresentation(msgWithoutCheckIn);

    expect(presentationWith.checkInId).toBe('check-in-123');
    expect(presentationWithout.checkInId).toBeUndefined();
  });
});
