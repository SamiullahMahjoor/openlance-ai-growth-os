import { bench, describe } from 'vitest';

import { DomainError, fromThrowable, InfrastructureError, ValidationError } from '../src/index';

/**
 * Observational micro-baselines for the error primitives (Engineering Rule 5).
 * Measurement only: these run outside `src`, never on a runtime path, and never
 * change behavior. Recorded results live in benchmarks/baseline.md.
 */
const wrap = (error: unknown): InfrastructureError =>
  new InfrastructureError('I.WRAPPED', 'failed', {}, error);

describe('errors primitives', () => {
  bench('construct DomainError', () => {
    new DomainError('D.X', 'message', { a: 1 });
  });

  bench('construct ValidationError', () => {
    new ValidationError('V.X', 'invalid', [{ path: 'a', message: 'bad' }]);
  });

  const sample = new DomainError('D.X', 'message', { a: 1 });
  bench('BaseError.toJSON', () => {
    sample.toJSON();
  });

  bench('fromThrowable (return path)', () => {
    fromThrowable(() => 1, wrap);
  });

  bench('fromThrowable (throw path)', () => {
    fromThrowable(() => {
      throw new Error('boom');
    }, wrap);
  });
});
