import { describe, expect, it } from 'vitest';

import {
  DIAGNOSTICS_INVARIANTS,
  DIAGNOSTICS_INVARIANT_DESCRIPTIONS,
  DIAGNOSTICS_PRINCIPLES,
  DIAGNOSTICS_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('operations / diagnostics (ai/operations/diagnostics.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(DIAGNOSTICS_PRINCIPLES).toEqual([
      'diagnosis-investigates-a-cause-it-does-not-change-behavior',
      'diagnosis-rests-on-observed-signals',
      'diagnosis-is-grounded-and-traceable',
      'diagnosis-observes-it-never-reasons-about-the-task',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(DIAGNOSTICS_INVARIANTS).toEqual([
      'investigates-and-establishes-a-cause-never-changes-the-behavior-investigated',
      'rests-on-observed-signals-traceable-from-signals-to-cause',
      'passes-its-cause-never-fixes-judges-or-protects',
      'investigates-operational-cause-never-performs-the-ais-reasoning',
      'diagnosing-a-problem-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of DIAGNOSTICS_PRINCIPLES) {
      expect(DIAGNOSTICS_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of DIAGNOSTICS_INVARIANTS) {
      expect(DIAGNOSTICS_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(DIAGNOSTICS_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(DIAGNOSTICS_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(DIAGNOSTICS_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(DIAGNOSTICS_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
