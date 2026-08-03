import { describe, expect, it } from 'vitest';

import {
  MONITORING_INVARIANTS,
  MONITORING_INVARIANT_DESCRIPTIONS,
  MONITORING_PRINCIPLES,
  MONITORING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('operations / monitoring (ai/operations/monitoring.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MONITORING_PRINCIPLES).toEqual([
      'monitoring-watches-it-does-not-produce-signals',
      'monitoring-is-against-a-defined-expectation',
      'monitoring-observes-it-never-changes',
      'monitoring-is-bounded',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(MONITORING_INVARIANTS).toEqual([
      'watches-observability-signals-against-expectations-never-produces-a-signal',
      'a-deviation-is-defined-against-an-expectation-never-opinion',
      'observes-within-bounds-never-reaches-into-or-changes-behavior',
      'a-recognized-deviation-is-passed-to-health-or-incident-never-protects-or-decides',
      'monitoring-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of MONITORING_PRINCIPLES) {
      expect(MONITORING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MONITORING_INVARIANTS) {
      expect(MONITORING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MONITORING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MONITORING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MONITORING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MONITORING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
