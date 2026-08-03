import { describe, expect, it } from 'vitest';

import {
  RUNTIME_CONCERNS,
  RUNTIME_CONCERN_DESCRIPTIONS,
  RUNTIME_INVARIANTS,
  RUNTIME_INVARIANT_DESCRIPTIONS,
} from '../src/index';

describe('runtime / namespace (ai/runtime/README.md, ai/runtime/runtime.md)', () => {
  it('defines exactly the eight runtime invariants in constitutional order', () => {
    expect(RUNTIME_INVARIANTS).toEqual([
      'governance-precedes-execution',
      'every-execution-has-a-defined-lifecycle',
      'owns-no-truth-rule-or-behavior',
      'stays-within-its-grant',
      'failure-is-handled-safely',
      'execution-is-observable',
      'changes-nothing-at-execution-time',
      'scales-independently',
    ]);
  });

  it('defines exactly the ten execution-model concerns in inventory order', () => {
    expect(RUNTIME_CONCERNS).toEqual([
      'execution-lifecycle',
      'session-lifecycle',
      'execution-states',
      'execution-workflow',
      'context-loading',
      'knowledge-resolution',
      'validation-pipeline',
      'execution-boundaries',
      'failure-recovery',
      'event-lifecycle',
    ]);
  });

  it('gives every invariant and concern a non-empty description', () => {
    for (const id of RUNTIME_INVARIANTS) {
      expect(RUNTIME_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RUNTIME_CONCERNS) {
      expect(RUNTIME_CONCERN_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(RUNTIME_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(RUNTIME_CONCERNS)).toBe(true);
    expect(Object.isFrozen(RUNTIME_INVARIANT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RUNTIME_CONCERN_DESCRIPTIONS)).toBe(true);
  });
});
