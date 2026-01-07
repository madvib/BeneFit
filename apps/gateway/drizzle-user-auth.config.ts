import { createD1DrizzleConfig } from '../../tools/drizzle/drizzle-config.factory.ts';

const DB_NAME = 'DB_USER_AUTH';

export default createD1DrizzleConfig(
  DB_NAME,
  __filename,
  'src/lib/better-auth/migrations',
  'src/lib/better-auth/schema.ts',
);
