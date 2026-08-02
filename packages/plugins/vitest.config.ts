import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Plugins test configuration. Inherits the repository Definition-of-Done coverage
 * floor (Rule 6) and measures coverage over the modules that carry runtime logic.
 * The barrel (`index`) and the type-only `manifest`/`plugin`/`context`/`source`
 * modules have no executable statements.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        include: ['src/compatibility.ts', 'src/lifecycle.ts', 'src/host.ts'],
      },
    },
  }),
);
