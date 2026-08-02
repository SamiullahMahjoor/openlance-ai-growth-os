import { token } from '@openlance/aios-di';
import type { Token } from '@openlance/aios-di';
import type { Result } from '@openlance/aios-kernel';
import type { Logger } from '@openlance/aios-logging';

import { dispatch, type EventError } from './dispatcher.js';
import type { EventHandler, FrameworkEvent } from './event.js';
import type { Subscription } from './subscription.js';

/**
 * An in-process publish/subscribe bus for framework-internal events. Delivery is
 * deterministic (handlers run in registration order) and fault-isolated (a throwing
 * handler cannot abort siblings or the publisher; failures are aggregated on the
 * returned `Result`). It carries no transport, broker, persistence, or replay.
 */
export interface EventBus {
  publish<E extends FrameworkEvent>(event: E): Promise<Result<void, EventError>>;
  subscribe<E extends FrameworkEvent>(type: E['type'], handler: EventHandler<E>): Subscription;
  subscribeAll(handler: EventHandler<FrameworkEvent>): Subscription;
}

/**
 * The dependency-injection token under which the bus is registered as a singleton,
 * so every package resolves the same bus (composition follows the token pattern of
 * ADR-0010).
 */
export const EVENT_BUS: Token<EventBus> = token<EventBus>('aios.events.bus');

interface Registration {
  readonly handler: EventHandler<FrameworkEvent>;
}

class EventBusImpl implements EventBus {
  readonly #byType = new Map<string, Registration[]>();
  readonly #all: Registration[] = [];
  readonly #logger: Logger | undefined;

  constructor(logger?: Logger) {
    this.#logger = logger;
  }

  async publish<E extends FrameworkEvent>(event: E): Promise<Result<void, EventError>> {
    const typed = this.#byType.get(event.type) ?? [];
    const handlers = [...typed, ...this.#all].map((registration) => registration.handler);
    return dispatch(event, handlers, this.#logger);
  }

  subscribe<E extends FrameworkEvent>(type: E['type'], handler: EventHandler<E>): Subscription {
    let list = this.#byType.get(type);
    if (!list) {
      list = [];
      this.#byType.set(type, list);
    }
    return this.#register(list, handler as EventHandler<FrameworkEvent>);
  }

  subscribeAll(handler: EventHandler<FrameworkEvent>): Subscription {
    return this.#register(this.#all, handler);
  }

  #register(list: Registration[], handler: EventHandler<FrameworkEvent>): Subscription {
    const registration: Registration = { handler };
    list.push(registration);
    return {
      dispose: () => {
        const index = list.indexOf(registration);
        if (index !== -1) {
          list.splice(index, 1);
        }
      },
    };
  }
}

/**
 * Creates an in-process event bus. An optional logger records isolated handler
 * failures (off the hot path). The bus is registered as a DI singleton under
 * `EVENT_BUS` by the composition root.
 */
export const createEventBus = (logger?: Logger): EventBus => new EventBusImpl(logger);
