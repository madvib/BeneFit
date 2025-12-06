import {
  CreateNodesContextV2,
  CreateNodesV2,
  TargetConfiguration,
  createNodesFromFiles,
  readJsonFile,
  writeJsonFile,
} from '@nx/devkit';
import { dirname, join, relative } from 'node:path';

export interface BenePluginOptions {
  buildTargetName?: string;
  buildTypesTargetName?: string;
  inferNpmScripts?: boolean;
}

const DEFAULT_OPTIONS: Required<BenePluginOptions> = {
  buildTargetName: 'build',
  buildTypesTargetName: 'build-types',
  inferNpmScripts: true,
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
  '**/package.json',
  async (configFiles, options, context) => {
    const normalizedOptions = { ...DEFAULT_OPTIONS, ...options };

    return await createNodesFromFiles(
      (configFile, options, context) =>
        createNodesInternal(configFile, normalizedOptions, context),
      configFiles,
      normalizedOptions,
      context
    );
  },
];

// For backwards compatibility
export const createNodes = createNodesV2;

async function createNodesInternal(
  configFilePath: string,
  options: Required<BenePluginOptions>,
  context: CreateNodesContextV2
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
    const packageJson = readJsonFile(join(context.workspaceRoot, configFilePath));

    // Only process buildable library packages
    if (!isBuildablePackage(packageJson)) {
      return {};
    }

    const targets: Record<string, TargetConfiguration> = {};

    // Infer build targets
    const buildTargets = inferBuildTargets(projectRoot, packageJson, options);
    Object.assign(targets, buildTargets);

    // Infer npm script targets
    if (options.inferNpmScripts) {
      const npmScriptTargets = inferNpmScriptTargets(packageJson);
      Object.assign(targets, npmScriptTargets);
    }

    return {
      projects: {
        [projectRoot]: {
          targets,
        },
      },
    };
  } catch (error) {
    console.warn(`Error processing ${ configFilePath }:`, error);
    return {};
  }
}

/**
 * Determines if a package should have build targets inferred.
 * A package is buildable if it:
 * - Has type: "module"
 * - Has an exports field
 * - Has a types field or types in exports
 */
function isBuildablePackage(packageJson: any): boolean {
  return (
    packageJson.type === 'module' &&
    packageJson.exports &&
    (packageJson.types || packageJson.exports?.['.']?.types)
  );
}

/**
 * Infers build-types and build targets for a buildable package.
 */
function inferBuildTargets(
  projectRoot: string,
  packageJson: any,
  options: Required<BenePluginOptions>
): Record<string, TargetConfiguration> {
  const targets: Record<string, TargetConfiguration> = {};

  // Infer paths from package.json structure
  const outputPath = `${ projectRoot }/dist`;
  const mainFile = `${ projectRoot }/src/index.ts`;
  const tsConfig = `${ projectRoot }/tsconfig.lib.json`;

  // build-types target
  targets[options.buildTypesTargetName] = {
    executor: '@nx/js:tsc',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath,
      main: mainFile,
      tsConfig,
    },
  };

  // build target
  targets[options.buildTargetName] = {
    executor: '@nx/js:swc',
    dependsOn: [options.buildTypesTargetName],
    outputs: ['{options.outputPath}'],
    options: {
      outputPath,
      main: mainFile,
      tsConfig,
      skipTypeCheck: true,
      stripLeadingPaths: true,
    },
  };

  return targets;
}

/**
 * Infers targets from npm scripts in package.json.
 * This makes implicit npm scripts visible as NX targets.
 */
function inferNpmScriptTargets(packageJson: any): Record<string, TargetConfiguration> {
  const targets: Record<string, TargetConfiguration> = {};
  const scripts = packageJson.scripts || {};

  // Common npm scripts to expose as NX targets
  const scriptsToInfer = ['lint', 'test', 'format', 'clean'];

  for (const scriptName of scriptsToInfer) {
    if (scripts[scriptName]) {
      targets[scriptName] = {
        executor: 'nx:run-commands',
        options: {
          command: `pnpm run ${ scriptName }`,
        },
      };
    }
  }

  return targets;
}
