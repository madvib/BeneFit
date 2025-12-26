// drizzle.config.factory.ts
import { defineConfig, type Config } from 'drizzle-kit';
import { getD1Helper } from './get-d1-helper.ts';
// Assuming you have this helper available
// NOTE: Adjust the path to getPersistPath based on where you place this file.

/**
 * Creates a Drizzle configuration object for a specific D1 database.
 * @param dbName The name of the D1 binding (e.g., 'DB_ACTIVITY_STREAM').
 * @param baseDir The base directory for the schema and migrations
 * (e.g., './src/d1/activity_stream').
 * @param configFilename The name of the configuration file (__filename)
 * to correctly persist the D1 helper path.
 * @returns A Drizzle-kit configuration object.
 */
export function createDrizzleConfig(
  dbName: string,
  configFilename: string,
  migrationsDir?: string,
  schemaPath?: string,
): Config {
  // 1. Initialize D1Helper for the specific database
  const d1Helper = getD1Helper(dbName, configFilename);
  // 2. Determine environment
  const isProd = () => process.env.NODE_ENV === 'production';

  // 3. Production Credentials (D1 HTTP)
  const getProdCredentials = () => ({
    driver: 'd1-http' as const,
    dbCredentials: {
      ...d1Helper.withCfCredentials(
        process.env.CLOUDFLARE_ACCOUNT_ID,
        process.env.CLOUDFLARE_D1_TOKEN,
      ).proxyCredentials,
    },
  });

  // 4. Development Credentials (Local SQLite file)
  const getDevCredentials = () => ({
    dbCredentials: {
      url: d1Helper.sqliteLocalFileCredentials.url,
    },
  });
  console.log(d1Helper.sqliteLocalFileCredentials.url);
  // 5. Get Credentials based on environment
  const getCredentials = () => {
    return isProd() ? getProdCredentials() : getDevCredentials();
  };

  const kebabDbName = dbName.toLowerCase().slice(3);
  // 6. Return the full Drizzle Config
  return defineConfig({
    out: migrationsDir ?? `src/d1/${kebabDbName}/migrations`,
    schema: schemaPath ?? `src/d1/${kebabDbName}/schema/*`,
    dialect: 'sqlite',
    ...getCredentials(),
  });
}
