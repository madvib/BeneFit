// tools/nx-plugins/wrangler/index.ts
import {
  CreateNodesContextV2,
  CreateNodesV2,
  TargetConfiguration,
  createNodesFromFiles,
  readJsonFile,
  writeJsonFile,
} from '@nx/devkit';
import { dirname, join } from 'path';
import { existsSync, readFileSync, symlinkSync, unlinkSync } from 'fs';

interface WranglerPluginOptions {
  persistTo?: string;
  devVarsPath?: string;
  generateTypes?: boolean;
  runtimeTypesPath?: string;
}

// Default options
const DEFAULT_OPTIONS: WranglerPluginOptions = {
  persistTo: '.wrangler/state',
  devVarsPath: '.dev.vars',
  generateTypes: true,
  runtimeTypesPath: 'types/cloudflare-runtime.d.ts',
};

export const createNodesV2: CreateNodesV2<WranglerPluginOptions> = [
  // Pattern to match wrangler config files
  '**/wrangler.*',
  async (configFiles, options, context) => {
    const pluginOptions = { ...DEFAULT_OPTIONS, ...options };

    return await createNodesFromFiles(
      (configFile, options, context) =>
        createNodesInternal(configFile, options, context, pluginOptions),
      configFiles,
      options,
      context,
    );
  },
];

async function createNodesInternal(
  configFilePath: string,
  options: any,
  context: CreateNodesContextV2,
  pluginOptions: WranglerPluginOptions,
) {
  const projectRoot = dirname(configFilePath);
  const workspaceRoot = context.workspaceRoot;

  // Calculate relative paths
  const relativeProjectRoot = projectRoot.replace(workspaceRoot + '/', '');
  const persistToPath = join(workspaceRoot, pluginOptions.persistTo!);
  const devVarsPath = join(workspaceRoot, pluginOptions.devVarsPath!);

  // Ensure dev.vars symlink exists
  const projectDevVars = join(projectRoot, '.dev.vars');
  if (!existsSync(projectDevVars) && existsSync(devVarsPath)) {
    try {
      // Create relative symlink
      const relativePath = getRelativePath(projectRoot, devVarsPath);
      symlinkSync(relativePath, projectDevVars);
      console.log(`✓ Created .dev.vars symlink in ${relativeProjectRoot}`);
    } catch (error) {
      // Symlink might already exist or permissions issue
    }
  }

  // Read wrangler config to get project name
  const wranglerConfig = readWranglerConfig(configFilePath);
  const projectName = wranglerConfig?.name || dirname(configFilePath).split('/').pop();

  // Build target configurations
  const targets: Record<string, TargetConfiguration> = {};

  if (wranglerConfig.main) {
    // Dev target
    targets['worker-dev'] = {
      executor: 'nx:run-commands',
      options: {
        command: `wrangler dev --persist-to ${persistToPath}`,
        cwd: projectRoot,
      },
    };
    // Deploy target
    targets['worker-deploy'] = {
      executor: 'nx:run-commands',
      options: {
        commands: ['wrangler deploy'],
        cwd: projectRoot,
      },
    };

    // Deploy with environment
    targets['worker-deploy:staging'] = {
      executor: 'nx:run-commands',
      options: {
        command: 'wrangler deploy --env staging',
        cwd: projectRoot,
      },
    };

    targets['worker-deploy:production'] = {
      executor: 'nx:run-commands',
      options: {
        command: 'wrangler deploy --env production',
        cwd: projectRoot,
      },
    };
    // Tail logs target
    targets['worker-logs'] = {
      executor: 'nx:run-commands',
      options: {
        command: 'wrangler tail',
        cwd: projectRoot,
      },
    };

    // Logs with environment
    targets['worker-logs:staging'] = {
      executor: 'nx:run-commands',
      options: {
        command: 'wrangler tail --env staging',
        cwd: projectRoot,
      },
    };

    targets['worker-logs:production'] = {
      executor: 'nx:run-commands',
      options: {
        command: 'wrangler tail --env production',
        cwd: projectRoot,
      },
    };
  }
  // Type generation target
  if (pluginOptions.generateTypes) {
    const runtimeTypesFullPath = join(workspaceRoot, pluginOptions.runtimeTypesPath!);
    const hasRuntimeTypes = existsSync(runtimeTypesFullPath);

    targets['wrangler:types:env'] = {
      executor: 'nx:run-commands',
      options: {
        commands: [
          `wrangler types --include-runtime=false --env-file ${workspaceRoot}/.dev.vars`,
        ],
        cwd: projectRoot,
      },
    };

    const typeGenCmd = `wrangler types ${runtimeTypesFullPath} --include-env false`;
    // Generate runtime types (only once, at root)
    targets['wrangler:types:runtime'] = {
      executor: 'nx:run-commands',
      options: {
        commands: [
          !hasRuntimeTypes
            ? `mkdir -p ${dirname(runtimeTypesFullPath)}` && typeGenCmd
            : typeGenCmd,
        ],
        cwd: projectRoot,
      },
    };
  }

  // KV operations (if applicable)
  if (hasKVBindings(wranglerConfig)) {
    targets['cloudflare-kv:list'] = {
      executor: 'nx:run-commands',
      options: {
        command: 'wrangler kv:namespace list',
        cwd: projectRoot,
      },
    };
  }

  // D1 operations (if applicable)
  if (hasD1Bindings(wranglerConfig)) {
    targets['cloudflare-d1:list'] = {
      executor: 'nx:run-commands',
      options: {
        command: 'wrangler d1 list',
        cwd: projectRoot,
      },
    };
  }

  return {
    projects: {
      [relativeProjectRoot]: {
        targets,
      },
    },
  };
}

// Helper to read wrangler config
function readWranglerConfig(configPath: string): any {
  try {
    if (configPath.endsWith('.jsonc')) {
      return readJsonFile(configPath);
    } else if (configPath.endsWith('.toml')) {
      // For TOML, we'd need a parser, but we can read basic info
      const content = readFileSync(configPath, 'utf-8');
      const nameMatch = content.match(/name\s*=\s*["']([^"']+)["']/);
      return nameMatch ? { name: nameMatch[1] } : {};
    }
  } catch {
    return {};
  }
}

// Helper to check for KV bindings
function hasKVBindings(config: any): boolean {
  return !!config?.kv_namespaces?.length;
}

// Helper to check for D1 bindings
function hasD1Bindings(config: any): boolean {
  return !!config?.d1_databases?.length;
}

// Helper to get relative path between directories
function getRelativePath(from: string, to: string): string {
  const fromParts = from.split('/');
  const toParts = to.split('/');

  // Find common base
  let commonLength = 0;
  while (
    commonLength < fromParts.length &&
    commonLength < toParts.length &&
    fromParts[commonLength] === toParts[commonLength]
  ) {
    commonLength++;
  }

  // Go up from 'from' directory
  const upLevels = fromParts.length - commonLength;
  const ups = Array(upLevels).fill('..');

  // Add remaining path from 'to'
  const remaining = toParts.slice(commonLength);

  return [...ups, ...remaining].join('/');
}

export default createNodesV2;
