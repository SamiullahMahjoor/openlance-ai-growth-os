import { bench, describe } from 'vitest';

import { createContainer, createModuleHost, token } from '../src/index';
import type { Module, Registry } from '../src/index';

/**
 * Observational micro-baselines for the container (Engineering Rule 5). Measurement
 * only: these run outside `src`, never on a runtime path, and never change behavior.
 * Recorded results live in benchmarks/baseline.md.
 */
describe('di primitives', () => {
  const registerToken = token<number>('svc');
  bench('register a service', () => {
    const container = createContainer();
    container.register(registerToken, { useValue: 1 });
  });

  const singletonContainer = createContainer();
  const singletonToken = token<number>('singleton');
  singletonContainer.register(singletonToken, { useValue: 1 }, { lifetime: 'singleton' });
  bench('resolve a cached singleton', () => {
    singletonContainer.resolve(singletonToken);
  });

  const transientContainer = createContainer();
  const transientToken = token<object>('transient');
  transientContainer.register(
    transientToken,
    { useFactory: () => ({}) },
    { lifetime: 'transient' },
  );
  bench('resolve a transient', () => {
    transientContainer.resolve(transientToken);
  });

  bench('validate a small graph', () => {
    const container = createContainer();
    const a = token<number>('a');
    const b = token<number>('b');
    container.register(a, { useValue: 1 });
    container.register(b, { useFactory: (resolve) => resolve.resolve(a), inject: [a] });
    container.validate();
  });

  const configToken = token<number>('port');
  bench('build a single-module host', () => {
    const config: Module = {
      name: 'config',
      version: '1',
      register: (registry: Registry) => registry.register(configToken, { useValue: 1 }),
    };
    createModuleHost().add(config).build();
  });
});
