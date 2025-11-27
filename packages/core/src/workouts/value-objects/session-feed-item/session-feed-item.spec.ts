import { describe, it, expect } from 'vitest';
import { createFeedItem } from './session-feed-item.factory.js';

describe('SessionFeedItem', () => {
  describe('createFeedItem', () => {
    it('should create a valid feed item', () => {
      const result = createFeedItem({
        type: 'chat_message',
        userId: 'user-123',
        userName: 'John Doe',
        content: 'Hello everyone!',
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.type).toBe('chat_message');
        expect(result.value.userId).toBe('user-123');
        expect(result.value.userName).toBe('John Doe');
        expect(result.value.content).toBe('Hello everyone!');
        expect(result.value.id).toBeDefined();
        expect(result.value.timestamp).toBeDefined();
      }
    });

    it('should fail if required properties are missing', () => {
      const result = createFeedItem({
        type: 'chat_message',
        userId: '',
        userName: 'John Doe',
        content: 'Hello',
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail if content is too long', () => {
      const longContent = 'a'.repeat(501);
      const result = createFeedItem({
        type: 'chat_message',
        userId: 'user-123',
        userName: 'John Doe',
        content: longContent,
      });

      expect(result.isFailure).toBe(true);
    });

    it('should create with metadata', () => {
      const metadata = { weight: 100, reps: 10 };
      const result = createFeedItem({
        type: 'set_completed',
        userId: 'user-123',
        userName: 'John Doe',
        content: 'Completed a set',
        metadata,
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.metadata).toEqual(metadata);
      }
    });
  });
});
