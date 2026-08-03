import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * DI test configuration. Inherits the repository coverage policy (Rule 6 / ADR-0015):
 * all of `src` is measured at 100%. `provider`, `registry`, and `scope` are type-only
 * modules (interfaces and type aliases with no emitted statements); they are excluded
 * so they do not appear as phantom entries. Every module with runtime logic is covered.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        exclude: ['src/provider.ts', 'src/registry.ts', 'src/scope.ts'],
      },
    },
  }),
);
