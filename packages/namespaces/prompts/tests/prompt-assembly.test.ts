import { describe, expect, it } from 'vitest';

import {
  PROMPT_ASSEMBLY_INVARIANTS,
  PROMPT_ASSEMBLY_INVARIANT_DESCRIPTIONS,
  PROMPT_ASSEMBLY_PRINCIPLES,
  PROMPT_ASSEMBLY_PRINCIPLE_DESCRIPTIONS,
  PROMPT_ASSEMBLY_STAGES,
  PROMPT_ASSEMBLY_STAGE_DESCRIPTIONS,
  assemblyStageAtOrAfter,
} from '../src/index';

describe('prompts / prompt assembly (ai/prompts/prompt-assembly.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROMPT_ASSEMBLY_PRINCIPLES).toEqual([
      'order-is-fixed-and-deterministic',
      'resolution-precedes-combination',
      'normalization-precedes-validation',
      'order-holds-at-any-scale',
    ]);
  });

  it('defines exactly the six ordered assembly stages', () => {
    expect(PROMPT_ASSEMBLY_STAGES).toEqual([
      'resolve-inheritance',
      'gather-layers-and-template',
      'reference-context',
      'compose',
      'normalize',
      'finalize-for-validation',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROMPT_ASSEMBLY_INVARIANTS).toEqual([
      'stages-occur-in-order',
      'same-parts-same-assembled-prompt',
      'normalization-settles-structure-only',
      'normalized-and-finalized-before-validation-never-expressed',
      'order-is-inert',
    ]);
  });

  it('gives every principle, stage, and invariant a non-empty description', () => {
    for (const id of PROMPT_ASSEMBLY_PRINCIPLES) {
      expect(PROMPT_ASSEMBLY_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_ASSEMBLY_STAGES) {
      expect(PROMPT_ASSEMBLY_STAGE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_ASSEMBLY_INVARIANTS) {
      expect(PROMPT_ASSEMBLY_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('assemblyStageAtOrAfter', () => {
    it('holds for a later or equal stage and is false for an earlier stage', () => {
      expect(assemblyStageAtOrAfter('finalize-for-validation', 'resolve-inheritance')).toBe(true);
      expect(assemblyStageAtOrAfter('compose', 'compose')).toBe(true);
      expect(assemblyStageAtOrAfter('normalize', 'compose')).toBe(true);
      expect(assemblyStageAtOrAfter('resolve-inheritance', 'normalize')).toBe(false);
    });

    it('agrees with the declared stage order across the whole assembly', () => {
      PROMPT_ASSEMBLY_STAGES.forEach((a, i) => {
        PROMPT_ASSEMBLY_STAGES.forEach((b, j) => {
          expect(assemblyStageAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_ASSEMBLY_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROMPT_ASSEMBLY_STAGES)).toBe(true);
    expect(Object.isFrozen(PROMPT_ASSEMBLY_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_ASSEMBLY_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_ASSEMBLY_STAGE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_ASSEMBLY_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
