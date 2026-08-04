import { bench, describe } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';
import type { Clock } from '@openlance/aios-kernel';
import type { LogSink } from '@openlance/aios-logging';
import { wireNamespaces } from '@openlance/aios-namespace-wiring';

import { integrate } from '../src/index';

/**
 * Observational micro-baseline for `integrate` (Engineering Rule 5, ADR-0022). Measurement only: it joins the
 * composition root and the namespace wiring into an immutable integration handle; it executes nothing, registers
 * no service, activates nothing, and holds no state. Recorded results live in benchmarks/baseline.md. The one
 * executable path is `integrate`, which delegates graph validation to the frozen container, references the
 * injectable substrate surface, records per-namespace readiness over 13 nodes, and freezes the result.
 */
const clock: Clock = { now: () => 0 };
const sink: LogSink = { write: () => undefined };
const bootstrapped = bootstrap({
  config: [new DefaultsProvider({ app: { name: 'bench' } })],
  logging: { level: 'info', clock, sinks: [sink] },
});
const wired = bootstrapped.ok ? wireNamespaces(bootstrapped.value) : undefined;
const wiredApplication = wired && wired.ok ? wired.value : undefined;

describe('di-integration', () => {
  bench('integrate', () => {
    if (wiredApplication) {
      integrate(wiredApplication);
    }
  });
});
