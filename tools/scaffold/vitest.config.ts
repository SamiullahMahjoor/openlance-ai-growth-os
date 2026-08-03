import { defineConfig } from 'vitest/config';

/**
 * Test configuration for the scaffold golden-file test. This package ships templates
 * and generators (no runtime source), so coverage is not measured here; the test
 * shells out to plop, tsc, and dependency-cruiser, so the timeout is generous.
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
});
