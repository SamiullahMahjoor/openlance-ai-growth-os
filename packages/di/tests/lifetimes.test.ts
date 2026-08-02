import { describe, expect, it } from 'vitest';

import { createContainer, token } from '../src/index';

describe('lifetimes', () => {
  it('singleton resolves to the same instance every time', () => {
    const container = createContainer();
    const service = token<object>('singleton');
    container.register(service, { useFactory: () => ({}) }, { lifetime: 'singleton' });
    expect(container.resolve(service)).toBe(container.resolve(service));
  });

  it('defaults to singleton when no lifetime is given', () => {
    const container = createContainer();
    const service = token<object>('default');
    container.register(service, { useFactory: () => ({}) });
    expect(container.resolve(service)).toBe(container.resolve(service));
  });

  it('transient resolves to a new instance every time', () => {
    const container = createContainer();
    const service = token<object>('transient');
    container.register(service, { useFactory: () => ({}) }, { lifetime: 'transient' });
    expect(container.resolve(service)).not.toBe(container.resolve(service));
  });

  it('scoped resolves to one instance per scope, distinct across scopes', () => {
    const container = createContainer();
    const service = token<object>('scoped');
    container.register(service, { useFactory: () => ({}) }, { lifetime: 'scoped' });
    const first = container.createScope();
    const second = container.createScope();
    expect(first.resolve(service)).toBe(first.resolve(service));
    expect(first.resolve(service)).not.toBe(second.resolve(service));
  });

  it('a scope can try-resolve registered and unregistered tokens', () => {
    const container = createContainer();
    const service = token<number>('scoped');
    container.register(service, { useValue: 1 }, { lifetime: 'scoped' });
    const scope = container.createScope();
    expect(scope.tryResolve(service)).toEqual({ some: true, value: 1 });
    expect(scope.tryResolve(token<number>('absent'))).toEqual({ some: false });
  });

  it('a singleton is shared whether resolved from the root or a scope', () => {
    const container = createContainer();
    const service = token<object>('singleton');
    container.register(service, { useFactory: () => ({}) }, { lifetime: 'singleton' });
    expect(container.resolve(service)).toBe(container.createScope().resolve(service));
  });

  it('disposes container singletons in reverse construction order', async () => {
    const order: string[] = [];
    const container = createContainer();
    const a = token<{ dispose(): void }>('a');
    const b = token<{ dispose(): void }>('b');
    container.register(a, {
      useFactory: () => ({
        dispose: () => {
          order.push('a');
        },
      }),
    });
    container.register(b, {
      useFactory: () => ({
        dispose: () => {
          order.push('b');
        },
      }),
    });
    container.resolve(a);
    container.resolve(b);
    await container.dispose();
    expect(order).toEqual(['b', 'a']);
  });

  it('disposes scoped instances when the scope is disposed, in reverse order', async () => {
    const order: string[] = [];
    const container = createContainer();
    const a = token<{ dispose(): void }>('a');
    const b = token<{ dispose(): void }>('b');
    container.register(
      a,
      { useFactory: () => ({ dispose: () => order.push('a') }) },
      { lifetime: 'scoped' },
    );
    container.register(
      b,
      { useFactory: () => ({ dispose: () => order.push('b') }) },
      { lifetime: 'scoped' },
    );
    const scope = container.createScope();
    scope.resolve(a);
    scope.resolve(b);
    await scope.dispose();
    expect(order).toEqual(['b', 'a']);
  });

  it('does not dispose transient instances', async () => {
    let disposed = false;
    const container = createContainer();
    const service = token<{ dispose(): void }>('transient');
    container.register(
      service,
      { useFactory: () => ({ dispose: () => (disposed = true) }) },
      { lifetime: 'transient' },
    );
    container.resolve(service);
    await container.dispose();
    expect(disposed).toBe(false);
  });

  it('container disposal is idempotent', async () => {
    let count = 0;
    const container = createContainer();
    const service = token<{ dispose(): void }>('service');
    container.register(service, { useFactory: () => ({ dispose: () => (count += 1) }) });
    container.resolve(service);
    await container.dispose();
    await container.dispose();
    expect(count).toBe(1);
  });

  it('scope disposal is idempotent', async () => {
    let count = 0;
    const container = createContainer();
    const service = token<{ dispose(): void }>('service');
    container.register(
      service,
      { useFactory: () => ({ dispose: () => (count += 1) }) },
      { lifetime: 'scoped' },
    );
    const scope = container.createScope();
    scope.resolve(service);
    await scope.dispose();
    await scope.dispose();
    expect(count).toBe(1);
  });

  it('awaits asynchronous disposal', async () => {
    let done = false;
    const container = createContainer();
    const service = token<{ dispose(): Promise<void> }>('async');
    container.register(service, {
      useFactory: () => ({
        dispose: async () => {
          await Promise.resolve();
          done = true;
        },
      }),
    });
    container.resolve(service);
    await container.dispose();
    expect(done).toBe(true);
  });
});
