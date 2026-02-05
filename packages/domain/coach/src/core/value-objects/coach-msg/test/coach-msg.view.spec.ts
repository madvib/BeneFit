import { describe, it, expect } from 'vitest';
import { toCoachMsgView } from '../coach-msg.view.js';
import { createCoachMsgFixture } from './coach-msg.fixtures.js';

describe('CoachMsg Presentation', () => {
  it('should map a valid coach message to presentation DTO', () => {
    const msg = createCoachMsgFixture();
    const presentation = toCoachMsgView(msg);


    expect(presentation.id).toBe(msg.id);
    expect(presentation.role).toBe(msg.role);
    expect(presentation.content).toBe(msg.content);
  });

  it('should convert timestamp Date to ISO string', () => {
    const msg = createCoachMsgFixture({
      timestamp: new Date('2024-01-15T10:30:00Z'),
    });
    const presentation = toCoachMsgView(msg);

    expect(typeof presentation.timestamp).toBe('string');
    expect(presentation.timestamp).toBe('2024-01-15T10:30:00.000Z');
  });



  it('should map nested coach actions to presentation', () => {
    const msg = createCoachMsgFixture({
      role: 'coach',
    });
    const presentation = toCoachMsgView(msg);

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
    const presentation = toCoachMsgView(msg);

    expect(presentation.actions).toBeUndefined();
  });

  it('should validate all message roles', () => {
    const roles = ['user', 'coach', 'system'] as const;

    roles.forEach((role) => {
      const msg = createCoachMsgFixture({ role });
      const presentation = toCoachMsgView(msg);
      expect(presentation.role).toBe(role);
    });
  });

  it('should handle optional checkInId', () => {
    const msgWithCheckIn = createCoachMsgFixture({
      checkInId: '550e8400-e29b-41d4-a716-446655440002',
    });
    const msgWithoutCheckIn = createCoachMsgFixture({
      checkInId: undefined,
    });

    const presentationWith = toCoachMsgView(msgWithCheckIn);
    const presentationWithout = toCoachMsgView(msgWithoutCheckIn);

    expect(presentationWith.checkInId).toBe('550e8400-e29b-41d4-a716-446655440002');
    expect(presentationWithout.checkInId).toBeUndefined();
  });
});
