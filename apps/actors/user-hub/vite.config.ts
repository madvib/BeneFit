import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  envDir: '../../../',
  plugins: [
    cloudflare({
      persistState: { path: '../../../.wrangler/state' },
    }),
    viteTsConfigPaths(),
    {
      name: 'sql-loader',
      transform(code, id) {
        if (/[.]sql/i.test(id)) {
          return `export default ${JSON.stringify(code)}`;
        }
        return {
          code,
          map: null,
        };
      },
    },
  ],
  resolve: {
    // Handle @/* paths from your workspace packages
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    // Don't pre-optimize workspace packages - bundle them directly
    exclude: ['cloudflare:*', '@bene/*'],

    // Pre-optimize external deps
    include: ['agents', 'drizzle-orm'],
  },
});
