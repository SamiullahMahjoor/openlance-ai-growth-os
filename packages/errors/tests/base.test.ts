import { describe, expect, it } from 'vitest';

import { BaseError, DomainError, InfrastructureError } from '../src/index';

describe('BaseError (via concrete subclasses)', () => {
  it('stores code, category, message, and a frozen context', () => {
    const error = new DomainError('D.RULE', 'rule violated', { orderId: 7 });
    expect(error.code).toBe('D.RULE');
    expect(error.category).toBe('domain');
    expect(error.message).toBe('rule violated');
    expect(error.context).toEqual({ orderId: 7 });
    expect(Object.isFrozen(error.context)).toBe(true);
  });

  it('sets name to the concrete class name', () => {
    expect(new DomainError('D.X', 'm').name).toBe('DomainError');
    expect(new InfrastructureError('I.X', 'm').name).toBe('InfrastructureError');
  });

  it('fixes the category per subclass', () => {
    expect(new DomainError('D.X', 'm').category).toBe('domain');
    expect(new InfrastructureError('I.X', 'm').category).toBe('infrastructure');
  });

  it('participates in the Error and BaseError prototype chains', () => {
    const error = new DomainError('D.X', 'm');
    expect(error).toBeInstanceOf(DomainError);
    expect(error).toBeInstanceOf(BaseError);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(InfrastructureError);
  });

  it('copies context so later mutation of the source does not leak in', () => {
    const source = { a: 1 };
    const error = new DomainError('D.X', 'm', source);
    source.a = 2;
    expect(error.context).toEqual({ a: 1 });
  });

  it('is immutable: context cannot be mutated after construction', () => {
    const error = new DomainError('D.X', 'm', { a: 1 });
    expect(() => {
      (error.context as Record<string, unknown>).a = 99;
    }).toThrow(TypeError);
  });

  it('defaults context to a frozen empty object when none is given', () => {
    const error = new DomainError('D.X', 'm');
    expect(error.context).toEqual({});
    expect(Object.isFrozen(error.context)).toBe(true);
  });

  it('carries an optional cause, absent by default', () => {
    const cause = new Error('root');
    expect(new DomainError('D.X', 'm', {}, cause).cause).toBe(cause);
    expect(new DomainError('D.X', 'm').cause).toBeUndefined();
  });

  it('serializes deterministically: exactly code/category/message/context, no stack', () => {
    const error = new DomainError('D.RULE', 'rule violated', { orderId: 7 });
    const json = error.toJSON();
    expect(Object.keys(json)).toEqual(['code', 'category', 'message', 'context']);
    expect('stack' in json).toBe(false);
    expect(json).toEqual({
      code: 'D.RULE',
      category: 'domain',
      message: 'rule violated',
      context: { orderId: 7 },
    });
  });

  it('produces identical serialization for identical inputs', () => {
    const a = new DomainError('D.X', 'boom', { n: 1 });
    const b = new DomainError('D.X', 'boom', { n: 1 });
    expect(a.toJSON()).toEqual(b.toJSON());
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
