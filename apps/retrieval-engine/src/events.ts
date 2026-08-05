import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';

import type { RetrievalId } from './types.js';

/**
 * The framework event types the retrieval engine emits. They are namespaced framework events, distinct
 * from the runtime AI event-lifecycle, which is owned by the Runtime namespace and not restated here.
 */
export const RETRIEVAL_EVENT_TYPES = Object.freeze({
  registered: 'framework.retrieval.registered',
  retrieved: 'framework.retrieval.retrieved',
  failed: 'framework.retrieval.failed',
});

/**
 * Retrieval event emission. It publishes candidate registration and retrieval facts on the frozen event
 * bus by consuming the frozen `createEvent` constructor (the injected `Clock` stamps `occurredAt`). It
 * recreates no bus, dispatcher, or subscription, and restates no runtime event model.
 */
export class RetrievalEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that a candidate was registered. */
  async registered(candidateId: RetrievalId): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, RETRIEVAL_EVENT_TYPES.registered, { candidateId }),
    );
  }

  /** Emit that a retrieval produced a validated result for a scope. */
  async retrieved(scope: string, count: number): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, RETRIEVAL_EVENT_TYPES.retrieved, { scope, count }),
    );
  }

  /** Emit that a retrieval for a scope was refused. */
  async failed(scope: string): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, RETRIEVAL_EVENT_TYPES.failed, { scope }));
  }
}
