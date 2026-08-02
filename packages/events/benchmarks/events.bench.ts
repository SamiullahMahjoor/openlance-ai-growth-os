import type { Clock } from '@openlance/aios-kernel';
import { bench, describe } from 'vitest';

import { createEvent, createEventBus } from '../src/index';

/**
 * Observational micro-baselines for the event bus (Engineering Rule 5). Measurement
 * only: these run outside `src`, never on a runtime path, and never change behavior.
 * Recorded results live in benchmarks/baseline.md.
 */
const clock: Clock = { now: () => 1_700_000_000_000, nowIso: () => '2023-11-14T22:13:20.000Z' };

describe('events primitives', () => {
  const bus = createEventBus();
  bus.subscribe('a', () => undefined);
  bus.subscribe('a', () => undefined);
  bus.subscribe('many', () => undefined);
  bus.subscribe('many', () => undefined);
  bus.subscribe('many', () => undefined);
  bus.subscribe('many', () => undefined);
  bus.subscribe('many', () => undefined);

  bench('envelope creation', () => {
    createEvent(clock, 'a', { n: 1 });
  });

  const event = createEvent(clock, 'a', { n: 1 });
  bench('publish (2 handlers)', async () => {
    await bus.publish(event);
  });

  const manyEvent = createEvent(clock, 'many', { n: 1 });
  bench('dispatch (5 handlers)', async () => {
    await bus.publish(manyEvent);
  });

  const miss = createEvent(clock, 'none', {});
  bench('handler lookup (publish, no handlers)', async () => {
    await bus.publish(miss);
  });

  bench('subscription (subscribe + dispose)', () => {
    bus.subscribe('scratch', () => undefined).dispose();
  });
});
