import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';
import type { Capability } from '@openlance/aios-provider-engine';

import type { PromptId } from './types.js';

/**
 * The framework event types the prompt engine emits. They are namespaced framework events, distinct from
 * the runtime AI event-lifecycle, which is owned by the Runtime namespace and not restated here.
 */
export const PROMPT_EVENT_TYPES = Object.freeze({
  registered: 'framework.prompt.registered',
  compiled: 'framework.prompt.compiled',
  failed: 'framework.prompt.failed',
});

/**
 * Prompt event emission. It publishes prompt registration and compilation facts on the frozen event bus
 * by consuming the frozen `createEvent` constructor (the injected `Clock` stamps `occurredAt`). It
 * recreates no bus, dispatcher, or subscription, and restates no runtime event model.
 */
export class PromptEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that a definition was registered. */
  async registered(promptId: PromptId): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, PROMPT_EVENT_TYPES.registered, { promptId }));
  }

  /** Emit that a prompt was compiled to an execution-ready payload. */
  async compiled(promptId: PromptId, capability: Capability): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, PROMPT_EVENT_TYPES.compiled, { promptId, capability }),
    );
  }

  /** Emit that a compilation for a definition failed. */
  async failed(promptId: PromptId, capability: Capability): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, PROMPT_EVENT_TYPES.failed, { promptId, capability }),
    );
  }
}
