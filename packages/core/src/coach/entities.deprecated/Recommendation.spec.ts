import { describe, it, expect } from 'vitest';
import { Recommendation } from './Recommendation.js';

describe('Recommendation', () => {
  describe('create', () => {
    it('should create a valid Recommendation with required properties', () => {
      const props = {
        title: 'Hydration Reminder',
        description: 'Drink more water throughout the day',
        category: 'health',
        createdAt: new Date(),
      };

      const result = Recommendation.create(props, 'rec-123');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.id).toBe('rec-123');
        expect(result.value.title).toBe('Hydration Reminder');
        expect(result.value.description).toBe('Drink more water throughout the day');
        expect(result.value.category).toBe('health');
        expect(result.value.createdAt).toBeInstanceOf(Date);
      }
    });

    it('should set createdAt to current date if not provided', () => {
      const props = {
        title: 'Hydration Reminder',
        description: 'Drink more water throughout the day',
        category: 'health',
        // createdAt not provided
      };

      const before = new Date();
      const result = Recommendation.create(props, 'rec-123');
      const after = new Date();

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.createdAt).toBeInstanceOf(Date);
        expect(result.value.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(result.value.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      }
    });

    it('should accept a priority value if provided', () => {
      const props = {
        title: 'Priority Workout',
        description: 'Do this workout first',
        category: 'fitness',
        createdAt: new Date(),
        priority: 5,
      };

      const result = Recommendation.create(props, 'rec-123');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.priority).toBe(5);
      }
    });

    it('should fail when title is empty', () => {
      const props = {
        title: '', // Empty title
        description: 'Drink more water throughout the day',
        category: 'health',
        createdAt: new Date(),
      };

      const result = Recommendation.create(props, 'rec-123');

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Title is required');
      }
    });

    it('should fail when title is only whitespace', () => {
      const props = {
        title: '   ', // Whitespace only
        description: 'Drink more water throughout the day',
        category: 'health',
        createdAt: new Date(),
      };

      const result = Recommendation.create(props, 'rec-123');

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Title is required');
      }
    });

    it('should fail when description is empty', () => {
      const props = {
        title: 'Hydration Reminder',
        description: '', // Empty description
        category: 'health',
        createdAt: new Date(),
      };

      const result = Recommendation.create(props, 'rec-123');

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Description is required');
      }
    });

    it('should fail when category is empty', () => {
      const props = {
        title: 'Hydration Reminder',
        description: 'Drink more water throughout the day',
        category: '', // Empty category
        createdAt: new Date(),
      };

      const result = Recommendation.create(props, 'rec-123');

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Category is required');
      }
    });
  });

  describe('getters', () => {
    it('should return correct values for all getters', () => {
      const props = {
        title: 'Sleep Tips',
        description: 'Go to bed earlier for better health',
        category: 'sleep',
        createdAt: new Date(),
        priority: 3,
      };

      const recommendation = Recommendation.create(props, 'rec-123').value;

      expect(recommendation.title).toBe('Sleep Tips');
      expect(recommendation.description).toBe('Go to bed earlier for better health');
      expect(recommendation.category).toBe('sleep');
      expect(recommendation.createdAt).toBeInstanceOf(Date);
      expect(recommendation.priority).toBe(3);
    });

    it('should return undefined for priority when not set', () => {
      const props = {
        title: 'General Tip',
        description: 'Stay active',
        category: 'fitness',
        createdAt: new Date(),
        // priority not set
      };

      const recommendation = Recommendation.create(props, 'rec-123').value;

      expect(recommendation.priority).toBeUndefined();
    });
  });
});