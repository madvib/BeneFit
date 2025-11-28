// packages/database/src/client.ts
// Drizzle client factory

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

let sqlite: Database.Database | undefined;
let globalDb: ReturnType<typeof drizzle> | undefined;

export function createDbClient(databaseUrl?: string) {
  if (!globalDb) {
    const dbPath = databaseUrl || process.env.DATABASE_URL || './sqlite.db';
    
    sqlite = new Database(dbPath);
    globalDb = drizzle(sqlite);

    // Enable WAL mode for better concurrency
    sqlite.exec('PRAGMA journal_mode = WAL;');
    sqlite.exec('PRAGMA foreign_keys = ON;');
  }

  return globalDb;
}

export function migrateDb(databaseUrl?: string) {
  const db = createDbClient(databaseUrl);
  const dbPath = databaseUrl || process.env.DATABASE_URL || './sqlite.db';
  const sqliteInstance = new Database(dbPath);

  const migratedDb = drizzle(sqliteInstance);
  migrate(migratedDb, { migrationsFolder: './drizzle' });
  sqliteInstance.close();
}

export type DbClient = ReturnType<typeof createDbClient>;