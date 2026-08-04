import { describe, expect, it } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';
import { err } from '@openlance/aios-kernel';
import type { Clock } from '@openlance/aios-kernel';
import type { LogSink } from '@openlance/aios-logging';
import { wireNamespaces } from '@openlance/aios-namespace-wiring';
import type { WiredApplication } from '@openlance/aios-namespace-wiring';

import { DiIntegrationError, integrate } from '../src/index';

const testClock: Clock = { now: () => 0 };
const noopSink: LogSink = { write: () => undefined };

/** A real Stage 2 WiredApplication to integrate, built via the frozen composition root and namespace wiring. */
const buildWired = (): WiredApplication => {
  const bootstrapped = bootstrap({
    config: [new DefaultsProvider({ app: { name: 'test' } })],
    logging: { level: 'info', clock: testClock, sinks: [noopSink] },
  });
  if (!bootstrapped.ok) throw new Error('expected a bootstrapped application');
  const wired = wireNamespaces(bootstrapped.value);
  if (!wired.ok) throw new Error('expected a wired application');
  return wired.value;
};

const CANONICAL_ORDER = [
  'governance',
  'providers',
  'memory',
  'retrieval',
  'safety',
  'reasoning',
  'prompts',
  'tools',
  'agents',
  'runtime',
  'evaluation',
  'operations',
  'evolution',
] as const;

describe('di-integration / integrate (docs/implementation/25-di-integration.md, ADR-0028)', () => {
  it('integrates the composition root and the namespace wiring, succeeding on a valid graph', () => {
    const wired = buildWired();
    const result = integrate(wired);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const integrated = result.value;
    expect(integrated.wired).toBe(wired); // the Stage 2 WiredApplication, consumed unchanged
    expect(integrated.validated).toBe(true);
  });

  it('references the injectable substrate surface from the composition root, never re-registering it', () => {
    const wired = buildWired();
    const result = integrate(wired);
    if (!result.ok) throw new Error('expected ok');

    // The three substrate services composed by the Stage 1 root (config, logging, events), by reference.
    expect(result.value.injectable).toBe(wired.application.diagnostics.services);
    expect(result.value.injectable).toHaveLength(3);
    for (const token of result.value.injectable) {
      expect(typeof token).toBe('string');
    }
  });

  it('records per-namespace injection readiness with an empty binding set (no services yet)', () => {
    const wired = buildWired();
    const result = integrate(wired);
    if (!result.ok) throw new Error('expected ok');
    const { readiness } = result.value;

    expect(readiness).toHaveLength(13);
    expect(readiness.map((r) => r.namespace)).toEqual([...CANONICAL_ORDER]);
    for (const record of readiness) {
      expect(record.available).toBe(true);
      expect(record.ready).toBe(true);
      expect(record.serviceBindings).toEqual([]); // empty today; no namespace has an operational service
    }
  });

  it('produces an immutable IntegratedApplication (deep)', () => {
    const result = integrate(buildWired());
    if (!result.ok) throw new Error('expected ok');
    const integrated = result.value;

    expect(Object.isFrozen(integrated)).toBe(true);
    expect(Object.isFrozen(integrated.injectable)).toBe(true);
    expect(Object.isFrozen(integrated.readiness)).toBe(true);
    expect(integrated.readiness.every((r) => Object.isFrozen(r))).toBe(true);
    expect(integrated.readiness.every((r) => Object.isFrozen(r.serviceBindings))).toBe(true);
  });

  it('fails closed by delegating graph validation to the frozen container', () => {
    const wired = buildWired();
    // A synthetic WiredApplication whose container reports an invalid graph. `integrate` must surface it and
    // build no partial result; only `container.validate()`, `diagnostics.services`, and `namespaces` are touched.
    const failing = {
      ...wired,
      application: {
        ...wired.application,
        container: { validate: () => err([{ code: 'DI.MISSING_DEPENDENCY' }]) },
      },
    } as unknown as WiredApplication;

    const result = integrate(failing);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toHaveLength(1);
    expect(result.error[0]).toBeInstanceOf(DiIntegrationError);
    expect(result.error[0].code).toBe('DI_INTEGRATION.GRAPH_VALIDATION_FAILED');
    expect(result.error[0].category).toBe('infrastructure');
    expect(result.error[0].context.cause).toBe('DI.MISSING_DEPENDENCY');
  });
});
