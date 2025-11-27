import { describe, it, expect } from 'vitest';
import { createFitnessGoals, PrimaryFitnessGoal } from './fitness-goals.js';

describe('FitnessGoals Value Object', () => {
  describe('Factory', () => {
    it('should create valid fitness goals', () => {
      const result = createFitnessGoals({
        primary: 'strength',
        motivation: 'Get stronger to lift heavy weights',
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const goals = result.value;
        expect(goals.primary).toBe('strength');
        expect(goals.motivation).toBe('Get stronger to lift heavy weights');
        expect(goals.secondary).toEqual([]);
        expect(goals.successCriteria).toEqual([]);
      }
    });

    it('should create with all properties', () => {
      const targetDate = new Date('2026-12-31');
      const result = createFitnessGoals({
        primary: 'weight_loss',
        motivation: 'Lose weight for health',
        secondary: ['improve endurance', 'gain strength'],
        targetWeight: {
          current: 80,
          target: 70,
          unit: 'kg',
        },
        targetBodyFat: 15,
        targetDate,
        successCriteria: ['feel stronger', 'look better'],
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const goals = result.value;
        expect(goals.primary).toBe('weight_loss');
        expect(goals.motivation).toBe('Lose weight for health');
        expect(goals.secondary).toEqual(['improve endurance', 'gain strength']);
        expect(goals.targetWeight).toEqual({
          current: 80,
          target: 70,
          unit: 'kg',
        });
        expect(goals.targetBodyFat).toBe(15);
        expect(goals.targetDate).toEqual(targetDate);
        expect(goals.successCriteria).toEqual(['feel stronger', 'look better']);
      }
    });

    it('should fail with empty motivation', () => {
      const result = createFitnessGoals({
        primary: 'strength',
        motivation: '',
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail with too long motivation', () => {
      const result = createFitnessGoals({
        primary: 'strength',
        motivation: 'A'.repeat(501),
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail with negative target weight', () => {
      const result = createFitnessGoals({
        primary: 'weight_loss',
        motivation: 'Lose weight',
        targetWeight: {
          current: -100,
          target: 70,
          unit: 'kg',
        },
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail with zero target weight', () => {
      const result = createFitnessGoals({
        primary: 'weight_loss',
        motivation: 'Lose weight',
        targetWeight: {
          current: 0,
          target: 70,
          unit: 'kg',
        },
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail with invalid body fat percentage', () => {
      const result = createFitnessGoals({
        primary: 'weight_loss',
        motivation: 'Lose weight',
        targetBodyFat: 60,
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail with past target date', () => {
      const result = createFitnessGoals({
        primary: 'strength',
        motivation: 'Get strong',
        targetDate: new Date('2020-01-01'),
      });

      expect(result.isFailure).toBe(true);
    });
  });
});