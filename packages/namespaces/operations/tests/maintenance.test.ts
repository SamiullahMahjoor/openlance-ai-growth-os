import { describe, expect, it } from 'vitest';

import {
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_CATEGORY_DESCRIPTIONS,
  MAINTENANCE_INVARIANTS,
  MAINTENANCE_INVARIANT_DESCRIPTIONS,
  MAINTENANCE_PRINCIPLES,
  MAINTENANCE_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('operations / maintenance (ai/operations/maintenance.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MAINTENANCE_PRINCIPLES).toEqual([
      'maintenance-upkeeps-operation-it-never-changes-behavior',
      'maintenance-is-categorized',
      'maintenance-is-governed-and-validated',
      'maintenance-follows-a-defined-lifecycle',
    ]);
  });

  it('defines exactly the three maintenance categories', () => {
    expect(MAINTENANCE_CATEGORIES).toEqual(['corrective', 'preventive', 'adaptive']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(MAINTENANCE_INVARIANTS).toEqual([
      'keeps-operation-in-good-order-never-changes-the-behavior-of-a-namespace',
      'every-maintenance-activity-falls-into-a-defined-category-by-its-intent',
      'permitted-under-governance-bounded-by-safety-follows-a-lifecycle-from-plan-to-completion',
      'a-change-a-maintenance-applies-is-versioned',
      'maintaining-operation-is-inert',
    ]);
  });

  it('gives every principle, category, and invariant a non-empty description', () => {
    for (const id of MAINTENANCE_PRINCIPLES) {
      expect(MAINTENANCE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MAINTENANCE_CATEGORIES) {
      expect(MAINTENANCE_CATEGORY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MAINTENANCE_INVARIANTS) {
      expect(MAINTENANCE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MAINTENANCE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MAINTENANCE_CATEGORIES)).toBe(true);
    expect(Object.isFrozen(MAINTENANCE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MAINTENANCE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MAINTENANCE_CATEGORY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MAINTENANCE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
