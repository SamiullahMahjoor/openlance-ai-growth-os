import { describe, expect, it } from 'vitest';

import {
  REFUSAL_CATEGORIES,
  REFUSAL_CATEGORY_DESCRIPTIONS,
  REFUSAL_MODEL_INVARIANTS,
  REFUSAL_MODEL_INVARIANT_DESCRIPTIONS,
  REFUSAL_MODEL_PRINCIPLES,
  REFUSAL_MODEL_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('safety / refusal model (ai/safety/refusal-model.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(REFUSAL_MODEL_PRINCIPLES).toEqual([
      'protective-not-punitive',
      'proportionate-and-correct',
      'graceful',
      'recoverable',
    ]);
  });

  it('defines exactly the three refusal categories in constitutional order', () => {
    expect(REFUSAL_CATEGORIES).toEqual(['protective', 'constitutional', 'escalation']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(REFUSAL_MODEL_INVARIANTS).toEqual([
      'declines-only-unsafe-never-fails-open',
      'refuses-when-and-only-when-required',
      'leaves-safe-state-recoverable',
      'not-retried-unless-hazard-resolved',
      'refusing-is-inert',
    ]);
  });

  it('gives every principle, category, and invariant a non-empty description', () => {
    for (const id of REFUSAL_MODEL_PRINCIPLES) {
      expect(REFUSAL_MODEL_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REFUSAL_CATEGORIES) {
      expect(REFUSAL_CATEGORY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REFUSAL_MODEL_INVARIANTS) {
      expect(REFUSAL_MODEL_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REFUSAL_MODEL_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(REFUSAL_CATEGORIES)).toBe(true);
    expect(Object.isFrozen(REFUSAL_MODEL_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REFUSAL_MODEL_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REFUSAL_CATEGORY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REFUSAL_MODEL_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
