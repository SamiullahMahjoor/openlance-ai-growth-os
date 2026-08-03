import { describe, expect, it } from 'vitest';

import {
  PROMPT_ARCHITECTURE_INVARIANTS,
  PROMPT_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
  PROMPT_ARCHITECTURE_PRINCIPLES,
  PROMPT_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  PROMPT_LAYERS,
  PROMPT_LAYER_DESCRIPTIONS,
  promptLayerAtOrAfter,
} from '../src/index';

describe('prompts / prompt architecture (ai/prompts/prompt-architecture.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROMPT_ARCHITECTURE_PRINCIPLES).toEqual([
      'layers-are-architectural-not-content',
      'layers-are-ordered-and-separated',
      'layers-descend-from-constitution-to-task',
      'layers-are-extensible',
    ]);
  });

  it('defines exactly the five ordered layers, governing to task', () => {
    expect(PROMPT_LAYERS).toEqual(['governing', 'role', 'intent', 'context', 'task']);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(PROMPT_ARCHITECTURE_INVARIANTS).toEqual([
      'organized-into-ordered-layers-governing-to-task',
      'each-layer-one-kind-context-separated',
      'a-layer-names-a-role-never-content',
      'defining-layering-is-inert',
    ]);
  });

  it('gives every principle, layer, and invariant a non-empty description', () => {
    for (const id of PROMPT_ARCHITECTURE_PRINCIPLES) {
      expect(PROMPT_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_LAYERS) {
      expect(PROMPT_LAYER_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROMPT_ARCHITECTURE_INVARIANTS) {
      expect(PROMPT_ARCHITECTURE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('promptLayerAtOrAfter', () => {
    it('holds for a more-specific or equal layer and is false for a more-authoritative layer', () => {
      expect(promptLayerAtOrAfter('task', 'governing')).toBe(true);
      expect(promptLayerAtOrAfter('intent', 'intent')).toBe(true);
      expect(promptLayerAtOrAfter('governing', 'task')).toBe(false);
    });

    it('agrees with the declared layer order across the whole set', () => {
      PROMPT_LAYERS.forEach((a, i) => {
        PROMPT_LAYERS.forEach((b, j) => {
          expect(promptLayerAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROMPT_ARCHITECTURE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROMPT_LAYERS)).toBe(true);
    expect(Object.isFrozen(PROMPT_ARCHITECTURE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROMPT_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_LAYER_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROMPT_ARCHITECTURE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
