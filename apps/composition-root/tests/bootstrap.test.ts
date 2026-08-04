import { describe, expect, it } from 'vitest';

import { CONFIG_SERVICE, ConfigError, DefaultsProvider } from '@openlance/aios-config';
import type { ConfigProvider } from '@openlance/aios-config';
import { token } from '@openlance/aios-di';
import type { Module } from '@openlance/aios-di';
import { EVENT_BUS } from '@openlance/aios-events';
import { LOGGER } from '@openlance/aios-logging';
import type { LogSink } from '@openlance/aios-logging';
import { err } from '@openlance/aios-kernel';
import type { Clock } from '@openlance/aios-kernel';

import { bootstrap, CompositionError } from '../src/index';
import type { CompositionConfig } from '../src/index';

const testClock: Clock = { now: () => 0 };
const noopSink: LogSink = { write: () => undefined };

const validConfig = (modules?: readonly Module[]): CompositionConfig => ({
  config: [new DefaultsProvider({ app: { name: 'test' } })],
  logging: { level: 'info', clock: testClock, sinks: [noopSink] },
  ...(modules ? { modules } : {}),
});

describe('composition-root / bootstrap (docs/implementation/23-composition-root.md, ADR-0026)', () => {
  it('composes the three substrate services into a validated, resolvable graph', () => {
    const result = bootstrap(validConfig());
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const app = result.value;
    // The container resolves each substrate service to a working instance.
    expect(typeof app.container.resolve(CONFIG_SERVICE).get).toBe('function');
    expect(typeof app.container.resolve(LOGGER).info).toBe('function');
    expect(typeof app.container.resolve(EVENT_BUS).subscribe).toBe('function');
  });

  it('records the composed services in an immutable registry', () => {
    const result = bootstrap(validConfig());
    if (!result.ok) throw new Error('expected ok');
    const { registry } = result.value;

    expect(registry).toEqual([
      { token: 'aios.config.service', module: 'config', lifetime: 'singleton' },
      { token: 'aios.logging.logger', module: 'logging', lifetime: 'singleton' },
      { token: 'aios.events.bus', module: 'events', lifetime: 'singleton' },
    ]);
    expect(Object.isFrozen(registry)).toBe(true);
    // The records are frozen data, not just a frozen array (deep, per the documented contract).
    expect(registry.every((service) => Object.isFrozen(service))).toBe(true);
  });

  it('reports composition diagnostics for the validated graph', () => {
    const result = bootstrap(validConfig());
    if (!result.ok) throw new Error('expected ok');
    const { diagnostics } = result.value;

    expect(diagnostics.modules).toEqual(['config', 'logging', 'events']);
    expect(diagnostics.services).toEqual([
      'aios.config.service',
      'aios.logging.logger',
      'aios.events.bus',
    ]);
    expect(diagnostics.validated).toBe(true);
    expect(Object.isFrozen(diagnostics)).toBe(true);
  });

  it('carries the configuration and metadata as immutable composition state', () => {
    const config = validConfig();
    const result = bootstrap(config);
    if (!result.ok) throw new Error('expected ok');
    const app = result.value;

    expect(app.metadata).toEqual({
      package: '@openlance/aios-composition-root',
      stage: 'phase-3-stage-1',
      serviceCount: 3,
      moduleCount: 3,
    });
    expect(app.configuration.config).toBe(config.config);
    expect(app.configuration.logging).toBe(config.logging);
    expect(Object.isFrozen(app)).toBe(true);
    expect(Object.isFrozen(app.configuration)).toBe(true);
    expect(Object.isFrozen(app.metadata)).toBe(true);
  });

  it('composes extension-seam modules alongside the substrate, inertly', () => {
    const extraToken = token<number>('aios.test.extra');
    const extension: Module = {
      name: 'extra',
      version: '1.0.0',
      register(registry) {
        registry.register(extraToken, { useValue: 42 });
      },
    };

    const result = bootstrap(validConfig([extension]));
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    // The seam module was composed and its service resolves; the substrate registry is unchanged.
    expect(result.value.diagnostics.modules).toEqual(['config', 'logging', 'events', 'extra']);
    expect(result.value.metadata.moduleCount).toBe(4);
    expect(result.value.metadata.serviceCount).toBe(3);
    expect(result.value.container.resolve(extraToken)).toBe(42);
  });

  it('fails closed when the configuration service cannot be built', () => {
    const failing: ConfigProvider = {
      name: 'failing',
      priority: 1,
      load: () => err(new ConfigError('CONFIG.SOURCE_FAILED', 'source failed to load')),
    };
    const result = bootstrap({
      config: [failing],
      logging: { level: 'info', clock: testClock, sinks: [noopSink] },
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toHaveLength(1);
    const [error] = result.error;
    expect(error).toBeInstanceOf(CompositionError);
    expect(error.code).toBe('COMPOSITION.CONFIG_BUILD_FAILED');
    expect(error.category).toBe('infrastructure');
    expect(error.cause).toBeInstanceOf(ConfigError);
  });

  it('fails closed when the composed dependency graph is invalid', () => {
    const missing = token<number>('aios.test.missing');
    const broken: Module = {
      name: 'broken',
      version: '1.0.0',
      register(registry) {
        registry.register(token<number>('aios.test.needs'), {
          useFactory: (resolver) => resolver.resolve(missing),
          inject: [missing],
        });
      },
    };

    const result = bootstrap(validConfig([broken]));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.length).toBeGreaterThan(0);
    for (const error of result.error) {
      expect(error).toBeInstanceOf(CompositionError);
      expect(error.code).toBe('COMPOSITION.GRAPH_VALIDATION_FAILED');
    }
  });

  it('disposes the composed application through the container', async () => {
    const result = bootstrap(validConfig());
    if (!result.ok) throw new Error('expected ok');
    await expect(result.value.dispose()).resolves.toBeUndefined();
  });
});
