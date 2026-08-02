import { createContainer } from '@openlance/aios-di';
import type { Clock } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import { createEvent, createEventBus, EVENT_BUS } from '../src/index';
import type { FrameworkEvent } from '../src/index';

const clock: Clock = { now: () => 1_700_000_000_000, nowIso: () => '2023-11-14T22:13:20.000Z' };
const evt = (type: string, payload: unknown = {}): FrameworkEvent =>
  createEvent(clock, type, payload);

describe('EventBus publish and subscribe', () => {
  it('delivers an event to a subscriber of its type', async () => {
    const bus = createEventBus();
    const received: FrameworkEvent[] = [];
    bus.subscribe('a', (event) => {
      received.push(event);
    });
    const result = await bus.publish(evt('a', { n: 1 }));
    expect(result.ok).toBe(true);
    expect(received).toHaveLength(1);
    expect(received[0]?.payload).toEqual({ n: 1 });
  });

  it('does not deliver to subscribers of other types', async () => {
    const bus = createEventBus();
    let got = 0;
    bus.subscribe('a', () => {
      got += 1;
    });
    await bus.publish(evt('b'));
    expect(got).toBe(0);
  });

  it('publishing with no subscribers succeeds', async () => {
    expect((await createEventBus().publish(evt('none'))).ok).toBe(true);
  });

  it('delivers to multiple subscribers of the same type', async () => {
    const bus = createEventBus();
    const order: number[] = [];
    bus.subscribe('a', () => {
      order.push(1);
    });
    bus.subscribe('a', () => {
      order.push(2);
    });
    await bus.publish(evt('a'));
    expect(order).toEqual([1, 2]);
  });

  it('subscribeAll receives every event', async () => {
    const bus = createEventBus();
    const types: string[] = [];
    bus.subscribeAll((event) => {
      types.push(event.type);
    });
    await bus.publish(evt('a'));
    await bus.publish(evt('b'));
    expect(types).toEqual(['a', 'b']);
  });

  it('unsubscribe stops delivery', async () => {
    const bus = createEventBus();
    let got = 0;
    const subscription = bus.subscribe('a', () => {
      got += 1;
    });
    await bus.publish(evt('a'));
    subscription.dispose();
    await bus.publish(evt('a'));
    expect(got).toBe(1);
  });

  it('disposing a subscription twice is safe', async () => {
    const bus = createEventBus();
    let got = 0;
    const subscription = bus.subscribe('a', () => {
      got += 1;
    });
    subscription.dispose();
    subscription.dispose();
    await bus.publish(evt('a'));
    expect(got).toBe(0);
  });

  it('unsubscribing a diagnostic subscriber stops delivery', async () => {
    const bus = createEventBus();
    let got = 0;
    const subscription = bus.subscribeAll(() => {
      got += 1;
    });
    subscription.dispose();
    await bus.publish(evt('a'));
    expect(got).toBe(0);
  });

  it('supports nested publishing from within a handler', async () => {
    const bus = createEventBus();
    const seen: string[] = [];
    bus.subscribe('a', async () => {
      seen.push('a');
      await bus.publish(evt('b'));
    });
    bus.subscribe('b', () => {
      seen.push('b');
    });
    await bus.publish(evt('a'));
    expect(seen).toEqual(['a', 'b']);
  });

  it('registers and resolves as a DI singleton under EVENT_BUS', () => {
    const bus = createEventBus();
    const container = createContainer();
    container.register(EVENT_BUS, { useValue: bus });
    expect(container.resolve(EVENT_BUS)).toBe(bus);
  });
});
