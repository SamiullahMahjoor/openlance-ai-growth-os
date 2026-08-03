import { bench, describe } from 'vitest';

import {
  executionPhaseAtOrAfter,
  sessionPhaseAtOrAfter,
  transitionAllowed,
  validationStageAtOrAfter,
  workflowStepAtOrAfter,
} from '../src/index';

/**
 * Observational micro-baselines for the runtime predicates (Engineering Rule 5, ADR-0022). Measurement only:
 * these run outside `src`, never on a runtime path, and never change behavior. Recorded results live in
 * benchmarks/baseline.md. The runtime namespace's five pure deterministic algorithms are the execution
 * state-transition relation and the four orderings; the other concerns are immutable definitions with no
 * executable predicate to benchmark.
 */
describe('runtime predicates', () => {
  bench('transitionAllowed', () => {
    transitionAllowed('executing', 'recovering');
  });

  bench('executionPhaseAtOrAfter', () => {
    executionPhaseAtOrAfter('finalization', 'initialization');
  });

  bench('sessionPhaseAtOrAfter', () => {
    sessionPhaseAtOrAfter('closure', 'establishment');
  });

  bench('workflowStepAtOrAfter', () => {
    workflowStepAtOrAfter('finalize-session', 'initialize');
  });

  bench('validationStageAtOrAfter', () => {
    validationStageAtOrAfter('policy-validation', 'constitutional-validation');
  });
});
