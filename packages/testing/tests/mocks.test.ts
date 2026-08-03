import { describe, expect, it } from 'vitest';

import { mock, spy } from '../src/index';

interface Service {
  compute(n: number): number;
  label: string;
}

describe('mock', () => {
  it('builds a typed partial double from the given fields', () => {
    const double = mock<Service>({ label: 'x' });
    expect(double.label).toBe('x');
  });

  it('builds an empty double when no fields are given', () => {
    expect(mock<Service>()).toEqual({});
  });
});

describe('spy', () => {
  it('records the arguments and return of each call, using the implementation', () => {
    const sum = spy((a: number, b: number) => a + b);
    expect(sum(2, 3)).toBe(5);
    sum(1, 1);
    expect(sum.calls).toEqual([
      [2, 3],
      [1, 1],
    ]);
    expect(sum.returned).toEqual([5, 2]);
  });

  it('returns undefined when no implementation is given', () => {
    const noop = spy<[string], void>();
    expect(noop('x')).toBeUndefined();
    expect(noop.calls).toEqual([['x']]);
    expect(noop.returned).toEqual([undefined]);
  });
});
