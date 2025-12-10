// packages/persistence/scripts/clean.ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up to monorepo root: persistence/scripts -> persistence -> packages -> root
const rootDir = path.resolve(__dirname, '../../../../');
const wranglerDir = path.join(rootDir, '.wrangler');

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getDirectorySize(dirPath: string): number {
  let size = 0;

  if (!fs.existsSync(dirPath)) return 0;

  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dirPath, file.name);

    if (file.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += fs.statSync(filePath).size;
    }
  }

  return size;
}

function countDOInstances(wranglerPath: string): { [key: string]: number } {
  const doDir = path.join(wranglerPath, 'state', 'v3', 'do');
  const counts: { [key: string]: number } = {};

  if (!fs.existsSync(doDir)) return counts;

  const doClasses = fs.readdirSync(doDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const doClass of doClasses) {
    const classDir = path.join(doDir, doClass.name);
    const instances = fs.readdirSync(classDir)
      .filter(f => f.endsWith('.sqlite'));
    counts[doClass.name] = instances.length;
  }

  return counts;
}

function countD1Databases(wranglerPath: string): string[] {
  const d1Dir = path.join(wranglerPath, 'state', 'v3', 'd1');

  if (!fs.existsSync(d1Dir)) return [];

  return fs.readdirSync(d1Dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

async function promptUser(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function clean() {
  console.log('🧹 Cleaning local persistence state...\n');
  console.log(`📁 Target: ${wranglerDir}\n`);

  if (!fs.existsSync(wranglerDir)) {
    console.log('ℹ️  .wrangler directory not found, nothing to clean');
    return;
  }

  // Show what will be deleted
  const size = getDirectorySize(wranglerDir);
  const doInstances = countDOInstances(wranglerDir);
  const d1Databases = countD1Databases(wranglerDir);

  console.log('📊 Current state:');
  console.log(`   Total size: ${formatBytes(size)}`);

  if (Object.keys(doInstances).length > 0) {
    console.log('\n   Durable Object instances:');
    for (const [className, count] of Object.entries(doInstances)) {
      console.log(`   • ${className}: ${count} instance(s)`);
    }
  }

  if (d1Databases.length > 0) {
    console.log('\n   D1 databases:');
    for (const db of d1Databases) {
      console.log(`   • ${db}`);
    }
  }

  console.log('\n⚠️  This will delete ALL local development data!');

  // Check for --force flag
  const forceFlag = process.argv.includes('--force') || process.argv.includes('-f');

  if (!forceFlag) {
    const confirmed = await promptUser('\n❓ Are you sure you want to continue? (y/N): ');

    if (!confirmed) {
      console.log('\n❌ Clean cancelled');
      return;
    }
  }

  console.log('\n🗑️  Removing .wrangler directory...');
  fs.rmSync(wranglerDir, { recursive: true, force: true });
  console.log('✅ .wrangler directory removed');
  console.log(`💾 Freed ${formatBytes(size)}`);
  console.log('\n✨ Clean complete!');
}

clean().catch((err) => {
  console.error('❌ Clean failed:', err);
  process.exit(1);
});
