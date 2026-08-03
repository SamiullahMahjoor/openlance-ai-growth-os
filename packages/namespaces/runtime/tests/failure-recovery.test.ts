import { describe, expect, it } from 'vitest';

import {
  FAILURE_RECOVERY_INVARIANTS,
  FAILURE_RECOVERY_INVARIANT_DESCRIPTIONS,
  FAILURE_RECOVERY_PRINCIPLES,
  FAILURE_RECOVERY_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('runtime / failure and recovery (ai/runtime/failure-recovery.md)', () => {
  it('defines exactly the five principles in constitutional order', () => {
    expect(FAILURE_RECOVERY_PRINCIPLES).toEqual([
      'failure-is-always-handled',
      'the-runtime-handles-governance-decides',
      'recovery-is-bounded',
      'failure-is-safe',
      'termination-is-clean',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(FAILURE_RECOVERY_INVARIANTS).toEqual([
      'every-failure-resolves-to-retry-recovery-or-termination',
      'retries-and-recovery-are-bounded-never-run-without-end',
      'terminated-or-cancelled-reaches-terminal-state-releases-resources',
      'never-continues-against-a-governance-decision-to-stop-escalate-or-refuse',
      'handling-a-failure-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of FAILURE_RECOVERY_PRINCIPLES) {
      expect(FAILURE_RECOVERY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of FAILURE_RECOVERY_INVARIANTS) {
      expect(FAILURE_RECOVERY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(FAILURE_RECOVERY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(FAILURE_RECOVERY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(FAILURE_RECOVERY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(FAILURE_RECOVERY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
