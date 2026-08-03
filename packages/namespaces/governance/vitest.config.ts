/**
 * Governance test configuration. Inherits the repository coverage policy (Rule 6 / ADR-0015, and
 * ADR-0022 for domain-model namespaces): every executable module under `src` is measured at 100%.
 * `risk` mixes classifications with predicates and is measured in full; there is no pure-data-only
 * module to exclude at this stage.
 */
export { default } from '../../../vitest.config';
