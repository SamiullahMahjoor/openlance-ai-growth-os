import { describe, expect, it } from 'vitest';

import {
  HAZARD_CATEGORIES,
  HAZARD_CATEGORY_DESCRIPTIONS,
  HAZARD_IDENTIFICATION_INVARIANTS,
  HAZARD_IDENTIFICATION_INVARIANT_DESCRIPTIONS,
  HAZARD_IDENTIFICATION_PRINCIPLES,
  HAZARD_IDENTIFICATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('safety / hazard identification (ai/safety/hazard-identification.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(HAZARD_IDENTIFICATION_PRINCIPLES).toEqual([
      'identified-before-harm',
      'categorized',
      'no-hazard-hidden',
      'hazards-compound',
    ]);
  });

  it('defines exactly the eight hazard categories in constitutional order', () => {
    expect(HAZARD_CATEGORIES).toEqual([
      'capability',
      'knowledge',
      'permission',
      'reasoning',
      'runtime',
      'prompt',
      'agent',
      'compound',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(HAZARD_IDENTIFICATION_INVARIANTS).toEqual([
      'one-category-compound-distinct',
      'surfaced-never-hidden',
      'categorizes-not-classifies',
      'knowledge-hazard-references-never-restates',
      'identifying-is-inert',
    ]);
  });

  it('gives every principle, category, and invariant a non-empty description', () => {
    for (const id of HAZARD_IDENTIFICATION_PRINCIPLES) {
      expect(HAZARD_IDENTIFICATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of HAZARD_CATEGORIES) {
      expect(HAZARD_CATEGORY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of HAZARD_IDENTIFICATION_INVARIANTS) {
      expect(HAZARD_IDENTIFICATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(HAZARD_IDENTIFICATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(HAZARD_CATEGORIES)).toBe(true);
    expect(Object.isFrozen(HAZARD_IDENTIFICATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(HAZARD_IDENTIFICATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(HAZARD_CATEGORY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(HAZARD_IDENTIFICATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
