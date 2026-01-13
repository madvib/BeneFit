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
    '**/dist/**',
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
      'sonarjs/todo-tag': 'warn',
      ...security.configs.recommended.rules,
      'security/detect-object-injection': 'off',
      ...testing_library.configs['flat/react'].rules,
      ...vitest.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'sonarjs/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
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
              onlyDependOnLibsWithTags: ['layer:core', 'scope:shared'],
            },
            {
              sourceTag: 'layer:infrastructure',
              onlyDependOnLibsWithTags: ['layer:application', 'layer:core', 'layer:shared'],
            },
            {
              sourceTag: 'layer:presentation',
              onlyDependOnLibsWithTags: [
                'layer:application',
                'layer:core',
                'layer:infrastructure',
                'scope:shared',
                'scope:persistence',
              ],
            },
            {
              sourceTag: 'scope:training',
              onlyDependOnLibsWithTags: ['scope:training', 'scope:shared', 'scope:persistence'],
            },

            {
              sourceTag: 'scope:coach',
              onlyDependOnLibsWithTags: [
                'scope:coach',
                'scope:training',
                'scope:shared',
                'scope:persistence',
              ],
            },
            {
              sourceTag: 'scope:integrations',
              onlyDependOnLibsWithTags: [
                'scope:integrations',
                'scope:training',
                'scope:shared',
                'scope:persistence',
              ],
            },
            {
              sourceTag: 'scope:auth',
              onlyDependOnLibsWithTags: ['scope:auth', 'scope:shared'],
            },
            {
              sourceTag: 'scope:blog',
              onlyDependOnLibsWithTags: ['scope:blog', 'scope:shared'],
            },
            {
              sourceTag: 'scope:persistence',
              onlyDependOnLibsWithTags: ['scope:persistence', 'scope:shared'],
            },

            {
              sourceTag: 'slice:vertical',
              onlyDependOnLibsWithTags: ['slice:vertical', 'scope:shared'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['*'],
            },
            {
              sourceTag: 'type:test',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'JSXAttribute[name.name="className"] Literal[value=/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/]',
          message: 'Use typography constants from typography.ts instead',
        },
        {
          selector:
            'JSXAttribute[name.name="className"] Literal[value=/font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/]',
          message: 'Use typography constants from typography.ts instead',
        },
      ],
      '@next/next/no-img-element': 'off',
    },
  },
];
