import type { Clock } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import { createEvent, createEventBus } from '../src/index';
import type { FrameworkEvent } from '../src/index';

const clock: Clock = { now: () => 1_700_000_000_000, nowIso: () => '2023-11-14T22:13:20.000Z' };
const evt = (type: string): FrameworkEvent => createEvent(clock, type, {});

describe('deterministic dispatch order', () => {
  it('invokes handlers in registration order', async () => {
    const bus = createEventBus();
    const order: string[] = [];
    bus.subscribe('a', () => {
      order.push('first');
    });
    bus.subscribe('a', () => {
      order.push('second');
    });
    bus.subscribe('a', () => {
      order.push('third');
    });
    await bus.publish(evt('a'));
    expect(order).toEqual(['first', 'second', 'third']);
  });

  it('awaits an async handler before invoking the next', async () => {
    const bus = createEventBus();
    const order: number[] = [];
    bus.subscribe('a', async () => {
      await Promise.resolve();
      order.push(1);
    });
    bus.subscribe('a', () => {
      order.push(2);
    });
    await bus.publish(evt('a'));
    expect(order).toEqual([1, 2]);
  });

  it('runs typed handlers before diagnostic subscribeAll handlers', async () => {
    const bus = createEventBus();
    const order: string[] = [];
    bus.subscribe('a', () => {
      order.push('typed');
    });
    bus.subscribeAll(() => {
      order.push('all');
    });
    await bus.publish(evt('a'));
    expect(order).toEqual(['typed', 'all']);
  });
});
