import { describe, it, expect } from 'vitest';
import { User } from './User.js';

describe('User', () => {
  describe('create', () => {
    it('should create valid user with required properties', () => {
      const result = User.create({
        id: 'test-123',
        email: 'test@example.com',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.isActive).toBe(true);
      expect(result.value.email).toBe('test@example.com');
      expect(result.value.createdAt).toBeInstanceOf(Date);
    });

    it('should fail with invalid data', () => {
      const result = User.create({
        id: 'test-123',
        email: '',
      });

      expect(result.isFailure).toBe(true);
    });

    it('should allow optional name property', () => {
      const result = User.create({
        id: 'test-123',
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.value.name).toBe('Test User');
    });
  });

  describe('deactivate', () => {
    it('should deactivate user', () => {
      const user = User.create({
        id: 'test-123',
        email: 'test@example.com',
      }).value;

      user.deactivate();

      expect(user.isActive).toBe(false);
    });
  });

  describe('activate', () => {
    it('should activate user', () => {
      const user = User.create({
        id: 'test-123',
        email: 'test@example.com',
      }).value;

      user.deactivate();
      expect(user.isActive).toBe(false);

      user.activate();
      expect(user.isActive).toBe(true);
    });
  });
});
