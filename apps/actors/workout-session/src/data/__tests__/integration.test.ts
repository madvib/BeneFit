import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupTestDb } from './test-utils.js';
import { seedWorkoutSession } from '../seed.js';
import { sessionMetadata } from '../schema/index.js';
import { count } from 'drizzle-orm';
import { SEED_USERS } from '@bene/shared';

describe('Workout Session Integration Tests', () => {
  let db: Awaited<ReturnType<typeof setupTestDb>>['db'];
  let client: Awaited<ReturnType<typeof setupTestDb>>['client'];

  beforeEach(async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;
  });

  afterEach(() => {
    client?.close();
  });

  it('should seed the database correctly', async () => {
    await seedWorkoutSession(db);

    const sessionCount = await db.select({ count: count() }).from(sessionMetadata);
    expect(sessionCount[0].count).toBe(1);

    const session = await db.query.sessionMetadata.findFirst();
    expect(session).toBeDefined();
    expect(SEED_USERS.some(u => u.id === session?.createdByUserId)).toBe(true);
  });
});
