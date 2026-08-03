import { describe, expect, it } from 'vitest';

import {
  AGENT_DELEGATION_INVARIANTS,
  AGENT_DELEGATION_INVARIANT_DESCRIPTIONS,
  AGENT_DELEGATION_PRINCIPLES,
  AGENT_DELEGATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('agents / agent delegation (ai/agents/agent-delegation.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(AGENT_DELEGATION_PRINCIPLES).toEqual([
      'delegation-passes-authority-within-authority',
      'delegation-narrows-or-preserves-it-never-widens',
      'the-delegation-chain-is-bounded-and-acyclic',
      'delegation-is-revocable-and-accountable',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(AGENT_DELEGATION_INVARIANTS).toEqual([
      'delegates-only-authority-held-never-exceeds-delegators',
      'authority-never-widens-along-a-delegation-chain',
      'delegation-chain-finite-and-acyclic',
      'every-delegation-traceable-to-delegator-who-remains-accountable',
      'delegating-authority-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of AGENT_DELEGATION_PRINCIPLES) {
      expect(AGENT_DELEGATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_DELEGATION_INVARIANTS) {
      expect(AGENT_DELEGATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_DELEGATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(AGENT_DELEGATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_DELEGATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_DELEGATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
