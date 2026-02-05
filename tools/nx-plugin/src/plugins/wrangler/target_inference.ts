import {
  CreateNodesContextV2,
  CreateNodesV2,
  TargetConfiguration,
  createNodesFromFiles,
} from '@nx/devkit';
import { dirname, join } from 'path';
import { existsSync, readdirSync } from 'fs';
import {
  extractServiceDependencies,
  getAllWorkers,
  readWranglerConfig,
  WorkerManifest,
} from './config-parser';

interface CloudflarePluginOptions {
  persistTo?: string;
  devVarsFile?: string;
  generateTypes?: boolean;
  runtimeTypesPath?: string;
}

// Default options
const DEFAULT_OPTIONS: CloudflarePluginOptions = {
  persistTo: '.wrangler/state',
  devVarsFile: '.env.local',
  generateTypes: true,
  runtimeTypesPath: 'types/cloudflare-runtime.d.ts',
};

export const createNodesV2: CreateNodesV2<CloudflarePluginOptions> = [
  // Pattern to match wrangler config files
  '**/wrangler.{jsonc,toml}',
  async (configFiles, options, context) => {
    const pluginOptions = { ...DEFAULT_OPTIONS, ...options };
    const allWorkers = getAllWorkers(Array.from(configFiles));

    return await createNodesFromFiles(
      (configFile, _, context) =>
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
  pluginOptions: CloudflarePluginOptions,
  allWorkers: WorkerManifest,
) {
  const projectRoot = dirname(configFilePath);

  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));
  const useVite = siblingFiles.some((file) =>
    /^vite\.config\.(ts|mts|cts|js|cjs|mjs)$/.test(file),
  );
  const persistToPath = join(context.workspaceRoot, pluginOptions.persistTo!);

  const workspaceVars = join('--env-file ', context.workspaceRoot, pluginOptions.devVarsFile!);
  const projectVars = existsSync(join(projectRoot, '.dev.vars')) ? '--env-file .dev.vars' : '';

  // Read wrangler config to get project name
  const wranglerConfig = readWranglerConfig(configFilePath);
  const dependencies = extractServiceDependencies(wranglerConfig);

  // Build target configurations
  const targets: Record<string, TargetConfiguration> = {};

  if (wranglerConfig.main) {
    if (useVite) {
      // Vite-based targets
      addViteTargets(targets, projectRoot);
    } else {
      // Traditional Wrangler targets
      addWranglerTargets(targets, projectRoot, persistToPath, workspaceVars, projectVars);
    }
    addLogsTargets(targets, projectRoot);
  }
  // Type generation targets (shared by both Vite and Wrangler)
  if (pluginOptions.generateTypes) {
    addTypeGenerationTargets(
      targets,
      projectRoot,
      context,
      pluginOptions,
      dependencies,
      allWorkers,
      workspaceVars,
      projectVars,
    );
  }

  // Binding-specific targets (shared by both)
  if (hasKVBindings(wranglerConfig)) {
    targets['kv:list'] = {
      executor: 'nx:run-commands',
      options: {
        command: 'wrangler kv:namespace list',
        cwd: projectRoot,
      },
    };
  }

  if (hasD1Bindings(wranglerConfig)) {
    targets['d1:list'] = {
      executor: 'nx:run-commands',
      options: {
        command: 'wrangler d1 list',
        cwd: projectRoot,
      },
    };
  }

  return {
    projects: {
      [projectRoot]: {
        targets,
      },
    },
  };
}

function addViteTargets(targets: Record<string, TargetConfiguration>, projectRoot: string) {
  targets['dev'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'vite dev',
      cwd: projectRoot,
    },
    continuous: true,
  };

  targets['build'] = {
    executor: 'nx:run-commands',
    dependsOn: ['^build'],
    options: {
      command: 'vite build',
      cwd: projectRoot,
    },
    outputs: ['{projectRoot}/dist'],
    cache: true,
  };

  targets['preview'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'vite preview',
      cwd: projectRoot,
    },
    continuous: true,
  };

  // Environment-specific builds
  // CLOUDFLARE_ENV tells Vite which wrangler.toml environment to use
  targets['build:staging'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'vite build',
      cwd: projectRoot,
      env: 'CLOUDFLARE_ENV=staging',
    },
    outputs: ['{projectRoot}/dist'],
    cache: true,
  };

  targets['build:production'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'vite build',
      cwd: projectRoot,
      env: 'CLOUDFLARE_ENV=production',
    },
    outputs: ['{projectRoot}/dist'],
    cache: true,
  };

  // Deploy targets - NO --env flag with Vite
  // The environment is baked into the build via CLOUDFLARE_ENV
  targets['deploy:staging'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'wrangler deploy',
      cwd: projectRoot,
    },
    dependsOn: ['build:staging'],
  };

  targets['deploy:production'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'wrangler deploy',
      cwd: projectRoot,
    },
    dependsOn: ['build:production'],
  };
}
function addWranglerTargets(
  targets: Record<string, TargetConfiguration>,
  projectRoot: string,
  persistToPath: string,
  workspaceVars: string,
  projectVars: string,
) {
  // Dev target
  targets['dev'] = {
    executor: 'nx:run-commands',
    options: {
      command: `wrangler dev --persist-to ${persistToPath} ${workspaceVars} ${projectVars}`,
      cwd: projectRoot,
    },
    continuous: true,
  };

  // Deploy targets
  targets['deploy'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'wrangler deploy',
      cwd: projectRoot,
    },
  };

  targets['deploy:staging'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'wrangler deploy --env staging',
      cwd: projectRoot,
    },
  };

  targets['deploy:production'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'wrangler deploy --env production',
      cwd: projectRoot,
    },
  };
}
function addLogsTargets(
  targets: Record<string, TargetConfiguration>,

  projectRoot: string,
) {
  // Logs targets
  targets['logs'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'wrangler tail',
      cwd: projectRoot,
    },
  };

  targets['logs:staging'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'wrangler tail --env staging',
      cwd: projectRoot,
    },
  };

  targets['logs:production'] = {
    executor: 'nx:run-commands',
    options: {
      command: 'wrangler tail --env production',
      cwd: projectRoot,
    },
  };
}

function addTypeGenerationTargets(
  targets: Record<string, TargetConfiguration>,
  projectRoot: string,
  context: CreateNodesContextV2,
  pluginOptions: CloudflarePluginOptions,
  dependencies: string[],
  allWorkers: WorkerManifest,
  workspaceVars: string,
  projectVars: string,
) {
  // Build config paths for service bindings
  const boundServiceConfigPaths: string[] = [];
  for (const dep of dependencies) {
    if (allWorkers[dep]) {
      boundServiceConfigPaths.push(allWorkers[dep]);
    }
  }

  const configPaths =
    '-c ./wrangler.jsonc ' +
    boundServiceConfigPaths.map((path) => `-c ${join(context.workspaceRoot, path)}`).join(' ');

  // Generate environment types (includes service bindings)
  const envTypesCmd = `wrangler types worker-env.d.ts --include-runtime=false ${configPaths} ${workspaceVars} ${projectVars}`;

  targets['types:env'] = {
    executor: 'nx:run-commands',
    options: {
      command: envTypesCmd,
      cwd: projectRoot,
    },
    outputs: ['{projectRoot}/worker-env.d.ts'],
    cache: true,
  };

  // Generate runtime types (once at workspace root)
  const runtimeTypesFullPath = join(context.workspaceRoot, pluginOptions.runtimeTypesPath!);
  const hasRuntimeTypes = existsSync(runtimeTypesFullPath);
  const typeGenCmd = `wrangler types ${runtimeTypesFullPath} --include-env false`;

  targets['types:runtime'] = {
    executor: 'nx:run-commands',
    options: {
      command: hasRuntimeTypes
        ? typeGenCmd
        : `mkdir -p ${dirname(runtimeTypesFullPath)} && ${typeGenCmd}`,
      cwd: projectRoot,
    },
    outputs: [`{workspaceRoot}/${pluginOptions.runtimeTypesPath}`],
    cache: true,
  };

  // Convenience target to generate all types
  targets['types'] = {
    executor: 'nx:run-commands',
    options: {
      commands: [],
      cwd: projectRoot,
    },
    dependsOn: ['types:env', 'types:runtime'],
  };
}

function hasKVBindings(config: any): boolean {
  return !!config?.kv_namespaces?.length;
}

function hasD1Bindings(config: any): boolean {
  return !!config?.d1_databases?.length;
}

export default createNodesV2;

//   if (wranglerConfig.main) {
//     // Dev target
//     targets['wrangler-dev'] = {
//       executor: 'nx:run-commands',
//       options: {
//         command: `wrangler dev --persist-to ${persistToPath} ${workspaceVars} ${projectVars}`,
//         cwd: projectRoot,
//       },
//     };
//     // Deploy target
//     targets['wrangler-deploy'] = {
//       executor: 'nx:run-commands',
//       options: {
//         commands: ['wrangler deploy'],
//         cwd: projectRoot,
//       },
//     };

//     // Deploy with environment
//     targets['worker-deploy:staging'] = {
//       executor: 'nx:run-commands',
//       options: {
//         command: 'wrangler deploy --env staging',
//         cwd: projectRoot,
//       },
//     };

//     targets['worker-deploy:production'] = {
//       executor: 'nx:run-commands',
//       options: {
//         command: 'wrangler deploy --env production',
//         cwd: projectRoot,
//       },
//     };
//     // Tail logs target
//     targets['worker-logs'] = {
//       executor: 'nx:run-commands',
//       options: {
//         command: 'wrangler tail',
//         cwd: projectRoot,
//       },
//     };

//     // Logs with environment
//     targets['worker-logs:staging'] = {
//       executor: 'nx:run-commands',
//       options: {
//         command: 'wrangler tail --env staging',
//         cwd: projectRoot,
//       },
//     };

//     targets['worker-logs:production'] = {
//       executor: 'nx:run-commands',
//       options: {
//         command: 'wrangler tail --env production',
//         cwd: projectRoot,
//       },
//     };
//   }
//   // Type generation target
//   if (pluginOptions.generateTypes) {
//     const boundServiceConfigPaths = [];
//     for (const dep of dependencies) {
//       if (allWorkers[dep]) {
//         boundServiceConfigPaths.push(allWorkers[dep]);
//       }
//     }
//     const configPaths =
//       '-c ./wrangler.jsonc ' +
//       boundServiceConfigPaths.map((path) => `-c ${context.workspaceRoot + '/' + path}`).join(' ');

//     const envTypesCmd = `wrangler types worker-env.d.ts --include-runtime=false ${configPaths} ${workspaceVars} ${projectVars} `;

//     targets['wrangler:types:env'] = {
//       executor: 'nx:run-commands',
//       options: {
//         commands: [envTypesCmd],
//         cwd: projectRoot,
//       },
//     };

//     const runtimeTypesFullPath = join(context.workspaceRoot, pluginOptions.runtimeTypesPath!);
//     const hasRuntimeTypes = existsSync(runtimeTypesFullPath);

//     const typeGenCmd = `wrangler types ${runtimeTypesFullPath} --include-env false`;
//     // Generate runtime types (only once, at root)
//     targets['wrangler:types:runtime'] = {
//       executor: 'nx:run-commands',
//       options: {
//         commands: [
//           !hasRuntimeTypes
//             ? `mkdir -p ${dirname(runtimeTypesFullPath)} && ${typeGenCmd}`
//             : typeGenCmd,
//         ],
//         cwd: projectRoot,
//       },
//     };
//   }

//   // KV operations (if applicable)
//   if (hasKVBindings(wranglerConfig)) {
//     targets['cloudflare-kv:list'] = {
//       executor: 'nx:run-commands',
//       options: {
//         command: 'wrangler kv:namespace list',
//         cwd: projectRoot,
//       },
//     };
//   }

//   // D1 operations (if applicable)
//   if (hasD1Bindings(wranglerConfig)) {
//     targets['cloudflare-d1:list'] = {
//       executor: 'nx:run-commands',
//       options: {
//         command: 'wrangler d1 list',
//         cwd: projectRoot,
//       },
//     };
//   }

//   return {
//     projects: {
//       [projectRoot]: {
//         targets,
//       },
//     },
//   };
// }

// // Helper to check for KV bindings
// function hasKVBindings(config: any): boolean {
//   return !!config?.kv_namespaces?.length;
// }

// // Helper to check for D1 bindings
// function hasD1Bindings(config: any): boolean {
//   return !!config?.d1_databases?.length;
// }

// export default createNodesV2;
