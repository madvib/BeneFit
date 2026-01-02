import { account, user } from './schema.js';
import { useLocalD1 } from '../../../../../tools/drizzle/get-d1-helper.js';
import { drizzle } from 'drizzle-orm/d1';

import { hashPassword } from 'better-auth/crypto';

/**
 * Seed users for local development
 *
 * Creates test users that can be used to access the application
 * with pre-existing fitness plans and data.
 */

import { SEED_USERS } from '@bene/shared';

/**
 * Seeds the user authentication database using Drizzle ORM and D1Helper.
 */
export async function seedUserAuth() {
  console.log('🌱 Seeding User Auth database with Drizzle ORM...');

  try {
    // Execute the seeding logic using the D1 binding
    await useLocalD1('DB_USER_AUTH', insertUsers, './wrangler.jsonc');

    console.log('✅ User Auth database seeded successfully');
    console.log('\n📝 Test Credentials:');
    SEED_USERS.forEach((u) => {
      console.log(`  Email: ${u.email}`);
      console.log(`  Password: ${u.password}`);
      console.log(`  Email Verified: ${u.emailVerified ? '✅' : '❌'}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error seeding User Auth database:', error);
    throw error;
  }
}
async function insertUsers(binding: D1Database) {
  console.log('  - Clearing existing data...');
  // Use Drizzle ORM for clear operations (cascade will handle accounts)
  const db = drizzle(binding);
  await db.delete(account);
  await db.delete(user);

  // --- 2. Insert Data ---
  console.log(`  - Inserting ${SEED_USERS.length} users...`);

  for (const seedUser of SEED_USERS) {
    // Hash password using Better Auth's crypto utility
    const hashedPassword = await hashPassword(seedUser.password);

    // Insert user
    await db.insert(user).values({
      id: seedUser.id,
      email: seedUser.email,
      name: seedUser.name,
      emailVerified: seedUser.emailVerified,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Insert account with password
    await db.insert(account).values({
      id: `account_${seedUser.id}`,
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`    ✅ Created user: ${seedUser.email}`);
  }
}

// This block makes the script runnable directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedUserAuth().catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
}
