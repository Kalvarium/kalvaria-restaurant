import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

/**
 * Shared base ESLint (flat) config for Kalvaria packages.
 * Apps with their own framework presets (e.g. Next.js) extend their own config;
 * plain TS packages import this one.
 */
export default tseslint.config(
  {
    ignores: ["dist/**", "build/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);
