import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  assetsInclude: ['**/*.sql'],
  test: {
    poolOptions: {
      workers: {
        wrangler: {
          configPath: './wrangler.jsonc',
        },
        miniflare: {
          serviceBindings: {
            // Mock service bindings to avoid socket errors
            async AI_SERVICE() {
              return new Response(
                JSON.stringify({ error: 'AI service not available in tests' }),
                {
                  status: 503,
                },
              );
            },
            async EVENT_BUS() {
              return new Response(null, { status: 204 });
            },
          },
        },
      },
    },
  },
});
