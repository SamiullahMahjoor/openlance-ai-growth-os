import { bench, describe } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { CONFIG_SERVICE, DefaultsProvider } from '@openlance/aios-config';
import { integrate } from '@openlance/aios-di-integration';
import { buildErrorPropagationPlan } from '@openlance/aios-error-propagation';
import { EVENT_BUS } from '@openlance/aios-events';
import { buildExecutionPipelinePlan } from '@openlance/aios-execution-pipeline';
import type { Clock } from '@openlance/aios-kernel';
import { LOGGER } from '@openlance/aios-logging';
import type { LogSink } from '@openlance/aios-logging';
import { wireNamespaces } from '@openlance/aios-namespace-wiring';
import { createPluginHost } from '@openlance/aios-plugins';
import type { PluginContext } from '@openlance/aios-plugins';
import { buildPluginLoadingPlan } from '@openlance/aios-plugin-loading';
import { buildRuntimeLifecyclePlan } from '@openlance/aios-runtime-lifecycle';

import { buildEventFlowPlan } from '../src/index';
import type { EventFlowNode } from '../src/index';

/**
 * Observational micro-baseline for `buildEventFlowPlan` (Engineering Rule 5, ADR-0022). Measurement only: it
 * validates a declared topology and realizes each event via the frozen `createEvent`; it publishes, subscribes,
 * dispatches nothing, and holds no state. Recorded results live in benchmarks/baseline.md.
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
const pipeline =
  lifecycle && lifecycle.ok ? buildExecutionPipelinePlan(lifecycle.value) : undefined;
const pluginPlan =
  bootstrapped.ok && pipeline && pipeline.ok
    ? buildPluginLoadingPlan(
        pipeline.value,
        createPluginHost({
          plugins: [],
          context: {
            registry: bootstrapped.value.container,
            config: bootstrapped.value.container.resolve(CONFIG_SERVICE),
            logger: bootstrapped.value.container.resolve(LOGGER),
            events: bootstrapped.value.container.resolve(EVENT_BUS),
          } satisfies PluginContext,
          supportedApiVersion: '^1.0.0',
          clock,
        }),
        { manifests: [] },
      )
    : undefined;
const errorPlan =
  pluginPlan && pluginPlan.ok ? buildErrorPropagationPlan(pluginPlan.value, []) : undefined;
const chain = errorPlan && errorPlan.ok ? errorPlan.value : undefined;
const flow: readonly EventFlowNode[] = [
  { type: 'framework.plugin.started' },
  { type: 'framework.plugin.stopped' },
];

describe('event-flow', () => {
  bench('buildEventFlowPlan', () => {
    if (chain) {
      buildEventFlowPlan(chain, clock, flow);
    }
  });
});
