import { describe, expect, it } from 'vitest';

import {
  REASONING_QUALITY_INVARIANTS,
  REASONING_QUALITY_INVARIANT_DESCRIPTIONS,
  REASONING_QUALITY_PRINCIPLES,
  REASONING_QUALITY_PRINCIPLE_DESCRIPTIONS,
  REASONING_QUALITY_PROPERTIES,
  REASONING_QUALITY_PROPERTY_DESCRIPTIONS,
} from '../src/index';

describe('reasoning / reasoning quality (ai/reasoning/reasoning-quality.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(REASONING_QUALITY_PRINCIPLES).toEqual([
      'reasoning-is-complete',
      'reasoning-is-traceable',
      'reasoning-is-sound-in-form',
      'quality-is-a-property-not-a-score',
    ]);
  });

  it('defines exactly the two structural quality properties in constitutional order', () => {
    expect(REASONING_QUALITY_PROPERTIES).toEqual(['completeness', 'traceability']);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(REASONING_QUALITY_INVARIANTS).toEqual([
      'concludes-only-when-complete',
      'every-step-is-explicit-and-traceable',
      'quality-is-structural-never-a-score',
      'assessing-quality-is-inert',
    ]);
  });

  it('gives every principle, property, and invariant a non-empty description', () => {
    for (const id of REASONING_QUALITY_PRINCIPLES) {
      expect(REASONING_QUALITY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_QUALITY_PROPERTIES) {
      expect(REASONING_QUALITY_PROPERTY_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_QUALITY_INVARIANTS) {
      expect(REASONING_QUALITY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REASONING_QUALITY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(REASONING_QUALITY_PROPERTIES)).toBe(true);
    expect(Object.isFrozen(REASONING_QUALITY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REASONING_QUALITY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_QUALITY_PROPERTY_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_QUALITY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
