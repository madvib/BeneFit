import { describe, it, expect } from 'vitest';
import { BlogPost } from './BlogPost.js';

import { BlogCategory } from '../value-objects/BlogCategory.js';

describe('BlogPost', () => {
  describe('create', () => {
    it('should create valid blogpost', () => {
      const categoryResult = BlogCategory.create('Technology');
      if (categoryResult.isFailure) {
        throw new Error(`Failed to create category: ${categoryResult.error.message}`);
      }
      
      const result = BlogPost.create({
        id: 'test-123',
        title: 'Test Title',
        excerpt: 'Test excerpt',
        date: '2023-01-01',
        author: 'Test Author',
        readTime: '5 min read',
        category: categoryResult.value,
        image: 'test-image.jpg',
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.isActive).toBe(true);
        expect(result.value.title).toBe('Test Title');
      }
    });

    it('should fail with invalid data', () => {
      const categoryResult = BlogCategory.create('Technology');
      if (categoryResult.isFailure) {
        throw new Error(`Failed to create category: ${categoryResult.error.message}`);
      }
      
      const result = BlogPost.create({
        id: 'test-123',
        title: '', // Invalid - empty title
        excerpt: 'Test excerpt',
        date: '2023-01-01',
        author: 'Test Author',
        readTime: '5 min read',
        category: categoryResult.value,
        image: 'test-image.jpg',
      });

      expect(result.isFailure).toBe(true);
    });
  });

  describe('deactivate', () => {
    it('should deactivate blogpost', () => {
      const categoryResult = BlogCategory.create('Technology');
      if (categoryResult.isFailure) {
        throw new Error(`Failed to create category: ${categoryResult.error.message}`);
      }
      
      const blogpost = BlogPost.create({
        id: 'test-123',
        title: 'Test Title',
        excerpt: 'Test excerpt',
        date: '2023-01-01',
        author: 'Test Author',
        readTime: '5 min read',
        category: categoryResult.value,
        image: 'test-image.jpg',
      }).value;

      blogpost.deactivate();

      expect(blogpost.isActive).toBe(false);
    });
  });
});
