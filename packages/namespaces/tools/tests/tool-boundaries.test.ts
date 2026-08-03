import { describe, expect, it } from 'vitest';

import {
  TOOL_BOUNDARIES,
  TOOL_BOUNDARY_DESCRIPTIONS,
  TOOL_BOUNDARY_INVARIANTS,
  TOOL_BOUNDARY_INVARIANT_DESCRIPTIONS,
  TOOL_BOUNDARY_PRINCIPLES,
  TOOL_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('tools / tool boundaries (ai/tools/tool-boundaries.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(TOOL_BOUNDARY_PRINCIPLES).toEqual([
      'a-tool-interacts-it-does-not-reason-decide-or-execute-itself',
      'a-tool-holds-no-authority-of-its-own',
      'a-tool-carries-no-truth-and-no-intelligence',
      'a-tool-stays-within-governance-and-safety',
    ]);
  });

  it('defines exactly the six architectural boundaries in constitutional order', () => {
    expect(TOOL_BOUNDARIES).toEqual([
      'reasoning-and-decision',
      'authority',
      'execution',
      'provider-and-intelligence',
      'truth',
      'implementation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(TOOL_BOUNDARY_INVARIANTS).toEqual([
      'performs-no-reasoning-makes-no-decision',
      'holds-no-permission-no-policy-never-grants-or-escalates-authority',
      'never-orchestrates-schedules-executes-itself-carries-no-truth-or-intelligence',
      'used-only-within-governance-rules-and-safety-limits',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of TOOL_BOUNDARY_PRINCIPLES) {
      expect(TOOL_BOUNDARY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_BOUNDARIES) {
      expect(TOOL_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_BOUNDARY_INVARIANTS) {
      expect(TOOL_BOUNDARY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_BOUNDARY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(TOOL_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(TOOL_BOUNDARY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_BOUNDARY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_BOUNDARY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
