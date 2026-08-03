import { describe, expect, it } from 'vitest';

import {
  AGENT_CONCERNS,
  AGENT_CONCERN_DESCRIPTIONS,
  AGENT_INVARIANTS,
  AGENT_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('agents / namespace (ai/agents/README.md, ai/agents/agents.md)', () => {
  it('defines exactly the eight agent invariants in constitutional order', () => {
    expect(AGENT_INVARIANTS).toEqual([
      'distinct-uniquely-identified-actor',
      'acts-only-within-capabilities-and-permissions',
      'composes-operational-namespaces-owns-none',
      'governed-and-bounded',
      'coordination-acyclic-delegation-bounded',
      'deterministic-composition',
      'fault-is-isolated',
      'single-owned-provider-neutral-scalable',
    ]);
  });

  it('defines exactly the ten agent concerns in inventory order', () => {
    expect(AGENT_CONCERNS).toEqual([
      'agent-architecture',
      'agent-lifecycle',
      'agent-capabilities',
      'agent-permissions',
      'agent-coordination',
      'agent-communication',
      'agent-delegation',
      'agent-specialization',
      'agent-boundaries',
      'agent-versioning',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of AGENT_INVARIANTS) {
      expect(AGENT_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_CONCERNS) {
      expect(AGENT_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_CONCERNS)).toBe(true);
    expect(Object.isFrozen(AGENT_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
