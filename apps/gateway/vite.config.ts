import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import viteTsConfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  envDir: '../../',
  server: { cors: false, port: 8787 },
  plugins: [
    cloudflare({
      auxiliaryWorkers: [
        {
          configPath: '../actors/user-hub/wrangler.jsonc',
        },
        {
          configPath: '../actors/workout-session/wrangler.jsonc',
        },
      ],
      persistState: { path: '../../.wrangler/state' },
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
  optimizeDeps: {
    // Don't pre-bundle these - let them be bundled normally
    exclude: ['cloudflare:*', '@bene/*'],
    // Force these to be pre-bundled
    include: ['better-auth', 'drizzle-orm', 'hono', 'zod'],
    noDiscovery: true,
  },
});
