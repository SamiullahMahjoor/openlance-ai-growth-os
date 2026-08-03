import { describe, expect, it } from 'vitest';

import {
  OPERATIONS_ARCHITECTURE_INVARIANTS,
  OPERATIONS_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
  OPERATIONS_ARCHITECTURE_PRINCIPLES,
  OPERATIONS_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  OPERATIONS_PARTS,
  OPERATIONS_PART_DESCRIPTIONS,
} from '../src/index';

describe('operations / architecture (ai/operations/operations-architecture.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(OPERATIONS_ARCHITECTURE_PRINCIPLES).toEqual([
      'operating-is-a-discipline-not-a-behavior',
      'operating-has-a-distinct-identity',
      'operating-is-composed-of-defined-parts',
      'the-operational-structure-is-deterministic',
    ]);
  });

  it('defines exactly the six parts the operational model is composed of', () => {
    expect(OPERATIONS_PARTS).toEqual([
      'observability',
      'monitoring',
      'health',
      'incident',
      'diagnostic',
      'maintenance',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(OPERATIONS_ARCHITECTURE_INVARIANTS).toEqual([
      'operating-is-a-distinct-identifiable-discipline-separate-from-behavior',
      'composed-of-observability-monitoring-health-incident-diagnostic-and-maintenance',
      'composes-over-runtime-never-orchestrates-schedules-or-changes',
      'same-definition-same-operational-model',
      'defining-structure-is-inert',
    ]);
  });

  it('gives every principle, part, and invariant a non-empty description', () => {
    for (const id of OPERATIONS_ARCHITECTURE_PRINCIPLES) {
      expect(OPERATIONS_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of OPERATIONS_PARTS) {
      expect(OPERATIONS_PART_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of OPERATIONS_ARCHITECTURE_INVARIANTS) {
      expect(OPERATIONS_ARCHITECTURE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(OPERATIONS_ARCHITECTURE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_PARTS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_ARCHITECTURE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_PART_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(OPERATIONS_ARCHITECTURE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
