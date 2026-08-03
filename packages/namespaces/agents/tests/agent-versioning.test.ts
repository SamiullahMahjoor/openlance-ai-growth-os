import { describe, expect, it } from 'vitest';

import {
  AGENT_VERSIONING_INVARIANTS,
  AGENT_VERSIONING_INVARIANT_DESCRIPTIONS,
  AGENT_VERSIONING_PRINCIPLES,
  AGENT_VERSIONING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('agents / agent versioning (ai/agents/agent-versioning.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(AGENT_VERSIONING_PRINCIPLES).toEqual([
      'an-agent-definition-is-versioned',
      'change-is-governed',
      'compatibility-is-preserved-or-versioned',
      'versioning-governs-definitions-not-truth',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(AGENT_VERSIONING_INVARIANTS).toEqual([
      'an-agent-definition-carries-a-version',
      'evolves-only-under-governed-change-never-by-agent-beyond-authority',
      'incompatible-change-is-a-new-version',
      'versioning-applies-to-architecture-not-truth',
      'versioning-an-agent-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of AGENT_VERSIONING_PRINCIPLES) {
      expect(AGENT_VERSIONING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_VERSIONING_INVARIANTS) {
      expect(AGENT_VERSIONING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_VERSIONING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(AGENT_VERSIONING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_VERSIONING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_VERSIONING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
