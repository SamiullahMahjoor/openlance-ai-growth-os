import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import {
  REASONING_STAGES,
  REASONING_STRATEGIES,
  REASONING_WORKFLOW_STEPS,
  reasoningStepAtOrAfter,
  transitionAllowed,
} from '@openlance/aios-reasoning';
import type { ReasoningStage, ReasoningWorkflowStep } from '@openlance/aios-reasoning';

import type { ReasoningDecomposer } from './decomposer.js';
import { ReasoningError } from './errors.js';
import type { ReasoningNormalizer } from './normalizer.js';
import type { ReasoningRegistry } from './registry.js';
import type { ReasoningId, ReasoningPlan, ReasoningRequest } from './types.js';
import type { ReasoningValidator } from './validator.js';

/**
 * The reasoning planner: it produces the governed reasoning plan over a request and the registry, driving the frozen
 * reasoning workflow, in order: frame the task on its premises and assumptions, decompose it into parts, validate it
 * through the frozen dimensions, determine the terminal stage, and produce the {@link ReasoningPlan}. It **reasons and
 * stops**: it invokes no provider, performs no inference, loads nothing, and executes nothing. It fails closed on a
 * malformed request, and yields a governed absence (an `inconclusive` or `escalated` plan) rather than an invented
 * conclusion.
 */
export class ReasoningPlanner {
  readonly #decomposer: ReasoningDecomposer;
  readonly #validator: ReasoningValidator;
  readonly #normalizer: ReasoningNormalizer;

  constructor(
    decomposer: ReasoningDecomposer,
    validator: ReasoningValidator,
    normalizer: ReasoningNormalizer,
  ) {
    this.#decomposer = decomposer;
    this.#validator = validator;
    this.#normalizer = normalizer;
  }

  /** The frozen, ordered reasoning workflow steps. */
  workflow(): readonly ReasoningWorkflowStep[] {
    return REASONING_WORKFLOW_STEPS;
  }

  /** Whether the frozen workflow steps are in constitutional order. Proof, over the predicate. */
  workflowInConstitutionalOrder(): boolean {
    return REASONING_WORKFLOW_STEPS.every((step, index) => {
      const previous = REASONING_WORKFLOW_STEPS[index - 1];
      return previous === undefined || reasoningStepAtOrAfter(step, previous);
    });
  }

  /** The frozen reasoning stages. */
  stages(): readonly ReasoningStage[] {
    return REASONING_STAGES;
  }

  /** Whether a stage is terminal, reaching Complete by a permitted transition (the frozen state machine). */
  reachesComplete(stage: ReasoningStage): boolean {
    return transitionAllowed(stage, 'complete');
  }

  /** Produce the governed reasoning plan for a request over the registry, failing closed. */
  plan(
    request: ReasoningRequest,
    registry: ReasoningRegistry,
    strictGovernance: boolean,
  ): Result<ReasoningPlan, ReasoningError> {
    if (strictGovernance && request.permitted === undefined) {
      return err(
        new ReasoningError(
          'REASONING.PERMISSION_REQUIRED',
          'A reasoning requires an explicit governance verdict.',
          {},
        ),
      );
    }
    const task = this.#normalizer.normalize(request.task);
    if (task === '') {
      return err(new ReasoningError('REASONING.BLANK_TASK', 'A reasoning has a blank task.', {}));
    }
    if (!REASONING_STRATEGIES.includes(request.strategy)) {
      return err(
        new ReasoningError(
          'REASONING.INVALID_STRATEGY',
          `Reasoning strategy '${request.strategy}' is not a reasoning category.`,
          { strategy: request.strategy },
        ),
      );
    }
    const premises: readonly ReasoningId[] = request.premises ?? [];
    for (const premiseId of premises) {
      if (!registry.has(premiseId)) {
        return err(
          new ReasoningError(
            'REASONING.UNKNOWN_PREMISE',
            `Reasoning references unknown premise '${premiseId}'.`,
            { premise: premiseId },
          ),
        );
      }
    }
    const decomposed = this.#decomposer.decompose(task, request.parts);
    if (isErr(decomposed)) {
      return err(decomposed.error);
    }
    const assumptions = (request.assumptions ?? []).map((assumption) =>
      this.#normalizer.normalize(assumption),
    );
    const validation = this.#validator.validate(premises, assumptions, request.permitted);
    if (isErr(validation)) {
      return err(validation.error);
    }
    const { stage, uncertainty } = validation.value;
    const plan: ReasoningPlan = Object.freeze({
      task,
      strategy: request.strategy,
      parts: decomposed.value,
      premises: Object.freeze([...premises]),
      assumptions: Object.freeze(assumptions),
      stage,
      ...(uncertainty !== undefined ? { uncertainty } : {}),
      validated: true,
    });
    return ok(plan);
  }
}
