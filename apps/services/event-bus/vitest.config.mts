import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		workers: {
			wrangler: { configPath: './wrangler.jsonc' },
		},
	},
});
