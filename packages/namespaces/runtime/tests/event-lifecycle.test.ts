import { describe, expect, it } from 'vitest';

import {
  EVENT_LIFECYCLE_INVARIANTS,
  EVENT_LIFECYCLE_INVARIANT_DESCRIPTIONS,
  EVENT_LIFECYCLE_PRINCIPLES,
  EVENT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  RUNTIME_EVENTS,
  RUNTIME_EVENT_DESCRIPTIONS,
} from '../src/index';

describe('runtime / event lifecycle (ai/runtime/event-lifecycle.md)', () => {
  it('defines exactly the four principles in constitutional order', () => {
    expect(EVENT_LIFECYCLE_PRINCIPLES).toEqual([
      'every-execution-is-observable',
      'events-are-architectural-not-a-mechanism',
      'events-mirror-the-lifecycle',
      'events-carry-no-truth-or-rule',
    ]);
  });

  it('defines exactly the eight lifecycle events in constitutional order', () => {
    expect(RUNTIME_EVENTS).toEqual([
      'execution-started',
      'validation-started',
      'knowledge-loaded',
      'context-loaded',
      'execution-completed',
      'execution-failed',
      'execution-cancelled',
      'session-closed',
    ]);
  });

  it('defines exactly the four invariants in constitutional order', () => {
    expect(EVENT_LIFECYCLE_INVARIANTS).toEqual([
      'emits-started-and-reaches-exactly-one-terminal-event',
      'an-event-marks-a-runtime-moment-carries-no-truth-or-decision',
      'events-correspond-to-states-and-steps-never-contradict',
      'emitting-an-event-is-inert',
    ]);
  });

  it('gives every principle, event, and invariant a non-empty description', () => {
    for (const id of EVENT_LIFECYCLE_PRINCIPLES) {
      expect(EVENT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of RUNTIME_EVENTS) {
      expect(RUNTIME_EVENT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
    for (const id of EVENT_LIFECYCLE_INVARIANTS) {
      expect(EVENT_LIFECYCLE_INVARIANT_DESCRIPTIONS[id].length).toBeGreaterThan(0);
    }
  });

  it('exposes the catalogs as immutable truth', () => {
    expect(Object.isFrozen(EVENT_LIFECYCLE_PRINCIPLES)).toBe(true);
    expect(Object.isFrozen(RUNTIME_EVENTS)).toBe(true);
    expect(Object.isFrozen(EVENT_LIFECYCLE_INVARIANTS)).toBe(true);
    expect(Object.isFrozen(EVENT_LIFECYCLE_PRINCIPLE_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(RUNTIME_EVENT_DESCRIPTIONS)).toBe(true);
    expect(Object.isFrozen(EVENT_LIFECYCLE_INVARIANT_DESCRIPTIONS)).toBe(true);
  });
});
