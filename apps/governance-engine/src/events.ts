import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';

import type { GovernanceId, GovernanceOutcome } from './types.js';

/**
 * The framework event types the governance engine emits. They are namespaced framework events, distinct from the runtime
 * AI event-lifecycle, which is owned by the Runtime namespace and not restated here.
 */
export const GOVERNANCE_EVENT_TYPES = Object.freeze({
  registered: 'framework.governance.registered',
  decided: 'framework.governance.decided',
});

/**
 * Governance event emission. It publishes grant registration and decision facts on the frozen event bus by consuming the
 * frozen `createEvent` constructor (the injected `Clock` stamps `occurredAt`, the immutable audit timestamp). It
 * recreates no bus, dispatcher, or subscription, and restates no runtime event model.
 */
export class GovernanceEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that a grant was registered. */
  async registered(subject: GovernanceId): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, GOVERNANCE_EVENT_TYPES.registered, { subject }),
    );
  }

  /** Emit that a governance decision was reached for a subject, with the audit timestamp. */
  async decided(subject: GovernanceId, decision: GovernanceOutcome): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, GOVERNANCE_EVENT_TYPES.decided, { subject, decision }),
    );
  }
}
