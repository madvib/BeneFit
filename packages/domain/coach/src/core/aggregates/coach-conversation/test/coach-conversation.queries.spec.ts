import { describe, it, expect } from 'vitest';
import {
  createCoachMsgFixture,
  createCheckInFixture,
  createCoachContextFixture,
  createCoachConversationFixture
} from '@/fixtures.js';
import * as Queries from '../coach-conversation.queries.js';

describe('CoachConversation Queries', () => {
  describe('getRecentMessages', () => {
    it('should return the last N messages', () => {
      // Arrange
      const messages = [
        createCoachMsgFixture({ content: '1' }),
        createCoachMsgFixture({ content: '2' }),
        createCoachMsgFixture({ content: '3' }),
      ];
      const conversation = createCoachConversationFixture({ messages });

      // Act
      const result = Queries.getRecentMessages(conversation, 2);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('2');
      expect(result[1].content).toBe('3');
    });
  });

  describe('getLatestMessage', () => {
    it('should return the last message', () => {
      // Arrange
      const messages = [
        createCoachMsgFixture({ content: 'first' }),
        createCoachMsgFixture({ content: 'last' }),
      ];
      const conversation = createCoachConversationFixture({ messages });

      // Act
      const result = Queries.getLatestMessage(conversation);

      // Assert
      expect(result?.content).toBe('last');
    });

    it('should return undefined if no messages', () => {
      const conversation = createCoachConversationFixture({ messages: [] });
      expect(Queries.getLatestMessage(conversation)).toBeUndefined();
    });
  });

  describe('getPendingCheckIns', () => {
    it('should return only pending check-ins', () => {
      // Arrange
      const checkIns = [
        createCheckInFixture({ status: 'pending' }),
        createCheckInFixture({ status: 'responded' }),
      ];
      const conversation = createCoachConversationFixture({ checkIns });

      // Act
      const result = Queries.getPendingCheckIns(conversation);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('pending');
    });
  });

  describe('shouldSendCheckIn', () => {
    it('should return false if there are pending check-ins', () => {
      const conversation = createCoachConversationFixture({
        checkIns: [createCheckInFixture({ status: 'pending' })],
        pendingCheckIns: 1,
      });
      expect(Queries.shouldSendCheckIn(conversation)).toBe(false);
    });

    it('should return true if adherence is low', () => {
      const context = createCoachContextFixture({
        currentPlan: { adherenceRate: 0.4 } as any,
      });
      const conversation = createCoachConversationFixture({
        context,
        checkIns: [],
        pendingCheckIns: 0,
      });
      expect(Queries.shouldSendCheckIn(conversation)).toBe(true);
    });

    it('should return true if enjoyment trend is declining', () => {
      const context = createCoachContextFixture();
      context.trends.enjoymentTrend = 'declining';
      const conversation = createCoachConversationFixture({
        context,
        checkIns: [],
        pendingCheckIns: 0,
      });
      expect(Queries.shouldSendCheckIn(conversation)).toBe(true);
    });

    it('should return true if there are reported injuries', () => {
      const context = createCoachContextFixture({
        reportedInjuries: [{ bodyPart: 'knee', severity: 'minor' } as any],
      });
      const conversation = createCoachConversationFixture({
        context,
        checkIns: [],
        pendingCheckIns: 0,
      });
      expect(Queries.shouldSendCheckIn(conversation)).toBe(true);
    });
  });

  describe('getConversationSummary', () => {
    it('should return correct summary stats', () => {
      const startedAt = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      const conversation = createCoachConversationFixture({
        totalMessages: 10,
        totalUserMessages: 4,
        totalCoachMessages: 6,
        startedAt,
      });

      const summary = Queries.getConversationSummary(conversation);
      expect(summary.messageCount).toBe(10);
      expect(summary.userMessageCount).toBe(4);
      expect(summary.daysSinceStart).toBe(5);
    });
  });

  describe('getTotalActionsApplied', () => {
    it('should sum actions from messages and check-ins', () => {
      const messages = [
        createCoachMsgFixture({ actions: [{} as any, {} as any] }),
      ];
      const checkIns = [
        createCheckInFixture({ actions: [{} as any] }),
      ];
      const conversation = createCoachConversationFixture({ messages, checkIns });

      expect(Queries.getTotalActionsApplied(conversation)).toBe(3);
    });
  });
});
