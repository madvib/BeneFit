import { describe, it, expect } from 'vitest';
import * as Commands from '../coach-conversation.commands.js';
import { createCoachConversationFixture } from './coach-conversation.fixtures.js';
import { createCheckInFixture } from '../../../value-objects/index.js';
import { createCoachContextFixture } from '../../../value-objects/index.js';

describe('CoachConversation Commands', () => {
  describe('addUserMessage', () => {
    it('should add a user message to the conversation', () => {
      // Arrange
      const conversation = createCoachConversationFixture({
        messages: [],
        totalMessages: 0,
        totalUserMessages: 0,
      });
      const content = 'Hello coach!';

      // Act
      const result = Commands.addUserMessage(conversation, content);

      // Assert
      expect(result.isSuccess).toBe(true);
      const updated = result.value;
      expect(updated.messages).toHaveLength(1);
      expect(updated.messages[0].content).toBe(content);
      expect(updated.messages[0].role).toBe('user');
      expect(updated.totalMessages).toBe(1);
      expect(updated.totalUserMessages).toBe(1);
      expect(updated.lastMessageAt).toBeInstanceOf(Date);
    });
  });

  describe('addCoachMessage', () => {
    it('should add a coach message to the conversation', () => {
      // Arrange
      const conversation = createCoachConversationFixture({
        messages: [],
        totalMessages: 0,
        totalCoachMessages: 0,
      });
      const content = 'Hello user!';

      // Act
      const result = Commands.addCoachMessage(conversation, content);

      // Assert
      expect(result.isSuccess).toBe(true);
      const updated = result.value;
      expect(updated.messages).toHaveLength(1);
      expect(updated.messages[0].content).toBe(content);
      expect(updated.messages[0].role).toBe('coach');
      expect(updated.totalMessages).toBe(1);
      expect(updated.totalCoachMessages).toBe(1);
    });
  });

  describe('addSystemMessage', () => {
    it('should add a system message to the conversation', () => {
      // Arrange
      const conversation = createCoachConversationFixture({
        messages: [],
        totalMessages: 0,
      });
      const content = 'System alert';

      // Act
      const result = Commands.addSystemMessage(conversation, content);

      // Assert
      expect(result.isSuccess).toBe(true);
      const updated = result.value;
      expect(updated.messages).toHaveLength(1);
      expect(updated.role).toBeUndefined(); // Aggregate doesn't have role, message does. Wait, I should check message role.
      expect(updated.messages[0].role).toBe('system');
      expect(updated.totalMessages).toBe(1);
    });
  });

  describe('scheduleCheckIn', () => {
    it('should add a check-in to the conversation', () => {
      // Arrange
      const conversation = createCoachConversationFixture({
        checkIns: [],
        totalCheckIns: 0,
        pendingCheckIns: 0,
      });
      const checkIn = createCheckInFixture({ status: 'pending' });

      // Act
      const result = Commands.scheduleCheckIn(conversation, checkIn);

      // Assert
      expect(result.isSuccess).toBe(true);
      const updated = result.value;
      expect(updated.checkIns).toHaveLength(1);
      expect(updated.checkIns[0].id).toBe(checkIn.id);
      expect(updated.totalCheckIns).toBe(1);
      expect(updated.pendingCheckIns).toBe(1);
    });
  });

  describe('respondToCheckIn', () => {
    it('should update a pending check-in to responded', () => {
      // Arrange
      const checkIn = createCheckInFixture({ status: 'pending' });
      const conversation = createCoachConversationFixture({
        checkIns: [checkIn],
        pendingCheckIns: 1,
      });
      const userResponse = 'I feel tired';
      const coachAnalysis = 'User is overtraining';

      // Act
      const result = Commands.respondToCheckIn(
        conversation,
        checkIn.id,
        userResponse,
        coachAnalysis,
        []
      );

      // Assert
      expect(result.isSuccess).toBe(true);
      const updated = result.value;
      const updatedCheckIn = updated.checkIns.find(c => c.id === checkIn.id);
      expect(updatedCheckIn?.status).toBe('responded');
      expect(updatedCheckIn?.userResponse).toBe(userResponse);
      expect(updatedCheckIn?.coachAnalysis).toBe(coachAnalysis);
      expect(updated.pendingCheckIns).toBe(0);
    });

    it('should fail if check-in is not found', () => {
      // Arrange
      const conversation = createCoachConversationFixture({ checkIns: [] });

      // Act
      const result = Commands.respondToCheckIn(
        conversation,
        'non-existent-id',
        'response',
        'analysis',
        []
      );

      // Assert
      expect(result.isFailure).toBe(true);
    });
  });

  describe('dismissCheckIn', () => {
    it('should update a pending check-in to dismissed', () => {
      // Arrange
      const checkIn = createCheckInFixture({ status: 'pending' });
      const conversation = createCoachConversationFixture({
        checkIns: [checkIn],
        pendingCheckIns: 1,
      });

      // Act
      const result = Commands.dismissCheckIn(conversation, checkIn.id);

      // Assert
      expect(result.isSuccess).toBe(true);
      const updated = result.value;
      const updatedCheckIn = updated.checkIns.find(c => c.id === checkIn.id);
      expect(updatedCheckIn?.status).toBe('dismissed');
      expect(updated.pendingCheckIns).toBe(0);
    });
  });

  describe('updateContext', () => {
    it('should update the conversation context', () => {
      // Arrange
      const conversation = createCoachConversationFixture();
      const newContext = createCoachContextFixture({ energyLevel: 'low' });

      // Act
      const result = Commands.updateContext(conversation, newContext);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value.context).toEqual(newContext);
      expect(result.value.lastContextUpdateAt).toBeInstanceOf(Date);
    });
  });

  describe('clearOldMessages', () => {
    it('should keep only the last N messages', () => {
      // Arrange
      const messages = Array(10).fill(null).map(() => ({ content: 'msg', role: 'user', timestamp: new Date() } as any));
      const conversation = createCoachConversationFixture({ messages });

      // Act
      const result = Commands.clearOldMessages(conversation, 5);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value.messages).toHaveLength(5);
    });
  });
});
