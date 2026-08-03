import { describe, expect, it } from 'vitest';

import {
  POLICY_ENFORCEMENT_MANDATES,
  POLICY_ENFORCEMENT_MANDATE_DESCRIPTIONS,
  POLICY_ENFORCEMENT_PRINCIPLES,
  POLICY_ENFORCEMENT_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('governance / policy enforcement (ai/governance/policy-enforcement.md)', () => {
  it('defines exactly the four policy-enforcement principles in constitutional order', () => {
    expect(POLICY_ENFORCEMENT_PRINCIPLES).toEqual([
      'policies-precede-runtime',
      'precedence-follows-authority',
      'enforcement-is-consistent',
      'exceptions-are-governed',
    ]);
  });

  it('defines exactly the six policy-enforcement mandates in constitutional order', () => {
    expect(POLICY_ENFORCEMENT_MANDATES).toEqual([
      'enforced-not-advisory',
      'precedence-by-authority',
      'business-truth-prevails',
      'unresolved-conflict-escalates',
      'governed-exceptions-only',
      'no-silent-override',
    ]);
  });

  it('gives every principle and mandate a non-empty description', () => {
    for (const id of POLICY_ENFORCEMENT_PRINCIPLES) {
      expect(POLICY_ENFORCEMENT_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of POLICY_ENFORCEMENT_MANDATES) {
      expect(POLICY_ENFORCEMENT_MANDATE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(POLICY_ENFORCEMENT_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(POLICY_ENFORCEMENT_MANDATES)).toBe(true);
    expect(Object.isFrozen(POLICY_ENFORCEMENT_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(POLICY_ENFORCEMENT_MANDATE_DESCRIPTIONS)).toBe(true);
  });
});
