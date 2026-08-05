import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';

/**
 * The framework event types the evaluation engine emits. They are namespaced framework events (the injected `Clock`
 * stamps `occurredAt`); they carry an evaluation identity and a verdict, never a subject's behavior or a decision.
 */
export const EVALUATION_EVENT_TYPES = Object.freeze({
  evaluated: 'framework.evaluation.evaluated',
  result: 'framework.evaluation.result',
});

/**
 * Evaluation event emission. It publishes assessment facts (an evaluation processed, and its accepted or withheld
 * result) on the frozen event bus by consuming the frozen `createEvent` constructor. These are engine-owned framework
 * events; they inform and never decide. It recreates no bus, dispatcher, or subscription.
 */
export class EvaluationEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that an evaluation was processed. */
  async evaluated(evaluation: string): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, EVALUATION_EVENT_TYPES.evaluated, { evaluation }),
    );
  }

  /** Emit an evaluation's verdict (accepted or withheld). */
  async result(evaluation: string, verdict: string): Promise<void> {
    await this.#bus.publish(
      createEvent(this.#clock, EVALUATION_EVENT_TYPES.result, { evaluation, verdict }),
    );
  }
}
