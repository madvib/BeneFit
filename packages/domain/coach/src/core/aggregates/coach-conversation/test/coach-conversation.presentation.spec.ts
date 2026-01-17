import { describe, it, expect } from 'vitest';
import {
  CoachConversationPresentationSchema,
  toCoachConversationPresentation,
} from '../coach-conversation.presentation.js';
import { createCoachConversationFixture } from './coach-conversation.fixtures.js';

describe('CoachConversation Presentation', () => {
  it('should map a valid coach conversation to presentation DTO', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationPresentation(conversation);

    const result = CoachConversationPresentationSchema.safeParse(presentation);
    expect(result.success).toBe(true);
    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }
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
    const presentation = toCoachConversationPresentation(conversation);

    expect(typeof presentation.startedAt).toBe('string');
    expect(presentation.startedAt).toBe('2024-01-01T00:00:00.000Z');
    expect(typeof presentation.lastMessageAt).toBe('string');
    expect(presentation.lastMessageAt).toBe('2024-01-15T10:30:00.000Z');
    expect(typeof presentation.lastContextUpdateAt).toBe('string');
    expect(presentation.lastContextUpdateAt).toBe('2024-01-14T15:00:00.000Z');
  });

  it('should map nested context to presentation', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationPresentation(conversation);

    expect(presentation.context).toBeDefined();
    expect(presentation.context.experienceLevel).toBeDefined();
    expect(presentation.context.energyLevel).toBeDefined();
  });

  it('should map all messages to presentation', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationPresentation(conversation);

    expect(Array.isArray(presentation.messages)).toBe(true);
    expect(presentation.messages.length).toBe(conversation.messages.length);

    presentation.messages.forEach((msg) => {
      expect(typeof msg.timestamp).toBe('string');
      expect(msg.role).toBeDefined();
      expect('tokens' in msg).toBe(false); // Verify tokens are redacted
    });
  });

  it('should map all check-ins to presentation', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationPresentation(conversation);

    expect(Array.isArray(presentation.checkIns)).toBe(true);
    expect(presentation.checkIns.length).toBe(conversation.checkIns.length);

    presentation.checkIns.forEach((checkIn) => {
      expect(typeof checkIn.createdAt).toBe('string');
      expect(checkIn.status).toBeDefined();
    });
  });

  it('should include computed latestMessage field', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationPresentation(conversation);

    if (conversation.messages.length > 0) {
      expect(presentation.latestMessage).toBeDefined();
      expect(typeof presentation.latestMessage?.timestamp).toBe('string');
    }
  });

  it('should include computed pendingCheckInsList field', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationPresentation(conversation);

    expect(Array.isArray(presentation.pendingCheckInsList)).toBe(true);
    presentation.pendingCheckInsList.forEach((checkIn) => {
      expect(checkIn.status).toBe('pending');
    });
  });

  it('should compute conversationDurationDays', () => {
    const conversation = createCoachConversationFixture({
      startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    });
    const presentation = toCoachConversationPresentation(conversation);

    expect(typeof presentation.conversationDurationDays).toBe('number');
    expect(presentation.conversationDurationDays).toBeGreaterThanOrEqual(29);
    expect(presentation.conversationDurationDays).toBeLessThanOrEqual(31);
  });

  it('should correctly count message types', () => {
    const conversation = createCoachConversationFixture();
    const presentation = toCoachConversationPresentation(conversation);

    expect(presentation.totalMessages).toBe(presentation.messages.length);
    expect(presentation.totalCheckIns).toBe(presentation.checkIns.length);

    const userMsgCount = presentation.messages.filter((m) => m.role === 'user').length;
    const coachMsgCount = presentation.messages.filter((m) => m.role === 'coach').length;

    expect(presentation.totalUserMessages).toBe(userMsgCount);
    expect(presentation.totalCoachMessages).toBe(coachMsgCount);
  });
});
