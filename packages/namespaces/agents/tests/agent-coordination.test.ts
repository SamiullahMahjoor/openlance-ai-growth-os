import { describe, expect, it } from 'vitest';

import {
  AGENT_COORDINATION_INVARIANTS,
  AGENT_COORDINATION_INVARIANT_DESCRIPTIONS,
  AGENT_COORDINATION_PRINCIPLES,
  AGENT_COORDINATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('agents / agent coordination (ai/agents/agent-coordination.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(AGENT_COORDINATION_PRINCIPLES).toEqual([
      'coordination-is-structure-not-execution',
      'the-coordination-topology-is-acyclic',
      'direction-follows-authority',
      'peers-coordinate-without-a-cycle',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(AGENT_COORDINATION_INVARIANTS).toEqual([
      'coordination-defines-who-directs-whom-never-the-execution',
      'coordination-topology-directed-and-acyclic',
      'supervising-agent-directs-only-within-authority-held',
      'a-coordination-that-would-form-a-cycle-refused-or-escalated',
      'defining-coordination-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of AGENT_COORDINATION_PRINCIPLES) {
      expect(AGENT_COORDINATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_COORDINATION_INVARIANTS) {
      expect(AGENT_COORDINATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_COORDINATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(AGENT_COORDINATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_COORDINATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_COORDINATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
