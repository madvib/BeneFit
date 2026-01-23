import { describe, it, expect } from 'vitest';

import { CreatePlanPositionSchema } from '../plan-position.factory.js';
import { createPlanPositionFixture } from '@/fixtures.js';
import {
  advanceDay,
  daysUntil,
  isBefore,
  isAfter,
  goToNextMonday,
} from '../plan-position.commands.js';

describe('PlanPosition', () => {
  describe('creation', () => {
    it('should create valid plan position with correct defaults', () => {
      // Arrange & Act
      const week = 5;
      const day = 3;
      const pos = createPlanPositionFixture({ week, day });

      // Assert
      expect(pos.week).toBe(week);
      expect(pos.day).toBe(day);
    });
  });

  describe('validation', () => {
    it('should fail when week is < 1', () => {
      const input = { week: 0, day: 1 };
      const result = CreatePlanPositionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should fail when week is > 52', () => {
      const input = { week: 53, day: 1 };
      const result = CreatePlanPositionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should fail when day is < 0', () => {
      const input = { week: 1, day: -1 };
      const result = CreatePlanPositionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should fail when day is > 6', () => {
      const input = { week: 1, day: 7 };
      const result = CreatePlanPositionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('state transitions & navigation', () => {
    it('should advance correctly across week boundary', () => {
      // Arrange
      const week = 10;
      const saturday = createPlanPositionFixture({ week, day: 6 });

      // Act
      const sunday = advanceDay(saturday);

      // Assert
      expect(sunday.week).toBe(week + 1);
      expect(sunday.day).toBe(0);
    });

    it('should calculate days between positions correctly', () => {
      // Arrange
      const start = createPlanPositionFixture({ week: 1, day: 0 });
      const end = createPlanPositionFixture({ week: 2, day: 3 });

      // Act & Assert
      expect(daysUntil(start, end)).toBe(10); // 7 days + 3 days
    });

    it('should compare positions correctly', () => {
      // Arrange
      const earlier = createPlanPositionFixture({ week: 1, day: 3 });
      const later = createPlanPositionFixture({ week: 2, day: 1 });

      // Act & Assert
      expect(isBefore(earlier, later)).toBe(true);
      expect(isAfter(later, earlier)).toBe(true);
      expect(isBefore(later, earlier)).toBe(false);
    });

    it('should navigate to next monday correctly', () => {
      // Arrange
      const week = 15;
      const thursday = createPlanPositionFixture({ week, day: 4 });

      // Act
      const monday = goToNextMonday(thursday);

      // Assert
      expect(monday.day).toBe(1); // Monday
      expect(monday.week).toBe(week + 1); // Next week
    });
  });
});
