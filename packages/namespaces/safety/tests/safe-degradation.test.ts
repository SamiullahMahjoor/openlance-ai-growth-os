import { describe, expect, it } from 'vitest';

import {
  SAFE_DEGRADATION_INVARIANTS,
  SAFE_DEGRADATION_INVARIANT_DESCRIPTIONS,
  SAFE_DEGRADATION_PRINCIPLES,
  SAFE_DEGRADATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('safety / safe degradation (ai/safety/safe-degradation.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(SAFE_DEGRADATION_PRINCIPLES).toEqual([
      'reduces-capability-never-protection',
      'graceful-and-controlled',
      'safe-state-always-reachable',
      'recoverable',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(SAFE_DEGRADATION_INVARIANTS).toEqual([
      'degradation-reduces-capability-not-protection',
      'safe-mode-and-stop-always-reachable',
      'graceful-controlled-never-abrupt',
      'returns-only-when-safe',
      'degrading-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of SAFE_DEGRADATION_PRINCIPLES) {
      expect(SAFE_DEGRADATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of SAFE_DEGRADATION_INVARIANTS) {
      expect(SAFE_DEGRADATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(SAFE_DEGRADATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(SAFE_DEGRADATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(SAFE_DEGRADATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(SAFE_DEGRADATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
