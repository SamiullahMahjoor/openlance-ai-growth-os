import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';
import type { ReasoningStage } from '@openlance/aios-reasoning';

import type { ReasoningId } from './types.js';

/**
 * The framework event types the reasoning engine emits. They are namespaced framework events, distinct from the runtime
 * AI event-lifecycle, which is owned by the Runtime namespace and not restated here.
 */
export const REASONING_EVENT_TYPES = Object.freeze({
  registered: 'framework.reasoning.registered',
  reasoned: 'framework.reasoning.reasoned',
  failed: 'framework.reasoning.failed',
});

/**
 * Reasoning event emission. It publishes premise registration and reasoning facts on the frozen event bus by consuming
 * the frozen `createEvent` constructor (the injected `Clock` stamps `occurredAt`). It recreates no bus, dispatcher, or
 * subscription, and restates no runtime event model.
 */
export class ReasoningEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that a premise was registered. */
  async registered(premiseId: ReasoningId): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, REASONING_EVENT_TYPES.registered, { premiseId }),
    );
  }

  /** Emit that a reasoning produced a governed plan for a task, with its terminal stage. */
  async reasoned(task: string, stage: ReasoningStage): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, REASONING_EVENT_TYPES.reasoned, { task, stage }),
    );
  }

  /** Emit that a reasoning for a task was refused. */
  async failed(task: string): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, REASONING_EVENT_TYPES.failed, { task }));
  }
}
