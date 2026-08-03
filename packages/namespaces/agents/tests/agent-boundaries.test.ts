import { describe, expect, it } from 'vitest';

import {
  AGENT_BOUNDARIES,
  AGENT_BOUNDARY_DESCRIPTIONS,
  AGENT_BOUNDARY_INVARIANTS,
  AGENT_BOUNDARY_INVARIANT_DESCRIPTIONS,
  AGENT_BOUNDARY_PRINCIPLES,
  AGENT_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('agents / agent boundaries (ai/agents/agent-boundaries.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(AGENT_BOUNDARY_PRINCIPLES).toEqual([
      'an-agent-composes-it-does-not-own',
      'an-agent-acts-within-its-bounds',
      'an-agent-does-not-execute-itself',
      'an-agents-fault-is-isolated',
    ]);
  });

  it('defines exactly the six architectural boundaries in constitutional order', () => {
    expect(AGENT_BOUNDARIES).toEqual([
      'composition',
      'truth',
      'governance',
      'execution',
      'fault-isolation',
      'implementation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(AGENT_BOUNDARY_INVARIANTS).toEqual([
      'composes-the-operational-namespaces-owns-none-never-owns-truth',
      'acts-only-within-capabilities-permissions-autonomy-never-escalates-authority',
      'never-orchestrates-schedules-executes-or-selects-provider-or-model',
      'a-failing-agents-fault-bounded-never-corrupts-another',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of AGENT_BOUNDARY_PRINCIPLES) {
      expect(AGENT_BOUNDARY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_BOUNDARIES) {
      expect(AGENT_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_BOUNDARY_INVARIANTS) {
      expect(AGENT_BOUNDARY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_BOUNDARY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(AGENT_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(AGENT_BOUNDARY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_BOUNDARY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_BOUNDARY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
