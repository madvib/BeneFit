import { createDrizzleConfig } from './helpers/drizzle-config.factory.ts';

const DB_NAME = 'DB_USER_AUTH';

export default createDrizzleConfig(DB_NAME, __filename);
