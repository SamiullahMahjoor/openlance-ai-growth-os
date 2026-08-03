import type { FrameworkEvent } from '@openlance/aios-events';
import type { LogRecord } from '@openlance/aios-logging';
import { describe, expect, it } from 'vitest';

import { CapturingSink, InMemoryEventBus } from '../src/index';

const event = (type: string): FrameworkEvent => ({ type, occurredAt: 0, payload: {} });

describe('CapturingSink', () => {
  it('captures every record written to it', () => {
    const sink = new CapturingSink();
    const record: LogRecord = { level: 'info', message: 'm', timestamp: 0, fields: {} };
    sink.write(record);
    expect(sink.records).toEqual([record]);
  });
});

describe('InMemoryEventBus', () => {
  it('captures published events and returns ok', async () => {
    const bus = new InMemoryEventBus();
    const result = await bus.publish(event('a'));
    expect(result.ok).toBe(true);
    expect(bus.published).toHaveLength(1);
  });

  it('delivers only to subscribers of the published type', async () => {
    const bus = new InMemoryEventBus();
    const got: string[] = [];
    bus.subscribe('a', (received) => {
      got.push(received.type);
    });
    await bus.publish(event('a'));
    await bus.publish(event('b'));
    expect(got).toEqual(['a']);
  });

  it('delivers to multiple subscribers of a type and to subscribeAll, in order', async () => {
    const bus = new InMemoryEventBus();
    const order: string[] = [];
    bus.subscribe('a', () => order.push('first'));
    bus.subscribe('a', () => order.push('second'));
    bus.subscribeAll(() => order.push('all'));
    await bus.publish(event('a'));
    expect(order).toEqual(['first', 'second', 'all']);
  });

  it('unsubscribes on dispose and is safe to dispose twice', async () => {
    const bus = new InMemoryEventBus();
    let count = 0;
    const typed = bus.subscribe('a', () => {
      count += 1;
    });
    const all = bus.subscribeAll(() => {
      count += 1;
    });
    typed.dispose();
    typed.dispose();
    all.dispose();
    await bus.publish(event('a'));
    expect(count).toBe(0);
  });
});
