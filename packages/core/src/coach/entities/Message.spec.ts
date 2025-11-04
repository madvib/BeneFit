import { describe, it, expect } from 'vitest';
import { Message } from './Message.js';

describe('Message', () => {
  describe('create', () => {
    it('should create valid message', () => {
      const result = Message.create({
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
    it('should deactivate message', () => {
      const message = Message.create({
        id: 'test-123',
      }).value;

      message.deactivate();

      expect(message.isActive).toBe(false);
    });
  });
});
