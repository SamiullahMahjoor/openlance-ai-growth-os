/**
 * Operations test configuration. Inherits the repository coverage policy (Rule 6 / ADR-0015, and ADR-0022
 * for domain-model namespaces): every executable module under `src` is measured at 100%. The operations
 * modules are immutable classifications plus two pure ordering predicates (the operations-lifecycle-phase and
 * health-state orderings); all are measured in full, and there is no pure-data-only module to exclude.
 */
export { default } from '../../../vitest.config';
