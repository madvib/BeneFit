import { describe, it, expect } from 'vitest';
import { toCheckInView } from '../check-in.view.js';
import { createCheckInFixture } from './check-in.fixtures.js';

describe('CheckIn Presentation', () => {
  it('should map a valid check-in to presentation DTO', () => {
    const checkIn = createCheckInFixture();
    const presentation = toCheckInView(checkIn);


    expect(presentation.id).toBe(checkIn.id);
    expect(presentation.type).toBe(checkIn.type);
    expect(presentation.question).toBe(checkIn.question);
  });

  it('should convert all dates to ISO strings', () => {
    const checkIn = createCheckInFixture({
      createdAt: new Date('2024-01-15T10:00:00Z'),
      respondedAt: new Date('2024-01-16T14:30:00Z'),
      status: 'responded',
    });
    const presentation = toCheckInView(checkIn);

    expect(typeof presentation.createdAt).toBe('string');
    expect(presentation.createdAt).toBe('2024-01-15T10:00:00.000Z');
    expect(typeof presentation.respondedAt).toBe('string');
    expect(presentation.respondedAt).toBe('2024-01-16T14:30:00.000Z');
  });

  it('should map nested coach actions to presentation', () => {
    const checkIn = createCheckInFixture();
    const presentation = toCheckInView(checkIn);

    expect(Array.isArray(presentation.actions)).toBe(true);
    expect(presentation.actions.length).toBe(checkIn.actions.length);

    presentation.actions.forEach((action) => {
      expect(typeof action.appliedAt).toBe('string');
      expect(action.type).toBeDefined();
      expect(action.details).toBeDefined();
    });
  });

  it('should handle pending check-ins without responses', () => {
    const checkIn = createCheckInFixture({
      status: 'pending',
      userResponse: undefined,
      coachAnalysis: undefined,
      respondedAt: undefined,
      dismissedAt: undefined,
    });
    const presentation = toCheckInView(checkIn);

    expect(presentation.status).toBe('pending');
    expect(presentation.userResponse).toBeUndefined();
    expect(presentation.coachAnalysis).toBeUndefined();
    expect(presentation.respondedAt).toBeUndefined();
    expect(presentation.dismissedAt).toBeUndefined();
  });

  it('should handle dismissed check-ins', () => {
    const checkIn = createCheckInFixture({
      status: 'dismissed',
      dismissedAt: new Date('2024-01-17T09:00:00Z'),
    });
    const presentation = toCheckInView(checkIn);

    expect(presentation.status).toBe('dismissed');
    expect(presentation.dismissedAt).toBe('2024-01-17T09:00:00.000Z');
  });

  it('should validate all check-in types and triggers', () => {
    const types = ['proactive', 'scheduled', 'user_initiated'] as const;
    const triggers = [
      'low_adherence',
      'high_exertion',
      'injury_reported',
      'weekly_review',
      'milestone_achieved',
      'streak_broken',
      'difficulty_pattern',
      'enjoyment_declining',
    ] as const;

    types.forEach((type) => {
      triggers.forEach((trigger) => {
        const checkIn = createCheckInFixture({ type, triggeredBy: trigger });
        const presentation = toCheckInView(checkIn);
        expect(presentation.triggeredBy).toBe(trigger);
      });
    });
  });
});
