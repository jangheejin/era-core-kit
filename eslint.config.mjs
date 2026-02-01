// eslint.config.mjs

//ESLint boundary
//flat config file that defines restricted zones and other rules for the monorepo
// THIS IS ONLY GOOD FOR PHASE 1 OF THE REFACTOR, just to enforce boundaries
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

  // Boundary enforcement: packages must not import from apps
  {
    // Only lint package source files
    files: ["packages/**/src/**/*.{ts,tsx,js,jsx}"],

    // Critical: TS parser so ESLint can parse .ts/.tsx without dragging in ts rules
    languageOptions: {
      parser: tseslint.parser,
    },

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