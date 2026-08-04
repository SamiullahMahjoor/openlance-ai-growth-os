import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';
import type { MemoryType } from '@openlance/aios-memory';

import type { MemoryId, MemoryScope } from './types.js';

/**
 * The framework event types the memory engine emits. They are namespaced framework events, distinct from
 * the runtime AI event-lifecycle, which is owned by the Runtime namespace and not restated here.
 */
export const MEMORY_EVENT_TYPES = Object.freeze({
  formed: 'framework.memory.formed',
  recalled: 'framework.memory.recalled',
  removed: 'framework.memory.removed',
  failed: 'framework.memory.failed',
});

/**
 * Memory event emission. It publishes memory formation, recall, and removal facts on the frozen event bus
 * by consuming the frozen `createEvent` constructor (the injected `Clock` stamps `occurredAt`). It
 * recreates no bus, dispatcher, or subscription, and restates no runtime event model.
 */
export class MemoryEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that a record was formed and retained. */
  async formed(memoryId: MemoryId, type: MemoryType): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, MEMORY_EVENT_TYPES.formed, { memoryId, type }),
    );
  }

  /** Emit that retained context was recalled for a scope. */
  async recalled(scope: MemoryScope, count: number): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, MEMORY_EVENT_TYPES.recalled, { scope, count }),
    );
  }

  /** Emit that a record was removed. */
  async removed(memoryId: MemoryId): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, MEMORY_EVENT_TYPES.removed, { memoryId }));
  }

  /** Emit that a memory operation for a scope failed. */
  async failed(scope: MemoryScope): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, MEMORY_EVENT_TYPES.failed, { scope }));
  }
}
