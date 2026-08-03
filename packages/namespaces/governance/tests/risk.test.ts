import { describe, expect, it } from 'vitest';

import {
  TRUST_LEVELS,
  higherTrust,
  requiredOversight,
  requiresHumanApproval,
  trustAtLeast,
  type TrustLevel,
} from '../src/index';

describe('governance / risk and trust (ai/governance/risk-management.md)', () => {
  it('defines exactly the four governance trust levels in constitutional order', () => {
    expect(TRUST_LEVELS).toEqual(['low', 'moderate', 'high', 'critical']);
  });

  it('exposes the trust levels as immutable truth', () => {
    expect(Object.isFrozen(TRUST_LEVELS)).toBe(true);
  });

  it('maps each trust level to the oversight the constitution requires', () => {
    expect(requiredOversight('low')).toBe('standing-rules');
    expect(requiredOversight('moderate')).toBe('standing-rules-with-traceability');
    expect(requiredOversight('high')).toBe('human-review');
    expect(requiredOversight('critical')).toBe('human-approval');
  });

  it('requires human approval only for a Critical action', () => {
    expect(requiresHumanApproval('critical')).toBe(true);
    const nonCritical: TrustLevel[] = ['low', 'moderate', 'high'];
    for (const level of nonCritical) {
      expect(requiresHumanApproval(level)).toBe(false);
    }
  });

  it('orders trust levels by increasing consequence', () => {
    expect(trustAtLeast('critical', 'low')).toBe(true);
    expect(trustAtLeast('high', 'high')).toBe(true);
    expect(trustAtLeast('low', 'critical')).toBe(false);
  });

  it('governs unclear or combined risk at the higher level', () => {
    expect(higherTrust('low', 'critical')).toBe('critical');
    expect(higherTrust('critical', 'low')).toBe('critical');
    expect(higherTrust('moderate', 'moderate')).toBe('moderate');
  });

  it('is deterministic: the same inputs always yield the same outputs', () => {
    expect(requiredOversight('high')).toBe(requiredOversight('high'));
    expect(higherTrust('low', 'high')).toBe(higherTrust('low', 'high'));
  });
});
