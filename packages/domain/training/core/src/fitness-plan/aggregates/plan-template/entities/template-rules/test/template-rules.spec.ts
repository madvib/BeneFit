import { describe, it, expect } from 'vitest';
import { CreateTemplateRulesSchema } from '../template-rules.factory.js';
import { createTemplateRulesFixture } from '@/fixtures.js';

describe('TemplateRules', () => {
  describe('creation', () => {
    it('should create valid rules with all properties defined', () => {
      // Arrange & Act
      const rules = createTemplateRulesFixture();

      // Assert - fixture already proves creation works
      expect(rules.minExperienceLevel).toBeDefined();
      expect(rules.maxExperienceLevel).toBeDefined();
      expect(rules.requiredDaysPerWeek).toBeGreaterThanOrEqual(1);
      expect(rules.requiredDaysPerWeek).toBeLessThanOrEqual(7);
    });

    it('should allow customization through overrides', () => {
      // Arrange & Act
      const requiredDaysPerWeek = 5;
      const rules = createTemplateRulesFixture({
        minExperienceLevel: 'advanced',
        maxExperienceLevel: 'advanced',
        requiredDaysPerWeek,
      });

      // Assert
      expect(rules.minExperienceLevel).toBe('advanced');
      expect(rules.maxExperienceLevel).toBe('advanced');
      expect(rules.requiredDaysPerWeek).toBe(requiredDaysPerWeek);
    });
  });

  describe('validation', () => {
    it('should fail with descriptive error when minExperienceLevel is invalid', () => {
      // Arrange
      const invalidInput = {
        minExperienceLevel: 'expert',
        maxExperienceLevel: 'advanced' as const,
      };

      // Act
      const parseResult = CreateTemplateRulesSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when experience levels are in wrong order', () => {
      // Arrange
      const invalidInput = {
        minExperienceLevel: 'advanced' as const,
        maxExperienceLevel: 'beginner' as const, // min > max violates domain rule
      };

      // Act
      const parseResult = CreateTemplateRulesSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when requiredDaysPerWeek exceeds 7', () => {
      // Arrange
      const invalidInput = {
        minExperienceLevel: 'beginner' as const,
        maxExperienceLevel: 'advanced' as const,
        requiredDaysPerWeek: 8, // Invalid: more than 7 days in a week
      };

      // Act
      const parseResult = CreateTemplateRulesSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when requiredDaysPerWeek is less than 1', () => {
      // Arrange
      const invalidInput = {
        minExperienceLevel: 'beginner' as const,
        maxExperienceLevel: 'advanced' as const,
        requiredDaysPerWeek: 0, // Invalid: must be at least 1
      };

      // Act
      const parseResult = CreateTemplateRulesSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });

  describe('restrictions', () => {
    it('should accept valid session duration restrictions', () => {
      // Arrange & Act
      const minSessionMinutes = 20;
      const maxSessionMinutes = 90;
      const rules = createTemplateRulesFixture({
        restrictions: {
          minSessionMinutes,
          maxSessionMinutes,
        },
      });

      // Assert
      expect(rules.restrictions?.minSessionMinutes).toBe(minSessionMinutes);
      expect(rules.restrictions?.maxSessionMinutes).toBe(maxSessionMinutes);
    });

    it('should fail when minSessionMinutes exceeds maxSessionMinutes', () => {
      // Arrange
      const invalidInput = {
        minExperienceLevel: 'beginner' as const,
        maxExperienceLevel: 'advanced' as const,
        restrictions: {
          minSessionMinutes: 90,
          maxSessionMinutes: 30, // min > max violates domain rule
        },
      };

      // Act
      const parseResult = CreateTemplateRulesSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should accept optional equipment requirements', () => {
      // Arrange & Act
      const equipment = ['Dumbbells', 'Resistance Bands'];
      const rules = createTemplateRulesFixture({
        requiredEquipment: equipment,
      });

      // Assert
      expect(rules.requiredEquipment).toEqual(equipment);
    });

    it('should accept optional location requirements', () => {
      // Arrange & Act
      const locations = ['gym' as const, 'home' as const];
      const rules = createTemplateRulesFixture({
        restrictions: {
          minSessionMinutes: 30,
          maxSessionMinutes: 60,
          requiresLocation: locations,
        },
      });

      // Assert
      expect(rules.restrictions?.requiresLocation).toEqual(locations);
    });
  });
});
