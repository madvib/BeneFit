import { describe, it, expect } from 'vitest';
import { CreateCoachActionSchema } from '../coach-action.factory.js';
import { createCoachActionFixture } from './coach-action.fixtures.js';

describe('CoachAction', () => {
  describe('Factory', () => {
    it('should create a valid coach action', () => {
      // Arrange
      const input = {
        type: 'encouraged' as const,
        details: 'Keep up the good work!',
        planChangeId: '550e8400-e29b-41d4-a716-446655440003',
      };

      // Act
      const result = CreateCoachActionSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const action = result.data;
        expect(action.type).toBe('encouraged');
        expect(action.details).toBe('Keep up the good work!');
        expect(action.planChangeId).toBe('550e8400-e29b-41d4-a716-446655440003');
        expect(action.appliedAt).toBeInstanceOf(Date);
      }
    });

    it('should fail if type is missing', () => {
      // Act
      const result = CreateCoachActionSchema.safeParse({
        // @ts-expect-error Testing invalid input
        type: null,
        details: 'Details',
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail if details is empty', () => {
      // Act
      const result = CreateCoachActionSchema.safeParse({
        type: 'adjusted_plan',
        details: '',
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail if details is too long', () => {
      // Arrange
      const longDetails = 'a'.repeat(501);

      // Act
      const result = CreateCoachActionSchema.safeParse({
        type: 'adjusted_plan',
        details: longDetails,
      });

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const fixture = createCoachActionFixture();

      expect(fixture.type).toBeDefined();
      expect(fixture.details).toBeDefined();
    });

    it('should allow overrides in fixture', () => {
      const fixture = createCoachActionFixture({ details: 'Custom details' });

      expect(fixture.details).toBe('Custom details');
    });
  });
});
