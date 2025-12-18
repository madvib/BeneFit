import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { betterAuthOptions } from './options.js';

const db = (driver: DrizzleD1Database) =>
  drizzleAdapter(driver, {
    provider: 'sqlite',
  });

// Configuration function DO NOT import
export const auth = betterAuth({
  ...betterAuthOptions,
  database: db(undefined as never),
});
