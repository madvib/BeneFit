import nextVitals from 'eslint-config-next/core-web-vitals';
import sonarjs from 'eslint-plugin-sonarjs';
import vitest from 'eslint-plugin-vitest';
import security from 'eslint-plugin-security';
import unicorn from 'eslint-plugin-unicorn';
import testing_library from 'eslint-plugin-testing-library';
import nx from '@nx/eslint-plugin';
import custom from '../index.js';

import { globalIgnores } from 'eslint/config';

export const recommended = (name, projectDir) => [
  globalIgnores([
    '**/.next/**',
    '**/out/**',
    '**/build/**',
    '**/next-env.d.ts',
    '**/cloudflare-env.d.ts',
    '**/.open-next/**',
  ]),
  {
    name,
    files: [`${projectDir}/**/*.{ts,tsx,js,jsx,mjs}`],
    ignores: ['cloudflare-env.d.ts', '**/.open-next/**'],
    extends: [nextVitals],
    plugins: {
      security,
      sonarjs,
      unicorn,
      'testing-library': testing_library,
      vitest,
      '@nx': nx,
      custom,
    },
    settings: {
      next: {
        rootDir: projectDir,
      },
    },
    rules: {
      ...unicorn.configs.unopinionated.rules,
      ...sonarjs.configs.recommended.rules,
      ...security.configs.recommended.rules,
      ...testing_library.configs['flat/react'].rules,
      ...vitest.configs.recommended.rules,
      'custom/require-colocated-tests': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'layer:core',
              onlyDependOnLibsWithTags: ['layer:shared'],
            },
            {
              sourceTag: 'layer:application',
              onlyDependOnLibsWithTags: ['layer:core', 'layer:shared'],
            },
            {
              sourceTag: 'layer:infrastructure',
              onlyDependOnLibsWithTags: [
                'layer:application',
                'layer:core',
                'layer:shared',
              ],
            },
            {
              sourceTag: 'layer:presentation',
              onlyDependOnLibsWithTags: [
                'layer:application',
                'layer:core',
                'layer:infrastructure',
                'layer:shared',
              ],
            },
          ],
        },
      ],

      '@next/next/no-img-element': 'off',
    },
  },
];
