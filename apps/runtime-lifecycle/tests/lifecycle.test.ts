import { describe, expect, it } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';
import { integrate } from '@openlance/aios-di-integration';
import type { IntegratedApplication } from '@openlance/aios-di-integration';
import type { Clock } from '@openlance/aios-kernel';
import type { LogSink } from '@openlance/aios-logging';
import { wireNamespaces } from '@openlance/aios-namespace-wiring';
import { EXECUTION_LIFECYCLE_PHASES } from '@openlance/aios-runtime';

import {
  RuntimeLifecycleError,
  buildRuntimeLifecyclePlan,
  validateLifecyclePath,
} from '../src/index';

const testClock: Clock = { now: () => 0 };
const noopSink: LogSink = { write: () => undefined };

/** A real Stage 3 IntegratedApplication, built via the frozen composition root, wiring, and DI integration. */
const buildIntegrated = (): IntegratedApplication => {
  const bootstrapped = bootstrap({
    config: [new DefaultsProvider({ app: { name: 'test' } })],
    logging: { level: 'info', clock: testClock, sinks: [noopSink] },
  });
  if (!bootstrapped.ok) throw new Error('expected a bootstrapped application');
  const wired = wireNamespaces(bootstrapped.value);
  if (!wired.ok) throw new Error('expected a wired application');
  const integrated = integrate(wired.value);
  if (!integrated.ok) throw new Error('expected an integrated application');
  return integrated.value;
};

describe('runtime-lifecycle / validateLifecyclePath (docs/implementation/26-runtime-lifecycle.md, ADR-0029)', () => {
  it('accepts a permitted path, delegating to the frozen transition relation', () => {
    const result = validateLifecyclePath(['created', 'initializing', 'loading', 'validating']);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual(['created', 'initializing', 'loading', 'validating']);
    expect(Object.isFrozen(result.value)).toBe(true);
  });

  it('accepts a single-state path (no transition to check)', () => {
    const result = validateLifecyclePath(['created']);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual(['created']);
  });

  it('fails closed on a forbidden transition', () => {
    const result = validateLifecyclePath(['created', 'closed']);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toHaveLength(1);
    expect(result.error[0]).toBeInstanceOf(RuntimeLifecycleError);
    expect(result.error[0].code).toBe('RUNTIME_LIFECYCLE.FORBIDDEN_TRANSITION');
    expect(result.error[0].category).toBe('infrastructure');
    expect(result.error[0].context).toEqual({ from: 'created', to: 'closed' });
  });

  it('aggregates one error per forbidden transition, building no partial path', () => {
    // ready -> loading is forbidden, loading -> ready is forbidden (loading only goes to validating).
    const result = validateLifecyclePath(['ready', 'loading', 'ready']);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toHaveLength(2);
    expect(result.error.every((e) => e.code === 'RUNTIME_LIFECYCLE.FORBIDDEN_TRANSITION')).toBe(
      true,
    );
  });
});

describe('runtime-lifecycle / buildRuntimeLifecyclePlan (Option A, ADR-0029)', () => {
  it('binds the integrated application to the frozen runtime lifecycle model', () => {
    const integrated = buildIntegrated();
    const result = buildRuntimeLifecyclePlan(integrated);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const plan = result.value;
    expect(plan.integrated).toBe(integrated); // the Stage 3 IntegratedApplication, consumed unchanged
    expect(plan.validated).toBe(true);
    expect(plan.initialState).toBe('created'); // referenced from the frozen model
    expect(plan.phases).toBe(EXECUTION_LIFECYCLE_PHASES); // referenced, not re-declared
    expect(plan.admissionPath).toEqual(['created', 'initializing', 'loading', 'validating']);
  });

  it('produces an immutable RuntimeLifecyclePlan (deep)', () => {
    const result = buildRuntimeLifecyclePlan(buildIntegrated());
    if (!result.ok) throw new Error('expected ok');
    const plan = result.value;

    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.phases)).toBe(true);
    expect(Object.isFrozen(plan.admissionPath)).toBe(true);
  });
});
