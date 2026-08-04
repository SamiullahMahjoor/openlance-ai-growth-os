import { bench, describe } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';
import { integrate } from '@openlance/aios-di-integration';
import type { Clock } from '@openlance/aios-kernel';
import type { LogSink } from '@openlance/aios-logging';
import { wireNamespaces } from '@openlance/aios-namespace-wiring';
import { buildRuntimeLifecyclePlan } from '@openlance/aios-runtime-lifecycle';

import { buildExecutionPipelinePlan } from '../src/index';

/**
 * Observational micro-baseline for `buildExecutionPipelinePlan` (Engineering Rule 5, ADR-0022). Measurement only:
 * it composes the runtime lifecycle plan with the frozen pipeline model and proves the frozen workflow order; it
 * executes nothing, drives no step, orchestrates nothing, and holds no state. Recorded results live in
 * benchmarks/baseline.md. The one executable path delegates to the frozen `workflowStepAtOrAfter` over the 14
 * workflow steps, references the frozen validation stages / context inputs / events, and freezes the result.
 */
const clock: Clock = { now: () => 0 };
const sink: LogSink = { write: () => undefined };
const bootstrapped = bootstrap({
  config: [new DefaultsProvider({ app: { name: 'bench' } })],
  logging: { level: 'info', clock, sinks: [sink] },
});
const wired = bootstrapped.ok ? wireNamespaces(bootstrapped.value) : undefined;
const integrated = wired && wired.ok ? integrate(wired.value) : undefined;
const lifecycle =
  integrated && integrated.ok ? buildRuntimeLifecyclePlan(integrated.value) : undefined;
const lifecyclePlan = lifecycle && lifecycle.ok ? lifecycle.value : undefined;

describe('execution-pipeline', () => {
  bench('buildExecutionPipelinePlan', () => {
    if (lifecyclePlan) {
      buildExecutionPipelinePlan(lifecyclePlan);
    }
  });
});
