import { mkdirSync, rmSync, readdirSync, unlinkSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '../../..');
const GATEWAY_DIR = join(ROOT_DIR, 'apps/gateway');
const OUTPUT_DIR = join(ROOT_DIR, 'packages/react-api-client/src/generated');

async function run() {
  console.log('🧹 Cleaning output directory...');

  // Clean generated directory but keep fixtures directory and legacy fixtures.ts
  const keepFiles = new Set(['fixtures.ts']);
  const keepDirs = new Set(['fixtures']);

  try {
    const files = readdirSync(OUTPUT_DIR, { withFileTypes: true });
    for (const file of files) {
      if (keepFiles.has(file.name) || (file.isDirectory() && keepDirs.has(file.name))) {
        continue; // Preserve fixtures directory and legacy files
      }
      const fullPath = join(OUTPUT_DIR, file.name);
      if (file.isDirectory()) {
        rmSync(fullPath, { recursive: true, force: true });
      } else {
        unlinkSync(fullPath);
      }
    }
  } catch {
    // Directory might not exist yet
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🔨 Compiling Gateway types...');
  try {
    execSync('pnpm tsc -p tsconfig.client.json', { cwd: GATEWAY_DIR, stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Failed to compile types:', err);
    process.exit(1);
  }

  console.log('🧹 Cleaning compiled type files...');

  // After TSC runs, clean everything except what we need
  try {
    const files = readdirSync(OUTPUT_DIR, { withFileTypes: true });
    for (const file of files) {
      const fullPath = join(OUTPUT_DIR, file.name);
      // Keep only .d.ts files
      if (file.isFile() && file.name.endsWith('.d.ts')) {
        continue;
      }
      // Delete everything else (js files, folders, etc) except fixtures
      if (file.isDirectory() && !keepDirs.has(file.name)) {
        rmSync(fullPath, { recursive: true, force: true });
      } else if (!keepFiles.has(file.name) && file.name !== 'client.js' && file.name !== 'index.ts') {
        unlinkSync(fullPath);
      }
    }
  } catch (err) {
    console.warn('Warning during cleanup:', err);
  }
  console.log('📝 Writing client wrapper...');

  console.log('\n✅ Client build complete!');
  console.log(`📦 Output: ${ OUTPUT_DIR }`);
  console.log('📄 Files:');
  console.log('   ├── client.js          (RPC client)');
  console.log('   ├── client.d.ts         ');
  console.log('   ├── index.d.ts         (Compiled types from TSC)');
  console.log('');
}

run().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
