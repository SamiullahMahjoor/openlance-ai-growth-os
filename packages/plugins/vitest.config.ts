import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Plugins test configuration. Inherits the repository coverage policy (Rule 6 /
 * ADR-0015): all of `src` is measured at 100%. `context`, `manifest`, `plugin`, and
 * `source` are type-only modules (public interfaces with no emitted statements) and
 * are excluded. Every module with runtime logic is covered.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        exclude: ['src/context.ts', 'src/manifest.ts', 'src/plugin.ts', 'src/source.ts'],
      },
    },
  }),
);
