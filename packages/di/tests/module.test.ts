import { describe, expect, it } from 'vitest';

import { createModuleHost, DependencyError, token } from '../src/index';
import type { Module, Registry } from '../src/index';

const port = token<number>('port');

describe('module composition', () => {
  it('builds a validated container from modules', () => {
    const config: Module = {
      name: 'config',
      version: '1.0.0',
      register(registry: Registry) {
        registry.register(port, { useValue: 8080 });
      },
    };
    const result = createModuleHost().add(config).build();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.resolve(port)).toBe(8080);
    }
  });

  it('registers modules in dependency order', () => {
    const order: string[] = [];
    const a: Module = {
      name: 'a',
      version: '1',
      dependsOn: ['b'],
      register: () => order.push('a'),
    };
    const b: Module = { name: 'b', version: '1', register: () => order.push('b') };
    createModuleHost().add(a).add(b).build();
    expect(order).toEqual(['b', 'a']);
  });

  it('registers a shared module dependency exactly once', () => {
    const order: string[] = [];
    const shared: Module = { name: 'shared', version: '1', register: () => order.push('shared') };
    const a: Module = {
      name: 'a',
      version: '1',
      dependsOn: ['shared'],
      register: () => order.push('a'),
    };
    const b: Module = {
      name: 'b',
      version: '1',
      dependsOn: ['shared'],
      register: () => order.push('b'),
    };
    createModuleHost().add(a).add(b).add(shared).build();
    expect(order).toEqual(['shared', 'a', 'b']);
  });

  it('returns an error when the resulting service graph is invalid', () => {
    const gone = token<number>('gone');
    const bad: Module = {
      name: 'bad',
      version: '1',
      register(registry: Registry) {
        registry.register(token<number>('x'), {
          useFactory: (resolve) => resolve.resolve(gone),
          inject: [gone],
        });
      },
    };
    const result = createModuleHost().add(bad).build();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error[0]).toBeInstanceOf(DependencyError);
    }
  });

  it('reports a missing module dependency', () => {
    const a: Module = { name: 'a', version: '1', dependsOn: ['nope'], register: () => undefined };
    const result = createModuleHost().add(a).build();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.map((error) => error.code)).toContain('DI.MISSING_MODULE');
    }
  });

  it('reports a circular module dependency', () => {
    const a: Module = { name: 'a', version: '1', dependsOn: ['b'], register: () => undefined };
    const b: Module = { name: 'b', version: '1', dependsOn: ['a'], register: () => undefined };
    const result = createModuleHost().add(a).add(b).build();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.map((error) => error.code)).toContain('DI.CIRCULAR_MODULE');
    }
  });
});
