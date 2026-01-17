import { describe, it, expect, afterEach } from 'vitest';
import { setupTestDb } from './test-utils.js';
import { seedWorkoutSession } from '../seed.js';
import { SEED_USERS } from '@bene/shared';
import * as schema from '../schema/index.js';
import { eq, count } from 'drizzle-orm';

/**
 * Sanity tests for the seed script.
 */
describe('seedWorkoutSession - Sanity Tests', () => {
  let db: Awaited<ReturnType<typeof setupTestDb>>['db'];
  let client: Awaited<ReturnType<typeof setupTestDb>>['client'];

  afterEach(() => {
    client?.close();
  });

  it('should successfully seed all tables with fixture data', async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;

    // Run the seed script
    await seedWorkoutSession(db);

    // Verify Sessions
    const sessionsCount = await db.select({ count: count() }).from(schema.sessionMetadata);
    expect(sessionsCount[0].count).toBe(1);

    // Verify Participants
    const participantsCount = await db.select({ count: count() }).from(schema.participants);
    expect(participantsCount[0].count).toBeGreaterThan(0);

    // Verify Chat
    const chatCount = await db.select({ count: count() }).from(schema.sessionChat);
    expect(chatCount[0].count).toBeGreaterThan(0);

    const mainUserId = SEED_USERS[0].id;
    const session = await db.query.sessionMetadata.findFirst({
      where: eq(schema.sessionMetadata.createdByUserId, mainUserId),
    });
    expect(session).toBeDefined();
    expect(session?.createdByUserId).toBe(mainUserId);
  });

  it('should handle multiple seed calls without errors (idempotency)', async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;

    // Seed twice
    await seedWorkoutSession(db);
    await seedWorkoutSession(db);

    const sessionsCount = await db.select({ count: count() }).from(schema.sessionMetadata);
    expect(sessionsCount[0].count).toBe(1);
  });
});
