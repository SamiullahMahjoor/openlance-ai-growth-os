import { describe, expect, it } from 'vitest';

import {
  EXECUTION_BOUNDARIES,
  EXECUTION_BOUNDARY_DESCRIPTIONS,
  EXECUTION_BOUNDARY_INVARIANTS,
  EXECUTION_BOUNDARY_INVARIANT_DESCRIPTIONS,
  EXECUTION_BOUNDARY_PRINCIPLES,
  EXECUTION_BOUNDARY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('runtime / execution boundaries (ai/runtime/execution-boundaries.md)', () => {
  it('defines exactly the five principles in constitutional order', () => {
    expect(EXECUTION_BOUNDARY_PRINCIPLES).toEqual([
      'an-execution-is-scoped',
      'executions-are-isolated',
      'an-execution-stays-within-its-grant',
      'an-execution-never-crosses-the-layer-boundaries',
      'bounds-hold-at-any-scale',
    ]);
  });

  it('defines exactly the five architectural boundaries in constitutional order', () => {
    expect(EXECUTION_BOUNDARIES).toEqual(['scope', 'isolation', 'authority', 'layer', 'resource']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EXECUTION_BOUNDARY_INVARIANTS).toEqual([
      'acts-only-within-granted-scope-authority-and-autonomy',
      'isolated-from-every-other-execution',
      'never-writes-truth-never-changes-ownership-or-governance',
      'releases-resources-at-closure',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of EXECUTION_BOUNDARY_PRINCIPLES) {
      expect(EXECUTION_BOUNDARY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EXECUTION_BOUNDARIES) {
      expect(EXECUTION_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EXECUTION_BOUNDARY_INVARIANTS) {
      expect(EXECUTION_BOUNDARY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EXECUTION_BOUNDARY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EXECUTION_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(EXECUTION_BOUNDARY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_BOUNDARY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_BOUNDARY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
