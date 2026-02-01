// eslint.config.js

//ESLint boundary
//flat config file that defines restricted zones and other rules for the monorepo
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
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