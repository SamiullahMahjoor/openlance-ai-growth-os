import { describe, expect, it } from 'vitest';

import { andThen, err, isErr, isOk, map, mapErr, ok, unwrapOr } from '../src/index';
import type { Result } from '../src/index';

describe('Result', () => {
  it('ok constructs a success', () => {
    const r = ok(42);
    expect(r).toEqual({ ok: true, value: 42 });
  });

  it('err constructs a failure', () => {
    const r = err('boom');
    expect(r).toEqual({ ok: false, error: 'boom' });
  });

  it('isOk narrows both branches', () => {
    expect(isOk(ok(1))).toBe(true);
    expect(isOk(err('x'))).toBe(false);
  });

  it('isErr narrows both branches', () => {
    expect(isErr(ok(1))).toBe(false);
    expect(isErr(err('x'))).toBe(true);
  });

  it('map transforms an ok and passes an err through untouched', () => {
    expect(map(ok(2), (n) => n * 3)).toEqual({ ok: true, value: 6 });
    const failure: Result<number, string> = err('nope');
    expect(map(failure, (n) => n * 3)).toBe(failure);
  });

  it('mapErr transforms an err and passes an ok through untouched', () => {
    expect(mapErr(err('e'), (e) => `${e}!`)).toEqual({ ok: false, error: 'e!' });
    const success: Result<number, string> = ok(9);
    expect(mapErr(success, (e) => `${e}!`)).toBe(success);
  });

  it('andThen chains on ok and short-circuits on err', () => {
    const half = (n: number): Result<number, string> => (n % 2 === 0 ? ok(n / 2) : err('odd'));
    expect(andThen(ok(8), half)).toEqual({ ok: true, value: 4 });
    expect(andThen(ok(7), half)).toEqual({ ok: false, error: 'odd' });
    const failure: Result<number, string> = err('start');
    expect(andThen(failure, half)).toBe(failure);
  });

  it('unwrapOr returns the value or the fallback', () => {
    expect(unwrapOr(ok(5), 0)).toBe(5);
    expect(unwrapOr(err<string>('e') as Result<number, string>, 0)).toBe(0);
  });
});
