import { describe, it, expect } from 'vitest';
import { toCoachConversationView } from '../coach-conversation.view.js';
import { createCoachConversationFixture } from './coach-conversation.fixtures.js';

describe('CoachConversation Presentation', () => {
  it('should map a valid coach conversation to presentation DTO', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationView(conversation);


    expect(presentation.id).toBe(conversation.id);
    expect(presentation.userId).toBe(conversation.userId);
    expect(presentation.totalMessages).toBe(conversation.totalMessages);
  });

  it('should convert all dates to ISO strings', () => {
    const conversation = createCoachConversationFixture({
      startedAt: new Date('2024-01-01T00:00:00Z'),
      lastMessageAt: new Date('2024-01-15T10:30:00Z'),
      lastContextUpdateAt: new Date('2024-01-14T15:00:00Z'),
    });
    const presentation = toCoachConversationView(conversation);

    expect(typeof presentation.startedAt).toBe('string');
    expect(presentation.startedAt).toBe('2024-01-01T00:00:00.000Z');
    expect(typeof presentation.lastMessageAt).toBe('string');
    expect(presentation.lastMessageAt).toBe('2024-01-15T10:30:00.000Z');
    expect(typeof presentation.lastContextUpdateAt).toBe('string');
    expect(presentation.lastContextUpdateAt).toBe('2024-01-14T15:00:00.000Z');
  });

  it('should map nested context to presentation', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationView(conversation);

    expect(presentation.context).toBeDefined();
    expect(presentation.context.experienceLevel).toBeDefined();
    expect(presentation.context.energyLevel).toBeDefined();
  });

  it('should map all messages to presentation', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationView(conversation);

    expect(Array.isArray(presentation.messages)).toBe(true);
    expect(presentation.messages.length).toBe(conversation.messages.length);

    presentation.messages.forEach((msg) => {
      expect(typeof msg.timestamp).toBe('string');
      expect(msg.role).toBeDefined();
    });
  });

  it('should map all check-ins to presentation', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationView(conversation);

    expect(Array.isArray(presentation.checkIns)).toBe(true);
    expect(presentation.checkIns.length).toBe(conversation.checkIns.length);

    presentation.checkIns.forEach((checkIn) => {
      expect(typeof checkIn.createdAt).toBe('string');
      expect(checkIn.status).toBeDefined();
    });
  });



  it('should include conversation summary', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationView(conversation);

    expect(presentation.conversationSummary).toBeDefined();
    expect(typeof presentation.conversationSummary.messageCount).toBe('number');
    expect(typeof presentation.conversationSummary.checkInCount).toBe('number');
  });

  it('should compute daysSinceStart', () => {
    const conversation = createCoachConversationFixture({
      startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    });
    const presentation = toCoachConversationView(conversation);

    expect(typeof presentation.conversationSummary.daysSinceStart).toBe('number');
    expect(presentation.conversationSummary.daysSinceStart).toBeGreaterThanOrEqual(29);
    expect(presentation.conversationSummary.daysSinceStart).toBeLessThanOrEqual(31);
  });

  it('should correctly count message types', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationView(conversation);

    expect(presentation.totalMessages).toBe(presentation.messages.length);
    expect(presentation.totalCheckIns).toBe(presentation.checkIns.length);

    const userMsgCount = presentation.messages.filter((m) => m.role === 'user').length;
    const coachMsgCount = presentation.messages.filter((m) => m.role === 'coach').length;

    expect(presentation.totalUserMessages).toBe(userMsgCount);
    expect(presentation.totalCoachMessages).toBe(coachMsgCount);
  });
});
