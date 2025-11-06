import { describe, it, expect } from 'vitest';
import { BlogCategory } from './BlogCategory';

describe('BlogCategory', () => {
  describe('create', () => {
    it('should create a valid BlogCategory with proper value', () => {
      const result = BlogCategory.create('Technology');
      
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.value).toBe('Technology');
        expect(result.value.toString()).toBe('Technology');
      }
    });

    it('should trim whitespace from the category value', () => {
      const result = BlogCategory.create('  Sports News  ');
      
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.value).toBe('Sports News'); // Should be trimmed
      }
    });

    it('should fail when value is empty string', () => {
      const result = BlogCategory.create('');
      
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Category value is required and must be a string');
      }
    });

    it('should fail when value is only whitespace', () => {
      const result = BlogCategory.create('   ');
      
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Category value cannot be empty');
      }
    });

    it('should fail when value exceeds 50 characters', () => {
      const longValue = 'A'.repeat(51); // 51 characters
      const result = BlogCategory.create(longValue);
      
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Category value cannot exceed 50 characters');
      }
    });

    it('should fail when value contains invalid characters', () => {
      const result = BlogCategory.create('Tech & News!'); // & and ! are invalid
      
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('Category value contains invalid characters');
      }
    });

    it('should succeed with valid special characters (spaces, hyphens, underscores)', () => {
      const result = BlogCategory.create('Tech-News_Category');
      
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.value).toBe('Tech-News_Category');
      }
    });

    it('should succeed with alphanumeric values', () => {
      const result = BlogCategory.create('TechNews123');
      
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.value).toBe('TechNews123');
      }
    });
  });

  describe('value getter', () => {
    it('should return the category value', () => {
      const result = BlogCategory.create('Health');
      
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.value).toBe('Health');
      }
    });
  });

  describe('equals', () => {
    it('should return true for categories with same value (case insensitive)', () => {
      const category1 = BlogCategory.create('Technology').value;
      const category2 = BlogCategory.create('technology').value; // lowercase
      
      expect(category1.equals(category2)).toBe(true);
      expect(category2.equals(category1)).toBe(true);
    });

    it('should return false for categories with different values', () => {
      const category1 = BlogCategory.create('Technology').value;
      const category2 = BlogCategory.create('Health').value;
      
      expect(category1.equals(category2)).toBe(false);
      expect(category2.equals(category1)).toBe(false);
    });

    it('should return true when comparing category to itself', () => {
      const category = BlogCategory.create('Technology').value;
      
      expect(category.equals(category)).toBe(true);
    });

    it('should return false when comparing to undefined', () => {
      const category = BlogCategory.create('Technology').value;
      
      expect(category.equals(undefined)).toBe(false);
    });
  });

  describe('isSameCategory', () => {
    it('should return true for categories with same value', () => {
      const category1 = BlogCategory.create('Technology').value;
      const category2 = BlogCategory.create('technology').value; // lowercase
      
      expect(category1.isSameCategory(category2)).toBe(true);
      expect(category2.isSameCategory(category1)).toBe(true);
    });

    it('should return false for categories with different values', () => {
      const category1 = BlogCategory.create('Technology').value;
      const category2 = BlogCategory.create('Health').value;
      
      expect(category1.isSameCategory(category2)).toBe(false);
      expect(category2.isSameCategory(category1)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return the category value as string', () => {
      const category = BlogCategory.create('Technology').value;
      
      expect(category.toString()).toBe('Technology');
    });
  });
});