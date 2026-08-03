import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Kernel test configuration. Inherits the repository coverage policy (Rule 6 /
 * ADR-0015): all of `src` is measured at 100%. `disposable` and `id` are type-only
 * modules (interfaces with no emitted statements) and are excluded so they do not
 * appear as phantom coverage entries. Every module with runtime logic is covered.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        exclude: ['src/disposable.ts', 'src/id.ts'],
      },
    },
  }),
);
