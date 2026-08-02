import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Events test configuration. Inherits the repository Definition-of-Done coverage
 * floor (Rule 6) and measures coverage over the modules that carry runtime logic.
 * The barrel (`index`) and the type-only `subscription` module have no executable
 * statements.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        include: ['src/event.ts', 'src/dispatcher.ts', 'src/bus.ts'],
      },
    },
  }),
);
