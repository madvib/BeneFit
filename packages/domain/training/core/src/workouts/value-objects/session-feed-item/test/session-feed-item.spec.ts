import { describe, it, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { CreateSessionFeedItemSchema } from '../session-feed-item.factory.js';
import { createSessionFeedItemFixture } from './session-feed-item.fixtures.js';

describe('SessionFeedItem', () => {
  describe('creation', () => {
    it('should create a valid feed item with fixture', () => {
      // Arrange
      const userId = randomUUID();

      // Act
      const feedItem = createSessionFeedItemFixture({
        type: 'chat_message',
        userId,
        userName: 'John Doe',
        content: 'Hello everyone!',
      });

      // Assert
      expect(feedItem.type).toBe('chat_message');
      expect(feedItem.id).toBeDefined();
      expect(feedItem.timestamp).toBeInstanceOf(Date);
      expect(feedItem.userId).toBe(userId);
    });

    it('should respect provided optional fields', () => {
      // Arrange
      const customId = randomUUID();
      const customDate = new Date('2023-01-01');
      const userId = randomUUID();

      // Act
      const feedItem = createSessionFeedItemFixture({
        type: 'chat_message',
        userId,
        userName: 'John Doe',
        content: 'Hello',
        id: customId,
        timestamp: customDate,
      });

      // Assert
      expect(feedItem.id).toBe(customId);
      expect(feedItem.timestamp).toEqual(customDate);
    });

    it('should create with metadata', () => {
      // Arrange
      const metadata = { weight: 100, reps: 10 };

      // Act
      const feedItem = createSessionFeedItemFixture({
        type: 'set_completed',
        userId: '550e8400-e29b-41d4-a716-446655440000',
        userName: 'John Doe',
        content: 'Completed a set',
        metadata,
      });

      // Assert
      expect(feedItem.metadata).toEqual(metadata);
    });
  });

  describe('validation', () => {
    it('should fail if required properties are missing', () => {
      // Arrange
      const invalidInput = {
        type: 'chat_message' as const,
        userId: '',
        userName: 'John Doe',
        content: 'Hello',
      };

      // Act
      const parseResult = CreateSessionFeedItemSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail if content is too long', () => {
      // Arrange
      const longContent = 'a'.repeat(1001);
      const userId = randomUUID();
      const invalidInput = {
        type: 'chat_message' as const,
        userId,
        userName: 'John Doe',
        content: longContent,
      };

      // Act
      const parseResult = CreateSessionFeedItemSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });
});
