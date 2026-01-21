import { describe, it, expect } from 'vitest';
import { CreateCoachConversationSchema } from '../coach-conversation.factory.js';
import { createCoachConversationFixture } from './coach-conversation.fixtures.js';
import { createCoachContextFixture } from '../../../value-objects/index.js';

describe('CoachConversation', () => {
  describe('Factory', () => {
    const mockContext = createCoachContextFixture();

    it('should create a valid coaching conversation', () => {
      // Arrange
      const input = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        context: mockContext,
        initialMessage: 'Welcome!',
      };

      // Act
      const result = CreateCoachConversationSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const conversation = result.data;
        expect(conversation.id).toBeDefined();
        expect(conversation.userId).toBe('550e8400-e29b-41d4-a716-446655440000');
        expect(conversation.context).toEqual(mockContext);
        expect(conversation.messages).toHaveLength(1);
        expect(conversation.messages[0]?.content).toBe('Welcome!');
        expect(conversation.totalMessages).toBe(1);
        expect(conversation.totalCoachMessages).toBe(1);
        expect(conversation.startedAt).toBeInstanceOf(Date);
      }
    });

    it('should create a conversation without initial message', () => {
      // Act
      const result = CreateCoachConversationSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        context: mockContext,
      });

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.messages).toHaveLength(0);
        expect(result.data.totalMessages).toBe(0);
      }
    });

    it('should create a conversation without context (uses default context)', () => {
      // Act
      const result = CreateCoachConversationSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
      });

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const conversation = result.data;
        expect(conversation.context).toBeDefined();
        expect(conversation.context.experienceLevel).toBe('beginner');
        expect(conversation.context.userGoals.primary).toBe('strength');
        expect(conversation.context.userConstraints.location).toBe('home');
      }
    });

    it('should fail if userId is invalid', () => {
      // Act
      const result = CreateCoachConversationSchema.safeParse({
        userId: 'invalid-uuid',
        context: mockContext,
      });

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const fixture = createCoachConversationFixture();

      expect(fixture.id).toBeDefined();
      expect(fixture.userId).toBeDefined();
      expect(fixture.context).toBeDefined();
      expect(fixture.messages.length).toBeGreaterThan(0);
    });

    it('should allow overrides in fixture', () => {
      const fixture = createCoachConversationFixture({ totalMessages: 100 });

      expect(fixture.totalMessages).toBe(100);
    });
  });
});
