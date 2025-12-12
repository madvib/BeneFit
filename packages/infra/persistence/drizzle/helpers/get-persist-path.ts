// packages/infra/persistence/src/helpers/drizzle-config.ts
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export function findMonorepoRoot(startDir?: string): string {
  let currentDir = startDir ?? fileURLToPath(import.meta.url);

  // Look for pnpm-workspace.yaml or .git
  while (currentDir !== path.parse(currentDir).root) {
    if (
      fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml')) ||
      fs.existsSync(path.join(currentDir, '.git'))
    ) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  throw new Error('Could not find monorepo root');
}

export function getPersistPath(configFilePath?: string): string {
  const root = findMonorepoRoot(configFilePath);
  return path.join(root, '.wrangler/state/v3');
}
