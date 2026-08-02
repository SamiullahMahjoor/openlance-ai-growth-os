import { describe, expect, it } from 'vitest';

import { createContainer, DependencyError, token } from '../src/index';

const codesOf = (errors: readonly DependencyError[]): string[] => errors.map((error) => error.code);

describe('graph validation', () => {
  it('accepts a valid graph (useValue, standalone factory, and injected factory)', () => {
    const container = createContainer();
    const a = token<number>('a');
    const standalone = token<number>('standalone');
    const b = token<number>('b');
    container.register(a, { useValue: 1 });
    container.register(standalone, { useFactory: () => 99 });
    container.register(b, { useFactory: (resolve) => resolve.resolve(a), inject: [a] });
    expect(container.validate().ok).toBe(true);
  });

  it('accepts an empty graph', () => {
    expect(createContainer().validate().ok).toBe(true);
  });

  it('accepts a diamond-shaped acyclic graph', () => {
    const container = createContainer();
    const a = token<number>('a');
    const b = token<number>('b');
    const c = token<number>('c');
    const d = token<number>('d');
    container.register(d, { useValue: 0 });
    container.register(b, { useFactory: (resolve) => resolve.resolve(d), inject: [d] });
    container.register(c, { useFactory: (resolve) => resolve.resolve(d), inject: [d] });
    container.register(a, {
      useFactory: (resolve) => resolve.resolve(b) + resolve.resolve(c),
      inject: [b, c],
    });
    expect(container.validate().ok).toBe(true);
  });

  it('allows a scoped service to depend on a singleton', () => {
    const container = createContainer();
    const singleton = token<number>('singleton');
    const scoped = token<number>('scoped');
    container.register(singleton, { useValue: 1 }, { lifetime: 'singleton' });
    container.register(
      scoped,
      { useFactory: (resolve) => resolve.resolve(singleton), inject: [singleton] },
      { lifetime: 'scoped' },
    );
    expect(container.validate().ok).toBe(true);
  });

  it('detects a missing dependency', () => {
    const container = createContainer();
    const a = token<number>('a');
    const missing = token<number>('missing');
    container.register(a, { useFactory: (resolve) => resolve.resolve(missing), inject: [missing] });
    const result = container.validate();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(codesOf(result.error)).toContain('DI.MISSING_DEPENDENCY');
    }
  });

  it('detects a circular dependency', () => {
    const container = createContainer();
    const a = token<number>('a');
    const b = token<number>('b');
    container.register(a, { useFactory: (resolve) => resolve.resolve(b), inject: [b] });
    container.register(b, { useFactory: (resolve) => resolve.resolve(a), inject: [a] });
    const result = container.validate();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(codesOf(result.error)).toContain('DI.CIRCULAR_DEPENDENCY');
    }
  });

  it('detects a singleton depending on a scoped service', () => {
    const container = createContainer();
    const scoped = token<number>('scoped');
    const singleton = token<number>('singleton');
    container.register(scoped, { useValue: 1 }, { lifetime: 'scoped' });
    container.register(
      singleton,
      { useFactory: (resolve) => resolve.resolve(scoped), inject: [scoped] },
      { lifetime: 'singleton' },
    );
    const result = container.validate();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(codesOf(result.error)).toContain('DI.LIFETIME_MISMATCH');
    }
  });

  it('collects multiple problems at once', () => {
    const container = createContainer();
    const a = token<number>('a');
    const missingOne = token<number>('missing-one');
    const missingTwo = token<number>('missing-two');
    container.register(a, {
      useFactory: (resolve) => resolve.resolve(missingOne) + resolve.resolve(missingTwo),
      inject: [missingOne, missingTwo],
    });
    const result = container.validate();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('throws a circular DependencyError at resolve time', () => {
    const container = createContainer();
    const a = token<number>('a');
    const b = token<number>('b');
    container.register(
      a,
      { useFactory: (resolve) => resolve.resolve(b), inject: [b] },
      { lifetime: 'transient' },
    );
    container.register(
      b,
      { useFactory: (resolve) => resolve.resolve(a), inject: [a] },
      { lifetime: 'transient' },
    );
    expect(() => container.resolve(a)).toThrow(DependencyError);
  });
});
