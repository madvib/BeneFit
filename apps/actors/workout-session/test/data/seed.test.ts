import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { eq } from 'drizzle-orm';
import { SEED_USERS } from '@bene/shared';
import { seedWorkoutSession } from '../../src/data/seed.js';
import * as schema from '../../src/data/schema/index.js';
import { workout_session_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

/**
 * Sanity tests for the seed script using Cloudflare Durable Objects.
 * Verifies that the seed script can successfully:
 * - Set up a Durable Object database
 * - Run migrations
 * - Insert fixture-based data into all tables
 */
describe('seedWorkoutSession - Durable Objects', () => {
  let stub: DurableObjectStub;

  beforeEach(async () => {
    const id = env.WORKOUT_SESSION.idFromName(`seed-test-${crypto.randomUUID()}`);
    stub = env.WORKOUT_SESSION.get(id);
  });

  it('should successfully set up database and run migrations', async () => {
    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: workout_session_schema });

      // Run migrations
      await migrate(db, migrations);

      // Verify migrations worked by checking we can query
      const result = await db.query.sessionMetadata.findMany({ limit: 1 });
      expect(result).toBeDefined();
    });
  }, 30000);

  it('should successfully seed all tables with fixture data', async () => {
    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: workout_session_schema });

      // Run migrations and seed
      await migrate(db, migrations);
      await seedWorkoutSession(db);

      const mainUserId = SEED_USERS[0].id;

      // Verify each table has data
      const sessionResult = await db.query.sessionMetadata.findFirst({
        where: eq(schema.sessionMetadata.createdByUserId, mainUserId),
      });
      expect(sessionResult).toBeDefined();
      expect(sessionResult?.createdByUserId).toBe(mainUserId);

      const participantsResult = await db.query.participants.findMany();
      expect(participantsResult.length).toBeGreaterThan(0);

      const chatResult = await db.query.sessionChat.findMany();
      expect(chatResult.length).toBeGreaterThan(0);
    });
  }, 30000);

  it('should handle multiple seed calls without errors (idempotency)', async () => {
    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: workout_session_schema });

      // Run migrations and seed twice
      await migrate(db, migrations);
      await seedWorkoutSession(db);
      await seedWorkoutSession(db);

      // Verify data still exists and is correct
      const mainUserId = SEED_USERS[0].id;
      const sessionResult = await db.query.sessionMetadata.findFirst({
        where: eq(schema.sessionMetadata.createdByUserId, mainUserId),
      });

      expect(sessionResult).toBeDefined();
      expect(sessionResult?.createdByUserId).toBe(mainUserId);
    });
  }, 30000);

  it('should seed data that matches domain fixture shapes', async () => {
    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: workout_session_schema });

      // Run migrations and seed
      await migrate(db, migrations);
      await seedWorkoutSession(db);

      const mainUserId = SEED_USERS[0].id;

      // Check that JSON fields are properly typed
      const session = await db.query.sessionMetadata.findFirst({
        where: eq(schema.sessionMetadata.createdByUserId, mainUserId),
      });

      expect(session?.configurationJson).toBeDefined();
      expect(session?.activitiesJson).toBeDefined();
      expect(Array.isArray(session?.activitiesJson)).toBe(true);
    });
  }, 30000);
});
