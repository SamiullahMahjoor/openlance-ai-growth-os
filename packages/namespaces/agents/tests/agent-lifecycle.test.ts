import { describe, expect, it } from 'vitest';

import {
  AGENT_LIFECYCLE_INVARIANTS,
  AGENT_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  AGENT_LIFECYCLE_PHASES,
  AGENT_LIFECYCLE_PHASE_DESCRIPTIONS,
  AGENT_LIFECYCLE_PRINCIPLES,
  AGENT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  agentPhaseAtOrAfter,
} from '../src/index';

describe('agents / agent lifecycle (ai/agents/agent-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(AGENT_LIFECYCLE_PRINCIPLES).toEqual([
      'an-agent-has-a-defined-beginning-and-end',
      'registration-precedes-activation',
      'discovery-follows-registration',
      'retirement-is-clean',
    ]);
  });

  it('defines exactly the five ordered phases, registration to retirement', () => {
    expect(AGENT_LIFECYCLE_PHASES).toEqual([
      'registration',
      'discovery',
      'activation',
      'operation',
      'retirement',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(AGENT_LIFECYCLE_INVARIANTS).toEqual([
      'registered-before-discoverable-discoverable-before-activated',
      'acts-only-while-active-activation-never-widens-capabilities-or-permissions',
      'retired-agent-releases-identity-and-holdings-acts-no-more',
      'retirement-bounded-never-corrupts-another-agent',
      'a-lifecycle-transition-is-inert',
    ]);
  });

  it('gives every principle, phase, and invariant a non-empty description', () => {
    for (const id of AGENT_LIFECYCLE_PRINCIPLES) {
      expect(AGENT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_LIFECYCLE_PHASES) {
      expect(AGENT_LIFECYCLE_PHASE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_LIFECYCLE_INVARIANTS) {
      expect(AGENT_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('agentPhaseAtOrAfter', () => {
    it('holds for a later or equal phase and is false for an earlier phase', () => {
      expect(agentPhaseAtOrAfter('retirement', 'registration')).toBe(true);
      expect(agentPhaseAtOrAfter('operation', 'operation')).toBe(true);
      expect(agentPhaseAtOrAfter('registration', 'retirement')).toBe(false);
    });

    it('agrees with the declared phase order across the whole lifecycle', () => {
      AGENT_LIFECYCLE_PHASES.forEach((a, i) => {
        AGENT_LIFECYCLE_PHASES.forEach((b, j) => {
          expect(agentPhaseAtOrAfter(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(AGENT_LIFECYCLE_PHASES)).toBe(true);
    expect(Object.isFrozen(AGENT_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_LIFECYCLE_PHASE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
