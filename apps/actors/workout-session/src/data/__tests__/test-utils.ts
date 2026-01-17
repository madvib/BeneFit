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

  try {
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }

  return { client, db };
}
