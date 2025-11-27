import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

import { fileURLToPath } from 'url'; // Required for ES Module compatibility

// Define a helper for __dirname in ES module context
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    setupFiles: ['./test/setup.ts'],
    globals: true,
  },
});
