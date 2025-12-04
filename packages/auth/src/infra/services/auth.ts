import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { user, session, account, verification } from '../data/schema/schema.js';

const authConfig = {
  baseURL: 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
};
const db = (driver: DrizzleD1Database) =>
  drizzleAdapter(driver, {
    provider: 'sqlite',
    schema: { user, session, account, verification },
  });

// Configuration function DO NOT import
export const auth = betterAuth({
  ...authConfig,
  database: db(undefined as never),
});

export const createBetterAuth = (driver: DrizzleD1Database) => {
  return betterAuth({
    ...authConfig,
    database: db(driver),
  });
};
