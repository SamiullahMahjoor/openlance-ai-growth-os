import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';

/**
 * The framework event types the operations engine emits. They are namespaced framework events, distinct from the frozen
 * runtime event-lifecycle (owned by ai/runtime/), which this engine observes and never restates or extends.
 */
export const OPERATIONS_EVENT_TYPES = Object.freeze({
  observed: 'framework.operations.observed',
  healthChanged: 'framework.operations.health-changed',
  incidentOpened: 'framework.operations.incident-opened',
  alertRaised: 'framework.operations.alert-raised',
});

/**
 * Operations event emission. It publishes operational facts (an observation processed, a health change, an incident
 * opened, an alert raised) on the frozen event bus by consuming the frozen `createEvent` constructor (the injected
 * `Clock` stamps `occurredAt`). These are operations-owned events; it emits no `RuntimeEvent` and restates no runtime
 * event model. It recreates no bus, dispatcher, or subscription.
 */
export class OperationsEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that an observation was processed. */
  async observed(observation: string): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, OPERATIONS_EVENT_TYPES.observed, { observation }),
    );
  }

  /** Emit that the assessed health state changed. */
  async healthChanged(state: string): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, OPERATIONS_EVENT_TYPES.healthChanged, { state }),
    );
  }

  /** Emit that an incident was opened. */
  async incidentOpened(key: string): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, OPERATIONS_EVENT_TYPES.incidentOpened, { key }),
    );
  }

  /** Emit that an alert was raised. */
  async alertRaised(key: string): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, OPERATIONS_EVENT_TYPES.alertRaised, { key }));
  }
}
