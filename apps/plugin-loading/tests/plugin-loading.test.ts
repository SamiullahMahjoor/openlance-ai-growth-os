import { describe, expect, it } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import type { Application } from '@openlance/aios-composition-root';
import { CONFIG_SERVICE, DefaultsProvider } from '@openlance/aios-config';
import { integrate } from '@openlance/aios-di-integration';
import { EVENT_BUS } from '@openlance/aios-events';
import { buildExecutionPipelinePlan } from '@openlance/aios-execution-pipeline';
import type { ExecutionPipelinePlan } from '@openlance/aios-execution-pipeline';
import type { Clock } from '@openlance/aios-kernel';
import { LOGGER } from '@openlance/aios-logging';
import type { LogSink } from '@openlance/aios-logging';
import { wireNamespaces } from '@openlance/aios-namespace-wiring';
import { createPluginHost } from '@openlance/aios-plugins';
import type { PluginContext, PluginHost, PluginManifest } from '@openlance/aios-plugins';
import { buildRuntimeLifecyclePlan } from '@openlance/aios-runtime-lifecycle';

import { PluginLoadingError, buildPluginLoadingPlan, validatePluginLoading } from '../src/index';

const clock: Clock = { now: () => 0 };
const sink: LogSink = { write: () => undefined };

/** The full Stage 1 to 5 chain, returning the Stage 1 Application and the Stage 5 ExecutionPipelinePlan. */
const buildChain = (): { application: Application; pipeline: ExecutionPipelinePlan } => {
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
  return { application, pipeline: pipeline.value };
};

/** A frozen PluginHost, built from the Application's substrate services (the plugin context), for validation. */
const buildHost = (application: Application, supportedApiVersion: string): PluginHost => {
  const context: PluginContext = {
    registry: application.container,
    config: application.container.resolve(CONFIG_SERVICE),
    logger: application.container.resolve(LOGGER),
    events: application.container.resolve(EVENT_BUS),
  };
  return createPluginHost({ plugins: [], context, supportedApiVersion, clock });
};

const ALPHA: PluginManifest = { name: 'alpha', version: '1.0.0', apiVersion: '1.0.0' };
const BETA: PluginManifest = { name: 'beta', version: '1.2.0', apiVersion: '1.1.0' };
const XRAY: PluginManifest = { name: 'xray', version: '1.0.0', apiVersion: '2.0.0' }; // apiVersion outside ^1.0.0

describe('plugin-loading / validatePluginLoading (docs/implementation/29-plugin-loading.md, ADR-0032)', () => {
  it('accepts an empty set, delegating to the frozen host', () => {
    const { application } = buildChain();
    const result = validatePluginLoading(buildHost(application, '^1.0.0'), []);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([]);
    expect(Object.isFrozen(result.value)).toBe(true);
  });

  it('accepts a compatible set', () => {
    const { application } = buildChain();
    const result = validatePluginLoading(buildHost(application, '^1.0.0'), [ALPHA, BETA]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([ALPHA, BETA]);
    expect(Object.isFrozen(result.value)).toBe(true);
  });

  it('fails closed on an incompatible set, delegating to the frozen validateCompatibility', () => {
    const { application } = buildChain();
    const result = validatePluginLoading(buildHost(application, '^1.0.0'), [XRAY]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toHaveLength(1);
    expect(result.error[0]).toBeInstanceOf(PluginLoadingError);
    expect(result.error[0].code).toBe('PLUGIN_LOADING.INCOMPATIBLE');
    expect(result.error[0].category).toBe('infrastructure');
    expect(result.error[0].context).toEqual({ cause: 'PLUGIN.INCOMPATIBLE_API' });
  });
});

describe('plugin-loading / buildPluginLoadingPlan (Stage 6, ADR-0032)', () => {
  it('builds a plan over all available plugins when none are named disabled', () => {
    const { application, pipeline } = buildChain();
    const host = buildHost(application, '^1.0.0');
    const result = buildPluginLoadingPlan(pipeline, host, { manifests: [ALPHA, BETA] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const plan = result.value;
    expect(plan.pipeline).toBe(pipeline); // the Stage 5 chain handle, consumed unchanged
    expect(plan.validated).toBe(true);
    expect(plan.available).toEqual([ALPHA, BETA]);
    expect(plan.enabled).toEqual([ALPHA, BETA]);
    expect(plan.compatible).toEqual([ALPHA, BETA]);
    expect(plan.ready).toEqual([ALPHA, BETA]);
    expect(plan.diagnostics).toEqual({
      availableCount: 2,
      enabledCount: 2,
      compatibleCount: 2,
      readyCount: 2,
    });
  });

  it('enables only the named subset of available plugins', () => {
    const { application, pipeline } = buildChain();
    const host = buildHost(application, '^1.0.0');
    const result = buildPluginLoadingPlan(pipeline, host, {
      manifests: [ALPHA, BETA],
      enabled: ['alpha'],
    });
    if (!result.ok) throw new Error('expected ok');
    const plan = result.value;
    expect(plan.available).toEqual([ALPHA, BETA]);
    expect(plan.enabled).toEqual([ALPHA]);
    expect(plan.compatible).toEqual([ALPHA]);
    expect(plan.diagnostics).toEqual({
      availableCount: 2,
      enabledCount: 1,
      compatibleCount: 1,
      readyCount: 1,
    });
  });

  it('handles the empty (zero plugins) declaration', () => {
    const { application, pipeline } = buildChain();
    const result = buildPluginLoadingPlan(pipeline, buildHost(application, '^1.0.0'), {
      manifests: [],
    });
    if (!result.ok) throw new Error('expected ok');
    expect(result.value.diagnostics).toEqual({
      availableCount: 0,
      enabledCount: 0,
      compatibleCount: 0,
      readyCount: 0,
    });
  });

  it('fails closed on an incompatible declaration, building no partial plan', () => {
    const { application, pipeline } = buildChain();
    const result = buildPluginLoadingPlan(pipeline, buildHost(application, '^1.0.0'), {
      manifests: [XRAY],
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error[0]).toBeInstanceOf(PluginLoadingError);
    expect(result.error[0].code).toBe('PLUGIN_LOADING.INCOMPATIBLE');
  });

  it('produces an immutable PluginLoadingPlan (deep)', () => {
    const { application, pipeline } = buildChain();
    const result = buildPluginLoadingPlan(pipeline, buildHost(application, '^1.0.0'), {
      manifests: [ALPHA],
    });
    if (!result.ok) throw new Error('expected ok');
    const plan = result.value;

    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.available)).toBe(true);
    expect(Object.isFrozen(plan.enabled)).toBe(true);
    expect(Object.isFrozen(plan.compatible)).toBe(true);
    expect(Object.isFrozen(plan.ready)).toBe(true);
    expect(Object.isFrozen(plan.diagnostics)).toBe(true);
  });
});
