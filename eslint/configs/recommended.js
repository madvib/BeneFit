import nextVitals from "eslint-config-next/core-web-vitals";
import sonarjs from "eslint-plugin-sonarjs";
import vitest from "eslint-plugin-vitest";
import security from "eslint-plugin-security";
import unicorn from "eslint-plugin-unicorn";
import testing_library from "eslint-plugin-testing-library";
import boundaries from "eslint-plugin-boundaries";
import custom from "../index.js";

import { resolve } from "node:path";
import { globalIgnores } from "eslint/config";

export const recommended = (name, projectDir, rootDir) => [
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/next-env.d.ts",
    "**/cloudflare-env.d.ts",
    "**/.open-next/**",
  ]),
  {
    name,
    files: [`${projectDir}/**/*.{ts,tsx,js,jsx,mjs}`],
    ignores: ["cloudflare-env.d.ts", "**/.open-next/**"],
    extends: [nextVitals],
    plugins: {
      security,
      sonarjs,
      unicorn,
      "testing-library": testing_library,
      vitest,
      boundaries,
      custom,
    },
    settings: {
      next: {
        rootDir: projectDir,
      },
      "boundaries/root-path": resolve(rootDir, projectDir),
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**/*", mode: "full" },
        {
          type: "services",
          pattern: "src/services/*",
          mode: "full",
        },
        {
          type: "infrastructure",
          pattern: "src/infrastructure/*",
          mode: "full",
        },
        { type: "domain", pattern: "src/domain/*", mode: "full" },
        {
          type: "controllers",
          pattern: "src/controllers/*",
          mode: "full",
        },
        {
          type: "presentation",
          pattern: "src/presentation/**/*",
          mode: "full",
        },
        { type: "shared", pattern: "src/shared/*", mode: "full" },
      ],
    },
    rules: {
      ...unicorn.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,
      ...security.configs.recommended.rules,
      ...testing_library.configs["flat/react"].rules,
      ...vitest.configs.recommended.rules,
      "custom/require-colocated-tests": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "boundaries/element-types": [
        2,
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["presentation", "services", "app"] },
            {
              from: "controllers",
              allow: ["services", "shared", "controllers"],
            },
            {
              from: "presentation",
              allow: ["controllers", "shared", "services", "presentation"],
            },
            {
              from: "services",
              allow: ["infrastructure", "domain", "shared", "services"],
            },
            { from: "infrastructure", allow: ["domain", "infrastructure"] },
            { from: "domain", allow: ["shared", "domain"] },
          ],
        },
      ],
      "@next/next/no-img-element": "off",
    },
  },
];
