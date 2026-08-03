import { describe, expect, it } from 'vitest';

import {
  PROVIDER_ROUTING_INVARIANTS,
  PROVIDER_ROUTING_INVARIANT_DESCRIPTIONS,
  PROVIDER_ROUTING_PRINCIPLES,
  PROVIDER_ROUTING_PRINCIPLE_DESCRIPTIONS,
} from '../src/index';

describe('providers / provider routing (ai/providers/provider-routing.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(PROVIDER_ROUTING_PRINCIPLES).toEqual([
      'directs-not-choose-or-execute',
      'acyclic-topology',
      'respects-limits',
      'deterministic',
    ]);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(PROVIDER_ROUTING_INVARIANTS).toEqual([
      'directs-never-chooses-or-executes',
      'topology-directed-and-acyclic',
      'routed-within-limits-then-fallback',
      'same-provider-and-request-same-route',
      'routing-is-inert',
    ]);
  });

  it('gives every principle and invariant a non-empty description', () => {
    for (const id of PROVIDER_ROUTING_PRINCIPLES) {
      expect(PROVIDER_ROUTING_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of PROVIDER_ROUTING_INVARIANTS) {
      expect(PROVIDER_ROUTING_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(PROVIDER_ROUTING_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(PROVIDER_ROUTING_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_ROUTING_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(PROVIDER_ROUTING_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
