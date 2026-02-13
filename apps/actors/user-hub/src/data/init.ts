import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { SEED_PERSONAS, SEED_USER_IDS } from '@bene/shared';
import migrations from '../../migrations/migrations.js';
import * as schema from './schema/index.js';

/**
 * Initializes the User Base database by running migrations and optionally seeding in local development.
 * @param state - The DurableObjectState instance
 * @param env - The Environment bindings
 */
export async function initializeUserHubDB(state: DurableObjectState, env: Env) {
  console.log('🚀 Initializing User Base database...');

  // Create the Drizzle client using the provided storage
  const db = drizzle<typeof schema.user_do_schema>(state.storage);

  // Run pending migrations
  console.log('📦 Running database migrations...');
  await migrate(db, migrations);

  // Check if this DO instance corresponds to a Seed User
  // We must generate the DO ID from the Seed User ID to compare
  const seedUserId = Object.values(SEED_USER_IDS).find(
    (uid) => env.USER_HUB.idFromName(uid).toString() === state.id.toString(),
  );
  // Optionally seed the database if in local development and this IS a seed user
  if (
    !(import.meta.env.MODE == 'production') &&
    seedUserId &&
    SEED_PERSONAS[seedUserId] &&
    (await db.select().from(schema.completedWorkouts).limit(1)).length === 0
  ) {
    const { seedUserHub } = await import('./seed.js');
    console.log(`🌱 Seeding database for Seed User: ${seedUserId}`);
    // Note: Ideally seedUserHub should accept seedUserId to only seed that user's data
    await seedUserHub(db, seedUserId);
  }

  console.log('✅ User Base database initialized successfully');
}
