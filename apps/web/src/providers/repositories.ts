import { AuthUserRepository, BetterAuthService } from '@bene/infrastructure/auth';
import { CreateDrizzleD1DB } from '@bene/infrastructure/shared';
import { getCloudflareContext } from '@opennextjs/cloudflare';

async function authDBBinding(): Promise<D1Database> {
  return (await getCloudflareContext({ async: true })).env.DB_USER_AUTH;
}

const authUserDB = new CreateDrizzleD1DB(await authDBBinding()).db;

export const authUserRepository = new AuthUserRepository(authUserDB);

export const authService = new BetterAuthService(authUserDB);
