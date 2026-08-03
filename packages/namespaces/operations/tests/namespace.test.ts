import { describe, expect, it } from 'vitest';

import {
  OPERATIONS_CONCERNS,
  OPERATIONS_CONCERN_DESCRIPTIONS,
  OPERATIONS_INVARIANTS,
  OPERATIONS_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('operations / namespace (ai/operations/README.md, ai/operations/operations.md)', () => {
  it('defines exactly the seven operational invariants in constitutional order', () => {
    expect(OPERATIONS_INVARIANTS).toEqual([
      'operates-never-changes-behavior',
      'observes-owns-no-behavior',
      'deterministic',
      'changes-no-governance-or-constitutional-behavior',
      'defers-protection-and-judgment',
      'technology-neutral',
      'single-owned-and-scalable',
    ]);
  });

  it('defines exactly the ten operational concerns in inventory order', () => {
    expect(OPERATIONS_CONCERNS).toEqual([
      'operations-architecture',
      'operations-lifecycle',
      'observability',
      'monitoring',
      'incident-management',
      'health-management',
      'diagnostics',
      'maintenance',
      'operations-boundaries',
      'operations-versioning',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of OPERATIONS_INVARIANTS) {
      expect(OPERATIONS_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of OPERATIONS_CONCERNS) {
      expect(OPERATIONS_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(OPERATIONS_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_CONCERNS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
