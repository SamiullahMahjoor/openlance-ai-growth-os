import { describe, expect, it } from 'vitest';

import {
  INCIDENT_MANAGEMENT_INVARIANTS,
  INCIDENT_MANAGEMENT_INVARIANT_DESCRIPTIONS,
  INCIDENT_MANAGEMENT_PRINCIPLES,
  INCIDENT_MANAGEMENT_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('operations / incident management (ai/operations/incident-management.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(INCIDENT_MANAGEMENT_PRINCIPLES).toEqual([
      'an-incident-is-a-discrete-operational-disruption',
      'an-incident-is-classified',
      'response-restores-operation-it-never-changes-behavior',
      'an-incident-is-not-a-safety-hazard',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(INCIDENT_MANAGEMENT_INVARIANTS).toEqual([
      'a-discrete-disruption-with-a-defined-lifecycle-from-recognition-to-closure',
      'every-incident-is-classified-by-severity-and-kind',
      'a-response-restores-operation-never-changes-behavior',
      'an-incident-implying-a-hazard-defers-to-safety-and-governance',
      'managing-an-incident-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of INCIDENT_MANAGEMENT_PRINCIPLES) {
      expect(INCIDENT_MANAGEMENT_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of INCIDENT_MANAGEMENT_INVARIANTS) {
      expect(INCIDENT_MANAGEMENT_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(INCIDENT_MANAGEMENT_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(INCIDENT_MANAGEMENT_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(INCIDENT_MANAGEMENT_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(INCIDENT_MANAGEMENT_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
