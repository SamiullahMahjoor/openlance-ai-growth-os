import { createConfigService } from '@openlance/aios-config';
import { createContainer, token } from '@openlance/aios-di';
import { createEventBus } from '@openlance/aios-events';
import { ok } from '@openlance/aios-kernel';
import type { Clock } from '@openlance/aios-kernel';
import { createLogger } from '@openlance/aios-logging';
import type { LogRecord, LogSink } from '@openlance/aios-logging';
import { describe, expect, it } from 'vitest';

import { createPluginHost } from '../src/index';
import type { Plugin, PluginContext, PluginManifest, PluginSource } from '../src/index';

const clock: Clock = { now: () => 1_700_000_000_000, nowIso: () => '2023-11-14T22:13:20.000Z' };

class MemorySink implements LogSink {
  readonly records: LogRecord[] = [];
  write(record: LogRecord): void {
    this.records.push(record);
  }
}

const makeContext = (overrides: Partial<PluginContext> = {}): PluginContext => {
  const config = createConfigService([]);
  if (!config.ok) {
    throw new Error('config build failed');
  }
  return {
    registry: createContainer(),
    config: config.value,
    logger: createLogger({ level: 'trace', clock, sinks: [] }),
    events: createEventBus(),
    ...overrides,
  };
};

const noop = (name: string): Plugin => ({
  manifest: { name, version: '1.0.0', apiVersion: '1.0.0' },
  register: () => undefined,
});

const hostFor = (plugins: readonly Plugin[]): ReturnType<typeof createPluginHost> =>
  createPluginHost({ plugins, context: makeContext(), supportedApiVersion: '^1.0.0', clock });

describe('PluginHost discovery and loading', () => {
  it('discovers manifests from a source', () => {
    const plugin = noop('a');
    const source: PluginSource = { list: () => ok([plugin.manifest]) };
    const result = hostFor([plugin]).discover(source);
    expect(result).toEqual({ ok: true, value: [plugin.manifest] });
  });

  it('validates compatibility against its supported API version', () => {
    const host = hostFor([]);
    expect(host.validateCompatibility([noop('a').manifest]).ok).toBe(true);
    const incompatible: PluginManifest = { name: 'b', version: '1.0.0', apiVersion: '9.0.0' };
    expect(host.validateCompatibility([incompatible]).ok).toBe(false);
  });

  it('loads an available plugin and returns its immutable descriptor', () => {
    const plugin = noop('a');
    const result = hostFor([plugin]).load(plugin.manifest);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.manifest).toBe(plugin.manifest);
    }
  });

  it('fails to load a manifest with no available plugin', () => {
    const result = hostFor([noop('a')]).load({
      name: 'ghost',
      version: '1.0.0',
      apiVersion: '1.0.0',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('PLUGIN.NOT_AVAILABLE');
    }
  });
});

describe('PluginHost lifecycle', () => {
  it('starts with nothing loaded', async () => {
    expect((await hostFor([]).start()).ok).toBe(true);
  });

  it('refuses to start a cyclically-dependent loaded set', async () => {
    const a: Plugin = {
      manifest: {
        name: 'a',
        version: '1.0.0',
        apiVersion: '1.0.0',
        dependsOn: [{ name: 'b', range: '^1.0.0' }],
      },
      register: () => undefined,
    };
    const b: Plugin = {
      manifest: {
        name: 'b',
        version: '1.0.0',
        apiVersion: '1.0.0',
        dependsOn: [{ name: 'a', range: '^1.0.0' }],
      },
      register: () => undefined,
    };
    const host = hostFor([a, b]);
    host.load(a.manifest);
    host.load(b.manifest);
    const result = await host.start();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error[0]?.code).toBe('PLUGIN.CIRCULAR_DEPENDENCY');
    }
  });

  it('activates a plugin loaded more than once only once', async () => {
    let registered = 0;
    const plugin: Plugin = {
      manifest: { name: 'a', version: '1.0.0', apiVersion: '1.0.0' },
      register: () => {
        registered += 1;
      },
    };
    const host = hostFor([plugin]);
    host.load(plugin.manifest);
    host.load(plugin.manifest);
    await host.start();
    expect(registered).toBe(1);
  });
});

describe('PluginHost integrations', () => {
  it('registers a plugin service into the DI container (DI integration)', async () => {
    const container = createContainer();
    const context = makeContext({ registry: container });
    const serviceToken = token<string>('plugin.service');
    const plugin: Plugin = {
      manifest: { name: 'a', version: '1.0.0', apiVersion: '1.0.0' },
      register: (ctx) => {
        ctx.registry.register(serviceToken, { useValue: 'hello' });
      },
    };
    const host = createPluginHost({
      plugins: [plugin],
      context,
      supportedApiVersion: '^1.0.0',
      clock,
    });
    host.load(plugin.manifest);
    await host.start();
    expect(container.resolve(serviceToken)).toBe('hello');
  });

  it('provides the logger to plugins (logging integration)', async () => {
    const sink = new MemorySink();
    const context = makeContext({ logger: createLogger({ level: 'trace', clock, sinks: [sink] }) });
    const plugin: Plugin = {
      manifest: { name: 'a', version: '1.0.0', apiVersion: '1.0.0' },
      register: (ctx) => {
        ctx.logger.info('plugin registered');
      },
    };
    const host = createPluginHost({
      plugins: [plugin],
      context,
      supportedApiVersion: '^1.0.0',
      clock,
    });
    host.load(plugin.manifest);
    await host.start();
    expect(sink.records.some((r) => r.message === 'plugin registered')).toBe(true);
  });

  it('emits framework.plugin.* lifecycle events (event integration)', async () => {
    const events = createEventBus();
    const context = makeContext({ events });
    const seen: string[] = [];
    events.subscribeAll((event) => {
      seen.push(event.type);
    });
    const plugin = noop('a');
    const host = createPluginHost({
      plugins: [plugin],
      context,
      supportedApiVersion: '^1.0.0',
      clock,
    });
    host.load(plugin.manifest);
    await host.start();
    await host.stop();
    expect(seen).toEqual([
      'framework.plugin.initialized',
      'framework.plugin.started',
      'framework.plugin.stopped',
      'framework.plugin.disposed',
    ]);
  });
});
