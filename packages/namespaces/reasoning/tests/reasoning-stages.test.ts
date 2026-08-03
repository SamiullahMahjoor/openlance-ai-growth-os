import { describe, expect, it } from 'vitest';

import {
  REASONING_STAGES,
  REASONING_STAGE_DESCRIPTIONS,
  REASONING_STAGE_INVARIANTS,
  REASONING_STAGE_INVARIANT_DESCRIPTIONS,
  REASONING_STAGE_PRINCIPLES,
  REASONING_STAGE_PRINCIPLE_DESCRIPTIONS,
  REASONING_STAGE_TRANSITIONS,
  transitionAllowed,
} from '../src/index';

describe('reasoning / reasoning stages (ai/reasoning/reasoning-stages.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(REASONING_STAGE_PRINCIPLES).toEqual([
      'always-in-exactly-one-stage',
      'transitions-are-defined-not-arbitrary',
      'every-reasoning-reaches-a-terminal-stage',
      'the-state-model-is-technology-neutral',
    ]);
  });

  it('defines exactly the ten stages in constitutional listing order', () => {
    expect(REASONING_STAGES).toEqual([
      'initiated',
      'framed',
      'reasoning',
      'uncertain',
      'concluding',
      'validating',
      'concluded',
      'inconclusive',
      'escalated',
      'complete',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(REASONING_STAGE_INVARIANTS).toEqual([
      'exactly-one-stage-at-all-times',
      'concluded-only-via-validating-from-concluding',
      'every-path-reaches-complete',
      'complete-is-terminal',
      'a-stage-change-is-inert',
    ]);
  });

  it('gives every principle, stage, and invariant a non-empty description', () => {
    for (const id of REASONING_STAGE_PRINCIPLES) {
      expect(REASONING_STAGE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_STAGES) {
      expect(REASONING_STAGE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of REASONING_STAGE_INVARIANTS) {
      expect(REASONING_STAGE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('REASONING_STAGE_TRANSITIONS (ai/reasoning/reasoning-stages.md, "Specification")', () => {
    it('is the exact adjacency the constitution enumerates', () => {
      expect(REASONING_STAGE_TRANSITIONS).toEqual({
        initiated: ['framed'],
        framed: ['reasoning'],
        reasoning: ['uncertain', 'concluding', 'escalated', 'inconclusive'],
        uncertain: ['reasoning'],
        concluding: ['validating'],
        validating: ['concluded', 'reasoning'],
        concluded: ['complete'],
        inconclusive: ['complete'],
        escalated: ['complete'],
        complete: [],
      });
    });

    it('has every stage as a key and only known stages as targets', () => {
      const stages = new Set<string>(REASONING_STAGES);
      expect(Object.keys(REASONING_STAGE_TRANSITIONS).sort()).toEqual([...REASONING_STAGES].sort());
      for (const from of REASONING_STAGES) {
        for (const to of REASONING_STAGE_TRANSITIONS[from]) {
          expect(stages.has(to)).toBe(true);
        }
      }
    });

    it('makes Complete the sole terminal stage (no outgoing transition)', () => {
      const terminal = REASONING_STAGES.filter((s) => REASONING_STAGE_TRANSITIONS[s].length === 0);
      expect(terminal).toEqual(['complete']);
    });

    it('routes every outcome stage (Concluded, Inconclusive, Escalated) only to Complete', () => {
      const predecessorsOfComplete = REASONING_STAGES.filter((s) =>
        REASONING_STAGE_TRANSITIONS[s].includes('complete'),
      );
      expect(predecessorsOfComplete).toEqual(['concluded', 'inconclusive', 'escalated']);
      for (const s of predecessorsOfComplete) {
        expect(REASONING_STAGE_TRANSITIONS[s]).toEqual(['complete']);
      }
    });

    it('enters Concluded only from Validating, which is entered only from Concluding', () => {
      const into = (target: string) =>
        REASONING_STAGES.filter((s) => REASONING_STAGE_TRANSITIONS[s].includes(target));
      expect(into('concluded')).toEqual(['validating']);
      expect(into('validating')).toEqual(['concluding']);
    });

    it('freezes the map and every adjacency list', () => {
      expect(Object.isFrozen(REASONING_STAGE_TRANSITIONS)).toBe(true);
      for (const from of REASONING_STAGES) {
        expect(Object.isFrozen(REASONING_STAGE_TRANSITIONS[from])).toBe(true);
      }
    });
  });

  describe('transitionAllowed', () => {
    it('permits exactly the enumerated edges and refuses every other pair', () => {
      REASONING_STAGES.forEach((from) => {
        REASONING_STAGES.forEach((to) => {
          expect(transitionAllowed(from, to)).toBe(REASONING_STAGE_TRANSITIONS[from].includes(to));
        });
      });
    });

    it('permits the forward path and the Reasoning/Uncertain and Validating/Reasoning cycles', () => {
      expect(transitionAllowed('initiated', 'framed')).toBe(true);
      expect(transitionAllowed('framed', 'reasoning')).toBe(true);
      expect(transitionAllowed('reasoning', 'concluding')).toBe(true);
      expect(transitionAllowed('reasoning', 'uncertain')).toBe(true);
      expect(transitionAllowed('uncertain', 'reasoning')).toBe(true);
      expect(transitionAllowed('concluding', 'validating')).toBe(true);
      expect(transitionAllowed('validating', 'concluded')).toBe(true);
      expect(transitionAllowed('validating', 'reasoning')).toBe(true);
      expect(transitionAllowed('concluded', 'complete')).toBe(true);
    });

    it('refuses to leave Complete and refuses undefined jumps', () => {
      REASONING_STAGES.forEach((to) => {
        expect(transitionAllowed('complete', to)).toBe(false);
      });
      expect(transitionAllowed('initiated', 'reasoning')).toBe(false);
      expect(transitionAllowed('reasoning', 'concluded')).toBe(false);
      expect(transitionAllowed('framed', 'complete')).toBe(false);
      expect(transitionAllowed('reasoning', 'reasoning')).toBe(false);
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(REASONING_STAGE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(REASONING_STAGES)).toBe(true);
    expect(Object.isFrozen(REASONING_STAGE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(REASONING_STAGE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_STAGE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(REASONING_STAGE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
