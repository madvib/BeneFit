import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { eq } from 'drizzle-orm';
import { SEED_USERS } from '@bene/shared';
import { seedUserHub } from '../../src/data/seed.js';
import * as schema from '../../src/data/schema/index.js';
import { user_do_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

/**
 * Sanity tests for the seed script using Cloudflare Durable Objects.
 * Verifies that the seed script can successfully:
 * - Set up a Durable Object database
 * - Run migrations
 * - Insert fixture-based data into all tables
 */
describe('seedUserHub - Durable Objects', () => {
  let stub: DurableObjectStub;

  beforeEach(async () => {
    const id = env.USER_HUB.idFromName(`seed-test-${crypto.randomUUID()}`);
    stub = env.USER_HUB.get(id);
  });

  it('should successfully set up database and run migrations', async () => {
    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: user_do_schema });

      // Run migrations
      await migrate(db, migrations);

      // Verify migrations worked by checking we can query
      const result = await db.query.profile.findMany({ limit: 1 });
      expect(result).toBeDefined();
    });
  }, 30000);

  it('should successfully seed all tables with fixture data', async () => {
    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: user_do_schema });

      // Run migrations and seed
      await migrate(db, migrations);
      await seedUserHub(db);

      const mainUserId = SEED_USERS[0].id;

      // Verify each table has data
      const profileResult = await db.query.profile.findFirst({
        where: eq(schema.profile.userId, mainUserId),
      });
      expect(profileResult).toBeDefined();
      expect(profileResult?.userId).toBe(mainUserId);

      const statsResult = await db.query.userStats.findFirst({
        where: eq(schema.userStats.userId, mainUserId),
      });
      expect(statsResult).toBeDefined();

      const planResult = await db.query.activeFitnessPlan.findFirst({
        where: eq(schema.activeFitnessPlan.userId, mainUserId),
      });
      expect(planResult).toBeDefined();
      expect(planResult?.userId).toBe(mainUserId);

      const workoutResult = await db.query.completedWorkouts.findFirst({
        where: eq(schema.completedWorkouts.userId, mainUserId),
      });
      expect(workoutResult).toBeDefined();

      const conversationResult = await db.query.coachingConversation.findFirst({
        where: eq(schema.coachingConversation.userId, mainUserId),
      });
      expect(conversationResult).toBeDefined();
      expect(conversationResult?.contextJson).toBeDefined();

      const serviceResult = await db.query.connectedServices.findFirst({
        where: eq(schema.connectedServices.userId, mainUserId),
      });
      expect(serviceResult).toBeDefined();
    });
  }, 30000);

  it('should handle multiple seed calls without errors (idempotency)', async () => {
    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: user_do_schema });

      // Run migrations and seed twice
      await migrate(db, migrations);
      await seedUserHub(db);
      await seedUserHub(db);

      // Verify data still exists and is correct
      const mainUserId = SEED_USERS[0].id;
      const profileResult = await db.query.profile.findFirst({
        where: eq(schema.profile.userId, mainUserId),
      });

      expect(profileResult).toBeDefined();
      expect(profileResult?.userId).toBe(mainUserId);
    });
  }, 30000);

  it('should seed data that matches domain fixture shapes', async () => {
    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: user_do_schema });

      // Run migrations and seed
      await migrate(db, migrations);
      await seedUserHub(db);

      const mainUserId = SEED_USERS[0].id;

      // Check that JSON fields are properly typed
      const plan = await db.query.activeFitnessPlan.findFirst({
        where: eq(schema.activeFitnessPlan.userId, mainUserId),
      });

      expect(plan?.goalsJson).toBeDefined();
      expect(plan?.progressionJson).toBeDefined();
      expect(plan?.constraintsJson).toBeDefined();
      expect(plan?.weeksJson).toBeDefined();
      expect(Array.isArray(plan?.weeksJson)).toBe(true);

      const workout = await db.query.completedWorkouts.findFirst({
        where: eq(schema.completedWorkouts.userId, mainUserId),
      });

      expect(workout?.performanceJson).toBeDefined();
      expect(workout?.verificationJson).toBeDefined();
    });
  }, 30000);
});
