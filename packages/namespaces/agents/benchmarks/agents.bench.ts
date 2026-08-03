import { bench, describe } from 'vitest';

import { agentPhaseAtOrAfter } from '../src/index';

/**
 * Observational micro-baseline for the agent ordering predicate (Engineering Rule 5, ADR-0022). Measurement
 * only: it runs outside `src`, never on a runtime path, and never changes behavior. Recorded results live in
 * benchmarks/baseline.md. The agents namespace's one pure predicate is the lifecycle-phase ordering; the
 * other concerns are immutable definitions with no executable predicate to benchmark.
 */
describe('agent predicates', () => {
  bench('agentPhaseAtOrAfter', () => {
    agentPhaseAtOrAfter('retirement', 'registration');
  });
});
