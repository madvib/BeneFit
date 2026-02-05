import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import custom from './tools/eslint/index.js';

const baseConfig = [
  { name: 'js', ...js.configs.recommended },
  tseslint.configs.recommended,
  { name: 'prettier', ...prettier },
];

const eslintConfig = defineConfig([
  ...baseConfig,
  custom.configs.recommended('web', 'apps/web'),
]);

export default eslintConfig;
