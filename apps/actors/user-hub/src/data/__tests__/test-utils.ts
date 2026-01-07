import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from '../schema/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get migrations folder path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_FOLDER = path.join(__dirname, '../../../migrations');

export async function setupTestDb() {
  const client = createClient({
    url: ':memory:',
  });

  const db = drizzle(client, { schema });

  // Run migrations
  // Note: We might need to adjust how migrations are loaded for tests 
  // if standard migrator expects a different format or if we don't have direct access to migration files in build.
  // For now assuming source access to migrations folder.

  // Actually, drizzle-orm/libsql/migrator might not work directly with relative paths if looking for .sql files in build.
  // But since we are in a repo source context (tests), it should verify.

  // Alternative: push schema directly using drizzle-kit logic or just raw verify.
  // For 'smoke test' of seed, we can just ensure tables exist.
  // But proper way is using migrate.

  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });

  return { client, db };
}
