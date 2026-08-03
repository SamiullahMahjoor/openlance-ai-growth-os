import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Events test configuration. Inherits the repository coverage policy (Rule 6 /
 * ADR-0015): all of `src` is measured at 100%. `subscription` is a type-only module
 * (the `Subscription` type alias, no emitted statements) and is excluded. Every module
 * with runtime logic is covered.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        exclude: ['src/subscription.ts'],
      },
    },
  }),
);
