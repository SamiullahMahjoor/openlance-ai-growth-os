import { describe, expect, it } from 'vitest';

import {
  AGENT_ARCHITECTURE_INVARIANTS,
  AGENT_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
  AGENT_ARCHITECTURE_PRINCIPLES,
  AGENT_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  AGENT_PARTS,
  AGENT_PART_DESCRIPTIONS,
} from '../src/index';

describe('agents / agent architecture (ai/agents/agent-architecture.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(AGENT_ARCHITECTURE_PRINCIPLES).toEqual([
      'an-agent-has-a-distinct-identity',
      'an-agent-is-composed-not-monolithic',
      'an-agent-composes-it-never-owns',
      'an-agents-structure-is-deterministic',
    ]);
  });

  it('defines exactly the four parts an agent is composed of', () => {
    expect(AGENT_PARTS).toEqual(['identity', 'capabilities', 'permissions', 'specialization']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(AGENT_ARCHITECTURE_INVARIANTS).toEqual([
      'every-agent-has-a-distinct-stable-identity-never-shared',
      'composed-of-identity-capabilities-permissions-and-specialization',
      'composes-the-operational-namespaces-owns-none',
      'same-definition-same-structure',
      'defining-structure-is-inert',
    ]);
  });

  it('gives every principle, part, and invariant a non-empty description', () => {
    for (const id of AGENT_ARCHITECTURE_PRINCIPLES) {
      expect(AGENT_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_PARTS) {
      expect(AGENT_PART_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_ARCHITECTURE_INVARIANTS) {
      expect(AGENT_ARCHITECTURE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_ARCHITECTURE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(AGENT_PARTS)).toBe(true);
    expect(Object.isFrozen(AGENT_ARCHITECTURE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_PART_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_ARCHITECTURE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
