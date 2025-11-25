import { AuthUserRepository, BetterAuthService } from '@bene/infrastructure/auth';
import { CreateDrizzleD1DB as DrizzleD1DBFactory } from '@bene/infrastructure/shared';
import { cloudflareEnv } from './cloudflare';
import { cache } from 'react';

const authUserDB = cache(async () => {
  const env = await cloudflareEnv();
  const createAuth = new DrizzleD1DBFactory(env.DB_USER_AUTH);
  return createAuth.db;
});

export const authUserRepository = async () =>
  new AuthUserRepository(await authUserDB());

export const authService = async () => new BetterAuthService(await authUserDB());
