import { createDurableObjectDrizzleConfig } from '../../../tools/drizzle/drizzle-config.factory';

export default createDurableObjectDrizzleConfig({
  durableObjectClass: 'UserHub',
  workerName: 'user-hub-handler',
  migrationsDir: './migrations',
  schemaPath: './src/data/schema/**/*',
});
