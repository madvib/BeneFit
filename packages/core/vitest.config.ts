import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    setupFiles: ['./test/setup.ts'],
    globals: true,
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
});
