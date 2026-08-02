import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Shared ESLint flat config for the OpenLance AIOS implementation.
 *
 * Enforces (Engineering Rules 1 and the determinism seams):
 *  - strict TypeScript style,
 *  - no ambient Date.now / Math.random / process.env outside sanctioned edges,
 *  - no deep imports into another package's internals (barrels only).
 *
 * Type checking of source is performed by `tsc` (the typecheck task), so ESLint
 * uses syntactic and stylistic rules here; per-package type-checked rules may be
 * layered on in later stages where a package tsconfig exists.
 */
export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/node_modules/**',
      '**/docs-api/**',
    ],
  },
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-restricted-properties': [
        'error',
        {
          object: 'Date',
          property: 'now',
          message: 'Use the injected Clock from @openlance/aios-kernel (determinism seam).',
        },
        {
          object: 'Math',
          property: 'random',
          message: 'Use the injected IdGenerator or a deterministic source (determinism seam).',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='process'][property.name='env']",
          message: 'Read configuration through @openlance/aios-config, never process.env directly.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@openlance/aios-*/src/*',
            '@openlance/aios-*/dist/internal/*',
            '**/internal/*',
          ],
        },
      ],
    },
  },
  {
    // Sanctioned edges: the only places allowed to touch ambient time / identity / env.
    files: [
      '**/kernel/src/clock.ts',
      '**/kernel/src/id.ts',
      '**/config/src/env-provider.ts',
      '**/config/src/secret.ts',
      '**/testing/src/**',
    ],
    rules: {
      'no-restricted-properties': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    // Config, tooling, and test files run in Node and may use console / env / any.
    files: [
      '**/*.config.{js,mjs,cjs,ts}',
      'tools/**',
      'plopfile.cjs',
      'eslint.config.mjs',
      '**/*.test.ts',
      '**/tests/**',
    ],
    rules: {
      'no-restricted-syntax': 'off',
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
  },
);
