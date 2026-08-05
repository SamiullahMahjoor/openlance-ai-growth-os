import type { RuntimeEvent } from '@openlance/aios-runtime';

import type { ExecutionEvents } from './events.js';
import type { TerminalOutcome } from './types.js';

/** The frozen terminal runtime event each terminal outcome emits (event-lifecycle: exactly one terminal event). */
const TERMINAL_EVENT: Readonly<Record<TerminalOutcome, RuntimeEvent>> = Object.freeze({
  completed: 'execution-completed',
  cancelled: 'execution-cancelled',
  failed: 'execution-failed',
});

/**
 * The telemetry manager: it emits the frozen runtime lifecycle events for an execution through the injected
 * {@link ExecutionEvents}, and maps a terminal outcome to its frozen terminal event. Every execution emits
 * `execution-started`, reaches exactly one terminal event, and emits `session-closed` at closure, mirroring the frozen
 * event lifecycle. It emits and maps only; emitting an event is inert and carries no truth or decision.
 */
export class TelemetryManager {
  readonly #events: ExecutionEvents;

  constructor(events: ExecutionEvents) {
    this.#events = events;
  }

  /** The frozen terminal runtime event for a terminal outcome. */
  terminalEvent(terminal: TerminalOutcome): RuntimeEvent {
    return TERMINAL_EVENT[terminal];
  }

  /** Emit that an execution has started. */
  async started(executionId: string): Promise<void> {
    await this.#events.emit('execution-started', executionId);
  }

  /** Emit the single terminal event for an execution's outcome. */
  async terminal(executionId: string, terminal: TerminalOutcome): Promise<void> {
    await this.#events.emit(this.terminalEvent(terminal), executionId);
  }

  /** Emit that the execution's session has closed. */
  async closed(executionId: string): Promise<void> {
    await this.#events.emit('session-closed', executionId);
  }
}
