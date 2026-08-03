/**
 * Runtime test configuration. Inherits the repository coverage policy (Rule 6 / ADR-0015, and ADR-0022 for
 * domain-model namespaces): every executable module under `src` is measured at 100%. The runtime modules are
 * immutable classifications plus five pure deterministic algorithms (the execution state-transition relation
 * and the execution-lifecycle, session-lifecycle, workflow-step, and validation-stage orderings); all are
 * measured in full, and there is no pure-data-only module to exclude.
 */
export { default } from '../../../vitest.config';
