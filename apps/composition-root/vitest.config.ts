/**
 * Composition-root test configuration. Inherits the repository coverage policy (Rule 6 / ADR-0015): every
 * runtime source file under `src` is measured at 100% (only the barrel and test files are excluded). The
 * composition root has no type-only module to exclude; its public types live alongside the `bootstrap`
 * function they describe, so the whole executable surface is measured in full.
 */
export { default } from '../../vitest.config';
