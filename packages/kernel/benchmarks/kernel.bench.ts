import { bench, describe } from 'vitest';

import {
  andThen,
  brand,
  err,
  fromNullable,
  map,
  mapOption,
  ok,
  some,
  SystemClock,
  unwrapOr,
} from '../src/index';

/**
 * Observational micro-baselines for the kernel primitives (Engineering Rule 5).
 * Measurement only: these run outside `src`, never on a runtime path, and never
 * change behavior. Recorded results live in benchmarks/baseline.md. The shared
 * bench harness (subsystem 09) will later absorb these definitions.
 */
describe('kernel primitives', () => {
  bench('Result.map over ok', () => {
    map(ok(1), (n) => n + 1);
  });

  bench('Result.andThen over ok', () => {
    andThen(ok(1), (n) => ok(n + 1));
  });

  bench('Result.unwrapOr over err', () => {
    unwrapOr(err('e'), 0);
  });

  bench('Option.mapOption over some', () => {
    mapOption(some(1), (n) => n + 1);
  });

  bench('Option.fromNullable', () => {
    fromNullable(1);
  });

  bench('brand', () => {
    brand<string, 'Sku'>('ABC-123');
  });

  const clock = new SystemClock();
  bench('SystemClock.now', () => {
    clock.now();
  });
});
