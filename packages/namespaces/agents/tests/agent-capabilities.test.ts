import { describe, expect, it } from 'vitest';

import {
  AGENT_CAPABILITIES_INVARIANTS,
  AGENT_CAPABILITIES_INVARIANT_DESCRIPTIONS,
  AGENT_CAPABILITIES_PRINCIPLES,
  AGENT_CAPABILITIES_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('agents / agent capabilities (ai/agents/agent-capabilities.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(AGENT_CAPABILITIES_PRINCIPLES).toEqual([
      'a-capability-is-an-ability-not-a-permission',
      'a-capability-composes-a-namespace-it-never-owns-it',
      'capabilities-are-explicit-and-bounded',
      'capability-inheritance-is-single-and-acyclic',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(AGENT_CAPABILITIES_INVARIANTS).toEqual([
      'a-capability-names-an-ability-never-performs-that-work',
      'nothing-outside-defined-set-of-capabilities',
      'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-specificity',
      'acts-only-where-holds-capability-and-permitted',
      'defining-capabilities-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of AGENT_CAPABILITIES_PRINCIPLES) {
      expect(AGENT_CAPABILITIES_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_CAPABILITIES_INVARIANTS) {
      expect(AGENT_CAPABILITIES_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_CAPABILITIES_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(AGENT_CAPABILITIES_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_CAPABILITIES_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_CAPABILITIES_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
