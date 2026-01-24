
import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';

import { CreateSessionFeedItemSchema } from '../session-feed-item.factory.js';
import { createSessionFeedItemFixture } from '@/fixtures.js';

describe('SessionFeedItem', () => {
  describe('creation', () => {
    it('should create a valid feed item with fixture', () => {
      // Arrange
      const userId = crypto.randomUUID();
      const userName = 'Test User';
      const content = 'Test feed content';

      // Act
      const feedItem = createSessionFeedItemFixture({
        type: 'chat_message',
        userId,
        userName,
        content,
      });

      // Assert
      expect(feedItem.type).toBe('chat_message');
      expect(feedItem.id).toBeDefined();
      expect(feedItem.timestamp).toBeInstanceOf(Date);
      expect(feedItem.userId).toBe(userId);
      expect(feedItem.userName).toBe(userName);
      expect(feedItem.content).toBe(content);
    });

    it('should respect provided optional fields', () => {
      // Arrange
      const customId = crypto.randomUUID();
      const customDate = faker.date.past();
      const userId = crypto.randomUUID();

      // Act
      const feedItem = createSessionFeedItemFixture({
        type: 'chat_message',
        userId,
        userName: 'Test User',
        content: 'Test feed content',
        id: customId,
        timestamp: customDate,
      });

      // Assert
      expect(feedItem.id).toBe(customId);
      expect(feedItem.timestamp).toEqual(customDate);
    });

    it('should create with metadata', () => {
      // Arrange
      const metadata = { weight: 150, reps: 10 };

      // Act
      const feedItem = createSessionFeedItemFixture({
        type: 'set_completed',
        userId: crypto.randomUUID(),
        userName: 'Test User',
        content: 'Test feed content',
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
        userName: 'Test User',
        content: 'Test feed content',
      };

      // Act
      const parseResult = CreateSessionFeedItemSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail if content is too long', () => {
      // Arrange
      const longContent = 'a'.repeat(1001);
      const invalidInput = {
        type: 'chat_message' as const,
        userId: crypto.randomUUID(),
        userName: 'Test User',
        content: longContent,
      };

      // Act
      const parseResult = CreateSessionFeedItemSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });
});
