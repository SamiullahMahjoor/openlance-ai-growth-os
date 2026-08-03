import { describe, expect, it } from 'vitest';

import {
  AGENT_SPECIALIZATION_INVARIANTS,
  AGENT_SPECIALIZATION_INVARIANT_DESCRIPTIONS,
  AGENT_SPECIALIZATION_PRINCIPLES,
  AGENT_SPECIALIZATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('agents / agent specialization (ai/agents/agent-specialization.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(AGENT_SPECIALIZATION_PRINCIPLES).toEqual([
      'an-agent-is-specialized-to-a-role',
      'a-role-is-single-owned',
      'roles-compose-without-ambiguity',
      'specialization-draws-capability-not-authority',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(AGENT_SPECIALIZATION_INVARIANTS).toEqual([
      'each-role-has-exactly-one-owning-definition',
      'specialization-narrows-never-widens-beyond-role',
      'composed-roles-resolve-by-authority-owner-specificity',
      'specialization-draws-on-capabilities-and-permissions-never-redefines',
      'defining-specialization-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of AGENT_SPECIALIZATION_PRINCIPLES) {
      expect(AGENT_SPECIALIZATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_SPECIALIZATION_INVARIANTS) {
      expect(AGENT_SPECIALIZATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_SPECIALIZATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(AGENT_SPECIALIZATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_SPECIALIZATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_SPECIALIZATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
