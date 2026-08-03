import { describe, expect, it } from 'vitest';

import {
  HEALTH_MANAGEMENT_INVARIANTS,
  HEALTH_MANAGEMENT_INVARIANT_DESCRIPTIONS,
  HEALTH_MANAGEMENT_PRINCIPLES,
  HEALTH_MANAGEMENT_PRINCIPLE_DESCRIPTIONS,
  HEALTH_STATES,
  HEALTH_STATE_DESCRIPTIONS,
  healthStateAtOrAfter,
} from '../src/index';

describe('operations / health management (ai/operations/health-management.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(HEALTH_MANAGEMENT_PRINCIPLES).toEqual([
      'health-is-an-operational-state-not-a-behavior',
      'health-is-assessed-from-monitored-signals',
      'health-states-are-defined',
      'assessing-health-observes-it-never-changes',
    ]);
  });

  it('defines exactly the three ordered health states, healthy to failed', () => {
    expect(HEALTH_STATES).toEqual(['healthy', 'degraded', 'failed']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(HEALTH_MANAGEMENT_INVARIANTS).toEqual([
      'health-is-an-operational-state-never-the-behavior-of-the-layer',
      'one-defined-health-state-at-a-time-from-healthy-to-failed',
      'assessed-deterministically-same-monitored-state-same-health-state',
      'reports-and-raises-an-incident-never-protects-degrades-or-decides',
      'assessing-health-is-inert',
    ]);
  });

  it('gives every principle, state, and invariant a non-empty description', () => {
    for (const id of HEALTH_MANAGEMENT_PRINCIPLES) {
      expect(HEALTH_MANAGEMENT_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of HEALTH_STATES) {
      expect(HEALTH_STATE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of HEALTH_MANAGEMENT_INVARIANTS) {
      expect(HEALTH_MANAGEMENT_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('healthStateAtOrAfter', () => {
    it('holds for a later or equal state and is false for an earlier state', () => {
      expect(healthStateAtOrAfter('failed', 'healthy')).toBe(true);
      expect(healthStateAtOrAfter('degraded', 'degraded')).toBe(true);
      expect(healthStateAtOrAfter('healthy', 'failed')).toBe(false);
    });

    it('agrees with the declared state order across the whole set', () => {
      HEALTH_STATES.forEach((a, i) => {
        HEALTH_STATES.forEach((b, j) => {
          expect(healthStateAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(HEALTH_MANAGEMENT_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(HEALTH_STATES)).toBe(true);
    expect(Object.isFrozen(HEALTH_MANAGEMENT_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(HEALTH_MANAGEMENT_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(HEALTH_STATE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(HEALTH_MANAGEMENT_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
