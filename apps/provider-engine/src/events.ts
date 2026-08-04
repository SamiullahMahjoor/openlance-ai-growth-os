import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';

import type { Capability, ProviderId } from './types.js';

/**
 * The framework event types the provider engine emits. They are namespaced framework events, distinct
 * from the runtime AI event-lifecycle (`RUNTIME_EVENTS`), which is owned by the Runtime namespace and
 * not restated here.
 */
export const PROVIDER_EVENT_TYPES = Object.freeze({
  registered: 'framework.provider.registered',
  invoked: 'framework.provider.invoked',
  failed: 'framework.provider.failed',
});

/**
 * Provider event emission. It publishes provider lifecycle and invocation facts on the frozen event
 * bus by consuming the frozen `createEvent` constructor (the injected `Clock` stamps `occurredAt`). It
 * recreates no bus, dispatcher, or subscription, and restates no `RUNTIME_EVENTS`.
 */
export class ProviderEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that a provider was registered. */
  async registered(providerId: ProviderId): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, PROVIDER_EVENT_TYPES.registered, { providerId }),
    );
  }

  /** Emit that a governed invocation succeeded on a provider. */
  async invoked(providerId: ProviderId, capability: Capability): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, PROVIDER_EVENT_TYPES.invoked, { providerId, capability }),
    );
  }

  /** Emit that a governed invocation for a capability failed. */
  async failed(capability: Capability): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, PROVIDER_EVENT_TYPES.failed, { capability }));
  }
}
