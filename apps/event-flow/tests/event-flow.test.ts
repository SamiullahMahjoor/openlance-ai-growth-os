import { describe, expect, it } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { CONFIG_SERVICE, DefaultsProvider } from '@openlance/aios-config';
import { integrate } from '@openlance/aios-di-integration';
import { buildErrorPropagationPlan } from '@openlance/aios-error-propagation';
import type { ErrorPropagationPlan } from '@openlance/aios-error-propagation';
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

import { EventFlowError, buildEventFlowPlan, validateEventFlow } from '../src/index';
import type { EventFlowNode } from '../src/index';

const clock: Clock = { now: () => 0 };
const sink: LogSink = { write: () => undefined };

/** The full Stage 1 to 7 chain, returning the Stage 7 ErrorPropagationPlan (which nests the whole chain). */
const buildChain = (): ErrorPropagationPlan => {
  const bootstrapped = bootstrap({
    config: [new DefaultsProvider({ app: { name: 'test' } })],
    logging: { level: 'info', clock, sinks: [sink] },
  });
  if (!bootstrapped.ok) throw new Error('expected a bootstrapped application');
  const application = bootstrapped.value;
  const wired = wireNamespaces(application);
  if (!wired.ok) throw new Error('expected a wired application');
  const integrated = integrate(wired.value);
  if (!integrated.ok) throw new Error('expected an integrated application');
  const lifecycle = buildRuntimeLifecyclePlan(integrated.value);
  if (!lifecycle.ok) throw new Error('expected a lifecycle plan');
  const pipeline = buildExecutionPipelinePlan(lifecycle.value);
  if (!pipeline.ok) throw new Error('expected a pipeline plan');
  const context: PluginContext = {
    registry: application.container,
    config: application.container.resolve(CONFIG_SERVICE),
    logger: application.container.resolve(LOGGER),
    events: application.container.resolve(EVENT_BUS),
  };
  const host = createPluginHost({ plugins: [], context, supportedApiVersion: '^1.0.0', clock });
  const pluginPlan = buildPluginLoadingPlan(pipeline.value, host, { manifests: [] });
  if (!pluginPlan.ok) throw new Error('expected a plugin loading plan');
  const errorPlan = buildErrorPropagationPlan(pluginPlan.value, []);
  if (!errorPlan.ok) throw new Error('expected an error propagation plan');
  return errorPlan.value;
};

const FLOW: readonly EventFlowNode[] = [
  { type: 'framework.plugin.started' },
  { type: 'framework.plugin.stopped' },
];

describe('event-flow / validateEventFlow (docs/implementation/31-event-flow.md, ADR-0034)', () => {
  it('accepts an empty topology', () => {
    const result = validateEventFlow(clock, []);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([]);
    expect(Object.isFrozen(result.value)).toBe(true);
  });

  it('realizes each declared type as a frozen FrameworkEvent via the frozen createEvent', () => {
    const result = validateEventFlow(clock, FLOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.map((event) => event.type)).toEqual([
      'framework.plugin.started',
      'framework.plugin.stopped',
    ]);
    expect(result.value.every((event) => Object.isFrozen(event))).toBe(true);
    expect(result.value[0].occurredAt).toBe(0); // stamped by the injected clock
  });

  it('fails closed on a blank event type', () => {
    const result = validateEventFlow(clock, [{ type: '   ' }]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toHaveLength(1);
    expect(result.error[0]).toBeInstanceOf(EventFlowError);
    expect(result.error[0].code).toBe('EVENT_FLOW.BLANK_TYPE');
    expect(result.error[0].category).toBe('infrastructure');
  });

  it('fails closed on a duplicate event type', () => {
    const result = validateEventFlow(clock, [
      { type: 'framework.plugin.started' },
      { type: 'framework.plugin.started' },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error[0].code).toBe('EVENT_FLOW.DUPLICATE_TYPE');
    expect(result.error[0].context).toEqual({ type: 'framework.plugin.started' });
  });
});

describe('event-flow / buildEventFlowPlan (Stage 8, ADR-0034)', () => {
  it('builds a plan attached to the chain over a valid topology', () => {
    const chain = buildChain();
    const result = buildEventFlowPlan(chain, clock, FLOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const plan = result.value;
    expect(plan.chain).toBe(chain); // the Stage 7 chain handle, consumed unchanged
    expect(plan.validated).toBe(true);
    expect(plan.events).toHaveLength(2);
    expect(plan.diagnostics).toEqual({
      eventCount: 2,
      types: ['framework.plugin.started', 'framework.plugin.stopped'],
    });
  });

  it('fails closed on an invalid topology, building no partial plan', () => {
    const result = buildEventFlowPlan(buildChain(), clock, [{ type: 'a' }, { type: 'a' }]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error[0]).toBeInstanceOf(EventFlowError);
    expect(result.error[0].code).toBe('EVENT_FLOW.DUPLICATE_TYPE');
  });

  it('produces an immutable EventFlowPlan (deep)', () => {
    const result = buildEventFlowPlan(buildChain(), clock, FLOW);
    if (!result.ok) throw new Error('expected ok');
    const plan = result.value;

    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.events)).toBe(true);
    expect(plan.events.every((event) => Object.isFrozen(event))).toBe(true);
    expect(Object.isFrozen(plan.diagnostics)).toBe(true);
    expect(Object.isFrozen(plan.diagnostics.types)).toBe(true);
  });
});
