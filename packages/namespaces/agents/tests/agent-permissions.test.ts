import { describe, expect, it } from 'vitest';

import {
  AGENT_PERMISSIONS_INVARIANTS,
  AGENT_PERMISSIONS_INVARIANT_DESCRIPTIONS,
  AGENT_PERMISSIONS_PRINCIPLES,
  AGENT_PERMISSIONS_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('agents / agent permissions (ai/agents/agent-permissions.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(AGENT_PERMISSIONS_PRINCIPLES).toEqual([
      'a-permission-is-authority-not-ability',
      'least-privilege-is-the-default',
      'an-agent-never-escalates-its-own-permissions',
      'permission-inheritance-is-single-and-acyclic',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(AGENT_PERMISSIONS_INVARIANTS).toEqual([
      'a-permission-is-granted-authority-under-least-privilege-distinct-from-capability',
      'acts-only-where-holds-both-capability-and-permission',
      'never-escalates-own-permissions-over-authority-refused-or-escalated',
      'inheritance-single-acyclic-overlaps-resolve-by-authority-owner-narrower-scope',
      'defining-permissions-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of AGENT_PERMISSIONS_PRINCIPLES) {
      expect(AGENT_PERMISSIONS_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_PERMISSIONS_INVARIANTS) {
      expect(AGENT_PERMISSIONS_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_PERMISSIONS_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(AGENT_PERMISSIONS_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_PERMISSIONS_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_PERMISSIONS_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
