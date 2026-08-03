/**
 * Errors test configuration. Inherits the repository coverage policy (Rule 6 /
 * ADR-0015) unchanged: every runtime module under `src` is measured at 100%. The
 * package has no type-only modules, so there is nothing to exclude beyond the barrel.
 */
export { default } from '../../vitest.config';
