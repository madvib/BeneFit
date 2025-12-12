import { createDrizzleConfig } from './helpers/drizzle-config.factory.ts';

const DB_NAME = 'DB_ACTIVITY_STREAM';

export default createDrizzleConfig(DB_NAME, __filename);
