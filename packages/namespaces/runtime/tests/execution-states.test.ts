import { describe, expect, it } from 'vitest';

import {
  EXECUTION_STATES,
  EXECUTION_STATE_DESCRIPTIONS,
  EXECUTION_STATE_INVARIANTS,
  EXECUTION_STATE_INVARIANT_DESCRIPTIONS,
  EXECUTION_STATE_PRINCIPLES,
  EXECUTION_STATE_PRINCIPLE_DESCRIPTIONS,
  EXECUTION_STATE_TRANSITIONS,
  type ExecutionState,
  transitionAllowed,
} from '../src/index';

describe('runtime / execution states (ai/runtime/execution-states.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EXECUTION_STATE_PRINCIPLES).toEqual([
      'an-execution-is-always-in-exactly-one-state',
      'transitions-are-defined-not-arbitrary',
      'every-execution-reaches-a-terminal-state',
      'the-state-model-is-technology-neutral',
    ]);
  });

  it('defines exactly the thirteen states in constitutional listing order', () => {
    expect(EXECUTION_STATES).toEqual([
      'created',
      'initializing',
      'loading',
      'validating',
      'ready',
      'executing',
      'waiting',
      'paused',
      'recovering',
      'completed',
      'cancelled',
      'failed',
      'closed',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(EXECUTION_STATE_INVARIANTS).toEqual([
      'exactly-one-state-at-all-times',
      'executing-entered-only-from-ready-which-only-after-validating-passed',
      'every-path-reaches-closed',
      'closed-is-terminal',
      'a-state-change-is-inert',
    ]);
  });

  it('gives every principle, state, and invariant a non-empty description', () => {
    for (const id of EXECUTION_STATE_PRINCIPLES) {
      expect(EXECUTION_STATE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EXECUTION_STATES) {
      expect(EXECUTION_STATE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EXECUTION_STATE_INVARIANTS) {
      expect(EXECUTION_STATE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('EXECUTION_STATE_TRANSITIONS (ai/runtime/execution-states.md + failure-recovery.md)', () => {
    it('is the exact adjacency the constitution enumerates', () => {
      expect(EXECUTION_STATE_TRANSITIONS).toEqual({
        created: ['initializing'],
        initializing: ['loading'],
        loading: ['validating'],
        validating: ['ready', 'cancelled', 'failed'],
        ready: ['executing'],
        executing: ['waiting', 'paused', 'recovering', 'completed'],
        waiting: ['executing'],
        paused: ['executing'],
        recovering: ['executing', 'failed'],
        completed: ['closed'],
        cancelled: ['closed'],
        failed: ['closed'],
        closed: [],
      });
    });

    it('has every state as a key and only known states as targets', () => {
      const states = new Set<string>(EXECUTION_STATES);
      expect(Object.keys(EXECUTION_STATE_TRANSITIONS).sort()).toEqual([...EXECUTION_STATES].sort());
      for (const from of EXECUTION_STATES) {
        for (const to of EXECUTION_STATE_TRANSITIONS[from]) {
          expect(states.has(to)).toBe(true);
        }
      }
    });

    it('makes Closed the sole terminal state (no outgoing transition)', () => {
      const terminal = EXECUTION_STATES.filter((s) => EXECUTION_STATE_TRANSITIONS[s].length === 0);
      expect(terminal).toEqual(['closed']);
    });

    it('routes the terminal outcome states (Completed, Cancelled, Failed) only to Closed', () => {
      const predecessorsOfClosed = EXECUTION_STATES.filter((s) =>
        EXECUTION_STATE_TRANSITIONS[s].includes('closed'),
      );
      expect(predecessorsOfClosed).toEqual(['completed', 'cancelled', 'failed']);
      for (const s of predecessorsOfClosed) {
        expect(EXECUTION_STATE_TRANSITIONS[s]).toEqual(['closed']);
      }
    });

    it('enters Ready only from Validating, so Executing is gated by a passed Validating', () => {
      const into = (target: ExecutionState) =>
        EXECUTION_STATES.filter((s) => EXECUTION_STATE_TRANSITIONS[s].includes(target));
      expect(into('ready')).toEqual(['validating']);
      expect(EXECUTION_STATE_TRANSITIONS.ready).toEqual(['executing']);
    });

    it('reaches Closed from every state (the every-path-reaches-Closed invariant)', () => {
      for (const start of EXECUTION_STATES) {
        const seen = new Set<ExecutionState>([start]);
        const queue: ExecutionState[] = [start];
        let reachesClosed = start === 'closed';
        while (queue.length > 0) {
          const s = queue.shift() as ExecutionState;
          for (const next of EXECUTION_STATE_TRANSITIONS[s]) {
            if (next === 'closed') reachesClosed = true;
            if (!seen.has(next)) {
              seen.add(next);
              queue.push(next);
            }
          }
        }
        expect(reachesClosed).toBe(true);
      }
    });

    it('freezes the map and every adjacency list', () => {
      expect(Object.isFrozen(EXECUTION_STATE_TRANSITIONS)).toBe(true);
      for (const from of EXECUTION_STATES) {
        expect(Object.isFrozen(EXECUTION_STATE_TRANSITIONS[from])).toBe(true);
      }
    });
  });

  describe('transitionAllowed', () => {
    it('permits exactly the enumerated edges and refuses every other pair', () => {
      EXECUTION_STATES.forEach((from) => {
        EXECUTION_STATES.forEach((to) => {
          expect(transitionAllowed(from, to)).toBe(EXECUTION_STATE_TRANSITIONS[from].includes(to));
        });
      });
    });

    it('permits the forward path, the resume edges, and the terminal edges', () => {
      expect(transitionAllowed('created', 'initializing')).toBe(true);
      expect(transitionAllowed('loading', 'validating')).toBe(true);
      expect(transitionAllowed('validating', 'ready')).toBe(true);
      expect(transitionAllowed('validating', 'cancelled')).toBe(true);
      expect(transitionAllowed('ready', 'executing')).toBe(true);
      expect(transitionAllowed('executing', 'recovering')).toBe(true);
      expect(transitionAllowed('waiting', 'executing')).toBe(true);
      expect(transitionAllowed('paused', 'executing')).toBe(true);
      expect(transitionAllowed('recovering', 'executing')).toBe(true);
      expect(transitionAllowed('recovering', 'failed')).toBe(true);
      expect(transitionAllowed('failed', 'closed')).toBe(true);
    });

    it('refuses to leave Closed and refuses undefined jumps', () => {
      EXECUTION_STATES.forEach((to) => {
        expect(transitionAllowed('closed', to)).toBe(false);
      });
      expect(transitionAllowed('created', 'executing')).toBe(false);
      expect(transitionAllowed('validating', 'executing')).toBe(false);
      expect(transitionAllowed('executing', 'closed')).toBe(false);
      expect(transitionAllowed('recovering', 'completed')).toBe(false);
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EXECUTION_STATE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(EXECUTION_STATES)).toBe(true);
    expect(Object.isFrozen(EXECUTION_STATE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_STATE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_STATE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EXECUTION_STATE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
