import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Testing-package test configuration. Inherits the repository Definition-of-Done
 * coverage floor (Rule 6) and measures coverage over the modules that carry runtime
 * logic. The barrel (`index`) has no executable statements.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        include: [
          'src/clocks.ts',
          'src/ids.ts',
          'src/container.ts',
          'src/mocks.ts',
          'src/fakes.ts',
          'src/matchers.ts',
          'src/harness.ts',
        ],
      },
    },
  }),
);
