import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Content-intelligence test configuration. Inherits the repository coverage policy (Rule 6 / ADR-0015): every runtime
 * source file under `src` is measured at 100%. `src/types.ts` is a genuinely type-only module (interfaces and type
 * aliases with no emitted statements), excluded per the root policy; every other module carries executable behavior.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        exclude: ['src/index.ts', 'src/**/*.test.ts', 'src/**/*.d.ts', 'src/types.ts'],
      },
    },
  }),
);
