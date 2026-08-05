import { createEvent } from '@openlance/aios-events';
import type { EventBus } from '@openlance/aios-events';
import type { Clock } from '@openlance/aios-kernel';

import type { AgentId } from './types.js';

/**
 * The framework event types the agent engine emits. They are namespaced framework events, distinct from the runtime AI
 * event-lifecycle, which is owned by the Runtime namespace and not restated here.
 */
export const AGENT_EVENT_TYPES = Object.freeze({
  registered: 'framework.agent.registered',
  planned: 'framework.agent.planned',
  failed: 'framework.agent.failed',
});

/**
 * Agent event emission. It publishes agent registration and planning facts on the frozen event bus by consuming the
 * frozen `createEvent` constructor (the injected `Clock` stamps `occurredAt`). It recreates no bus, dispatcher, or
 * subscription, and restates no runtime event model.
 */
export class AgentEvents {
  readonly #bus: EventBus;
  readonly #clock: Clock;

  constructor(bus: EventBus, clock: Clock) {
    this.#bus = bus;
    this.#clock = clock;
  }

  /** Emit that an agent was registered. */
  async registered(agentId: AgentId): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, AGENT_EVENT_TYPES.registered, { agentId }));
  }

  /** Emit that a plan was composed for an agent and a task. */
  async planned(agentId: AgentId, task: string): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, AGENT_EVENT_TYPES.planned, { agentId, task }));
  }

  /** Emit that a plan for an agent was refused. */
  async failed(agentId: AgentId): Promise<void> {
    await this.#bus.publish(createEvent(this.#clock, AGENT_EVENT_TYPES.failed, { agentId }));
  }
}
