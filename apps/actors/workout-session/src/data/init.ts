import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import migrations from '../../migrations/migrations.js';
import { sessionMetadata } from './schema/session_metadata.js';
/**
 * Initializes the Workout Session database by running migrations and optionally seeding in local development.
 * @param storage - The DurableObjectStorage instance to initialize
 * @param shouldSeed - Whether to seed the database (defaults to true in local development)
 */
export async function initializeWorkoutSessionDB(storage: DurableObjectStorage) {
  console.log('🚀 Initializing Workout Session database...');
  // Create the Drizzle client using the provided storage
  const db = drizzle(storage);

  // Run pending migrations
  console.log('📦 Running database migrations...');
  await migrate(db, migrations);

  // Optionally seed the database if in local development
  if (import.meta.env.DEV && (await db.select().from(sessionMetadata).limit(1)).length === 0) {
    const { seedWorkoutSession } = await import("./seed.js");
    console.log('🌱 Seeding database with initial data...');
    await seedWorkoutSession(db);
  }

  console.log('✅ Workout Session database initialized successfully');
}
