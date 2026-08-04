import { bench, describe } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';
import { integrate } from '@openlance/aios-di-integration';
import type { Clock } from '@openlance/aios-kernel';
import type { LogSink } from '@openlance/aios-logging';
import { wireNamespaces } from '@openlance/aios-namespace-wiring';

import { buildRuntimeLifecyclePlan } from '../src/index';

/**
 * Observational micro-baseline for `buildRuntimeLifecyclePlan` (Engineering Rule 5, ADR-0022). Measurement only:
 * it binds the integrated application to the frozen runtime lifecycle model and validates the admission path; it
 * executes nothing, drives no transition, activates nothing, and holds no state. Recorded results live in
 * benchmarks/baseline.md. The one executable path delegates to the frozen `transitionAllowed` over the admission
 * sequence, references the frozen phases, and freezes the result.
 */
const clock: Clock = { now: () => 0 };
const sink: LogSink = { write: () => undefined };
const bootstrapped = bootstrap({
  config: [new DefaultsProvider({ app: { name: 'bench' } })],
  logging: { level: 'info', clock, sinks: [sink] },
});
const wired = bootstrapped.ok ? wireNamespaces(bootstrapped.value) : undefined;
const integrated = wired && wired.ok ? integrate(wired.value) : undefined;
const integratedApplication = integrated && integrated.ok ? integrated.value : undefined;

describe('runtime-lifecycle', () => {
  bench('buildRuntimeLifecyclePlan', () => {
    if (integratedApplication) {
      buildRuntimeLifecyclePlan(integratedApplication);
    }
  });
});
