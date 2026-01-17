import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createCoachConversationFixture } from '@bene/coach-domain';
import { setupTestDb } from '../../data/__tests__/test-utils.js';
import { toDomain, toDatabase } from '../coach-conversation.mapper.js';
import { eq } from 'drizzle-orm';
import { coachingConversation } from '../../data/schema';

/**
 * Tests for CoachConversation Mapper
 */
describe('CoachConversationMapper', () => {
  let db: Awaited<ReturnType<typeof setupTestDb>>['db'];
  let client: Awaited<ReturnType<typeof setupTestDb>>['client'];

  beforeAll(async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;
  });

  afterAll(() => {
    client?.close();
  });

  describe('toDatabase', () => {
    it('should map domain CoachConversation to database schema', () => {
      const conversation = createCoachConversationFixture({ id: 'conv_test_1' });
      const dbConv = toDatabase(conversation);

      expect(dbConv.id).toBe('conv_test_1');
      expect(dbConv.userId).toBe(conversation.userId);
      expect(dbConv.contextJson).toEqual(conversation.context);
      expect(dbConv.totalMessages).toBe(conversation.totalMessages);
      expect(dbConv.totalUserMessages).toBe(conversation.totalUserMessages);
      expect(dbConv.totalCoachMessages).toBe(conversation.totalCoachMessages);
      expect(dbConv.totalCheckIns).toBe(conversation.totalCheckIns);
      expect(dbConv.pendingCheckIns).toBe(conversation.pendingCheckIns);
      expect(dbConv.startedAt).toEqual(conversation.startedAt);
      expect(dbConv.lastMessageAt).toEqual(conversation.lastMessageAt);
      expect(dbConv.lastContextUpdateAt).toEqual(conversation.lastContextUpdateAt);
    });
  });

  describe('toDomain', () => {
    it('should map database row to domain entity', async () => {
      const conversation = createCoachConversationFixture({ id: 'db_conv_test' });

      // Insert into DB (mapper only handles conversation root, not messages/checkIns)
      await db.insert(coachingConversation).values(toDatabase(conversation));

      // Read back
      const dbRow = await db.query.coachingConversation.findFirst({
        where: eq(coachingConversation.id, 'db_conv_test'),
      });

      expect(dbRow).toBeDefined();

      // Map to domain (providing empty arrays for messages/checkIns)
      const domainConv = toDomain(dbRow!, [], []);

      expect(domainConv.id).toBe('db_conv_test');
      expect(domainConv.userId).toBe(conversation.userId);
      expect(domainConv.context).toEqual(conversation.context);
      expect(domainConv.totalMessages).toBe(conversation.totalMessages);
      expect(domainConv.messages).toEqual([]);
      expect(domainConv.checkIns).toEqual([]);
    });
  });

  describe('Round-trip integrity', () => {
    it('should maintain data through Domain → DB → Domain', async () => {
      const original = createCoachConversationFixture({
        id: 'roundtrip_conv',
        totalMessages: 10,
      });

      // Insert
      await db.insert(coachingConversation).values(toDatabase(original));

      // Read back
      const dbRow = await db.query.coachingConversation.findFirst({
        where: eq(coachingConversation.id, 'roundtrip_conv'),
      });

      expect(dbRow).toBeDefined();

      // Convert back
      const reconstructed = toDomain(dbRow!, [], []);

      expect(reconstructed.id).toBe(original.id);
      expect(reconstructed.userId).toBe(original.userId);
      expect(reconstructed.context).toEqual(original.context);
      expect(reconstructed.totalMessages).toBe(original.totalMessages);
      expect(reconstructed.totalUserMessages).toBe(original.totalUserMessages);
      expect(reconstructed.totalCoachMessages).toBe(original.totalCoachMessages);
      expect(reconstructed.startedAt).toEqual(original.startedAt);
    });
  });
});
