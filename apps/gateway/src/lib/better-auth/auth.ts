import { betterAuth } from 'better-auth';
import { DB, drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import { betterAuthOptions } from './options.js';
import { account, session, user, verification } from './schema.js';
const db = (driver: DB) =>
  drizzleAdapter(driver, {
    provider: 'sqlite',
    schema: {
      account,
      session,
      user,
      verification,
    },
  });

// Configuration function DO NOT import
export const auth = betterAuth({
  ...betterAuthOptions,
  database: db(undefined as never),
});

export const createAuth = (driver: D1Database) => {
  return betterAuth({
    ...betterAuthOptions,
    database: db(drizzle(driver)),
  });
};
