import { createConfigService } from '@openlance/aios-config';
import { createContainer } from '@openlance/aios-di';
import { createEventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';
import { createLogger } from '@openlance/aios-logging';
import { bench, describe } from 'vitest';

import { validateCompatibility } from '../src/compatibility';
import { createPluginHost } from '../src/index';
import type { Plugin, PluginContext, PluginManifest } from '../src/index';

/**
 * Observational micro-baselines for the plugin framework (Engineering Rule 5).
 * Measurement only: these run outside `src`, never on a runtime path, and never
 * change behavior. Recorded results live in benchmarks/baseline.md.
 */
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

const noop = (name: string, dependsOn?: readonly { name: string; range: string }[]): Plugin => ({
  manifest: dependsOn
    ? { name, version: '1.0.0', apiVersion: '1.0.0', dependsOn }
    : { name, version: '1.0.0', apiVersion: '1.0.0' },
  register: () => undefined,
});

const manifestA: PluginManifest = { name: 'a', version: '1.0.0', apiVersion: '1.0.0' };
const manifestB: PluginManifest = {
  name: 'b',
  version: '1.0.0',
  apiVersion: '1.0.0',
  dependsOn: [{ name: 'a', range: '^1.0.0' }],
};
const allManifests: readonly PluginManifest[] = [manifestA, manifestB];
const plugins: readonly Plugin[] = [noop('a'), noop('b', [{ name: 'a', range: '^1.0.0' }])];
const context = makeContext();
const mkHost = (): ReturnType<typeof createPluginHost> =>
  createPluginHost({ plugins, context, supportedApiVersion: '^1.0.0', clock });

describe('plugin primitives', () => {
  bench('compatibility validation', () => {
    validateCompatibility(allManifests, '^1.0.0');
  });

  bench('registration (load)', () => {
    mkHost().load(manifestA);
  });

  bench('registry lookup (load two)', () => {
    const host = mkHost();
    host.load(manifestA);
    host.load(manifestB);
  });

  bench('activation (load + start)', async () => {
    const host = mkHost();
    host.load(manifestA);
    await host.start();
  });

  bench('deactivation (start + stop)', async () => {
    const host = mkHost();
    host.load(manifestA);
    await host.start();
    await host.stop();
  });
});
