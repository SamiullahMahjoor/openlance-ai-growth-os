import type {
  EventBus,
  EventError,
  EventHandler,
  FrameworkEvent,
  Subscription,
} from '@openlance/aios-events';
import { ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { LogRecord, LogSink } from '@openlance/aios-logging';

/**
 * A `LogSink` that captures every record it receives, so a test can assert on what
 * was logged without any real output.
 */
export class CapturingSink implements LogSink {
  readonly records: LogRecord[] = [];

  write(record: LogRecord): void {
    this.records.push(record);
  }
}

/**
 * An in-process `EventBus` for tests. It records every published event in
 * `published` for assertions and delivers to subscribers in registration order.
 * It carries no transport and no fault isolation; a test controls its handlers.
 */
export class InMemoryEventBus implements EventBus {
  readonly published: FrameworkEvent[] = [];
  readonly #handlers = new Map<string, EventHandler<FrameworkEvent>[]>();
  readonly #all: EventHandler<FrameworkEvent>[] = [];

  async publish<E extends FrameworkEvent>(event: E): Promise<Result<void, EventError>> {
    this.published.push(event);
    const handlers = [...(this.#handlers.get(event.type) ?? []), ...this.#all];
    for (const handler of handlers) {
      await handler(event);
    }
    return ok(undefined);
  }

  subscribe<E extends FrameworkEvent>(type: E['type'], handler: EventHandler<E>): Subscription {
    let list = this.#handlers.get(type);
    if (!list) {
      list = [];
      this.#handlers.set(type, list);
    }
    return this.#add(list, handler as EventHandler<FrameworkEvent>);
  }

  subscribeAll(handler: EventHandler<FrameworkEvent>): Subscription {
    return this.#add(this.#all, handler);
  }

  #add(list: EventHandler<FrameworkEvent>[], handler: EventHandler<FrameworkEvent>): Subscription {
    list.push(handler);
    return {
      dispose: () => {
        const index = list.indexOf(handler);
        if (index !== -1) {
          list.splice(index, 1);
        }
      },
    };
  }
}
