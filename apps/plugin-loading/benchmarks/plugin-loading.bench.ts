import { bench, describe } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { CONFIG_SERVICE, DefaultsProvider } from '@openlance/aios-config';
import { integrate } from '@openlance/aios-di-integration';
import { EVENT_BUS } from '@openlance/aios-events';
import { buildExecutionPipelinePlan } from '@openlance/aios-execution-pipeline';
import type { Clock } from '@openlance/aios-kernel';
import { LOGGER } from '@openlance/aios-logging';
import type { LogSink } from '@openlance/aios-logging';
import { wireNamespaces } from '@openlance/aios-namespace-wiring';
import { createPluginHost } from '@openlance/aios-plugins';
import type { PluginContext } from '@openlance/aios-plugins';
import { buildRuntimeLifecyclePlan } from '@openlance/aios-runtime-lifecycle';

import { buildPluginLoadingPlan } from '../src/index';

/**
 * Observational micro-baseline for `buildPluginLoadingPlan` (Engineering Rule 5, ADR-0022). Measurement only: it
 * builds the plugin loading plan and delegates compatibility to the frozen host; it executes nothing, loads no
 * plugin, drives no lifecycle, and holds no state. Recorded results live in benchmarks/baseline.md.
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
const pipelineResult =
  lifecycle && lifecycle.ok ? buildExecutionPipelinePlan(lifecycle.value) : undefined;
const pipeline = pipelineResult && pipelineResult.ok ? pipelineResult.value : undefined;
const host = bootstrapped.ok
  ? createPluginHost({
      plugins: [],
      context: {
        registry: bootstrapped.value.container,
        config: bootstrapped.value.container.resolve(CONFIG_SERVICE),
        logger: bootstrapped.value.container.resolve(LOGGER),
        events: bootstrapped.value.container.resolve(EVENT_BUS),
      } satisfies PluginContext,
      supportedApiVersion: '^1.0.0',
      clock,
    })
  : undefined;

describe('plugin-loading', () => {
  bench('buildPluginLoadingPlan', () => {
    if (pipeline && host) {
      buildPluginLoadingPlan(pipeline, host, { manifests: [] });
    }
  });
});
