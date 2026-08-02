import type { Clock } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import { createEvent } from '../src/index';

const clock: Clock = { now: () => 1_700_000_000_000, nowIso: () => '2023-11-14T22:13:20.000Z' };

describe('createEvent', () => {
  it('stamps occurredAt from the clock and freezes the envelope', () => {
    const event = createEvent(clock, 'config.reloaded', { key: 'x' });
    expect(event).toEqual({
      type: 'config.reloaded',
      occurredAt: 1_700_000_000_000,
      payload: { key: 'x' },
    });
    expect(Object.isFrozen(event)).toBe(true);
  });

  it('includes a correlation id when given', () => {
    expect(createEvent(clock, 't', 1, 'corr-1').correlationId).toBe('corr-1');
  });

  it('omits the correlation id when not given', () => {
    expect('correlationId' in createEvent(clock, 't', 1)).toBe(false);
  });

  it('produces identical envelopes for identical inputs under a fixed clock', () => {
    expect(createEvent(clock, 't', { a: 1 })).toEqual(createEvent(clock, 't', { a: 1 }));
  });
});
