import { bench, describe } from 'vitest';

import { higherTrust, requiredOversight } from '../src/index';

/**
 * Observational micro-baselines for the governance predicates (Engineering Rule 5, ADR-0022).
 * Measurement only: these run outside `src`, never on a runtime path, and never change behavior.
 * Recorded results live in benchmarks/baseline.md.
 */
describe('governance predicates', () => {
  bench('requiredOversight', () => {
    requiredOversight('critical');
  });

  bench('higherTrust', () => {
    higherTrust('low', 'critical');
  });
});
