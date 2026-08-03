/**
 * Safety test configuration. Inherits the repository coverage policy (Rule 6 / ADR-0015, and ADR-0022
 * for domain-model namespaces): every module under `src` is measured at 100%. The safety modules are
 * immutable definitions and classifications with no executable predicate (the constitution defines no
 * named ordered classification for safety, so there is no grounded predicate to expose), so every
 * module is pure data covered by import; there is nothing to exclude.
 */
export { default } from '../../../vitest.config';
