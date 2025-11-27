import { describe, it, expect } from 'vitest';
import { Chat } from './Chat.js';

describe('Chat', () => {
  describe('create', () => {
    it('should create valid chat', () => {
      const result = Chat.create({
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
    it('should deactivate chat', () => {
      const chat = Chat.create({
        id: 'test-123',
      }).value;

      chat.deactivate();

      expect(chat.isActive).toBe(false);
    });
  });
});
