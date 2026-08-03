import { describe, expect, it } from 'vitest';

import { FixedClock, SequentialId } from '../src/index';

describe('FixedClock', () => {
  it('returns the fixed time and advances only when told', () => {
    const clock = new FixedClock(1000);
    expect(clock.now()).toBe(1000);
    clock.advance(500);
    expect(clock.now()).toBe(1500);
  });

  it('formats the current instant as an ISO string', () => {
    expect(new FixedClock(0).nowIso()).toBe('1970-01-01T00:00:00.000Z');
  });
});

describe('SequentialId', () => {
  it('yields sequential ids with the default prefix', () => {
    const ids = new SequentialId();
    expect(ids.next()).toBe('id-1');
    expect(ids.next()).toBe('id-2');
  });

  it('uses a custom prefix', () => {
    expect(new SequentialId('req').next()).toBe('req-1');
  });
});
