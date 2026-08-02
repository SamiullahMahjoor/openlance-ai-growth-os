import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * DI test configuration. Inherits the repository Definition-of-Done coverage floor
 * (Rule 6) and measures coverage over the modules that carry runtime logic. The
 * barrel (`index`) and the type-only `registry`/`scope` modules have no executable
 * statements.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        include: ['src/token.ts', 'src/container.ts', 'src/module.ts', 'src/validation.ts'],
      },
    },
  }),
);
