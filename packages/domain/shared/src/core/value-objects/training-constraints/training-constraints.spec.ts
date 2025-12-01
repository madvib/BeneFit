import { describe, it, expect } from 'vitest';
import {
  createTrainingConstraints,
} from './index.js';
import {
  hasInjuries,
  canExercise,
  hasEquipment,
  isAvailableDay,
  getAvailableDaysCount
} from './training-constraints.commands.js';

describe('TrainingConstraints', () => {
  describe('create', () => {
    it('should create with valid available days', () => {
      const result = createTrainingConstraints({
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableEquipment: ['dumbbells'],
        location: 'home',
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.availableDays.length).toBe(3);
      }
    });

    it('should fail with invalid day name', () => {
      const result = createTrainingConstraints({
        availableDays: ['Monday', 'InvalidDay'],
        availableEquipment: [],
        location: 'home',
      });

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.errorMessage).toContain('Invalid day');
      }
    });

    it('should fail with no available days', () => {
      const result = createTrainingConstraints({
        availableDays: [],
        availableEquipment: [],
        location: 'home',
      });

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.errorMessage).toContain('at least one available day');
      }
    });

    it('should fail with duplicate days', () => {
      const result = createTrainingConstraints({
        availableDays: ['Monday', 'Monday', 'Wednesday'],
        availableEquipment: [],
        location: 'home',
      });

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.errorMessage).toContain('Duplicate days');
      }
    });

    it('should validate max duration is positive', () => {
      const result = createTrainingConstraints({
        availableDays: ['Monday'],
        maxDuration: -10,
        availableEquipment: [],
        location: 'home',
      });

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.errorMessage).toContain('positive');
      }
    });
  });

  describe('query methods', () => {
    it('should check if has injuries', () => {
      const result = createTrainingConstraints({
        availableDays: ['Monday'],
        availableEquipment: [],
        location: 'home',
        injuries: [{
          bodyPart: 'knee',
          severity: 'moderate',
          avoidExercises: ['squats'],
          reportedDate: new Date().toISOString()
        }]
      });

      if (result.isSuccess) {
        expect(hasInjuries(result.value)).toBe(true);
      }
    });

    it('should check if can exercise', () => {
      const result = createTrainingConstraints({
        availableDays: ['Monday'],
        availableEquipment: [],
        location: 'home',
        injuries: [{
          bodyPart: 'knee',
          severity: 'moderate',
          avoidExercises: ['squats'],
          reportedDate: new Date().toISOString()
        }]
      });

      if (result.isSuccess) {
        // Should not be able to do squats if knee injury says to avoid
        expect(canExercise(result.value, 'squats')).toBe(false);
        expect(canExercise(result.value, 'pushups')).toBe(true);
      }
    });

    it('should check if has equipment', () => {
      const result = createTrainingConstraints({
        availableDays: ['Monday'],
        availableEquipment: ['dumbbells', 'kettlebell'],
        location: 'home',
      });

      if (result.isSuccess) {
        expect(hasEquipment(result.value, 'dumbbells')).toBe(true);
        expect(hasEquipment(result.value, 'barbell')).toBe(false);
      }
    });

    it('should check if day is available', () => {
      const result = createTrainingConstraints({
        availableDays: ['Monday', 'Wednesday'],
        availableEquipment: [],
        location: 'home',
      });

      if (result.isSuccess) {
        expect(isAvailableDay(result.value, 'Monday')).toBe(true);
        expect(isAvailableDay(result.value, 'Tuesday')).toBe(false);
      }
    });

    it('should get available days count', () => {
      const result = createTrainingConstraints({
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableEquipment: [],
        location: 'home',
      });

      if (result.isSuccess) {
        expect(getAvailableDaysCount(result.value)).toBe(3);
      }
    });
  });
});