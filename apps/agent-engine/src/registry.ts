import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { AgentError } from './errors.js';
import type { AgentDefinition, AgentId } from './types.js';

/**
 * The agent registry: registration, discovery, and deterministic lookup of agents by id. It preserves registration
 * order (Map insertion order), so composition is deterministic. It holds agent definitions (identity, capabilities,
 * permissions, specialization), never business truth and never the work an agent composes.
 */
export class AgentRegistry {
  readonly #byId = new Map<AgentId, AgentDefinition>();

  /** Register an agent. Fails closed on a duplicate id (`AGENT.DUPLICATE_ID`). */
  register(agent: AgentDefinition): Result<void, AgentError> {
    if (this.#byId.has(agent.id)) {
      return err(
        new AgentError(
          'AGENT.DUPLICATE_ID',
          `An agent with id '${agent.id}' is already registered.`,
          {
            id: agent.id,
          },
        ),
      );
    }
    this.#byId.set(agent.id, agent);
    return ok(undefined);
  }

  /** Whether an agent with the given id is registered. */
  has(id: AgentId): boolean {
    return this.#byId.has(id);
  }

  /** The registered agent for an id, or `undefined`. */
  get(id: AgentId): AgentDefinition | undefined {
    return this.#byId.get(id);
  }

  /** All registered agents, in registration order. */
  list(): readonly AgentDefinition[] {
    return [...this.#byId.values()];
  }

  /** Remove an agent by id; returns whether one was removed. */
  unregister(id: AgentId): boolean {
    return this.#byId.delete(id);
  }
}
