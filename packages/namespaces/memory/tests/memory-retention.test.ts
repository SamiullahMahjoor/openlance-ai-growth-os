import { describe, expect, it } from 'vitest';

import {
  MEMORY_RETENTION_CLASSES,
  MEMORY_RETENTION_CLASS_DESCRIPTIONS,
  MEMORY_RETENTION_INVARIANTS,
  MEMORY_RETENTION_INVARIANT_DESCRIPTIONS,
  MEMORY_RETENTION_PRINCIPLES,
  MEMORY_RETENTION_PRINCIPLE_DESCRIPTIONS,
  retentionAtLeast,
} from '../src/index';

describe('memory / memory retention (ai/memory/memory-retention.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(MEMORY_RETENTION_PRINCIPLES).toEqual([
      'classified-not-timed',
      'bounded-by-purpose',
      'removal-is-governed',
      'permanence-is-not-truth',
    ]);
  });

  it('defines exactly the four retention classes, shortest-lived to indefinitely held', () => {
    expect(MEMORY_RETENTION_CLASSES).toEqual(['temporary', 'session', 'long-term', 'permanent']);
  });

  it('defines exactly the five invariants in constitutional order', () => {
    expect(MEMORY_RETENTION_INVARIANTS).toEqual([
      'class-not-duration',
      'retained-within-class-and-purpose',
      'expires-and-removed-only-under-rules',
      'permanent-is-runtime-state',
      'retention-is-inert',
    ]);
  });

  it('gives every principle, class, and invariant a non-empty description', () => {
    for (const id of MEMORY_RETENTION_PRINCIPLES) {
      expect(MEMORY_RETENTION_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_RETENTION_CLASSES) {
      expect(MEMORY_RETENTION_CLASS_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of MEMORY_RETENTION_INVARIANTS) {
      expect(MEMORY_RETENTION_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  describe('retentionAtLeast', () => {
    it('holds for a longer-lived or equal class and is false for a shorter-lived one', () => {
      expect(retentionAtLeast('permanent', 'temporary')).toBe(true);
      expect(retentionAtLeast('long-term', 'session')).toBe(true);
      expect(retentionAtLeast('session', 'session')).toBe(true);
      expect(retentionAtLeast('temporary', 'permanent')).toBe(false);
    });

    it('agrees with the declared persistence order across all classes', () => {
      MEMORY_RETENTION_CLASSES.forEach((a, i) => {
        MEMORY_RETENTION_CLASSES.forEach((b, j) => {
          expect(retentionAtLeast(a, b)).toBe(i >= j);
        });
      });
    });
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(MEMORY_RETENTION_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(MEMORY_RETENTION_CLASSES)).toBe(true);
    expect(Object.isFrozen(MEMORY_RETENTION_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(MEMORY_RETENTION_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_RETENTION_CLASS_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(MEMORY_RETENTION_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
