import { createConfigService } from '@openlance/aios-config';
import { createContainer } from '@openlance/aios-di';
import { createEventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';
import { createLogger } from '@openlance/aios-logging';
import { describe, expect, it } from 'vitest';

import { createPluginHost } from '../src/index';
import type { Plugin, PluginContext } from '../src/index';

const clock: Clock = { now: () => 1_700_000_000_000, nowIso: () => '2023-11-14T22:13:20.000Z' };

const makeContext = (): PluginContext => {
  const config = createConfigService([]);
  if (!config.ok) {
    throw new Error('config build failed');
  }
  return {
    registry: createContainer(),
    config: config.value,
    logger: createLogger({ level: 'trace', clock, sinks: [] }),
    events: createEventBus(),
  };
};

const runStart = async (
  plugins: readonly Plugin[],
): Promise<{
  host: ReturnType<typeof createPluginHost>;
  result: Awaited<ReturnType<ReturnType<typeof createPluginHost>['start']>>;
}> => {
  const host = createPluginHost({
    plugins,
    context: makeContext(),
    supportedApiVersion: '^1.0.0',
    clock,
  });
  for (const plugin of plugins) {
    host.load(plugin.manifest);
  }
  const result = await host.start();
  return { host, result };
};

const recording = (
  name: string,
  log: string[],
  dependsOn?: readonly { name: string; range: string }[],
): Plugin => ({
  manifest: dependsOn
    ? { name, version: '1.0.0', apiVersion: '1.0.0', dependsOn }
    : { name, version: '1.0.0', apiVersion: '1.0.0' },
  register: () => {
    log.push(`register:${name}`);
  },
  hooks: {
    onInit: () => {
      log.push(`init:${name}`);
    },
    onStart: () => {
      log.push(`start:${name}`);
    },
    onStop: () => {
      log.push(`stop:${name}`);
    },
    onDispose: () => {
      log.push(`dispose:${name}`);
    },
  },
});

describe('lifecycle ordering', () => {
  it('registers, initializes, and starts in dependency order, then tears down in reverse', async () => {
    const log: string[] = [];
    const a = recording('a', log, [{ name: 'b', range: '^1.0.0' }]);
    const b = recording('b', log);
    const { host, result } = await runStart([a, b]);
    expect(result.ok).toBe(true);
    expect(log).toEqual(['register:b', 'register:a', 'init:b', 'init:a', 'start:b', 'start:a']);
    await host.stop();
    expect(log.slice(6)).toEqual(['stop:a', 'stop:b', 'dispose:a', 'dispose:b']);
  });

  it('handles a plugin with no lifecycle hooks', async () => {
    const log: string[] = [];
    const plugin: Plugin = {
      manifest: { name: 'a', version: '1.0.0', apiVersion: '1.0.0' },
      register: () => {
        log.push('register:a');
      },
    };
    const { host, result } = await runStart([plugin]);
    expect(result.ok).toBe(true);
    expect(log).toEqual(['register:a']);
    await expect(host.stop()).resolves.toBeUndefined();
  });

  it('handles a plugin with an empty hooks object', async () => {
    const plugin: Plugin = {
      manifest: { name: 'a', version: '1.0.0', apiVersion: '1.0.0' },
      register: () => undefined,
      hooks: {},
    };
    const { host, result } = await runStart([plugin]);
    expect(result.ok).toBe(true);
    await expect(host.stop()).resolves.toBeUndefined();
  });
});

describe('lifecycle failures', () => {
  const failing = (phase: 'register' | 'onInit' | 'onStart'): Plugin => ({
    manifest: { name: 'bad', version: '1.0.0', apiVersion: '1.0.0' },
    register: () => {
      if (phase === 'register') {
        throw new Error('register boom');
      }
    },
    hooks: {
      onInit: () => {
        if (phase === 'onInit') {
          throw new Error('init boom');
        }
      },
      onStart: () => {
        if (phase === 'onStart') {
          throw new Error('start boom');
        }
      },
    },
  });

  it('reports a registration failure and does not proceed', async () => {
    const { result } = await runStart([failing('register')]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error[0]?.code).toBe('PLUGIN.REGISTER_FAILED');
    }
  });

  it('reports an initialization failure and does not start', async () => {
    const { result } = await runStart([failing('onInit')]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error[0]?.code).toBe('PLUGIN.INIT_FAILED');
    }
  });

  it('reports a start failure', async () => {
    const { result } = await runStart([failing('onStart')]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error[0]?.code).toBe('PLUGIN.START_FAILED');
    }
  });

  it('isolates teardown failures so disposal still runs', async () => {
    const log: string[] = [];
    const plugin: Plugin = {
      manifest: { name: 'a', version: '1.0.0', apiVersion: '1.0.0' },
      register: () => undefined,
      hooks: {
        onStop: () => {
          throw new Error('stop boom');
        },
        onDispose: () => {
          throw new Error('dispose boom');
        },
      },
    };
    const { host } = await runStart([plugin]);
    log.push('activated');
    await expect(host.stop()).resolves.toBeUndefined();
    expect(log).toContain('activated');
  });
});
