import { describe, expect, it } from 'vitest';

import {
  PERMISSION_MANDATES,
  PERMISSION_MANDATE_DESCRIPTIONS,
  PERMISSION_PRINCIPLES,
  PERMISSION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('governance / permission governance (ai/governance/permission-governance.md)', () => {
  it('defines exactly the five permission principles in constitutional order', () => {
    expect(PERMISSION_PRINCIPLES).toEqual([
      'least-privilege',
      'granted-not-assumed',
      'delegated-not-invented',
      'bounded',
      'accountable',
    ]);
  });

  it('defines exactly the seven permission mandates in constitutional order', () => {
    expect(PERMISSION_MANDATES).toEqual([
      'minimum-necessary',
      'explicit-grant',
      'bounded-delegation',
      'no-privilege-escalation',
      'boundary-respecting',
      'accountable-ownership',
      'revocable',
    ]);
  });

  it('gives every principle and mandate a non-empty description', () => {
    for (const id of PERMISSION_PRINCIPLES) {
      expect(PERMISSION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PERMISSION_MANDATES) {
      expect(PERMISSION_MANDATE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PERMISSION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PERMISSION_MANDATES)).toBe(true);
    expect(Object.isFrozen(PERMISSION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PERMISSION_MANDATE_DESCRIPTIONS)).toBe(true);
  });
});
