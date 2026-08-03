import { describe, expect, it } from 'vitest';

import {
  AGENT_COMMUNICATION_INVARIANTS,
  AGENT_COMMUNICATION_INVARIANT_DESCRIPTIONS,
  AGENT_COMMUNICATION_PRINCIPLES,
  AGENT_COMMUNICATION_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('agents / agent communication (ai/agents/agent-communication.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(AGENT_COMMUNICATION_PRINCIPLES).toEqual([
      'communication-is-information-exchange-not-control',
      'communication-is-unambiguous',
      'communication-is-bounded-and-governed',
      'communication-carries-no-truth-of-its-own',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(AGENT_COMMUNICATION_INVARIANTS).toEqual([
      'every-exchange-has-defined-sender-and-recipient',
      'exchange-without-both-parties-identified-is-not-made',
      'communicates-only-within-permissions-message-points-to-knowledge',
      'communication-topology-never-contradicts-coordination-topology',
      'defining-communication-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of AGENT_COMMUNICATION_PRINCIPLES) {
      expect(AGENT_COMMUNICATION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of AGENT_COMMUNICATION_INVARIANTS) {
      expect(AGENT_COMMUNICATION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(AGENT_COMMUNICATION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(AGENT_COMMUNICATION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(AGENT_COMMUNICATION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(AGENT_COMMUNICATION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
