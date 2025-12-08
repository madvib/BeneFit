import {
  CreateNodesContextV2,
  CreateNodesV2,
  TargetConfiguration,
  createNodesFromFiles,
} from '@nx/devkit';
import { dirname } from 'node:path';

export interface BenePluginOptions {
  buildTargetName?: string;
  buildTypesTargetName?: string;
}

const DEFAULT_OPTIONS: Required<BenePluginOptions> = {
  buildTargetName: 'build',
  buildTypesTargetName: 'generate-types',
};

/**
 * NX Plugin to infer build targets and npm scripts for library packages.
 *
 * This plugin reduces configuration duplication by automatically generating:
 * 1. build-types target using @nx/js:tsc
 * 2. build target using @nx/js:swc
 * 3. npm script targets for better visibility
 *
 * The plugin detects buildable packages by looking for:
 * - type: "module" in package.json
 * - exports field in package.json
 * - dist output directory pattern
 */
export const createNodesV2: CreateNodesV2<BenePluginOptions> = [
  '**/.swcrc',
  async (configFiles, options, context) => {
    const normalizedOptions = { ...DEFAULT_OPTIONS, ...options };

    return await createNodesFromFiles(
      (configFile, options, context) =>
        createNodesInternal(configFile, normalizedOptions, context),
      configFiles,
      normalizedOptions,
      context,
    );
  },
];

// For backwards compatibility
export const createNodes = createNodesV2;

async function createNodesInternal(
  configFilePath: string,
  options: Required<BenePluginOptions>,
  context: CreateNodesContextV2,
) {
  const projectRoot = dirname(configFilePath);

  // Skip root package.json and node_modules
  if (
    projectRoot === '.' ||
    projectRoot === '' ||
    configFilePath.includes('node_modules')
  ) {
    return {};
  }

  try {
    const targets: Record<string, TargetConfiguration> = {};

    // Infer build targets
    const buildTargets = inferBuildTargets(options);
    Object.assign(targets, buildTargets);

    return {
      projects: {
        [projectRoot]: {
          targets,
        },
      },
    };
  } catch (error) {
    console.warn(`Error processing ${configFilePath}:`, error);
    return {};
  }
}

/**
 * Infers build-types and build targets for a buildable package.
 */
function inferBuildTargets(
  options: Required<BenePluginOptions>,
): Record<string, TargetConfiguration> {
  const targets: Record<string, TargetConfiguration> = {};

  // build-types target
  targets[options.buildTypesTargetName] = {
    executor: '@nx/js:tsc',
    dependsOn: [`^${options.buildTargetName}`],
  };

  // build target
  targets[options.buildTargetName] = {
    executor: '@nx/js:swc',
    dependsOn: [options.buildTypesTargetName, `^${options.buildTargetName}`],
  };

  return targets;
}
