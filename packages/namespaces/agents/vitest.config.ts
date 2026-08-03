/**
 * Agents test configuration. Inherits the repository coverage policy (Rule 6 / ADR-0015, and ADR-0022 for
 * domain-model namespaces): every executable module under `src` is measured at 100%. The agent modules are
 * immutable classifications plus one pure ordering predicate (the lifecycle-phase ordering); all are
 * measured in full, and there is no pure-data-only module to exclude.
 */
export { default } from '../../../vitest.config';
