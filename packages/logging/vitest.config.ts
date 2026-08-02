import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Logging test configuration. Inherits the repository Definition-of-Done coverage
 * floor (Rule 6) and measures coverage over the modules that carry runtime logic.
 * The barrel (`index`) and the type-only `record`/`sink` modules have no executable
 * statements.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        include: ['src/level.ts', 'src/context.ts', 'src/redaction.ts', 'src/logger.ts'],
      },
    },
  }),
);
