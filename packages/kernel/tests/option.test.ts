import { describe, expect, it } from 'vitest';

import {
  andThenOption,
  fromNullable,
  isNone,
  isSome,
  mapOption,
  none,
  some,
  unwrapOrOption,
} from '../src/index';
import type { Option } from '../src/index';

describe('Option', () => {
  it('some constructs a present value', () => {
    expect(some(7)).toEqual({ some: true, value: 7 });
  });

  it('none is the shared absent value', () => {
    expect(none).toEqual({ some: false });
  });

  it('fromNullable maps null and undefined to none, otherwise some', () => {
    expect(fromNullable(0)).toEqual({ some: true, value: 0 });
    expect(fromNullable('')).toEqual({ some: true, value: '' });
    expect(fromNullable(null)).toBe(none);
    expect(fromNullable(undefined)).toBe(none);
  });

  it('isSome narrows both branches', () => {
    expect(isSome(some(1))).toBe(true);
    expect(isSome(none)).toBe(false);
  });

  it('isNone narrows both branches', () => {
    expect(isNone(some(1))).toBe(false);
    expect(isNone(none)).toBe(true);
  });

  it('mapOption transforms a some and passes none through untouched', () => {
    expect(mapOption(some(4), (n) => n + 1)).toEqual({ some: true, value: 5 });
    expect(mapOption(none as Option<number>, (n) => n + 1)).toBe(none);
  });

  it('andThenOption chains on some and short-circuits on none', () => {
    const nonEmpty = (s: string): Option<string> => (s.length > 0 ? some(s) : none);
    expect(andThenOption(some('hi'), nonEmpty)).toEqual({ some: true, value: 'hi' });
    expect(andThenOption(some(''), nonEmpty)).toBe(none);
    expect(andThenOption(none as Option<string>, nonEmpty)).toBe(none);
  });

  it('unwrapOrOption returns the value or the fallback', () => {
    expect(unwrapOrOption(some(3), 0)).toBe(3);
    expect(unwrapOrOption(none as Option<number>, 0)).toBe(0);
  });
});
