// packages/persistence/scripts/studio-do.ts
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

// Always look at root .wrangler
const PERSIST_DIR = join(process.cwd(), '../../../.wrangler/state');

function findDODatabase(className: string, instanceId?: string): string | null {
  const doDir = join(PERSIST_DIR, 'v3', 'do', className);

  if (!existsSync(doDir)) {
    return null;
  }

  if (instanceId) {
    const dbPath = join(doDir, `${instanceId}.sqlite`);
    return existsSync(dbPath) ? dbPath : null;
  }

  // Find most recent
  const files = readdirSync(doDir)
    .filter((f) => f.endsWith('.sqlite'))
    .map((f) => ({
      path: join(doDir, f),
      mtime: statSync(join(doDir, f)).mtime,
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  return files.length > 0 ? files[0].path : null;
}

function listDOInstances(className: string): void {
  const doDir = join(PERSIST_DIR, 'v3', 'do', className);

  if (!existsSync(doDir)) {
    console.log(`❌ No instances found for ${className}`);
    console.log(`   Looking in: ${doDir}\n`);
    return;
  }

  const files = readdirSync(doDir)
    .filter((f) => f.endsWith('.sqlite'))
    .map((f) => {
      const stat = statSync(join(doDir, f));
      return {
        name: f.replace('.sqlite', ''),
        modified: stat.mtime.toLocaleString(),
        size: `${(stat.size / 1024).toFixed(2)} KB`,
      };
    })
    .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

  console.log(`\n📦 Found ${files.length} instance(s) of ${className}:\n`);
  files.forEach((file, i) => {
    console.log(`${i + 1}. ${file.name}`);
    console.log(`   Modified: ${file.modified}`);
    console.log(`   Size: ${file.size}\n`);
  });
}

// Main script
const args = process.argv.slice(2);
const command = args[0];
const className = args[1];
const instanceId = args[2];

if (!command || !className) {
  console.log(`
Usage:
  npm run db:studio:do <className>              - Open most recent instance
  npm run db:studio:do <className> <instanceId> - Open specific instance
  npm run db:list:do <className>                - List all instances

Examples:
  npm run db:studio:do WorkoutSession
  npm run db:studio:do WorkoutSession user-123
  npm run db:list:do WorkoutSession
  `);
  process.exit(1);
}

if (command === 'list') {
  listDOInstances(className);
  process.exit(0);
}

const dbPath = findDODatabase(className, instanceId);

if (!dbPath || !existsSync(dbPath)) {
  console.error(
    `❌ Database not found for ${className}${instanceId ? ` (${instanceId})` : ''}\n`,
  );
  console.log('💡 Troubleshooting:');
  console.log('   1. Make sure you have run your worker locally at least once');
  console.log(`   2. Check: ${PERSIST_DIR}/v3/do/${className}/`);
  console.log(`   3. List available instances: npm run db:list:do ${className}\n`);
  process.exit(1);
}

console.log(`🔍 Opening Drizzle Studio for: ${className}`);
console.log(`📁 Database: ${dbPath}`);
console.log(`🎨 Studio will open at http://localhost:4983\n`);

const studio = spawn('drizzle-kit', ['studio'], {
  env: {
    ...process.env,
    LOCAL_DB_PATH: dbPath,
  },
  stdio: 'inherit',
});

studio.on('exit', (code) => {
  process.exit(code || 0);
});
