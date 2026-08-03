import { describe, expect, it } from 'vitest';

import {
  UNCERTAINTY_HANDLING_INVARIANTS,
  UNCERTAINTY_HANDLING_INVARIANT_DESCRIPTIONS,
  UNCERTAINTY_HANDLING_PRINCIPLES,
  UNCERTAINTY_HANDLING_PRINCIPLE_DESCRIPTIONS,
  UNCERTAINTY_KINDS,
  UNCERTAINTY_KIND_DESCRIPTIONS,
} from '../src/index';

describe('reasoning / uncertainty handling (ai/reasoning/uncertainty-handling.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(UNCERTAINTY_HANDLING_PRINCIPLES).toEqual([
      'uncertainty-is-classified-not-scored',
      'uncertainty-is-surfaced-not-hidden',
      'uncertainty-defaults-to-caution',
      'classification-is-deterministic',
    ]);
  });

  it('defines exactly the five architectural kinds of uncertainty in constitutional order', () => {
    expect(UNCERTAINTY_KINDS).toEqual([
      'knowledge',
      'interpretation',
      'conflict',
      'applicability',
      'authority',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(UNCERTAINTY_HANDLING_INVARIANTS).toEqual([
      'uncertainty-is-a-kind-never-a-value',
      'uncertainty-is-made-explicit',
      'unresolvable-uncertainty-yields-no-conclusion-or-escalation',
      'classification-is-deterministic',
      'classifying-is-inert',
    ]);
  });

  it('gives every principle, kind, and invariant a non-empty description', () => {
    for (const id of UNCERTAINTY_HANDLING_PRINCIPLES) {
      expect(UNCERTAINTY_HANDLING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of UNCERTAINTY_KINDS) {
      expect(UNCERTAINTY_KIND_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of UNCERTAINTY_HANDLING_INVARIANTS) {
      expect(UNCERTAINTY_HANDLING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(UNCERTAINTY_HANDLING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(UNCERTAINTY_KINDS)).toBe(true);
    expect(Object.isFrozen(UNCERTAINTY_HANDLING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(UNCERTAINTY_HANDLING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(UNCERTAINTY_KIND_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(UNCERTAINTY_HANDLING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
