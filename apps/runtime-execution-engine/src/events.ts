import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';
import type { RuntimeEvent } from '@openlance/aios-runtime';

/**
 * The framework event type prefix under which the engine republishes the frozen runtime lifecycle events. Each emitted
 * framework event type is this prefix followed by the frozen `RuntimeEvent` name, so the engine's framework events
 * correspond to the frozen event model and never invent an event.
 */
export const EXECUTION_EVENT_PREFIX = 'framework.runtime.';

/**
 * Execution event emission. It publishes the frozen runtime lifecycle events on the frozen event bus by consuming the
 * frozen `createEvent` constructor (the injected `Clock` stamps `occurredAt`, the immutable audit timestamp). It emits
 * only the frozen `RuntimeEvent` set (as framework events), recreates no bus, dispatcher, or subscription, and restates
 * no runtime event model.
 */
export class ExecutionEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit a frozen runtime lifecycle event for an execution, with the audit timestamp. */
  async emit(event: RuntimeEvent, executionId: string): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, `${EXECUTION_EVENT_PREFIX}${event}`, { executionId }),
    );
  }
}
