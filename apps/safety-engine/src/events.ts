import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';

import type { SafetyId, SafetyOutcome } from './types.js';

/**
 * The framework event types the safety engine emits. They are namespaced framework events, distinct from the runtime AI
 * event-lifecycle, which is owned by the Runtime namespace and not restated here.
 */
export const SAFETY_EVENT_TYPES = Object.freeze({
  registered: 'framework.safety.registered',
  decided: 'framework.safety.decided',
});

/**
 * Safety event emission. It publishes rule registration and decision facts on the frozen event bus by consuming the
 * frozen `createEvent` constructor (the injected `Clock` stamps `occurredAt`, the immutable audit timestamp). It
 * recreates no bus, dispatcher, or subscription, and restates no runtime event model.
 */
export class SafetyEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that a safety rule was registered. */
  async registered(rule: string): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, SAFETY_EVENT_TYPES.registered, { rule }));
  }

  /** Emit that a safety decision was reached for a subject, with the audit timestamp. */
  async decided(subject: SafetyId, outcome: SafetyOutcome): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, SAFETY_EVENT_TYPES.decided, { subject, outcome }),
    );
  }
}
