import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  envDir: '../../',
  server: { cors: false, port: 8787 },
  resolve: {
    conditions: ['development', 'import', 'module', 'browser', 'default'],
  },
  plugins: [
    nxViteTsPaths(),
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
  ],
});
