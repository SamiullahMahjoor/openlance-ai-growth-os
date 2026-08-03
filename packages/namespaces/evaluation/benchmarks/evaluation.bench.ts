import { bench, describe } from 'vitest';

import { evaluationPhaseAtOrAfter, evaluationValidationCheckAtOrAfter } from '../src/index';

/**
 * Observational micro-baselines for the evaluation predicates (Engineering Rule 5, ADR-0022). Measurement
 * only: these run outside `src`, never on an evaluation path, and never change behavior. Recorded results
 * live in benchmarks/baseline.md. The evaluation namespace's two pure deterministic algorithms are the
 * lifecycle-phase ordering and the validation-check ordering; the other concerns are immutable definitions
 * with no executable predicate to benchmark.
 */
describe('evaluation predicates', () => {
  bench('evaluationPhaseAtOrAfter', () => {
    evaluationPhaseAtOrAfter('result', 'framing');
  });

  bench('evaluationValidationCheckAtOrAfter', () => {
    evaluationValidationCheckAtOrAfter('constitutional-validation', 'well-formedness-validation');
  });
});
