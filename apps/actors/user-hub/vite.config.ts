import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => ({
  envDir: '../../../',
  plugins: mode === 'test' ? [viteTsConfigPaths()] : [
    cloudflare({
      persistState: { path: '../../../.wrangler/state' },
    }),
    viteTsConfigPaths(),
    {
      name: 'sql-loader',
      transform(code, id) {
        if (/[.]sql/i.test(id)) {
          return `export default ${ JSON.stringify(code) }`;
        }
        return {
          code,
          map: null,
        };
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['cloudflare:*', '@bene/*'],
    include: ['agents', 'drizzle-orm'],
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
}));
