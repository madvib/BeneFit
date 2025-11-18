import { AuthUserRepository, BetterAuthService } from '@bene/infrastructure/auth';
import { CreateDrizzleD1DB as DrizzleD1DBFactory } from '@bene/infrastructure/shared';
import { cloudflareEnv } from './cloudflare';

let createAuth: DrizzleD1DBFactory;

const authUserDB = async () => {
  if (!createAuth) {
    createAuth = new DrizzleD1DBFactory((await cloudflareEnv()).DB_USER_AUTH);
  }
  return createAuth.db;
};

export const authUserRepository = async () =>
  new AuthUserRepository(await authUserDB());

export const authService = async () => new BetterAuthService(await authUserDB());
