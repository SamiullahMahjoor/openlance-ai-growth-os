import { describe, expect, it } from 'vitest';

import {
  CHANGE_GOVERNANCE_MANDATES,
  CHANGE_GOVERNANCE_MANDATE_DESCRIPTIONS,
  CHANGE_GOVERNANCE_PRINCIPLES,
  CHANGE_GOVERNANCE_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('governance / change governance (ai/governance/change-governance.md)', () => {
  it('defines exactly the five change-governance principles in constitutional order', () => {
    expect(CHANGE_GOVERNANCE_PRINCIPLES).toEqual([
      'governed-never-emergent',
      'approval-precedes-change',
      'autonomy-expands-deliberately',
      'preserves-the-invariants',
      'runtime-never-changes-governance',
    ]);
  });

  it('defines exactly the six change-governance mandates in constitutional order', () => {
    expect(CHANGE_GOVERNANCE_MANDATES).toEqual([
      'governed-approval',
      'governance-review',
      'controlled-autonomy-evolution',
      'no-runtime-self-modification',
      'invariants-preserved',
      'traceable-change',
    ]);
  });

  it('gives every principle and mandate a non-empty description', () => {
    for (const id of CHANGE_GOVERNANCE_PRINCIPLES) {
      expect(CHANGE_GOVERNANCE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of CHANGE_GOVERNANCE_MANDATES) {
      expect(CHANGE_GOVERNANCE_MANDATE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(CHANGE_GOVERNANCE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(CHANGE_GOVERNANCE_MANDATES)).toBe(true);
    expect(Object.isFrozen(CHANGE_GOVERNANCE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(CHANGE_GOVERNANCE_MANDATE_DESCRIPTIONS)).toBe(true);
  });
});
