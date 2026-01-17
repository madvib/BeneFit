import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupTestDb } from './test-utils.js';
import { seedUserHub } from '../seed.js';
import { profile } from '../schema/index.js';
import { count } from 'drizzle-orm';
import { SEED_USERS } from '@bene/shared';

describe('User Hub Integration Tests', () => {
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
    // 1. Run seed
    await seedUserHub(db);

    // 2. Verify Profiles
    const profileCount = await db.select({ count: count() }).from(profile);
    expect(profileCount[0].count).toBe(5);

    // 3. Verify the seeded user exists
    const user = await db.query.profile.findFirst();
    expect(user).toBeDefined();
    expect(user?.userId).toBe(SEED_USERS[0].id);
  });
});
