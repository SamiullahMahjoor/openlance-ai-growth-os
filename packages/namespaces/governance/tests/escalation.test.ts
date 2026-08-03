import { describe, expect, it } from 'vitest';

import {
  ESCALATION_PRINCIPLES,
  ESCALATION_PRINCIPLE_DESCRIPTIONS,
  ESCALATION_TRIGGERS,
  ESCALATION_TRIGGER_DESCRIPTIONS,
} from '../src/index';

describe('governance / escalation (ai/governance/escalation.md)', () => {
  it('defines exactly the four escalation principles in constitutional order', () => {
    expect(ESCALATION_PRINCIPLES).toEqual([
      'always-valid',
      'uncertainty-defaults-to-escalation',
      'safe-never-a-failure',
      'preserves-accountability',
    ]);
  });

  it('defines exactly the eight escalation triggers in constitutional order', () => {
    expect(ESCALATION_TRIGGERS).toEqual([
      'beyond-authority',
      'beyond-autonomy',
      'failed-validation',
      'high-risk',
      'unresolved-uncertainty',
      'conflict',
      'deadlock',
      'legal-or-safety-significance',
    ]);
  });

  it('gives every principle and trigger a non-empty description', () => {
    for (const id of ESCALATION_PRINCIPLES) {
      expect(ESCALATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of ESCALATION_TRIGGERS) {
      expect(ESCALATION_TRIGGER_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(ESCALATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(ESCALATION_TRIGGERS)).toBe(true);
    expect(Object.isFrozen(ESCALATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(ESCALATION_TRIGGER_DESCRIPTIONS)).toBe(true);
  });
});
