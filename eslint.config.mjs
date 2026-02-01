// eslint.config.mjs

//ESLint boundary
//flat config file that defines restricted zones and other rules for the monorepo
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default [// Don’t lint generated output or app code from the repo root
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/.turbo/**",
      "**/coverage/**",
      "apps/**",
      "**/*.d.ts",
      "**/.eslintrc.*",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Boundary enforcement: packages must not import from apps
  {
    files: ["packages/**/*.{js,jsx,ts,tsx}"],
    plugins: { import: importPlugin },
    rules: {
      // Prevent deep imports across package boundaries (optional)
      // "import/no-internal-modules": ["error", { allow: ["@kit/**", "@ui/**"] }],

      // Hard boundary: packages must never import from apps
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            { target: "./packages", from: "./apps" } // packages cannot import apps/*
          ]
        }
      ]
    }
  }
];