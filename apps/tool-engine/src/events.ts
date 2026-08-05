import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';

import type { ToolId } from './types.js';

/**
 * The framework event types the tool engine emits. They are namespaced framework events, distinct from the runtime AI
 * event-lifecycle, which is owned by the Runtime namespace and not restated here.
 */
export const TOOL_EVENT_TYPES = Object.freeze({
  registered: 'framework.tool.registered',
  prepared: 'framework.tool.prepared',
  failed: 'framework.tool.failed',
});

/**
 * Tool event emission. It publishes tool registration and preparation facts on the frozen event bus by consuming the
 * frozen `createEvent` constructor (the injected `Clock` stamps `occurredAt`). It recreates no bus, dispatcher, or
 * subscription, and restates no runtime event model.
 */
export class ToolEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that a tool was registered. */
  async registered(toolId: ToolId): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, TOOL_EVENT_TYPES.registered, { toolId }));
  }

  /** Emit that a preparation produced a validated execution for a capability. */
  async prepared(capability: string, toolId: ToolId): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, TOOL_EVENT_TYPES.prepared, { capability, toolId }),
    );
  }

  /** Emit that a preparation for a capability was refused. */
  async failed(capability: string): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, TOOL_EVENT_TYPES.failed, { capability }));
  }
}
