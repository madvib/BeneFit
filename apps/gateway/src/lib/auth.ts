import { betterAuth } from 'better-auth';
import { createD1Client } from '@bene/persistence';
import { betterAuthOptions } from '@bene/persistence/auth-options';

export function createAuth(env: Env) {
  return betterAuth({
    ...betterAuthOptions,
    database: createD1Client(env.DB_USER_AUTH),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: '/api/auth',
  });
}
