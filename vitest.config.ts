import { defineConfig } from 'vitest/config';

/**
 * Shared Vitest base configuration for the OpenLance AIOS monorepo.
 *
 * Per-package configs extend this. `passWithNoTests` keeps foundation and
 * tooling packages green before they carry tests. Coverage thresholds are the
 * default Definition-of-Done floor (Rule 6); individual packages may raise them.
 */
export default defineConfig({
  test: {
    passWithNoTests: true,
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});
