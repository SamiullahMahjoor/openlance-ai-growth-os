import { bench, describe } from 'vitest';

import { toolPhaseAtOrAfter, toolValidationCheckAtOrAfter } from '../src/index';

/**
 * Observational micro-baselines for the tool ordering predicates (Engineering Rule 5, ADR-0022).
 * Measurement only: these run outside `src`, never on a runtime path, and never change behavior. Recorded
 * results live in benchmarks/baseline.md. The tools namespace's two pure predicates are the lifecycle-phase
 * and validation-check orderings; the other concerns are immutable definitions with no executable predicate
 * to benchmark.
 */
describe('tool predicates', () => {
  bench('toolPhaseAtOrAfter', () => {
    toolPhaseAtOrAfter('retirement', 'registration');
  });

  bench('toolValidationCheckAtOrAfter', () => {
    toolValidationCheckAtOrAfter('compatibility-validation', 'permission-validation');
  });
});
