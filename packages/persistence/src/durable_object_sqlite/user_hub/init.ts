import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { createDOClient } from '../../client.ts';
import { seedUserHub } from './seed.ts';
import migrations from './migrations/migrations.ts';

/**
 * Initializes the User Base database by running migrations and optionally seeding in local development.
 * @param storage - The DurableObjectStorage instance to initialize
 * @param shouldSeed - Whether to seed the database (defaults to true in local development)
 */
export async function initializeUserHubDB(
  storage: DurableObjectStorage,
  env: { NODE_ENV?: string },
) {
  const shouldSeed = process.env.NODE_ENV !== 'production';
  console.log('🚀 Initializing User Base database...');

  // Create the Drizzle client using the provided storage
  const db = createDOClient(storage);

  // Run pending migrations
  console.log('📦 Running database migrations...');
  await migrate(db, migrations);

  // Optionally seed the database if in local development
  if (shouldSeed) {
    console.log('🌱 Seeding database with initial data...');
    await seedUserHub(storage);
  }

  console.log('✅ User Base database initialized successfully');
}
