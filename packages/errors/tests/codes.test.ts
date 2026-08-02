import { describe, expect, it } from 'vitest';

import { BaseError, DomainError, InMemoryErrorCodeRegistry } from '../src/index';

describe('InMemoryErrorCodeRegistry', () => {
  it('passes assertUnique when every code is registered once', () => {
    const registry = new InMemoryErrorCodeRegistry();
    registry.register('CONFIG.MISSING_KEY');
    registry.register('DI.UNRESOLVED');
    registry.register('PLUGIN.INCOMPATIBLE');
    expect(() => registry.assertUnique()).not.toThrow();
  });

  it('passes assertUnique on an empty registry', () => {
    expect(() => new InMemoryErrorCodeRegistry().assertUnique()).not.toThrow();
  });

  it('throws a DomainError identifying the duplicate code', () => {
    const registry = new InMemoryErrorCodeRegistry();
    registry.register('CONFIG.MISSING_KEY');
    registry.register('CONFIG.MISSING_KEY');

    let thrown: unknown;
    try {
      registry.assertUnique();
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(DomainError);
    expect(thrown).toBeInstanceOf(BaseError);
    const domain = thrown as DomainError;
    expect(domain.code).toBe('ERRORS.DUPLICATE_CODE');
    expect(domain.context).toEqual({ duplicates: ['CONFIG.MISSING_KEY'] });
    expect(domain.message).toContain('CONFIG.MISSING_KEY');
  });

  it('reports multiple duplicates deterministically, sorted', () => {
    const registry = new InMemoryErrorCodeRegistry();
    for (const code of ['B.DUP', 'A.DUP', 'B.DUP', 'A.DUP', 'C.OK']) {
      registry.register(code);
    }

    let thrown: unknown;
    try {
      registry.assertUnique();
    } catch (error) {
      thrown = error;
    }

    const domain = thrown as DomainError;
    expect(domain.context).toEqual({ duplicates: ['A.DUP', 'B.DUP'] });
  });
});
