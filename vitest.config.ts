import { defineConfig } from 'vitest/config';

/**
 * Shared Vitest base configuration for the OpenLance AIOS monorepo.
 *
 * Per-package configs extend this. `passWithNoTests` keeps foundation and tooling
 * packages green before they carry tests.
 *
 * Coverage policy (Rule 6 / ADR-0015): every runtime source file under `src` is
 * measured automatically, so a new module participates in the gate the moment it is
 * added, with no per-package allowlist to keep in sync. The only exclusions are the
 * public barrel (`src/index.ts`, re-exports with no executable statements) and test
 * files. A package that owns a genuinely type-only module (interfaces/types with no
 * emitted statements) may add it to `coverage.exclude` in its own config, with a
 * comment naming why. Thresholds are 100 across the board.
 */
export default defineConfig({
  test: {
    passWithNoTests: true,
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      all: true,
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/**/*.test.ts', 'src/**/*.d.ts'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
