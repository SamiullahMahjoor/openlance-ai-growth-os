import { bench, describe } from 'vitest';

import { phaseAtOrAfter, usableInPhase } from '../src/index';

/**
 * Observational micro-baselines for the provider lifecycle predicates (Engineering Rule 5, ADR-0022).
 * Measurement only: these run outside `src`, never on a runtime path, and never change behavior.
 * Recorded results live in benchmarks/baseline.md. The other provider concerns are immutable
 * definitions with no executable predicate to benchmark.
 */
describe('providers predicates', () => {
  bench('phaseAtOrAfter', () => {
    phaseAtOrAfter('operation', 'registration');
  });

  bench('usableInPhase', () => {
    usableInPhase('operation');
  });
});
