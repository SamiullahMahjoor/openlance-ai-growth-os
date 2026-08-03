import { describe, expect, it } from 'vitest';

import {
  PROVIDER_BOUNDARIES,
  PROVIDER_BOUNDARIES_INVARIANTS,
  PROVIDER_BOUNDARIES_INVARIANT_DESCRIPTIONS,
  PROVIDER_BOUNDARIES_PRINCIPLES,
  PROVIDER_BOUNDARIES_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_BOUNDARY_DESCRIPTIONS,
} from '../src/index';

describe('providers / provider boundaries (ai/providers/provider-boundaries.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROVIDER_BOUNDARIES_PRINCIPLES).toEqual([
      'abstracts-not-reason-express-retain-retrieve-execute',
      'carries-no-truth',
      'produces-no-intelligence',
      'stays-within-governance-and-safety',
    ]);
  });

  it('defines exactly the six architectural boundaries in constitutional order', () => {
    expect(PROVIDER_BOUNDARIES).toEqual([
      'behavior',
      'execution',
      'truth',
      'actor',
      'governance-and-safety',
      'implementation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROVIDER_BOUNDARIES_INVARIANTS).toEqual([
      'abstracts-never-reasons-expresses-retains-retrieves-executes',
      'no-truth-no-intelligence',
      'composed-never-actor',
      'used-within-governance-and-safety',
      'enforcing-a-boundary-is-inert',
    ]);
  });

  it('gives every principle, boundary, and invariant a non-empty description', () => {
    for (const id of PROVIDER_BOUNDARIES_PRINCIPLES) {
      expect(PROVIDER_BOUNDARIES_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_BOUNDARIES) {
      expect(PROVIDER_BOUNDARY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_BOUNDARIES_INVARIANTS) {
      expect(PROVIDER_BOUNDARIES_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_BOUNDARIES_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_BOUNDARIES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_BOUNDARIES_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_BOUNDARIES_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_BOUNDARY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_BOUNDARIES_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
