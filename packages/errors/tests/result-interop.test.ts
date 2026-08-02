import { describe, expect, it } from 'vitest';

import { fromThrowable, InfrastructureError, toResult } from '../src/index';

const wrap = (error: unknown): InfrastructureError =>
  new InfrastructureError('I.WRAPPED', 'operation failed', {}, error);

describe('fromThrowable', () => {
  it('returns Ok when the function returns', () => {
    const result = fromThrowable(() => 42, wrap);
    expect(result).toEqual({ ok: true, value: 42 });
  });

  it('returns Err with the mapped BaseError when the function throws', () => {
    const boom = new Error('boom');
    const result = fromThrowable(() => {
      throw boom;
    }, wrap);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(InfrastructureError);
      expect(result.error.code).toBe('I.WRAPPED');
      expect(result.error.cause).toBe(boom);
    }
  });
});

describe('toResult', () => {
  it('returns Ok when the promise resolves', async () => {
    const result = await toResult(Promise.resolve('value'), wrap);
    expect(result).toEqual({ ok: true, value: 'value' });
  });

  it('returns Err with the mapped BaseError when the promise rejects', async () => {
    const boom = new Error('rejected');
    const result = await toResult(Promise.reject(boom), wrap);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(InfrastructureError);
      expect(result.error.cause).toBe(boom);
    }
  });
});
