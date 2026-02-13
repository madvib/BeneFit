import { account, user } from '../src/lib/better-auth/schema.js';
import { useLocalD1 } from '../../../tools/drizzle/get-d1-helper.js';
import { drizzle } from 'drizzle-orm/d1';
import { hashPassword } from 'better-auth/crypto';
import { SEED_USERS } from '@bene/shared';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';

/**
 * Seeds the user authentication database using Drizzle ORM and D1Helper.
 * @param environment - 'local' | 'staging' | 'production'
 */
export async function seedUserAuth(environment: 'local' | 'staging' | 'production' = 'local') {
  console.log(`🌱 Seeding User Auth database (${ environment }) with Drizzle ORM...`);

  try {
    const capturedSQL: string[] = [];

    // Always execute locally first to validate and capture SQL
    await useLocalD1(
      'DB_USER_AUTH',
      (binding) => insertUsers(binding, capturedSQL),
      './wrangler.jsonc',
    );

    console.log(`✅ User Auth local database seeded successfully`);

    // If remote environment, sync to remote database
    if (environment !== 'local') {
      await syncToRemote(environment, capturedSQL);
    }

    printCredentials();
  } catch (error) {
    console.error(`❌ Error seeding User Auth database (${ environment }):`, error);
    throw error;
  }
}

async function insertUsers(binding: D1Database, sqlCapture?: string[]) {
  console.log('  - Clearing existing data...');

  const db = drizzle(binding);

  // Clear existing data
  const deleteAccountQuery = db.delete(account).toSQL();
  const deleteUserQuery = db.delete(user).toSQL();

  await db.delete(account);
  await db.delete(user);

  // Capture SQL if needed
  if (sqlCapture) {
    sqlCapture.push(deleteAccountQuery.sql + ';');
    sqlCapture.push(deleteUserQuery.sql + ';');
  }

  console.log(`  - Inserting ${ SEED_USERS.length } users...`);

  for (const seedUser of SEED_USERS) {
    const hashedPassword = await hashPassword(seedUser.password);
    const now = new Date();

    const userValues = {
      id: seedUser.id,
      email: seedUser.email,
      name: seedUser.name,
      emailVerified: seedUser.emailVerified,
      image: null,
      createdAt: now,
      updatedAt: now,
    };

    const accountValues = {
      id: `account_${ seedUser.id }`,
      accountId: seedUser.email,
      providerId: 'credential',
      userId: seedUser.id,
      password: hashedPassword,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      createdAt: now,
      updatedAt: now,
    };

    // Get SQL before executing
    const userQuery = db.insert(user).values(userValues).toSQL();
    const accountQuery = db.insert(account).values(accountValues).toSQL();

    // Execute locally
    await db.insert(user).values(userValues);
    await db.insert(account).values(accountValues);

    // Capture SQL if needed
    if (sqlCapture) {
      sqlCapture.push(buildSQL(userQuery.sql, userQuery.params));
      sqlCapture.push(buildSQL(accountQuery.sql, accountQuery.params));
    }

    console.log(`    ✅ Created user: ${ seedUser.email }`);
  }
}

/**
 * Convert parameterized SQL query to executable SQL
 */
function buildSQL(sql: string, params: unknown[]): string {
  let result = sql;

  params.forEach((param) => {
    const value = formatSQLValue(param);
    result = result.replace('?', value);
  });

  return result + ';';
}

/**
 * Format a value for SQL insertion
 */
function formatSQLValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (value instanceof Date) {
    return `'${ value.toISOString() }'`;
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'string') {
    return `'${ value.replace(/'/g, "''") }'`;
  }
  // Fallback for other types
  return `'${ String(value).replace(/'/g, "''") }'`;
}

/**
 * Sync local database state to remote environment
 */
async function syncToRemote(environment: 'staging' | 'production', sqlStatements: string[]) {
  console.log(`\n🔄 Syncing to remote ${ environment } database...`);

  const sqlFile = '.temp-seed.sql';

  try {
    // Write SQL to temporary file
    writeFileSync(sqlFile, sqlStatements.join('\n'));

    console.log(`  - Executing SQL file with ${ sqlStatements.length } statements...`);
    console.log(`  - Command: wrangler d1 execute DB_USER_AUTH --remote --file ${ sqlFile }`);

    // Execute on remote database using the database ID with --remote flag
    // Change stdio to 'pipe' to capture output, then manually log it
    const result = execSync(
      `wrangler d1 execute DB_USER_AUTH --remote --file ${ sqlFile }`,
      {
        encoding: 'utf-8',
        stdio: 'pipe' // Capture output instead of inherit
      }
    );

    console.log(result);
    console.log(`✅ Successfully synced to remote ${ environment } database`);
  } catch (error: any) {
    console.error('\n❌ Wrangler command failed:');
    console.error('STDOUT:', error.stdout?.toString() || 'No stdout');
    console.error('STDERR:', error.stderr?.toString() || 'No stderr');
    console.error('Status:', error.status);

    // Also log the SQL file contents for debugging
    console.error('\n📄 SQL file contents:');
    console.error(readFileSync(sqlFile, 'utf-8'));

    throw error;
  } finally {
    // Clean up temporary file
    if (existsSync(sqlFile)) {
      unlinkSync(sqlFile);
    }
  }
}

/**
 * Check if file exists
 */
function existsSync(path: string): boolean {
  try {
    readFileSync(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Print test credentials
 */
function printCredentials() {
  console.log('\n📝 Test Credentials:');
  SEED_USERS.forEach((u) => {
    console.log(`  Email: ${ u.email }`);
    console.log(`  Password: ${ u.password }`);
    console.log(`  Email Verified: ${ u.emailVerified ? '✅' : '❌' }`);
    console.log('');
  });
}

// This block makes the script runnable directly
if (import.meta.url === `file://${ process.argv[1] }`) {
  const environment = (process.argv[2] as 'local' | 'staging' | 'production') || 'local';

  seedUserAuth(environment).catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
}
