import { describe, it, expect } from 'vitest';
import { createCheckIn } from '../check-in.factory.js';

describe('CheckIn Value Object', () => {
  it('should create a valid check-in', () => {
    const result = createCheckIn({
      type: 'scheduled',
      question: 'How are you feeling today?',
      triggeredBy: 'weekly_review',
    });

    expect(result.isSuccess).toBe(true);
    const checkIn = result.value;
    expect(checkIn.id).toBeDefined();
    expect(checkIn.type).toBe('scheduled');
    expect(checkIn.question).toBe('How are you feeling today?');
    expect(checkIn.triggeredBy).toBe('weekly_review');
    expect(checkIn.status).toBe('pending');
    expect(checkIn.createdAt).toBeInstanceOf(Date);
    expect(checkIn.actions).toHaveLength(0);
  });

  it('should fail if type is missing', () => {
    const result = createCheckIn({
      type: null as never,
      question: 'Question?',
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if question is missing', () => {
    const result = createCheckIn({
      type: 'proactive',
      question: null as never,
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if question is empty', () => {
    const result = createCheckIn({
      type: 'proactive',
      question: '',
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if question is too long', () => {
    const longQuestion = 'a'.repeat(501);
    const result = createCheckIn({
      type: 'proactive',
      question: longQuestion,
    });

    expect(result.isFailure).toBe(true);
  });
});
