// tools/nx-plugins/wrangler/index.ts
import {
  CreateNodesContextV2,
  CreateNodesV2,
  TargetConfiguration,
  createNodesFromFiles,
} from '@nx/devkit';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import {
  extractServiceDependencies,
  getAllWorkers,
  readWranglerConfig,
  WorkerManifest,
} from './config-parser';

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
  '**/wrangler.jsonc',
  async (configFiles, options, context) => {
    const pluginOptions = { ...DEFAULT_OPTIONS, ...options };
    const allWorkers = getAllWorkers(Array.from(configFiles));

    return await createNodesFromFiles(
      (configFile, options, context) =>
        createNodesInternal(configFile, context, pluginOptions, allWorkers),
      configFiles,
      options,
      context,
    );
  },
];

async function createNodesInternal(
  configFilePath: string,
  context: CreateNodesContextV2,
  pluginOptions: WranglerPluginOptions,
  allWorkers: WorkerManifest,
) {
  const projectRoot = dirname(configFilePath);
  const workspaceRoot = context.workspaceRoot;

  // Calculate relative paths
  const relativeProjectRoot = projectRoot.replace(workspaceRoot + '/', '');
  const persistToPath = join(workspaceRoot, pluginOptions.persistTo!);
  const devVarsPath = join(workspaceRoot, pluginOptions.devVarsPath!);

  // Read wrangler config to get project name
  const wranglerConfig = readWranglerConfig(configFilePath);
  const dependencies = extractServiceDependencies(wranglerConfig);

  // Build target configurations
  const targets: Record<string, TargetConfiguration> = {};

  if (wranglerConfig.main) {
    // Dev target
    targets['worker-dev'] = {
      executor: 'nx:run-commands',
      options: {
        command: `wrangler dev --persist-to ${ persistToPath }`,
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

    const boundServiceConfigPaths = [];
    for (const dep of dependencies) {
      if (allWorkers[dep]) {
        boundServiceConfigPaths.push(allWorkers[dep]);
      }
    }
    const configPaths =
      '-c ./wrangler.jsonc ' +
      boundServiceConfigPaths
        .map((path) => `-c ${ workspaceRoot + '/' + path }`)
        .join(' ');
    const projectVars = existsSync(join(projectRoot, '.dev.vars'))
      ? '--env-file .dev.vars'
      : '';

    const envTypesCmd = `wrangler types worker-env.d.ts --include-runtime=false ${ configPaths } --env-file ${ workspaceRoot }/.dev.vars ${ projectVars } `;

    targets['wrangler:types:env'] = {
      executor: 'nx:run-commands',
      options: {
        commands: [envTypesCmd],
        cwd: projectRoot,
      },
    };

    const runtimeTypesFullPath = join(workspaceRoot, pluginOptions.runtimeTypesPath!);
    const hasRuntimeTypes = existsSync(runtimeTypesFullPath);

    const typeGenCmd = `wrangler types ${ runtimeTypesFullPath } --include-env false`;
    // Generate runtime types (only once, at root)
    targets['wrangler:types:runtime'] = {
      executor: 'nx:run-commands',
      options: {
        commands: [
          !hasRuntimeTypes
            ? `mkdir -p ${ dirname(runtimeTypesFullPath) } && ${ typeGenCmd }`
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

// Helper to check for KV bindings
function hasKVBindings(config: any): boolean {
  return !!config?.kv_namespaces?.length;
}

// Helper to check for D1 bindings
function hasD1Bindings(config: any): boolean {
  return !!config?.d1_databases?.length;
}

export default createNodesV2;
