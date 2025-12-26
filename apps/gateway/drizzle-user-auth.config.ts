import { createDrizzleConfig } from '../../packages/persistence/drizzle/helpers/drizzle-config.factory.ts';

const DB_NAME = 'DB_USER_AUTH';

export default createDrizzleConfig(
  DB_NAME,
  __filename,
  'src/lib/better-auth/migrations',
  'src/lib/better-auth/schema.ts',
);
