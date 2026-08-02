import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Config test configuration. Inherits the repository Definition-of-Done coverage
 * floor (Rule 6) and measures coverage over the modules that carry runtime logic.
 * The barrel (`index`) and the type-only `schema` module have no executable
 * statements.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        include: [
          'src/provider.ts',
          'src/object-provider.ts',
          'src/env-provider.ts',
          'src/hierarchy.ts',
          'src/service.ts',
          'src/secret.ts',
        ],
      },
    },
  }),
);
