import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import type { AgentComposer } from './composer.js';
import type { AgentCoordinator } from './coordinator.js';
import { AgentError } from './errors.js';
import type { AgentNormalizer } from './normalizer.js';
import type { AgentRegistry } from './registry.js';
import type { AgentExecutionPlan, AgentRequest } from './types.js';
import type { AgentValidator } from './validator.js';

/**
 * The agent planner: it composes the immutable agent execution plan over a request and the registry, in order: look up
 * the agent, frame the task, compose its steps within its held capabilities, validate them against its permissions,
 * coordinate any multi-agent topology, and assemble the {@link AgentExecutionPlan}. It **composes and stops**: it invokes
 * no engine, sequences and combines no results, opens no network, and executes nothing. It fails closed at every step,
 * terminating in a validated plan or a refusal.
 */
export class AgentPlanner {
  readonly #composer: AgentComposer;
  readonly #validator: AgentValidator;
  readonly #coordinator: AgentCoordinator;
  readonly #normalizer: AgentNormalizer;

  constructor(
    composer: AgentComposer,
    validator: AgentValidator,
    coordinator: AgentCoordinator,
    normalizer: AgentNormalizer,
  ) {
    this.#composer = composer;
    this.#validator = validator;
    this.#coordinator = coordinator;
    this.#normalizer = normalizer;
  }

  /** Compose the immutable execution plan for a request over the registry, failing closed. */
  plan(
    request: AgentRequest,
    registry: AgentRegistry,
    maxSteps: number,
    maxLinks: number,
  ): Result<AgentExecutionPlan, AgentError> {
    const agent = registry.get(request.agent);
    if (agent === undefined) {
      return err(
        new AgentError(
          'AGENT.UNKNOWN_AGENT',
          `No agent with id '${request.agent}' is registered.`,
          {
            agent: request.agent,
          },
        ),
      );
    }
    const task = this.#normalizer.normalize(request.task);
    if (task === '') {
      return err(new AgentError('AGENT.BLANK_TASK', `Agent '${agent.id}' has a blank task.`, {}));
    }
    const composed = this.#composer.compose(agent, request.steps, maxSteps);
    if (isErr(composed)) {
      return err(composed.error);
    }
    const validation = this.#validator.validate(agent, composed.value);
    if (isErr(validation)) {
      return err(validation.error);
    }
    const coordination = this.#coordinator.coordinate(request.coordinate ?? [], registry, maxLinks);
    if (isErr(coordination)) {
      return err(coordination.error);
    }
    const plan: AgentExecutionPlan = Object.freeze({
      agent: agent.id,
      task,
      steps: composed.value,
      coordination: coordination.value,
      validated: true,
    });
    return ok(plan);
  }
}
