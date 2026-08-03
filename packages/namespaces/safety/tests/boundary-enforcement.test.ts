import { describe, expect, it } from 'vitest';

import {
  BOUNDARY_ENFORCEMENT_INVARIANTS,
  BOUNDARY_ENFORCEMENT_INVARIANT_DESCRIPTIONS,
  BOUNDARY_ENFORCEMENT_PRINCIPLES,
  BOUNDARY_ENFORCEMENT_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('safety / boundary enforcement (ai/safety/boundary-enforcement.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(BOUNDARY_ENFORCEMENT_PRINCIPLES).toEqual([
      'applies-boundaries-never-defines',
      'boundary-holds-by-default',
      'layered-and-cross-cutting',
      'containment-limits-spread',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(BOUNDARY_ENFORCEMENT_INVARIANTS).toEqual([
      'applies-owned-boundaries-never-defines',
      'proceeds-only-within-boundaries',
      'applied-across-every-layer',
      'hazard-isolated-and-contained',
      'applying-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of BOUNDARY_ENFORCEMENT_PRINCIPLES) {
      expect(BOUNDARY_ENFORCEMENT_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of BOUNDARY_ENFORCEMENT_INVARIANTS) {
      expect(BOUNDARY_ENFORCEMENT_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(BOUNDARY_ENFORCEMENT_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(BOUNDARY_ENFORCEMENT_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(BOUNDARY_ENFORCEMENT_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(BOUNDARY_ENFORCEMENT_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
