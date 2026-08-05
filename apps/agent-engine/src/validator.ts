import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { AgentError } from './errors.js';
import type { AgentDefinition, AgentStep } from './types.js';

/**
 * Agent validation: it applies governance to a composed agent, checking that every step's capability is one the agent is
 * permitted to use (`permissions`, least privilege), so an agent acts only within its permissions. It fails closed on a
 * step the agent is not permitted to take. It applies the permission, never defines the rule (the autonomy and
 * escalation rules are owned by ai/governance/); validating never executes.
 */
export class AgentValidator {
  /** Validate that every composed step is within the agent's permissions; fail closed. */
  validate(agent: AgentDefinition, steps: readonly AgentStep[]): Result<void, AgentError> {
    for (const step of steps) {
      if (!agent.permissions.includes(step.capability)) {
        return err(
          new AgentError(
            'AGENT.NOT_PERMITTED',
            `Agent '${agent.id}' is not permitted to use '${step.capability}'.`,
            { id: agent.id, capability: step.capability },
          ),
        );
      }
    }
    return ok(undefined);
  }
}
