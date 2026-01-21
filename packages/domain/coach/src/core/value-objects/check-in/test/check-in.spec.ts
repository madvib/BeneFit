import { describe, it, expect } from 'vitest';
import { CreateCheckInSchema } from '../check-in.factory.js';
import { createCheckInFixture } from './check-in.fixtures.js';

describe('CheckIn', () => {
  describe('Factory', () => {
    it('should create a valid check-in', () => {
      // Arrange
      const input = {
        type: 'scheduled' as const,
        question: 'How are you feeling today?',
        triggeredBy: 'weekly_review' as const,
      };

      // Act
      const result = CreateCheckInSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const checkIn = result.data;
        expect(checkIn.id).toBeDefined();
        expect(checkIn.type).toBe('scheduled');
        expect(checkIn.question).toBe('How are you feeling today?');
        expect(checkIn.triggeredBy).toBe('weekly_review');
        expect(checkIn.status).toBe('pending');
        expect(checkIn.createdAt).toBeInstanceOf(Date);
        expect(checkIn.actions).toHaveLength(0);
      }
    });

    it('should fail if type is missing', () => {
      // Act
      const result = CreateCheckInSchema.safeParse({
        type: null as never,
        question: 'Question?',
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail if question is empty', () => {
      // Act
      const result = CreateCheckInSchema.safeParse({
        type: 'proactive' as const,
        question: '',
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail if question is too long', () => {
      // Arrange
      const longQuestion = 'a'.repeat(501);

      // Act
      const result = CreateCheckInSchema.safeParse({
        type: 'proactive' as const,
        question: longQuestion,
      });

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const fixture = createCheckInFixture();

      expect(fixture.id).toBeDefined();
      expect(fixture.type).toBeDefined();
      expect(fixture.question).toBeDefined();
    });

    it('should allow overrides in fixture', () => {
      const fixture = createCheckInFixture({ status: 'responded', userResponse: 'I feel great' });

      expect(fixture.status).toBe('responded');
      expect(fixture.userResponse).toBe('I feel great');
    });
  });
});
