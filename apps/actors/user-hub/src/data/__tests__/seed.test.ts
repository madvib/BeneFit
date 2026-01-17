import { describe, it, expect, afterEach } from 'vitest';
import { setupTestDb } from './test-utils.js';
import { seedUserHub } from '../seed.js';
import { SEED_USERS } from '@bene/shared';
import * as schema from '../schema/index.js';
import { eq } from 'drizzle-orm';

/**
 * Sanity tests for the seed script.
 * Verifies that the seed script can successfully:
 * - Set up an in-memory database
 * - Run migrations
 * - Insert fixture-based data into all tables
 */
describe('seedUserHub - Sanity Tests', () => {
  let db: Awaited<ReturnType<typeof setupTestDb>>['db'];
  let client: Awaited<ReturnType<typeof setupTestDb>>['client'];

  afterEach(() => {
    client?.close();
  });

  it('should successfully set up database and run migrations', async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;

    // If we got here without errors, migrations worked
    expect(db).toBeDefined();
    expect(client).toBeDefined();
  });

  it('should successfully seed all tables with fixture data', async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;

    // Run the seed script
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

  it('should handle multiple seed calls without errors (idempotency)', async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;

    // Seed twice - should handle deletes and re-inserts
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

  it('should seed data that matches domain fixture shapes', async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;

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
});
