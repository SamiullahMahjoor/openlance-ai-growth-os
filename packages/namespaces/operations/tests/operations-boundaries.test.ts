import { describe, expect, it } from 'vitest';

import {
  OPERATIONS_BOUNDARIES,
  OPERATIONS_BOUNDARY_DESCRIPTIONS,
  OPERATIONS_BOUNDARY_INVARIANTS,
  OPERATIONS_BOUNDARY_INVARIANT_DESCRIPTIONS,
  OPERATIONS_BOUNDARY_PRINCIPLES,
  OPERATIONS_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('operations / boundaries (ai/operations/operations-boundaries.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(OPERATIONS_BOUNDARY_PRINCIPLES).toEqual([
      'operations-operates-it-does-not-reason-execute-or-change-behavior',
      'operations-changes-no-rule-and-no-behavior',
      'operations-owns-no-protection-or-judgment',
      'operations-carries-no-truth-and-no-tool',
    ]);
  });

  it('defines exactly the six architectural boundaries', () => {
    expect(OPERATIONS_BOUNDARIES).toEqual([
      'behavior',
      'runtime',
      'governance',
      'safety-and-evaluation',
      'evolution',
      'implementation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(OPERATIONS_BOUNDARY_INVARIANTS).toEqual([
      'observes-and-maintains-never-produces-or-changes-behavior',
      'never-orchestrates-schedules-or-executes-never-defines-or-changes-a-governance-rule',
      'observes-safety-and-evaluation-signals-defers-protection-and-judgment',
      'carries-no-business-truth-owns-no-tool-dashboard-infrastructure-or-deployment-system',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of OPERATIONS_BOUNDARY_PRINCIPLES) {
      expect(OPERATIONS_BOUNDARY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of OPERATIONS_BOUNDARIES) {
      expect(OPERATIONS_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of OPERATIONS_BOUNDARY_INVARIANTS) {
      expect(OPERATIONS_BOUNDARY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(OPERATIONS_BOUNDARY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_BOUNDARY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_BOUNDARY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_BOUNDARY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
