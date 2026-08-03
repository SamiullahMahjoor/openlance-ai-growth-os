import { describe, expect, it } from 'vitest';

import { resultMatchers } from '../src/index';

const { toBeOk, toBeErr, toHaveErrorCode } = resultMatchers;

describe('toBeOk', () => {
  it('passes for an Ok result', () => {
    const result = toBeOk({ ok: true, value: 1 });
    expect(result.pass).toBe(true);
    expect(result.message()).toContain('not to be Ok');
  });

  it('fails for an Err result', () => {
    const result = toBeOk({ ok: false, error: {} });
    expect(result.pass).toBe(false);
    expect(result.message()).toContain('to be Ok');
  });

  it('fails for a non-object or null', () => {
    expect(toBeOk(42).pass).toBe(false);
    expect(toBeOk(null).pass).toBe(false);
  });
});

describe('toBeErr', () => {
  it('passes for an Err result', () => {
    const result = toBeErr({ ok: false, error: {} });
    expect(result.pass).toBe(true);
    expect(result.message()).toContain('not to be Err');
  });

  it('fails for an Ok result', () => {
    const result = toBeErr({ ok: true, value: 1 });
    expect(result.pass).toBe(false);
    expect(result.message()).toContain('to be Err');
  });
});

describe('toHaveErrorCode', () => {
  it('passes when the error code matches', () => {
    const result = toHaveErrorCode({ ok: false, error: { code: 'X.Y' } }, 'X.Y');
    expect(result.pass).toBe(true);
    expect(result.message()).toContain('not to be');
  });

  it('fails when the error code differs', () => {
    const result = toHaveErrorCode({ ok: false, error: { code: 'A' } }, 'B');
    expect(result.pass).toBe(false);
    expect(result.message()).toContain("'B'");
  });

  it('fails for an Ok result', () => {
    expect(toHaveErrorCode({ ok: true, value: 1 }, 'X').pass).toBe(false);
  });
});

describe('registration with Vitest', () => {
  it('registers as custom matchers', () => {
    expect.extend(resultMatchers);
    expect({ ok: true, value: 1 }).toBeOk();
    expect({ ok: false, error: { code: 'E' } }).toBeErr();
    expect({ ok: false, error: { code: 'E' } }).toHaveErrorCode('E');
  });
});
