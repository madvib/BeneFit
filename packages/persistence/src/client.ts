// packages/database/src/client.ts
// Drizzle client factory for Cloudflare bindings

import { drizzle as drizzleD1, type DrizzleD1Database } from 'drizzle-orm/d1';
import {
  drizzle as drizzleDO,
  type DrizzleSqliteDODatabase,
} from 'drizzle-orm/durable-sqlite';

/**
 * Create a Drizzle client for D1 Database
 * @param binding - Cloudflare D1Database binding
 * @returns Drizzle D1 database instance
 */
export function createD1Client(binding: D1Database): DrizzleD1Database {
  return drizzleD1(binding);
}

/**
 * Create a Drizzle client for Durable Object SQLite storage
 * @param storage - Cloudflare DurableObjectStorage binding
 * @returns Drizzle Durable Object database instance
 */
export function createDOClient(storage: DurableObjectStorage): DrizzleSqliteDODatabase {
  return drizzleDO(storage);
}

/**
 * Type alias for D1 database client
 */
export type D1Client = DrizzleD1Database;

/**
 * Type alias for Durable Object database client
 */
export type DOClient<T extends Record<string, unknown>> = DrizzleSqliteDODatabase<T>;
