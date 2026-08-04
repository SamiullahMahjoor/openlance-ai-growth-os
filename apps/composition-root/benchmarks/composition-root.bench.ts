import { bench, describe } from 'vitest';

import { DefaultsProvider } from '@openlance/aios-config';
import type { LogSink } from '@openlance/aios-logging';
import type { Clock } from '@openlance/aios-kernel';

import { bootstrap } from '../src/index';
import type { CompositionConfig } from '../src/index';

/**
 * Observational micro-baseline for the composition-root bootstrap (Engineering Rule 5, ADR-0022). Measurement
 * only: it runs outside `src`, composes the substrate services into a validated graph, and disposes nothing.
 * Recorded results live in benchmarks/baseline.md. The composition root's one executable path is `bootstrap`;
 * it consumes the frozen `di` build/validate, so the measured cost is dominated by di's topological order and
 * startup validation, not by any logic this package owns.
 */
const clock: Clock = { now: () => 0 };
const sink: LogSink = { write: () => undefined };
const config: CompositionConfig = {
  config: [new DefaultsProvider({ app: { name: 'bench' } })],
  logging: { level: 'info', clock, sinks: [sink] },
};

describe('composition-root bootstrap', () => {
  bench('bootstrap', () => {
    bootstrap(config);
  });
});
