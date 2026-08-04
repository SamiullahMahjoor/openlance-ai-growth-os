import { bench, describe } from 'vitest';

import { deprecationStateAtOrAfter, evolutionPhaseAtOrAfter } from '../src/index';

/**
 * Observational micro-baselines for the evolution predicates (Engineering Rule 5, ADR-0022). Measurement
 * only: these run outside `src`, never on an evolution path, and never change behavior. Recorded results
 * live in benchmarks/baseline.md. The evolution namespace's two pure deterministic algorithms are the
 * evolution-lifecycle-phase ordering and the deprecation-state ordering; the other concerns are immutable
 * definitions with no executable predicate to benchmark.
 */
describe('evolution predicates', () => {
  bench('evolutionPhaseAtOrAfter', () => {
    evolutionPhaseAtOrAfter('retirement', 'proposal');
  });

  bench('deprecationStateAtOrAfter', () => {
    deprecationStateAtOrAfter('retired', 'active');
  });
});
