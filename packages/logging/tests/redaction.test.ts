import { describe, expect, it } from 'vitest';

import { createRedactor } from '../src/index';

describe('createRedactor', () => {
  it('redacts default sensitive keys, case-insensitively', () => {
    const redactor = createRedactor();
    expect(
      redactor.redact({ user: 'a', password: 'p', TOKEN: 't', Secret: 's', normal: 1 }),
    ).toEqual({
      user: 'a',
      password: '[redacted]',
      TOKEN: '[redacted]',
      Secret: '[redacted]',
      normal: 1,
    });
  });

  it('redacts a SecretRef value regardless of its key', () => {
    const redactor = createRedactor();
    expect(redactor.redact({ dbUrl: { kind: 'secret', key: 'DB' } })).toEqual({
      dbUrl: '[redacted]',
    });
  });

  it('passes through non-secret object and null values unchanged', () => {
    const redactor = createRedactor();
    expect(redactor.redact({ meta: { a: 1 }, nothing: null })).toEqual({
      meta: { a: 1 },
      nothing: null,
    });
  });

  it('uses a custom sensitive-key set', () => {
    const redactor = createRedactor(['ssn']);
    expect(redactor.redact({ ssn: '123', password: 'p' })).toEqual({
      ssn: '[redacted]',
      password: 'p',
    });
  });
});
