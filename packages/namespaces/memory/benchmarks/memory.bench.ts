import { bench, describe } from 'vitest';

import { lifecyclePhaseAtOrAfter, retentionAtLeast, workflowStepAtOrAfter } from '../src/index';

/**
 * Observational micro-baselines for the memory ordering predicates (Engineering Rule 5, ADR-0022).
 * Measurement only: these run outside `src`, never on a runtime path, and never change behavior.
 * Recorded results live in benchmarks/baseline.md. The other memory concerns are immutable definitions
 * with no executable predicate to benchmark.
 */
describe('memory predicates', () => {
  bench('lifecyclePhaseAtOrAfter', () => {
    lifecyclePhaseAtOrAfter('removal', 'formation');
  });

  bench('workflowStepAtOrAfter', () => {
    workflowStepAtOrAfter('retain', 'receive');
  });

  bench('retentionAtLeast', () => {
    retentionAtLeast('permanent', 'temporary');
  });
});
