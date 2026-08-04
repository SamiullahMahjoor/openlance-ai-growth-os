import { describe, expect, it } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';
import { integrate } from '@openlance/aios-di-integration';
import type { Clock } from '@openlance/aios-kernel';
import type { LogSink } from '@openlance/aios-logging';
import { wireNamespaces } from '@openlance/aios-namespace-wiring';
import {
  CONTEXT_INPUTS,
  EXECUTION_WORKFLOW_STEPS,
  RUNTIME_EVENTS,
  VALIDATION_STAGES,
} from '@openlance/aios-runtime';
import { buildRuntimeLifecyclePlan } from '@openlance/aios-runtime-lifecycle';
import type { RuntimeLifecyclePlan } from '@openlance/aios-runtime-lifecycle';

import {
  ExecutionPipelineError,
  buildExecutionPipelinePlan,
  validateWorkflowOrder,
} from '../src/index';

const testClock: Clock = { now: () => 0 };
const noopSink: LogSink = { write: () => undefined };

/** A real Stage 4 RuntimeLifecyclePlan, built via the frozen composition root, wiring, DI integration, lifecycle. */
const buildLifecycle = (): RuntimeLifecyclePlan => {
  const bootstrapped = bootstrap({
    config: [new DefaultsProvider({ app: { name: 'test' } })],
    logging: { level: 'info', clock: testClock, sinks: [noopSink] },
  });
  if (!bootstrapped.ok) throw new Error('expected a bootstrapped application');
  const wired = wireNamespaces(bootstrapped.value);
  if (!wired.ok) throw new Error('expected a wired application');
  const integrated = integrate(wired.value);
  if (!integrated.ok) throw new Error('expected an integrated application');
  const lifecycle = buildRuntimeLifecyclePlan(integrated.value);
  if (!lifecycle.ok) throw new Error('expected a lifecycle plan');
  return lifecycle.value;
};

describe('execution-pipeline / validateWorkflowOrder (docs/implementation/27-execution-pipeline.md, ADR-0030)', () => {
  it('accepts the frozen constitutional workflow order, delegating to the frozen ordering relation', () => {
    const result = validateWorkflowOrder(EXECUTION_WORKFLOW_STEPS);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual([...EXECUTION_WORKFLOW_STEPS]);
    expect(Object.isFrozen(result.value)).toBe(true);
  });

  it('accepts a single-step order (no pair to check)', () => {
    const result = validateWorkflowOrder(['initialize']);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual(['initialize']);
  });

  it('fails closed on an out-of-order step', () => {
    const result = validateWorkflowOrder(['execute', 'initialize']);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toHaveLength(1);
    expect(result.error[0]).toBeInstanceOf(ExecutionPipelineError);
    expect(result.error[0].code).toBe('EXECUTION_PIPELINE.OUT_OF_ORDER_STEP');
    expect(result.error[0].category).toBe('infrastructure');
    expect(result.error[0].context).toEqual({ previous: 'execute', step: 'initialize' });
  });

  it('aggregates one error per out-of-order pair, building no partial order', () => {
    const result = validateWorkflowOrder(['finalize-session', 'execute', 'initialize']);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toHaveLength(2);
    expect(result.error.every((e) => e.code === 'EXECUTION_PIPELINE.OUT_OF_ORDER_STEP')).toBe(true);
  });
});

describe('execution-pipeline / buildExecutionPipelinePlan (Option A, ADR-0030)', () => {
  it('composes the lifecycle plan with the referenced frozen pipeline model', () => {
    const lifecycle = buildLifecycle();
    const result = buildExecutionPipelinePlan(lifecycle);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const plan = result.value;
    expect(plan.lifecycle).toBe(lifecycle); // the Stage 4 RuntimeLifecyclePlan, consumed unchanged
    expect(plan.validated).toBe(true);
    expect(plan.workflow).toBe(EXECUTION_WORKFLOW_STEPS); // referenced, not re-declared
    expect(plan.validationStages).toBe(VALIDATION_STAGES);
    expect(plan.contextInputs).toBe(CONTEXT_INPUTS);
    expect(plan.events).toBe(RUNTIME_EVENTS);
  });

  it('produces an immutable ExecutionPipelinePlan (deep)', () => {
    const result = buildExecutionPipelinePlan(buildLifecycle());
    if (!result.ok) throw new Error('expected ok');
    const plan = result.value;

    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.workflow)).toBe(true);
    expect(Object.isFrozen(plan.validationStages)).toBe(true);
    expect(Object.isFrozen(plan.contextInputs)).toBe(true);
    expect(Object.isFrozen(plan.events)).toBe(true);
  });
});
