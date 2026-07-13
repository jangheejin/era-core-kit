// Flat config for ESLint 8.57 replacing .eslintrc.cjs.
// eslint-config-next 14 only ships eslintrc-style configs, so they are
// translated via FlatCompat. @eslint/eslintrc and @eslint/js are dependencies
// of eslint itself and are not hoisted by this workspace's .npmrc, so they are
// resolved through eslint's own module tree instead of a direct import.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const eslintRequire = createRequire(require.resolve("eslint"));
const { FlatCompat } = eslintRequire("@eslint/eslintrc");
const js = eslintRequire("@eslint/js");

const baseDirectory = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory,
  // Plugins referenced by the extended configs (react, react-hooks,
  // @next/next, @typescript-eslint, ...) are dependencies of
  // eslint-config-next, not of this package.
  resolvePluginsRelativeTo: path.dirname(
    require.resolve("eslint-config-next/package.json"),
  ),
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "__archive__/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
];

export default eslintConfig;
