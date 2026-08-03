import { describe, expect, it } from 'vitest';

import {
  SESSION_LIFECYCLE_INVARIANTS,
  SESSION_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  SESSION_LIFECYCLE_PHASES,
  SESSION_LIFECYCLE_PHASE_DESCRIPTIONS,
  SESSION_LIFECYCLE_PRINCIPLES,
  SESSION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  sessionPhaseAtOrAfter,
} from '../src/index';

describe('runtime / session lifecycle (ai/runtime/session-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(SESSION_LIFECYCLE_PRINCIPLES).toEqual([
      'a-session-is-a-bounded-container',
      'executions-run-within-a-session',
      'sessions-terminate-cleanly',
      'the-session-owns-no-persistence',
    ]);
  });

  it('defines exactly the three ordered phases, establishment to closure', () => {
    expect(SESSION_LIFECYCLE_PHASES).toEqual(['establishment', 'active', 'closure']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(SESSION_LIFECYCLE_INVARIANTS).toEqual([
      'one-lifecycle-per-session',
      'every-execution-belongs-to-exactly-one-session',
      'closing-brings-executions-terminal-releases-resources',
      'session-never-persists-state-on-its-own',
      'session-lifecycle-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of SESSION_LIFECYCLE_PRINCIPLES) {
      expect(SESSION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of SESSION_LIFECYCLE_PHASES) {
      expect(SESSION_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of SESSION_LIFECYCLE_INVARIANTS) {
      expect(SESSION_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('sessionPhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(sessionPhaseAtOrAfter('closure', 'establishment')).toBe(true);
      expect(sessionPhaseAtOrAfter('active', 'active')).toBe(true);
      expect(sessionPhaseAtOrAfter('establishment', 'closure')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      SESSION_LIFECYCLE_PHASES.forEach((a, i) => {
        SESSION_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(sessionPhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(SESSION_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(SESSION_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(SESSION_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(SESSION_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(SESSION_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(SESSION_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
