import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { eq } from 'drizzle-orm';
import { createCoachConversationFixture } from '@bene/coach-domain/fixtures';
import { coachingConversation } from '../../src/data/schema';
import { toDomain, toDatabase } from '../../src/mappers/coach-conversation.mapper.js';
import { user_do_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

/**
 * Tests for CoachConversation Mapper using Cloudflare Durable Objects
 */
describe('CoachConversationMapper (Durable Objects)', () => {
  let stub: DurableObjectStub;

  beforeEach(async () => {
    // Get a fresh Durable Object stub for each test
    const id = env.USER_HUB.idFromName(`test-${crypto.randomUUID()}`);
    stub = env.USER_HUB.get(id);

    // Initialize the database inside the Durable Object
    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: user_do_schema });
      await migrate(db, migrations);
      return { db };
    });
  });

  describe('toDatabase', () => {
    it('should map domain CoachConversation to database schema', async () => {
      // Act & Assert - Run inside the Durable Object
      await runInDurableObject(stub, async (instance: any, state: any) => {
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
  });

  describe('toDomain', () => {
    it('should map database row to domain entity', async () => {
      // Act & Assert - Run everything inside the Durable Object
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

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
  });

  describe('Round-trip integrity', () => {
    it('should maintain data through Domain → DB → Domain', async () => {
      // Act & Assert - Run everything inside the Durable Object
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

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

    it('should handle complex context data through round-trip', async () => {
      // Act & Assert - Run everything inside the Durable Object
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        const original = createCoachConversationFixture({
          id: 'complex_context_conv',
        });

        // Insert
        await db.insert(coachingConversation).values(toDatabase(original));

        // Read back
        const dbRow = await db.query.coachingConversation.findFirst({
          where: eq(coachingConversation.id, 'complex_context_conv'),
        });

        expect(dbRow).toBeDefined();

        // Convert back
        const reconstructed = toDomain(dbRow!, [], []);

        expect(reconstructed.id).toBe(original.id);
        // Test that key context fields are preserved
        expect(reconstructed.context.experienceLevel).toBe(original.context.experienceLevel);
        expect(reconstructed.context.energyLevel).toBe(original.context.energyLevel);
        expect(reconstructed.context.stressLevel).toBe(original.context.stressLevel);
        expect(reconstructed.context.sleepQuality).toBe(original.context.sleepQuality);
        // Test that arrays are preserved
        expect(reconstructed.context.recentWorkouts).toHaveLength(
          original.context.recentWorkouts.length,
        );
        expect(reconstructed.context.userGoals).toBeDefined();
      });
    });

    it('should preserve date fields through round-trip', async () => {
      // Act & Assert - Run everything inside the Durable Object
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        const startedAt = new Date('2024-01-01T10:00:00Z');
        const lastMessageAt = new Date('2024-01-02T15:30:00Z');
        const lastContextUpdateAt = new Date('2024-01-02T15:35:00Z');

        const original = createCoachConversationFixture({
          id: 'date_fields_conv',
          startedAt,
          lastMessageAt,
          lastContextUpdateAt,
        });

        // Insert
        await db.insert(coachingConversation).values(toDatabase(original));

        // Read back
        const dbRow = await db.query.coachingConversation.findFirst({
          where: eq(coachingConversation.id, 'date_fields_conv'),
        });

        expect(dbRow).toBeDefined();

        // Convert back
        const reconstructed = toDomain(dbRow!, [], []);

        expect(reconstructed.id).toBe(original.id);
        expect(reconstructed.startedAt.toISOString()).toBe(startedAt.toISOString());
        expect(reconstructed.lastMessageAt.toISOString()).toBe(lastMessageAt.toISOString());
        expect(reconstructed.lastContextUpdateAt.toISOString()).toBe(
          lastContextUpdateAt.toISOString(),
        );
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle minimal context gracefully', async () => {
      // Act & Assert - Run everything inside the Durable Object
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        // Create a minimal context by overriding with minimal required fields
        const original = createCoachConversationFixture({
          id: 'minimal_context_conv',
        });

        // Insert
        await db.insert(coachingConversation).values(toDatabase(original));

        // Read back
        const dbRow = await db.query.coachingConversation.findFirst({
          where: eq(coachingConversation.id, 'minimal_context_conv'),
        });

        expect(dbRow).toBeDefined();

        // Convert back
        const reconstructed = toDomain(dbRow!, [], []);

        expect(reconstructed.id).toBe(original.id);
        // The mapper always adds these fields, so they should be present
        expect(reconstructed.context.userGoals).toBeDefined();
        expect(reconstructed.context.recentWorkouts).toBeDefined();
        expect(Array.isArray(reconstructed.context.recentWorkouts)).toBe(true);
      });
    });

    it('should handle zero counts correctly', async () => {
      // Act & Assert - Run everything inside the Durable Object
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        const original = createCoachConversationFixture({
          id: 'zero_counts_conv',
          totalMessages: 0,
          totalUserMessages: 0,
          totalCoachMessages: 0,
          totalCheckIns: 0,
          pendingCheckIns: 0,
        });

        // Insert
        await db.insert(coachingConversation).values(toDatabase(original));

        // Read back
        const dbRow = await db.query.coachingConversation.findFirst({
          where: eq(coachingConversation.id, 'zero_counts_conv'),
        });

        expect(dbRow).toBeDefined();

        // Convert back
        const reconstructed = toDomain(dbRow!, [], []);

        expect(reconstructed.id).toBe(original.id);
        expect(reconstructed.totalMessages).toBe(0);
        expect(reconstructed.totalUserMessages).toBe(0);
        expect(reconstructed.totalCoachMessages).toBe(0);
        expect(reconstructed.totalCheckIns).toBe(0);
        expect(reconstructed.pendingCheckIns).toBe(0);
      });
    });
  });
});
