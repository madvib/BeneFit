import { describe, it, expect } from 'vitest';
import { BlogPost } from './BlogPost.js';

describe('BlogPost', () => {
  describe('create', () => {
    it('should create valid blogpost', () => {
      const result = BlogPost.create({
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
    it('should deactivate blogpost', () => {
      const blogpost = BlogPost.create({
        id: 'test-123',
      }).value;

      blogpost.deactivate();

      expect(blogpost.isActive).toBe(false);
    });
  });
});
