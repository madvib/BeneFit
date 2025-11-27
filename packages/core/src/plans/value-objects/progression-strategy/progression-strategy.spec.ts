import { describe, it, expect } from 'vitest';
import {
  createLinearProgression,
  createUndulatingProgression,
  createAdaptiveProgression,
  createConservativeProgression,
  createAggressiveProgression,
} from './index.js';
import {
  isConservative,
  calculateNextWeekLoad,
} from './progression-strategy.commands.js';

describe('ProgressionStrategy', () => {
  describe('factory methods', () => {
    it('should create linear progression strategy', () => {
      const result = createLinearProgression(0.05, 4);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.type).toBe('linear');
        expect(result.value.weeklyIncrease).toBe(0.05);
      }
    });

    it('should create undulating progression strategy', () => {
      const result = createUndulatingProgression(0.03);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.type).toBe('undulating');
        expect(result.value.weeklyIncrease).toBe(0.03);
      }
    });

    it('should create adaptive progression strategy', () => {
      const result = createAdaptiveProgression(0.04);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.type).toBe('adaptive');
        expect(result.value.weeklyIncrease).toBe(0.04);
      }
    });

    it('should create conservative progression strategy', () => {
      const result = createConservativeProgression();

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isConservative(result.value)).toBe(true);
        expect(result.value.weeklyIncrease).toBeLessThanOrEqual(0.03);
      }
    });

    it('should create aggressive progression strategy', () => {
      const result = createAggressiveProgression();

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.weeklyIncrease).toBeGreaterThanOrEqual(0.075);
      }
    });
  });

  describe('calculateNextWeekLoad', () => {
    it('should calculate linear progression correctly', () => {
      const result = createLinearProgression(0.05);
      if (result.isSuccess) {
        const nextLoad = calculateNextWeekLoad(result.value, 100, 1);
        expect(nextLoad).toBe(105); // 100 + (100 * 0.05)
      }
    });
  });
});
