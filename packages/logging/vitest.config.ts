import { defineConfig, mergeConfig } from 'vitest/config';

import base from '../../vitest.config';

/**
 * Logging test configuration. Inherits the repository coverage policy (Rule 6 /
 * ADR-0015): all of `src` is measured at 100%. `record` and `sink` are type-only
 * modules (the `LogRecord` and `LogSink` interfaces, no emitted statements) and are
 * excluded. Every module with runtime logic is covered.
 */
export default mergeConfig(
  base,
  defineConfig({
    test: {
      coverage: {
        exclude: ['src/record.ts', 'src/sink.ts'],
      },
    },
  }),
);
