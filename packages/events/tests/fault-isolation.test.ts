import type { Clock } from '@openlance/aios-kernel';
import { createLogger } from '@openlance/aios-logging';
import type { LogRecord, LogSink } from '@openlance/aios-logging';
import { describe, expect, it } from 'vitest';

import { createEvent, createEventBus, EventError } from '../src/index';
import type { FrameworkEvent } from '../src/index';

const clock: Clock = { now: () => 1_700_000_000_000, nowIso: () => '2023-11-14T22:13:20.000Z' };
const evt = (type: string): FrameworkEvent => createEvent(clock, type, {});

class MemorySink implements LogSink {
  readonly records: LogRecord[] = [];
  write(record: LogRecord): void {
    this.records.push(record);
  }
}

describe('fault isolation', () => {
  it('a throwing handler does not abort siblings or the publisher', async () => {
    const bus = createEventBus();
    const ran: string[] = [];
    bus.subscribe('a', () => {
      ran.push('before');
    });
    bus.subscribe('a', () => {
      throw new Error('boom');
    });
    bus.subscribe('a', () => {
      ran.push('after');
    });
    const result = await bus.publish(evt('a'));
    expect(ran).toEqual(['before', 'after']);
    expect(result.ok).toBe(false);
  });

  it('aggregates handler failures into an EventError on the Result', async () => {
    const bus = createEventBus();
    bus.subscribe('a', () => {
      throw new Error('one');
    });
    bus.subscribe('a', () => {
      throw new Error('two');
    });
    const result = await bus.publish(evt('a'));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(EventError);
      expect(result.error.code).toBe('EVENT.HANDLER_FAILED');
      expect(result.error.context).toEqual({ type: 'a', failureCount: 2 });
    }
  });

  it('succeeds when no handler throws', async () => {
    const bus = createEventBus();
    bus.subscribe('a', () => undefined);
    expect((await bus.publish(evt('a'))).ok).toBe(true);
  });

  it('logs isolated handler failures when a logger is provided', async () => {
    const sink = new MemorySink();
    const logger = createLogger({ level: 'trace', clock, sinks: [sink] });
    const bus = createEventBus(logger);
    bus.subscribe('a', () => {
      throw new Error('boom');
    });
    await bus.publish(evt('a'));
    expect(
      sink.records.some((r) => r.level === 'error' && r.message === 'event handler failed'),
    ).toBe(true);
  });
});
