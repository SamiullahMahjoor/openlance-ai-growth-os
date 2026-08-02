import { describe, expect, it } from 'vitest';

import { orderByDeps } from '../src/compatibility';

interface Node {
  readonly name: string;
  readonly deps: readonly string[];
}

const node = (name: string, deps: readonly string[] = []): Node => ({ name, deps });
const order = (nodes: readonly Node[]): ReturnType<typeof orderByDeps<Node>> =>
  orderByDeps(
    nodes,
    (item) => item.name,
    (item) => item.deps,
  );

const names = (result: ReturnType<typeof order>): string[] =>
  result.ok ? result.value.map((item) => item.name) : [];

describe('orderByDeps', () => {
  it('orders dependencies before dependents', () => {
    const result = order([node('a', ['b']), node('b')]);
    expect(result.ok).toBe(true);
    expect(names(result)).toEqual(['b', 'a']);
  });

  it('orders a shared dependency once', () => {
    const result = order([node('a', ['c']), node('b', ['c']), node('c')]);
    expect(names(result)).toEqual(['c', 'a', 'b']);
  });

  it('skips a missing dependency', () => {
    const result = order([node('a', ['missing'])]);
    expect(result.ok).toBe(true);
    expect(names(result)).toEqual(['a']);
  });

  it('accepts a diamond-shaped graph', () => {
    const result = order([node('a', ['b', 'c']), node('b', ['d']), node('c', ['d']), node('d')]);
    expect(result.ok).toBe(true);
  });

  it('detects a cycle', () => {
    const result = order([node('a', ['b']), node('b', ['a'])]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error[0]?.code).toBe('PLUGIN.CIRCULAR_DEPENDENCY');
    }
  });
});
