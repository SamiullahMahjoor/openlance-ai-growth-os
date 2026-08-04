import { bench, describe } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';
import type { LogSink } from '@openlance/aios-logging';
import type { Clock } from '@openlance/aios-kernel';

import { wireNamespaces } from '../src/index';

/**
 * Observational micro-baseline for `wireNamespaces` (Engineering Rule 5, ADR-0022). Measurement only: it builds
 * the namespace manifest and extends a Stage 1 Application; it executes nothing and holds no state. Recorded
 * results live in benchmarks/baseline.md. The one executable path is `wireNamespaces`, which validates the
 * canonical 13-namespace source set (structural checks over 13 nodes with empty edges) and freezes the result.
 */
const clock: Clock = { now: () => 0 };
const sink: LogSink = { write: () => undefined };
const bootstrapped = bootstrap({
  config: [new DefaultsProvider({ app: { name: 'bench' } })],
  logging: { level: 'info', clock, sinks: [sink] },
});
const application = bootstrapped.ok ? bootstrapped.value : undefined;

describe('namespace-wiring', () => {
  bench('wireNamespaces', () => {
    if (application) {
      wireNamespaces(application);
    }
  });
});
