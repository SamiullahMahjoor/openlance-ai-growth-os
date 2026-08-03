/**
 * dependency-cruiser configuration for the scaffold golden-file test only.
 *
 * It reuses every rule from the repo-root configuration but narrows the exclude so the
 * transient packages/goldenfixture/ package is actually cruised. The root configuration
 * excludes goldenfixture (to keep the whole-repo cruise from racing that transient package
 * during `turbo run test depcruise`); here we want the opposite, so the golden-file test can
 * assert the scaffolded package itself is graph-valid. It adds no rule the root config lacks.
 */
const base = require('../../../.dependency-cruiser.cjs');

module.exports = {
  ...base,
  options: {
    ...base.options,
    exclude: { path: '(^|/)(dist|docs-api|coverage|\\.turbo)/' },
  },
};
