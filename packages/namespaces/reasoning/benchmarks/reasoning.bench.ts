import { bench, describe } from 'vitest';

import { reasoningPhaseAtOrAfter, reasoningStepAtOrAfter, transitionAllowed } from '../src/index';

/**
 * Observational micro-baselines for the reasoning predicates (Engineering Rule 5, ADR-0022). Measurement
 * only: these run outside `src`, never on a runtime path, and never change behavior. Recorded results
 * live in benchmarks/baseline.md. The reasoning namespace's three pure deterministic algorithms are the
 * stage-transition relation and the two orderings; the other concerns are immutable definitions with no
 * executable predicate to benchmark.
 */
describe('reasoning predicates', () => {
  bench('reasoningPhaseAtOrAfter', () => {
    reasoningPhaseAtOrAfter('validation', 'framing');
  });

  bench('reasoningStepAtOrAfter', () => {
    reasoningStepAtOrAfter('produce-outcome', 'receive-request');
  });

  bench('transitionAllowed', () => {
    transitionAllowed('reasoning', 'concluding');
  });
});
