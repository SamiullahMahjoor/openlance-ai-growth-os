import { describe, expect, it } from 'vitest';

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
import { buildPluginLoadingPlan } from '@openlance/aios-plugin-loading';
import type { PluginLoadingPlan } from '@openlance/aios-plugin-loading';
import { buildRuntimeLifecyclePlan } from '@openlance/aios-runtime-lifecycle';

import {
  ErrorPropagationError,
  buildErrorPropagationPlan,
  validateErrorPropagation,
} from '../src/index';
import type { ErrorPropagationNode } from '../src/index';

const clock: Clock = { now: () => 0 };
const sink: LogSink = { write: () => undefined };

/** The full Stage 1 to 6 chain, returning the Stage 6 PluginLoadingPlan (which nests the whole chain). */
const buildChain = (): PluginLoadingPlan => {
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
  return pluginPlan.value;
};

const UNIQUE: readonly ErrorPropagationNode[] = [
  { code: 'COMPOSITION.CONFIG_BUILD_FAILED', category: 'infrastructure' },
  { code: 'PLUGIN_LOADING.INCOMPATIBLE', category: 'infrastructure' },
];
const DUPLICATE: readonly ErrorPropagationNode[] = [
  { code: 'X.DUP', category: 'infrastructure' },
  { code: 'X.DUP', category: 'domain' },
];

describe('error-propagation / validateErrorPropagation (docs/implementation/30-error-propagation.md, ADR-0033)', () => {
  it('accepts an empty topology', () => {
    const result = validateErrorPropagation([]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([]);
    expect(Object.isFrozen(result.value)).toBe(true);
  });

  it('accepts a topology with unique codes', () => {
    const result = validateErrorPropagation(UNIQUE);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual(UNIQUE);
    expect(Object.isFrozen(result.value)).toBe(true);
  });

  it('fails closed on duplicate codes, delegating to the frozen error-code registry', () => {
    const result = validateErrorPropagation(DUPLICATE);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toHaveLength(1);
    expect(result.error[0]).toBeInstanceOf(ErrorPropagationError);
    expect(result.error[0].code).toBe('ERROR_PROPAGATION.DUPLICATE_CODE');
    expect(result.error[0].category).toBe('infrastructure');
  });
});

describe('error-propagation / buildErrorPropagationPlan (Stage 7, ADR-0033)', () => {
  it('builds a plan attached to the chain over a valid topology', () => {
    const chain = buildChain();
    const result = buildErrorPropagationPlan(chain, UNIQUE);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const plan = result.value;
    expect(plan.chain).toBe(chain); // the Stage 6 chain handle, consumed unchanged
    expect(plan.validated).toBe(true);
    expect(plan.nodes).toEqual(UNIQUE);
    expect(plan.diagnostics).toEqual({
      nodeCount: 2,
      codes: ['COMPOSITION.CONFIG_BUILD_FAILED', 'PLUGIN_LOADING.INCOMPATIBLE'],
    });
  });

  it('fails closed on a duplicate-code topology, building no partial plan', () => {
    const result = buildErrorPropagationPlan(buildChain(), DUPLICATE);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error[0]).toBeInstanceOf(ErrorPropagationError);
    expect(result.error[0].code).toBe('ERROR_PROPAGATION.DUPLICATE_CODE');
  });

  it('produces an immutable ErrorPropagationPlan (deep)', () => {
    const result = buildErrorPropagationPlan(buildChain(), UNIQUE);
    if (!result.ok) throw new Error('expected ok');
    const plan = result.value;

    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.nodes)).toBe(true);
    expect(Object.isFrozen(plan.diagnostics)).toBe(true);
    expect(Object.isFrozen(plan.diagnostics.codes)).toBe(true);
  });
});
