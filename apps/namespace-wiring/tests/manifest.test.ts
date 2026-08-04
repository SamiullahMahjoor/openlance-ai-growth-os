import { describe, expect, it } from 'vitest';

import { bootstrap } from '@openlance/aios-composition-root';
import type { Application } from '@openlance/aios-composition-root';
import { DefaultsProvider } from '@openlance/aios-config';
import type { LogSink } from '@openlance/aios-logging';
import type { Clock } from '@openlance/aios-kernel';

import { NamespaceWiringError, validateNamespaces, wireNamespaces } from '../src/index';
import type { NamespaceSource } from '../src/index';

const testClock: Clock = { now: () => 0 };
const noopSink: LogSink = { write: () => undefined };

/** A real Stage 1 Application to wire, built via the frozen composition root. */
const buildApplication = (): Application => {
  const result = bootstrap({
    config: [new DefaultsProvider({ app: { name: 'test' } })],
    logging: { level: 'info', clock: testClock, sinks: [noopSink] },
  });
  if (!result.ok) throw new Error('expected a bootstrapped application');
  return result.value;
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

describe('namespace-wiring / wireNamespaces (docs/implementation/24-namespace-wiring.md, ADR-0027)', () => {
  it('wires the 13 frozen namespaces and extends the Stage 1 Application', () => {
    const application = buildApplication();
    const result = wireNamespaces(application);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const wired = result.value;
    expect(wired.application).toBe(application); // the Stage 1 Application, consumed unchanged
    expect(wired.namespaces.validated).toBe(true);
    expect(wired.namespaces.namespaces).toHaveLength(13);
    expect(wired.namespaces.namespaces.map((n) => n.namespace)).toEqual([...CANONICAL_ORDER]);
    for (const descriptor of wired.namespaces.namespaces) {
      expect(descriptor.available).toBe(true);
      expect(descriptor.conceptCount).toBeGreaterThan(0); // availability: non-empty catalog
      expect(descriptor.constitution.startsWith('OL-AI-')).toBe(true);
      expect(descriptor.dependencies).toEqual([]); // actual (empty) edges; topology owned by the constitution
    }
  });

  it('reports diagnostics for the wired manifest', () => {
    const result = wireNamespaces(buildApplication());
    if (!result.ok) throw new Error('expected ok');
    const { diagnostics } = result.value;

    expect(diagnostics.count).toBe(13);
    expect(diagnostics.edgeCount).toBe(0);
    expect(diagnostics.names).toEqual([...CANONICAL_ORDER]);
  });

  it('produces an immutable WiredApplication (deep)', () => {
    const result = wireNamespaces(buildApplication());
    if (!result.ok) throw new Error('expected ok');
    const wired = result.value;

    expect(Object.isFrozen(wired)).toBe(true);
    expect(Object.isFrozen(wired.namespaces)).toBe(true);
    expect(Object.isFrozen(wired.namespaces.namespaces)).toBe(true);
    expect(wired.namespaces.namespaces.every((n) => Object.isFrozen(n))).toBe(true);
    expect(wired.namespaces.namespaces.every((n) => Object.isFrozen(n.dependencies))).toBe(true);
    expect(Object.isFrozen(wired.diagnostics)).toBe(true);
    expect(Object.isFrozen(wired.diagnostics.names)).toBe(true);
  });
});

describe('namespace-wiring / validateNamespaces (structural, fail closed)', () => {
  it('accepts a valid set with a satisfied dependency', () => {
    const sources: readonly NamespaceSource[] = [
      { namespace: 'a', constitution: 'OL-AI-A-README', catalog: [1] },
      { namespace: 'b', constitution: 'OL-AI-B-README', catalog: [1], dependencies: ['a'] },
    ];
    const result = validateNamespaces(sources);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.namespaces).toHaveLength(2);
    expect(result.value.namespaces[1].dependencies).toEqual(['a']);
  });

  it('fails closed on a blank slug (INVALID_PACKAGE)', () => {
    const result = validateNamespaces([
      { namespace: '   ', constitution: 'OL-AI-A-README', catalog: [1] },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error[0]).toBeInstanceOf(NamespaceWiringError);
    expect(result.error[0].code).toBe('NAMESPACE_WIRING.INVALID_PACKAGE');
  });

  it('fails closed on a duplicate slug (DUPLICATE)', () => {
    const result = validateNamespaces([
      { namespace: 'a', constitution: 'OL-AI-A-README', catalog: [1] },
      { namespace: 'a', constitution: 'OL-AI-A-README', catalog: [1] },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.map((e) => e.code)).toContain('NAMESPACE_WIRING.DUPLICATE');
  });

  it('fails closed on a missing constitution reference (MISSING_CONSTITUTION)', () => {
    const result = validateNamespaces([{ namespace: 'a', constitution: '', catalog: [1] }]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error[0].code).toBe('NAMESPACE_WIRING.MISSING_CONSTITUTION');
  });

  it('fails closed on an unavailable namespace with an empty catalog (UNAVAILABLE)', () => {
    const result = validateNamespaces([
      { namespace: 'a', constitution: 'OL-AI-A-README', catalog: [] },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error[0].code).toBe('NAMESPACE_WIRING.UNAVAILABLE');
  });

  it('fails closed on a dependency on an unregistered namespace (MISSING_NAMESPACE)', () => {
    const result = validateNamespaces([
      { namespace: 'a', constitution: 'OL-AI-A-README', catalog: [1], dependencies: ['ghost'] },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error[0].code).toBe('NAMESPACE_WIRING.MISSING_NAMESPACE');
    expect(result.error[0].category).toBe('infrastructure');
  });
});
