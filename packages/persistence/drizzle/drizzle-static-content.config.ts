import { createDrizzleConfig } from './helpers/drizzle-config.factory.ts';

const DB_NAME = 'DB_STATIC_CONTENT';

export default createDrizzleConfig(DB_NAME, __filename);
