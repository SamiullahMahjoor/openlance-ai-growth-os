import { describe, expect, it } from 'vitest';

import {
  CONCLUSION_FORMATION_INVARIANTS,
  CONCLUSION_FORMATION_INVARIANT_DESCRIPTIONS,
  CONCLUSION_FORMATION_PRINCIPLES,
  CONCLUSION_FORMATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('reasoning / conclusion formation (ai/reasoning/conclusion-formation.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(CONCLUSION_FORMATION_PRINCIPLES).toEqual([
      'formed-only-when-sufficiently-supported',
      'a-conclusion-is-governed',
      'a-conclusion-follows-from-the-reasoning',
      'no-conclusion-is-preferable-to-an-unsound-one',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(CONCLUSION_FORMATION_INVARIANTS).toEqual([
      'formed-only-when-sufficient-and-permitted-then-validated',
      'a-rule-violating-conclusion-is-not-formed',
      'a-conclusion-is-traceable-to-its-basis',
      'no-sufficient-governed-conclusion-yields-none',
      'forming-a-conclusion-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of CONCLUSION_FORMATION_PRINCIPLES) {
      expect(CONCLUSION_FORMATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of CONCLUSION_FORMATION_INVARIANTS) {
      expect(CONCLUSION_FORMATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(CONCLUSION_FORMATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(CONCLUSION_FORMATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(CONCLUSION_FORMATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(CONCLUSION_FORMATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
