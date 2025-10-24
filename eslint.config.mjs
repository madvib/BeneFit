import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import custom from "./eslint/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseConfig = [
  { name: "js", ...js.configs.recommended },
  tseslint.configs.recommended,
  { name: "prettier", ...prettier },
];

const eslintConfig = defineConfig([
  ...baseConfig,
  custom.configs.recommended("web", "apps/web", __dirname),
]);

export default eslintConfig;
