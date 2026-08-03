import { bench, describe } from 'vitest';

import { healthStateAtOrAfter, operationsPhaseAtOrAfter } from '../src/index';

/**
 * Observational micro-baselines for the operations predicates (Engineering Rule 5, ADR-0022). Measurement
 * only: these run outside `src`, never on an operational path, and never change behavior. Recorded results
 * live in benchmarks/baseline.md. The operations namespace's two pure deterministic algorithms are the
 * operations-lifecycle-phase ordering and the health-state ordering; the other concerns are immutable
 * definitions with no executable predicate to benchmark.
 */
describe('operations predicates', () => {
  bench('operationsPhaseAtOrAfter', () => {
    operationsPhaseAtOrAfter('retirement', 'startup');
  });

  bench('healthStateAtOrAfter', () => {
    healthStateAtOrAfter('failed', 'healthy');
  });
});
