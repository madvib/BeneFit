import { defineConfig, type Config } from 'drizzle-kit';
import { getD1Helper } from './get-d1-helper.ts';
import { findDurableObjectSqliteDb } from './find-do-local-sqlite.ts';
// NOTE: as we migrate from persistence package we will remove the naming convention and require a schema/migrations path

/**
 * Creates a Drizzle configuration object for a specific D1 database.
 * @param dbName The name of the D1 binding (e.g., 'DB_ACTIVITY_STREAM').
 * @param baseDir The base directory for the schema and migrations
 * (e.g., './src/d1/activity_stream').
 * @param configFilename The name of the configuration file (__filename)
 * to correctly persist the D1 helper path.
 * @returns A Drizzle-kit configuration object.
 */
export function createD1DrizzleConfig(
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

interface DurableObjectDrizzleOptions {
  /** Name of the Durable Object class (e.g., 'UserHub') */
  durableObjectClass: string;
  /** Worker/handler name (e.g., 'user-hub-handler') */
  workerName: string;
  /** Directory for migrations (relative to package root)
   * Defaults to ./migrations */
  migrationsDir?: string;
  /** Path to schema files (relative to package root)
   * Defaults to ./src/data/schema/⁣**⁣/*⁣ */
  schemaPath?: string;
}
/**
 * Creates a Drizzle configuration for a Durable Object.
 *
 * @example
 * // drizzle.config.ts in your DO package
 * import { createDurableObjectDrizzleConfig } from '@bene/drizzle-config';
 *
 * export default createDurableObjectDrizzleConfig({
 *   durableObjectClass: 'UserHub',
 *   workerName: 'user-hub-handler',
 *   baseDir: './src/do/user-hub',
 * });
 */
export function createDurableObjectDrizzleConfig(options: DurableObjectDrizzleOptions): Config {
  const {
    durableObjectClass,
    workerName,
    migrationsDir = './migrations',
    schemaPath = './src/data/schema/**/*',
  } = options;

  const isProd = process.env.NODE_ENV === 'production';

  const config: Config = {
    out: migrationsDir,
    schema: schemaPath,
    dialect: 'sqlite',
  };

  if (isProd) {
    // Production: Use durable-sqlite driver (no dbCredentials needed)
    return defineConfig({
      ...config,
      driver: 'durable-sqlite',
    });
  } else {
    // Development: Point to local SQLite file
    return defineConfig({
      ...config,
      dbCredentials: {
        url: findDurableObjectSqliteDb(workerName, durableObjectClass),
      },
    });
  }
}
