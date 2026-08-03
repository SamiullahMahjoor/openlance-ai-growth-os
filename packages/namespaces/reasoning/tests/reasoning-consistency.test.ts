import { describe, expect, it } from 'vitest';

import {
  REASONING_CONSISTENCY_INVARIANTS,
  REASONING_CONSISTENCY_INVARIANT_DESCRIPTIONS,
  REASONING_CONSISTENCY_PRINCIPLES,
  REASONING_CONSISTENCY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('reasoning / reasoning consistency (ai/reasoning/reasoning-consistency.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(REASONING_CONSISTENCY_PRINCIPLES).toEqual([
      'reasoning-contains-no-contradiction',
      'the-same-inputs-yield-one-conclusion',
      'contradiction-is-surfaced-not-buried',
      'consistency-is-preserved-across-the-reasoning',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(REASONING_CONSISTENCY_INVARIANTS).toEqual([
      'no-contradiction-among-steps-findings-and-basis',
      'exactly-one-conclusion-per-inputs',
      'a-contradiction-is-resolved-or-no-conclusion',
      'maintaining-consistency-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of REASONING_CONSISTENCY_PRINCIPLES) {
      expect(REASONING_CONSISTENCY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_CONSISTENCY_INVARIANTS) {
      expect(REASONING_CONSISTENCY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REASONING_CONSISTENCY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(REASONING_CONSISTENCY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REASONING_CONSISTENCY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_CONSISTENCY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
