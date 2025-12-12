import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { createDOClient } from '../../client.js';
import { seedWorkoutSession } from './seed.js';
import migrations from './migrations/migrations';
/**
 * Initializes the Workout Session database by running migrations and optionally seeding in local development.
 * @param storage - The DurableObjectStorage instance to initialize
 * @param shouldSeed - Whether to seed the database (defaults to true in local development)
 */
export async function initializeWorkoutSessionDB(
  storage: DurableObjectStorage,
  env: { NODE_ENV?: string },
) {
  const shouldSeed = process.env.NODE_ENV !== 'production';
  console.log('🚀 Initializing Workout Session database...');
  // Create the Drizzle client using the provided storage
  const db = createDOClient(storage);

  // Run pending migrations
  console.log('📦 Running database migrations...');
  await migrate(db, migrations);

  // Optionally seed the database if in local development
  if (shouldSeed) {
    console.log('🌱 Seeding database with initial data...');
    await seedWorkoutSession(storage);
  }

  console.log('✅ Workout Session database initialized successfully');
}
