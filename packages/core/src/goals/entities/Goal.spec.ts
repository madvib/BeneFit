import { describe, it, expect } from 'vitest';
import { Goal } from './Goal.js';

describe('Goal', () => {
  describe('create', () => {
    it('should create valid goal', () => {
      const result = Goal.create({
        id: 'test-123',
        // TODO: Add test properties
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.isActive).toBe(true);
    });

    it('should fail with invalid data', () => {
      // TODO: Add validation tests
    });
  });

  describe('deactivate', () => {
    it('should deactivate goal', () => {
      const goal = Goal.create({
        id: 'test-123',
      }).value;

      goal.deactivate();

      expect(goal.isActive).toBe(false);
    });
  });
});
