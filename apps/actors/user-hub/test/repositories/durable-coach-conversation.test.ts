import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import {
  createCoachMsgFixture,
  createCoachConversationFixture,
} from '@bene/coach-domain/fixtures';
import { DurableCoachConversationRepository } from '../../src/repositories/durable-coach-conversation.repository.js';
import { user_do_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

describe('DurableCoachConversationRepository', () => {
  let stub: DurableObjectStub;

  beforeEach(async () => {
    const id = env.USER_HUB.idFromName(`test-${crypto.randomUUID()}`);
    stub = env.USER_HUB.get(id);

    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: user_do_schema });
      await migrate(db, migrations);
    });
  });

  describe('findById', () => {
    it('should return conversation when found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const conversation = createCoachConversationFixture({
          userId: crypto.randomUUID(),
        });
        const saveResult = await repo.save(conversation);
        expect(saveResult.isSuccess).toBe(true);

        const result = await repo.findById(conversation.id);

        expect(result.isSuccess).toBe(true);
        expect(result.value.id).toBe(conversation.id);
        expect(result.value.userId).toBe(conversation.userId);
      });
    });

    it('should return failure when not found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const result = await repo.findById('non-existent-id');

        expect(result.isFailure).toBe(true);
        expect(result.errorMessage).toContain('CoachConversation');
      });
    });
  });

  describe('findByUserId', () => {
    it('should return conversation with relations', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const conversation = createCoachConversationFixture({
          userId: crypto.randomUUID(),
          messages: [createCoachMsgFixture({ content: 'Test message' })],
        });
        const saveResult = await repo.save(conversation);
        expect(saveResult.isSuccess).toBe(true);

        const result = await repo.findByUserId(conversation.userId);

        expect(result.isSuccess).toBe(true);
        expect(result.value.userId).toBe(conversation.userId);
        expect(Array.isArray(result.value.messages)).toBe(true);
        expect(result.value.messages.length).toBe(1);
        expect(result.value.messages[0].content).toBe('Test message');
        expect(Array.isArray(result.value.checkIns)).toBe(true);
      });
    });

    it('should return failure when not found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const result = await repo.findByUserId('non-existent-user');

        expect(result.isFailure).toBe(true);
        expect(result.errorMessage).toContain('CoachConversation');
      });
    });
  });

  describe('save', () => {
    it('should create new conversation', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const conversation = createCoachConversationFixture({
          userId: crypto.randomUUID(),
        });

        const saveResult = await repo.save(conversation);

        expect(saveResult.isSuccess).toBe(true);

        const findResult = await repo.findById(conversation.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.userId).toBe(conversation.userId);
      });
    });

    it('should update existing conversation', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const conversation = createCoachConversationFixture({
          userId: crypto.randomUUID(),
          totalMessages: 3,
        });
        await repo.save(conversation);

        const updatedConversation = {
          ...conversation,
          totalMessages: 5,
        };
        const saveResult = await repo.save(updatedConversation);

        expect(saveResult.isSuccess).toBe(true);

        const findResult = await repo.findById(conversation.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.totalMessages).toBe(5);
      });
    });

    it('should sync messages and check-ins', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const conversation = createCoachConversationFixture({
          userId: crypto.randomUUID(),
          messages: [createCoachMsgFixture({ content: 'Original' })],
        });
        await repo.save(conversation);

        const updatedConversation = createCoachConversationFixture({
          id: conversation.id,
          userId: conversation.userId,
          context: conversation.context,
          messages: [...conversation.messages, createCoachMsgFixture({ content: 'New message' })],
          checkIns: conversation.checkIns,
          totalMessages: conversation.totalMessages + 1,
          totalUserMessages: conversation.totalUserMessages,
          totalCoachMessages: conversation.totalCoachMessages + 1,
          totalCheckIns: conversation.totalCheckIns,
          pendingCheckIns: conversation.pendingCheckIns,
          startedAt: conversation.startedAt,
          lastMessageAt: new Date(),
          lastContextUpdateAt: conversation.lastContextUpdateAt,
        });

        const saveResult = await repo.save(updatedConversation);

        expect(saveResult.isSuccess).toBe(true);

        const findResult = await repo.findByUserId(conversation.userId);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.messages.length).toBe(2);
        expect(findResult.value.messages.some((m) => m.content === 'New message')).toBe(true);
      });
    });

    it('should handle message deletion when messages are removed', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const conversation = createCoachConversationFixture({
          userId: crypto.randomUUID(),
          messages: [
            createCoachMsgFixture({ content: 'Message 1' }),
            createCoachMsgFixture({ content: 'Message 2' }),
          ],
        });
        await repo.save(conversation);

        const updatedConversation = {
          ...conversation,
          messages: [conversation.messages[0]],
          totalMessages: conversation.totalMessages - 1,
        };

        const saveResult = await repo.save(updatedConversation);

        expect(saveResult.isSuccess).toBe(true);

        const findResult = await repo.findByUserId(conversation.userId);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.messages.length).toBe(1);
        expect(findResult.value.messages[0].content).toBe('Message 1');
      });
    });
  });

  describe('saveSnapshot', () => {
    it('should save snapshot successfully', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const conversation = createCoachConversationFixture({
          userId: crypto.randomUUID(),
        });

        const result = await repo.saveSnapshot(conversation);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(conversation.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.userId).toBe(conversation.userId);
      });
    });
  });

  describe('Complex scenarios', () => {
    it('should handle conversation with multiple messages and check-ins', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const conversation = createCoachConversationFixture({
          userId: crypto.randomUUID(),
          messages: [
            createCoachMsgFixture({ content: 'User message', role: 'user' as const }),
            createCoachMsgFixture({ content: 'Coach response', role: 'coach' as const }),
            createCoachMsgFixture({ content: 'Follow up', role: 'user' as const }),
          ],
        });

        const saveResult = await repo.save(conversation);

        expect(saveResult.isSuccess).toBe(true);

        const findResult = await repo.findByUserId(conversation.userId);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.messages.length).toBe(3);
        expect(findResult.value.totalMessages).toBe(3);
        expect(findResult.value.totalUserMessages).toBe(2);
        expect(findResult.value.totalCoachMessages).toBe(1);
      });
    });

    it('should preserve message order', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCoachConversationRepository(db);

        const baseDate = new Date('2024-01-01T00:00:00Z');
        const messages = [
          createCoachMsgFixture({
            content: 'First',
            timestamp: new Date(baseDate.getTime() + 1000),
          }),
          createCoachMsgFixture({
            content: 'Second',
            timestamp: new Date(baseDate.getTime() + 2000),
          }),
          createCoachMsgFixture({
            content: 'Third',
            timestamp: new Date(baseDate.getTime() + 3000),
          }),
        ];

        const conversation = createCoachConversationFixture({
          userId: crypto.randomUUID(),
          messages,
        });

        await repo.save(conversation);
        const result = await repo.findByUserId(conversation.userId);

        expect(result.isSuccess).toBe(true);
        expect(result.value.messages.map((m) => m.content)).toEqual(['First', 'Second', 'Third']);
      });
    });
  });
});
