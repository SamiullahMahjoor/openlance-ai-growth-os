import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { AgentError } from './errors.js';
import { AgentNormalizer } from './normalizer.js';
import type { AgentCapability, AgentDefinition, AgentDefinitionInput } from './types.js';

/**
 * The six operational namespaces an agent may compose, per the frozen `agent-boundaries` composition boundary. Frozen;
 * the set an agent's capabilities and permissions are validated against.
 */
export const AGENT_CAPABILITIES: readonly AgentCapability[] = Object.freeze([
  'reasoning',
  'retrieval',
  'memory',
  'prompt',
  'tool',
  'provider',
]);

/**
 * The agent factory: it validates an `AgentDefinitionInput` and builds an immutable `AgentDefinition`, normalizing its
 * specialization. It fails closed on a blank id, no capabilities, a capability outside the operational namespaces, a
 * permission that exceeds the agent's capabilities (least privilege), or a blank specialization. When no permissions are
 * given, they default to the capabilities. It builds a composition definition only; it composes, executes, and invokes
 * nothing.
 */
export class AgentFactory {
  readonly #normalizer = new AgentNormalizer();

  /** Validate an input and build a frozen `AgentDefinition`, failing closed on an invalid input. */
  create(input: AgentDefinitionInput): Result<AgentDefinition, AgentError> {
    if (input.id.trim() === '') {
      return err(new AgentError('AGENT.BLANK_ID', 'An agent has a blank id.', {}));
    }
    if (input.capabilities.length === 0) {
      return err(
        new AgentError('AGENT.NO_CAPABILITIES', `Agent '${input.id}' declares no capabilities.`, {
          id: input.id,
        }),
      );
    }
    for (const capability of input.capabilities) {
      if (!AGENT_CAPABILITIES.includes(capability)) {
        return err(
          new AgentError(
            'AGENT.INVALID_CAPABILITY',
            `Agent '${input.id}' declares capability '${capability}', which is not an operational namespace.`,
            { id: input.id, capability },
          ),
        );
      }
    }
    const permissions = input.permissions ?? input.capabilities;
    for (const permission of permissions) {
      if (!input.capabilities.includes(permission)) {
        return err(
          new AgentError(
            'AGENT.PERMISSION_EXCEEDS_CAPABILITY',
            `Agent '${input.id}' is permitted '${permission}', which it does not hold as a capability (least privilege).`,
            { id: input.id, permission },
          ),
        );
      }
    }
    const specialization = this.#normalizer.normalize(input.specialization);
    if (specialization === '') {
      return err(
        new AgentError(
          'AGENT.BLANK_SPECIALIZATION',
          `Agent '${input.id}' has a blank specialization.`,
          {
            id: input.id,
          },
        ),
      );
    }
    const agent: AgentDefinition = {
      id: input.id,
      capabilities: Object.freeze([...input.capabilities]),
      permissions: Object.freeze([...permissions]),
      specialization,
    };
    return ok(Object.freeze(agent));
  }
}
