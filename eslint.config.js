import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      // You already have this via reactRefresh.configs.vite, but making it explicit is fine
      "react-refresh": reactRefresh,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs["flat/recommended"], // note: flat/ prefix for flat config
      reactRefresh.configs.vite,
    ],
    rules: {
      // Override / extend the rule from reactRefresh.configs.vite
      "react-refresh/only-export-components": [
        "warn", // or 'error' if you prefer strict
        {
          // Keeps the Vite default (allows const exports like export const something = 42)
          allowConstantExport: true,

          // ← This is the key part: explicitly allow your non-component exports
          allowExportNames: [
            "AuthContext", // the context object
            "useAuth", // the custom hook
            // Add more if you have other similar patterns, e.g. 'useTheme', 'useQueryClient', etc.
          ],
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
