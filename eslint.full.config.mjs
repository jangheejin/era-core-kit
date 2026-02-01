// eslint.full.config.mjs

// Full ESLint config for "full lint" runs across package source files
// scoped to packages/**/src/**, ignoring apps/** + dist/**
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

const PKG_TS = ["packages/**/src/**/*.{ts,tsx}"];
const PKG_JS = ["packages/**/src/**/*.{js,jsx}"];
const PKG_ALL = ["packages/**/src/**/*.{ts,tsx,js,jsx}"];

export default [
  // 1) Global ignores so full lint doesn't explode on generated output / app code
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.d.ts",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/.turbo/**",
      "**/coverage/**",
      "apps/**",
      "**/.eslintrc.*",
    ],
  },

  // 2) JS recommended, but ONLY for package JS source files
  {
    ...js.configs.recommended,
    files: PKG_JS,
    languageOptions: {
      // prevents noisy "console is not defined" / "URL is not defined" errors in js files
      globals: {
        console: "readonly",
        URL: "readonly",
        crypto: "readonly",
      },
    },
  },

  // 3) TS recommended, but ONLY for package TS source files
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: PKG_TS,
  })),

  // 4) Boundary rule: packages must never import from apps/*
  {
    files: PKG_ALL,
    plugins: { import: importPlugin },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [{ target: "./packages", from: "./apps" }],
        },
      ],
    },
  },

  // 5) (Optional) soften the most annoying rules while refactoring
  // Uncomment to get "full lint" to be informative without blocking.
  /*
  {
    files: PKG_ALL,
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  */
];
