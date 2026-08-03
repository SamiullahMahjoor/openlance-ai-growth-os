import { bench, describe } from 'vitest';

import { retrievalPhaseAtOrAfter, retrievalStepAtOrAfter } from '../src/index';

/**
 * Observational micro-baselines for the retrieval ordering predicates (Engineering Rule 5, ADR-0022).
 * Measurement only: these run outside `src`, never on a runtime path, and never change behavior.
 * Recorded results live in benchmarks/baseline.md. The other retrieval concerns are immutable
 * definitions with no executable predicate to benchmark.
 */
describe('retrieval predicates', () => {
  bench('retrievalPhaseAtOrAfter', () => {
    retrievalPhaseAtOrAfter('result', 'request');
  });

  bench('retrievalStepAtOrAfter', () => {
    retrievalStepAtOrAfter('assemble', 'discover');
  });
});
