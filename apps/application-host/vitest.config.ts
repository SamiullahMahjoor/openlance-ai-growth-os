import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Application-host test configuration. Inherits the repository coverage policy (Rule 6 / ADR-0015): every runtime source
 * file under `src` is measured at 100%. `src/index.ts` is the barrel; every other module carries executable behavior and
 * is measured in full.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        exclude: ['src/index.ts', 'src/**/*.test.ts', 'src/**/*.d.ts'],
      },
    },
  }),
);
