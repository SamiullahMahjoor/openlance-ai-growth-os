import { describe, expect, it } from 'vitest';

import {
  SAFETY_PRINCIPLES,
  SAFETY_PRINCIPLE_DESCRIPTIONS,
  SAFETY_PRINCIPLES_INVARIANTS,
  SAFETY_PRINCIPLES_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('safety / safety principles (ai/safety/safety-principles.md)', () => {
  it('defines exactly the eleven safety principles in constitutional order', () => {
    expect(SAFETY_PRINCIPLES).toEqual([
      'constitutional-safety',
      'least-harm',
      'defense-in-depth',
      'safe-failure',
      'fail-closed',
      'least-privilege-alignment',
      'risk-awareness',
      'uncertainty-first',
      'deterministic-protection',
      'human-accountability',
      'future-proofing',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(SAFETY_PRINCIPLES_INVARIANTS).toEqual([
      'operates-within-governance-never-overrides',
      'unconfirmed-refuses-escalates-degrades',
      'layered-no-single-failure',
      'same-hazard-same-response',
      'stating-a-principle-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of SAFETY_PRINCIPLES) {
      expect(SAFETY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of SAFETY_PRINCIPLES_INVARIANTS) {
      expect(SAFETY_PRINCIPLES_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(SAFETY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(SAFETY_PRINCIPLES_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(SAFETY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(SAFETY_PRINCIPLES_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
