import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Errors test configuration. Inherits the repository Definition-of-Done coverage
 * floor (Rule 6) from the root config and measures coverage over the modules that
 * carry runtime logic. The barrel (`index`) has no executable statements.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        include: [
          'src/base.ts',
          'src/domain.ts',
          'src/infrastructure.ts',
          'src/validation.ts',
          'src/codes.ts',
          'src/result-interop.ts',
        ],
      },
    },
  }),
);
