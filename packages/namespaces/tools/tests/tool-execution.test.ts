import { describe, expect, it } from 'vitest';

import {
  TOOL_EXECUTION_INVARIANTS,
  TOOL_EXECUTION_INVARIANT_DESCRIPTIONS,
  TOOL_EXECUTION_PRINCIPLES,
  TOOL_EXECUTION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('tools / tool execution (ai/tools/tool-execution.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(TOOL_EXECUTION_PRINCIPLES).toEqual([
      'execution-is-a-model-not-a-schedule',
      'validation-precedes-execution',
      'execution-is-bounded',
      'execution-ordering-is-acyclic',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(TOOL_EXECUTION_INVARIANTS).toEqual([
      'validated-before-executes-never-executes-when-validation-fails',
      'execution-stays-within-capabilities-and-safety-runtime-limits',
      'steps-follow-defined-acyclic-order-no-execution-cycle',
      'execution-crossing-a-boundary-refused-or-degraded-never-forced',
      'modelling-an-execution-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of TOOL_EXECUTION_PRINCIPLES) {
      expect(TOOL_EXECUTION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of TOOL_EXECUTION_INVARIANTS) {
      expect(TOOL_EXECUTION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(TOOL_EXECUTION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(TOOL_EXECUTION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(TOOL_EXECUTION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(TOOL_EXECUTION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
