import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import path from 'path';

const config = defineConfig(async () => {
  // Dynamic import — devtools-vite is a devDependency that may not be hoisted
  const { devtools } = await import('@tanstack/devtools-vite');

  return {
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/apps/web-start',
    server: { port: 3000, cors: false },
    plugins: [
      devtools(),
      cloudflare({
        viteEnvironment: { name: 'ssr' },
        persistState: { path: '../../.wrangler/state' },
        // auxiliaryWorkers: [{ configPath: '../gateway/wrangler.jsonc' }],
      }),
      viteTsConfigPaths(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});

export default config;
