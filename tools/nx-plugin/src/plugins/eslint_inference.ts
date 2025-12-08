import { CreateNodesV2, TargetConfiguration, createNodesFromFiles } from '@nx/devkit';
import { dirname } from 'node:path';

export const createNodesV2: CreateNodesV2 = [
  '**/package.json',
  async (configFiles, options, context) => {
    return await createNodesFromFiles(
      (configFile, options, context) => createNodesInternal(configFile),
      configFiles,
      {},
      context,
    );
  },
];

// For backwards compatibility
export const createNodes = createNodesV2;

async function createNodesInternal(configFilePath: string) {
  const projectRoot = dirname(configFilePath);

  // Skip root package.json and node_modules
  if (
    projectRoot === '.' ||
    projectRoot === '' ||
    configFilePath.includes('node_modules')
  ) {
    return {};
  }
  const targets: Record<string, TargetConfiguration> = {
    lint: { executor: '@nx/eslint:lint' },
  };

  return {
    projects: {
      [projectRoot]: {
        targets,
      },
    },
  };
}
