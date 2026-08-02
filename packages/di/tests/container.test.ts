import { describe, expect, it } from 'vitest';

import { createContainer, DependencyError, token } from '../src/index';
import type { Token } from '../src/index';

class Engine {
  readonly started = true;
}

class Car {
  constructor(readonly engine: Engine) {}
}

describe('container registration and resolution', () => {
  it('resolves a useValue provider', () => {
    const container = createContainer();
    const port = token<number>('config.port');
    container.register(port, { useValue: 8080 });
    expect(container.resolve(port)).toBe(8080);
  });

  it('resolves a useFactory provider through the resolver', () => {
    const container = createContainer();
    const base = token<number>('base');
    const scaled = token<number>('scaled');
    container.register(base, { useValue: 10 });
    container.register(scaled, {
      useFactory: (resolve) => resolve.resolve(base) * 2,
      inject: [base],
    });
    expect(container.resolve(scaled)).toBe(20);
  });

  it('resolves a useClass provider and injects its dependencies', () => {
    const container = createContainer();
    const engine = token<Engine>('engine');
    const car = token<Car>('car');
    container.register(engine, { useClass: Engine });
    container.register(car, { useClass: Car, inject: [engine] });
    const resolved = container.resolve(car);
    expect(resolved).toBeInstanceOf(Car);
    expect(resolved.engine).toBeInstanceOf(Engine);
  });

  it('tryResolve returns some for a registered token and none otherwise', () => {
    const container = createContainer();
    const name = token<string>('name');
    container.register(name, { useValue: 'x' });
    expect(container.tryResolve(name)).toEqual({ some: true, value: 'x' });
    expect(container.tryResolve(token<string>('missing'))).toEqual({ some: false });
  });

  it('throws a DependencyError when resolving an unregistered token', () => {
    const container = createContainer();
    expect(() => container.resolve(token<number>('nope'))).toThrow(DependencyError);
  });

  it('names an anonymous token as (anonymous) in diagnostics', () => {
    const container = createContainer();
    const anonymous = Symbol() as Token<number>;
    let thrown: unknown;
    try {
      container.resolve(anonymous);
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(DependencyError);
    expect((thrown as DependencyError).context).toEqual({ token: '(anonymous)' });
  });

  it('last registration wins for a duplicate token', () => {
    const container = createContainer();
    const duplicate = token<number>('dup');
    container.register(duplicate, { useValue: 1 });
    container.register(duplicate, { useValue: 2 });
    expect(container.resolve(duplicate)).toBe(2);
  });

  it('resolves a multi-level dependency chain', () => {
    const container = createContainer();
    const a = token<string>('a');
    const b = token<string>('b');
    const c = token<string>('c');
    container.register(a, { useValue: 'A' });
    container.register(b, { useFactory: (resolve) => `${resolve.resolve(a)}B`, inject: [a] });
    container.register(c, { useFactory: (resolve) => `${resolve.resolve(b)}C`, inject: [b] });
    expect(container.resolve(c)).toBe('ABC');
  });

  it('exposes tryResolve to factories', () => {
    const container = createContainer();
    const present = token<number>('present');
    const consumer = token<string>('consumer');
    container.register(present, { useValue: 5 });
    container.register(consumer, {
      useFactory: (resolve) => {
        const found = resolve.tryResolve(present);
        const absent = resolve.tryResolve(token<number>('absent'));
        return `${found.some ? found.value : 'none'}/${absent.some ? absent.value : 'none'}`;
      },
    });
    expect(container.resolve(consumer)).toBe('5/none');
  });
});
