import { describe, expect, it } from 'vitest';

import {
  OBSERVABILITY_INVARIANTS,
  OBSERVABILITY_INVARIANT_DESCRIPTIONS,
  OBSERVABILITY_PRINCIPLES,
  OBSERVABILITY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('operations / observability (ai/operations/observability.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(OBSERVABILITY_PRINCIPLES).toEqual([
      'observability-is-visibility-not-watching',
      'a-signal-is-defined-not-raw',
      'observability-observes-it-never-changes',
      'observability-is-neutral',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(OBSERVABILITY_INVARIANTS).toEqual([
      'a-signal-is-a-defined-indication-never-an-undefined-stream-or-business-truth',
      'observing-never-changes-the-behavior-it-observes',
      'operational-awareness-is-a-picture-not-a-judgment-or-decision',
      'signals-defined-technology-neutral-never-a-log-or-tool',
      'making-the-layer-observable-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of OBSERVABILITY_PRINCIPLES) {
      expect(OBSERVABILITY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of OBSERVABILITY_INVARIANTS) {
      expect(OBSERVABILITY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(OBSERVABILITY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(OBSERVABILITY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(OBSERVABILITY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(OBSERVABILITY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
