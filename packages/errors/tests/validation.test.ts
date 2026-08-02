import { describe, expect, it } from 'vitest';

import { BaseError, ValidationError } from '../src/index';

describe('ValidationError', () => {
  const issues = [
    { path: 'email', message: 'must be an email' },
    { path: 'age', message: 'must be positive' },
  ];

  it('is a validation-category BaseError carrying structured issues', () => {
    const error = new ValidationError('V.INPUT', 'invalid input', issues);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error).toBeInstanceOf(BaseError);
    expect(error.category).toBe('validation');
    expect(error.code).toBe('V.INPUT');
    expect(error.issues).toEqual(issues);
  });

  it('freezes the issues list and each issue', () => {
    const error = new ValidationError('V.INPUT', 'invalid', issues);
    expect(Object.isFrozen(error.issues)).toBe(true);
    expect(Object.isFrozen(error.issues[0])).toBe(true);
  });

  it('is immutable: neither the list nor an issue can be mutated', () => {
    const error = new ValidationError('V.INPUT', 'invalid', issues);
    expect(() => {
      (error.issues as Array<{ path: string; message: string }>).push({
        path: 'x',
        message: 'y',
      });
    }).toThrow(TypeError);
    expect(() => {
      (error.issues[0] as { path: string; message: string }).path = 'changed';
    }).toThrow(TypeError);
  });

  it('copies the issues so later mutation of the source does not leak in', () => {
    const source = [{ path: 'a', message: 'bad' }];
    const error = new ValidationError('V.INPUT', 'invalid', source);
    source.push({ path: 'b', message: 'also bad' });
    expect(error.issues).toHaveLength(1);
  });

  it('accepts an empty issue list', () => {
    const error = new ValidationError('V.INPUT', 'invalid', []);
    expect(error.issues).toEqual([]);
    expect(Object.isFrozen(error.issues)).toBe(true);
  });

  it('serializes via the base projection (code/category/message/context)', () => {
    const error = new ValidationError('V.INPUT', 'invalid', issues, { form: 'signup' });
    expect(error.toJSON()).toEqual({
      code: 'V.INPUT',
      category: 'validation',
      message: 'invalid',
      context: { form: 'signup' },
    });
  });
});
