// scripts/migrate.ts
import { execSync } from 'child_process';

type Environment = 'local' | 'staging' | 'production';

const env = (process.argv.find((arg) => arg.startsWith('--env='))?.split('=')[1] ||
  'local') as Environment;

const D1_DATABASES = ['DB_ACTIVITY_STREAM', 'DB_DISCOVERY_INDEX', 'DB_STATIC_CONTENT', "DB_USER_AUTH"];

console.log(`\n🚀 Migrating D1 databases for ${env}...\n`);

for (const db of D1_DATABASES) {
  console.log(`📦 Migrating ${db}...`);

  const cmd =
    env === 'local'
      ? `wrangler d1 migrations apply ${db} --local --config wrangler.jsonc --persist-to ../../../.wrangler/state`
      : `wrangler d1 migrations apply ${db} --env ${env} --config wrangler.jsonc`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ ${db} migrated\n`);
  } catch (error) {
    console.error(`❌ Failed to migrate ${db}`);
    process.exit(1);
  }
}

console.log('✨ All D1 migrations complete!\n');

// Note: DO migrations run automatically on first instantiation
// via initializeDB() function
console.log('💡 DO migrations will run automatically on first use\n');
