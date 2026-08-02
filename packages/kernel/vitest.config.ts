import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Kernel test configuration. Inherits the repository Definition-of-Done coverage
 * floor (Rule 6) from the root config and narrows coverage measurement to the
 * modules that carry runtime logic. Interface-only modules (`id`, `disposable`)
 * and the barrel (`index`) contain no executable statements and are excluded.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        include: ['src/result.ts', 'src/option.ts', 'src/brand.ts', 'src/types.ts', 'src/clock.ts'],
      },
    },
  }),
);
