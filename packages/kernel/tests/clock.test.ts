import { describe, expect, it } from 'vitest';

import { SystemClock } from '../src/index';
import type { Clock } from '../src/index';

// A timestamp safely in the past (2023-11-14T22:13:20Z), used only to assert that
// now() returns a real epoch value without reading ambient time in the test.
const PAST_EPOCH_MS = 1_700_000_000_000;

describe('SystemClock', () => {
  const clock: Clock = new SystemClock();

  it('now returns an integer number of milliseconds past the epoch', () => {
    const t = clock.now();
    expect(typeof t).toBe('number');
    expect(Number.isInteger(t)).toBe(true);
    expect(t).toBeGreaterThan(PAST_EPOCH_MS);
  });

  it('nowIso returns a parseable ISO-8601 string', () => {
    const iso = clock.nowIso();
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(Number.isNaN(Date.parse(iso))).toBe(false);
  });

  it('now is monotonic and non-decreasing across successive reads', () => {
    const a = clock.now();
    const b = clock.now();
    expect(b).toBeGreaterThanOrEqual(a);
  });
});
