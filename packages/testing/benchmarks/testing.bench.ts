import type { FrameworkEvent } from '@openlance/aios-events';
import type { LogRecord } from '@openlance/aios-logging';
import { bench, describe } from 'vitest';

import {
  CapturingSink,
  createHarness,
  createTestContainer,
  FixedClock,
  InMemoryEventBus,
  mock,
  SequentialId,
  spy,
} from '../src/index';

/**
 * Observational micro-baselines for the testing utilities (Engineering Rule 5).
 * Measurement only: these run outside `src`, never on a runtime path, and never
 * change behavior. Recorded results live in benchmarks/baseline.md.
 */
const record: LogRecord = { level: 'info', message: 'm', timestamp: 0, fields: {} };
const event: FrameworkEvent = { type: 'a', occurredAt: 0, payload: {} };

describe('testing utilities', () => {
  const clock = new FixedClock(0);
  bench('FixedClock.now', () => {
    clock.now();
  });

  const ids = new SequentialId();
  bench('SequentialId.next', () => {
    ids.next();
  });

  bench('mock', () => {
    mock<{ a: number }>({ a: 1 });
  });

  bench('spy call', () => {
    const recorder = spy((n: number) => n);
    recorder(1);
  });

  bench('CapturingSink.write', () => {
    new CapturingSink().write(record);
  });

  bench('InMemoryEventBus.publish', async () => {
    await new InMemoryEventBus().publish(event);
  });

  bench('createTestContainer', () => {
    createTestContainer();
  });

  bench('createHarness', () => {
    createHarness();
  });
});
