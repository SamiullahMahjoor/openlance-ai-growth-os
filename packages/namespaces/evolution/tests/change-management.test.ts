import { describe, expect, it } from 'vitest';

import {
  CHANGE_CATEGORIES,
  CHANGE_CATEGORY_DESCRIPTIONS,
  CHANGE_MANAGEMENT_INVARIANTS,
  CHANGE_MANAGEMENT_INVARIANT_DESCRIPTIONS,
  CHANGE_MANAGEMENT_PRINCIPLES,
  CHANGE_MANAGEMENT_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('evolution / change management (ai/evolution/change-management.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(CHANGE_MANAGEMENT_PRINCIPLES).toEqual([
      'change-is-controlled-never-uncontrolled',
      'change-applies-the-rules-it-does-not-define-them',
      'change-is-categorized',
      'change-preserves-the-constitution',
    ]);
  });

  it('defines exactly the three change categories', () => {
    expect(CHANGE_CATEGORIES).toEqual(['additive', 'amending', 'superseding']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(CHANGE_MANAGEMENT_INVARIANTS).toEqual([
      'every-change-is-classified-into-a-defined-category-and-controlled',
      'change-applies-the-governance-change-rules-never-redefines-them',
      'a-change-preserves-the-constitution-eroding-change-refused-and-escalated',
      'a-change-is-applied-through-the-amendment-workflow-kept-compatible-and-stabilized',
      'modelling-change-is-inert',
    ]);
  });

  it('gives every principle, category, and invariant a non-empty description', () => {
    for (const id of CHANGE_MANAGEMENT_PRINCIPLES) {
      expect(CHANGE_MANAGEMENT_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of CHANGE_CATEGORIES) {
      expect(CHANGE_CATEGORY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of CHANGE_MANAGEMENT_INVARIANTS) {
      expect(CHANGE_MANAGEMENT_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(CHANGE_MANAGEMENT_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(CHANGE_CATEGORIES)).toBe(true);
    expect(Object.isFrozen(CHANGE_MANAGEMENT_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(CHANGE_MANAGEMENT_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(CHANGE_CATEGORY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(CHANGE_MANAGEMENT_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
