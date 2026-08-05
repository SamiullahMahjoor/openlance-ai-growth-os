import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { AgentError } from './errors.js';
import type { AgentDefinition, AgentStep } from './types.js';

/**
 * Agent composition: it composes an agent's steps over the operational namespaces it holds. Every step names a
 * capability the agent must hold (`capabilities`), the plan must be non-empty, and the composition is bounded (no
 * unbounded composition). It fails closed on an empty plan, a plan that exceeds the bound, or a step whose capability
 * the agent does not hold. It composes the structure only; it never performs the internal work of a composed namespace,
 * executes, or invokes an engine.
 */
export class AgentComposer {
  /** Compose the agent's steps, bounded and within its held capabilities; fail closed. */
  compose(
    agent: AgentDefinition,
    steps: readonly AgentStep[],
    maxSteps: number,
  ): Result<readonly AgentStep[], AgentError> {
    if (steps.length === 0) {
      return err(
        new AgentError('AGENT.EMPTY_PLAN', `Agent '${agent.id}' composed no steps.`, {
          id: agent.id,
        }),
      );
    }
    if (steps.length > maxSteps) {
      return err(
        new AgentError(
          'AGENT.PLAN_TOO_LARGE',
          `Agent '${agent.id}' composed ${steps.length} steps, exceeding the bound of ${maxSteps}.`,
          { id: agent.id, steps: steps.length, maxSteps },
        ),
      );
    }
    for (const step of steps) {
      if (!agent.capabilities.includes(step.capability)) {
        return err(
          new AgentError(
            'AGENT.NOT_CAPABLE',
            `Agent '${agent.id}' does not hold capability '${step.capability}'.`,
            { id: agent.id, capability: step.capability },
          ),
        );
      }
    }
    // Freeze each step wrapper (a fresh copy), so a caller retaining an input step cannot reassign a validated step's
    // capability after the plan is built; the array is a copy, independent of the caller's input.
    return ok(Object.freeze(steps.map((step) => Object.freeze({ ...step }))));
  }
}
