import { token } from '@openlance/aios-di';
import type { Module } from '@openlance/aios-di';
import { EVENT_BUS } from '@openlance/aios-events';
import { LOGGER } from '@openlance/aios-logging';
import { describe, expect, it } from 'vitest';

import { createHarness } from '../src/index';

describe('createHarness', () => {
  it('exposes deterministic seams', () => {
    const harness = createHarness();
    expect(harness.clock.now()).toBe(0);
    expect(harness.ids.next()).toBe('id-1');
    expect(harness.logs.records).toEqual([]);
    expect(harness.events.published).toEqual([]);
  });

  it('pre-wires the logger and event bus in the container', () => {
    const harness = createHarness();
    expect(harness.container.resolve(EVENT_BUS)).toBe(harness.events);
    harness.container.resolve(LOGGER).info('hello');
    expect(harness.logs.records.some((record) => record.message === 'hello')).toBe(true);
  });

  it('registers provided modules into the container', () => {
    const service = token<string>('service');
    const module: Module = {
      name: 'm',
      version: '1.0.0',
      register: (registry) => {
        registry.register(service, { useValue: 'wired' });
      },
    };
    const harness = createHarness([module]);
    expect(harness.container.resolve(service)).toBe('wired');
  });

  it('disposes the container', async () => {
    await expect(createHarness().dispose()).resolves.toBeUndefined();
  });
});
