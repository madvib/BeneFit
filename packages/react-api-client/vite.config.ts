/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
export default defineConfig(() => ({
  envDir: '../..',
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/react-api-client',
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  define: {
    'import.meta.vitest': 'undefined',
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: '@bene/react-api-client',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es' as const],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: (id) => {
        // Keep your own code
        if (id.startsWith('.') || id.startsWith('/')) return false;

        // Externalize everything from node_modules
        return !id.startsWith('src/');
      },

      output: {
        // Don't mangle names for better debugging
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',

        // Preserve modules for tree-shaking
        preserveModules: true,
        preserveModulesRoot: 'src',

        // Ensure proper exports
        exports: 'named',

        // Better interop
        interop: 'auto',
      },
    },

    // Optimize deps
    minify: false, // Don't minify library code
    sourcemap: true, // Include sourcemaps for debugging
  },
  test: {
    name: '@bene/react-api-client',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    includeSource: ['src/**/*.{ts,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
