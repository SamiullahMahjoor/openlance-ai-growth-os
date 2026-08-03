import { describe, expect, it } from 'vitest';

import {
  ESCALATION_MODEL_INVARIANTS,
  ESCALATION_MODEL_INVARIANT_DESCRIPTIONS,
  ESCALATION_MODEL_PRINCIPLES,
  ESCALATION_MODEL_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('safety / escalation model (ai/safety/escalation-model.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(ESCALATION_MODEL_PRINCIPLES).toEqual([
      'applies-triggers-never-defines',
      'bounded-and-acyclic',
      'higher-risk-higher-priority',
      'reaches-accountable-humans',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(ESCALATION_MODEL_INVARIANTS).toEqual([
      'applies-governed-triggers-never-defines',
      'reaches-authority-finite-no-cycle',
      'higher-risk-higher-priority-never-lowers',
      'reserved-matter-ascends-to-human',
      'routing-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of ESCALATION_MODEL_PRINCIPLES) {
      expect(ESCALATION_MODEL_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of ESCALATION_MODEL_INVARIANTS) {
      expect(ESCALATION_MODEL_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(ESCALATION_MODEL_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(ESCALATION_MODEL_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(ESCALATION_MODEL_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(ESCALATION_MODEL_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
