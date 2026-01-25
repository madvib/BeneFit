import { fileURLToPath } from 'node:url';
import path from 'node:path';

import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-themes', '@storybook/addon-essentials', 'msw-storybook-addon'],
  framework: {
    name: getAbsolutePath('@storybook/nextjs-vite'),
    options: {},
  },
  staticDirs: ['../public']
};

function getAbsolutePath(value: string): string {
  return path.dirname(fileURLToPath(import.meta.resolve(`${ value }/package.json`)));
}

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
