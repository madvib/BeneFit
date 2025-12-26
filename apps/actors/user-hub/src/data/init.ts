import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { seedUserHub } from './seed.js';
import migrations from '../../migrations/migrations.js';
import { profile } from './schema/index.js';

/**
 * Initializes the User Base database by running migrations and optionally seeding in local development.
 * @param storage - The DurableObjectStorage instance to initialize
 * @param shouldSeed - Whether to seed the database (defaults to true in local development)
 */
export async function initializeUserHubDB(storage: DurableObjectStorage) {
  console.log('🚀 Initializing User Base database...');

  // Create the Drizzle client using the provided storage
  const db = drizzle(storage);

  // Run pending migrations
  console.log('📦 Running database migrations...');
  await migrate(db, migrations);

  // Optionally seed the database if in local development
  if (import.meta.env.DEV && (await db.select().from(profile).limit(1)).length === 0) {
    console.log('🌱 Seeding database with initial data...');
    await seedUserHub(storage);
  }

  console.log('✅ User Base database initialized successfully');
}
