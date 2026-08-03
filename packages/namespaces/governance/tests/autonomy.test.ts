import { describe, expect, it } from 'vitest';

import { AUTONOMY_BOUNDS, AUTONOMY_LEVELS, autonomyAtLeast, higherAutonomy } from '../src/index';

describe('governance / autonomy boundaries (ai/governance/autonomy-boundaries.md)', () => {
  it('defines exactly the four governance autonomy levels in constitutional order', () => {
    expect(AUTONOMY_LEVELS).toEqual(['assisted', 'supervised', 'bounded', 'governed']);
  });

  it('defines exactly the four bounds of autonomous action', () => {
    expect(AUTONOMY_BOUNDS).toEqual(['may-do', 'must-not-do', 'must-escalate', 'must-refuse']);
  });

  it('exposes the classifications as immutable truth', () => {
    expect(Object.isFrozen(AUTONOMY_LEVELS)).toBe(true);
    expect(Object.isFrozen(AUTONOMY_BOUNDS)).toBe(true);
  });

  it('orders autonomy levels by increasing operational independence', () => {
    expect(autonomyAtLeast('governed', 'assisted')).toBe(true);
    expect(autonomyAtLeast('bounded', 'bounded')).toBe(true);
    expect(autonomyAtLeast('assisted', 'governed')).toBe(false);
  });

  it('returns the more independent of two autonomy levels', () => {
    expect(higherAutonomy('assisted', 'governed')).toBe('governed');
    expect(higherAutonomy('governed', 'assisted')).toBe('governed');
    expect(higherAutonomy('bounded', 'bounded')).toBe('bounded');
  });

  it('is deterministic: the same inputs always yield the same outputs', () => {
    expect(autonomyAtLeast('bounded', 'supervised')).toBe(autonomyAtLeast('bounded', 'supervised'));
    expect(higherAutonomy('assisted', 'bounded')).toBe(higherAutonomy('assisted', 'bounded'));
  });
});
