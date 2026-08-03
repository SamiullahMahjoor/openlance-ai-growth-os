import { createContainer } from '@openlance/aios-di';
import type { Container, Module } from '@openlance/aios-di';
import { EVENT_BUS } from '@openlance/aios-events';
import { createLogger, LOGGER } from '@openlance/aios-logging';

import { FixedClock } from './clocks.js';
import { CapturingSink, InMemoryEventBus } from './fakes.js';
import { SequentialId } from './ids.js';

const HARNESS_START_MS = 0;

/**
 * An integration composition root for tests. It exposes the deterministic seams
 * directly (`clock`, `ids`, `logs`, `events`) and the DI `container` the modules
 * were registered into. Disposing it disposes the container.
 */
export interface Harness {
  readonly container: Container;
  readonly clock: FixedClock;
  readonly ids: SequentialId;
  readonly logs: CapturingSink;
  readonly events: InMemoryEventBus;
  dispose(): Promise<void>;
}

/**
 * Boots a chosen set of modules with the deterministic seams pre-wired: a
 * `FixedClock`, a `SequentialId`, a logger writing to a `CapturingSink` registered
 * under `LOGGER`, and an `InMemoryEventBus` registered under `EVENT_BUS`. An
 * integration test then exercises real DI, logging, and events without touching
 * real time, randomness, or any vendor.
 */
export const createHarness = (modules: readonly Module[] = []): Harness => {
  const clock = new FixedClock(HARNESS_START_MS);
  const ids = new SequentialId();
  const logs = new CapturingSink();
  const events = new InMemoryEventBus();
  const logger = createLogger({ level: 'trace', clock, sinks: [logs] });
  const container = createContainer();
  container.register(LOGGER, { useValue: logger });
  container.register(EVENT_BUS, { useValue: events });
  for (const module of modules) {
    module.register(container);
  }
  return {
    container,
    clock,
    ids,
    logs,
    events,
    dispose: async () => {
      await container.dispose();
    },
  };
};
