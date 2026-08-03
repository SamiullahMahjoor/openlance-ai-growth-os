/**
 * Reasoning workflow: the required order of reasoning, the ordered sequence of steps from framing to a
 * governed conclusion (ai/reasoning/reasoning-workflow.md, OL-AI-REASONING-REASONING-WORKFLOW).
 *
 * Where the lifecycle names the coarse phases, the workflow names the fine-grained steps and their
 * required order. Each step is a discrete unit of reasoning work; the order is architectural, defining what
 * happens before what, never how any step is carried out, and it defines no algorithm and no chain of
 * thought. This module defines the ordered steps, their principles, and their invariants, plus the pure
 * ordering predicate the document's ordering states. The mechanism that performs the steps is the
 * runtime's; this module is the immutable model of their order (ADR-0020). The model of each step is owned
 * by that step's document, referenced not restated.
 */

/**
 * A reasoning-workflow principle: a permanent rule the order upholds, each instantiating a reasoning
 * invariant (ai/reasoning/reasoning-workflow.md, "Principles").
 */
export type ReasoningWorkflowPrinciple =
  | 'order-is-fixed-and-deterministic'
  | 'framing-precedes-transformation'
  | 'sufficiency-precedes-conclusion'
  | 'validation-precedes-acceptance'
  | 'order-holds-at-any-scale';

/** The reasoning-workflow principles, in constitutional order; frozen. */
export const REASONING_WORKFLOW_PRINCIPLES: readonly ReasoningWorkflowPrinciple[] = Object.freeze([
  'order-is-fixed-and-deterministic',
  'framing-precedes-transformation',
  'sufficiency-precedes-conclusion',
  'validation-precedes-acceptance',
  'order-holds-at-any-scale',
]);

/** What each reasoning-workflow principle requires (ai/reasoning/reasoning-workflow.md, "Principles"). */
export const REASONING_WORKFLOW_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ReasoningWorkflowPrinciple, string>
> = Object.freeze({
  'order-is-fixed-and-deterministic':
    'Every reasoning follows the same required order, so the same inputs yield the same outcome.',
  'framing-precedes-transformation':
    'The basis is established before the knowledge is transformed.',
  'sufficiency-precedes-conclusion':
    'A conclusion is formed only after the reasoning and its evidence are found sufficient.',
  'validation-precedes-acceptance':
    'A conclusion is validated before it is accepted, and an invalid reasoning is revised or does not conclude.',
  'order-holds-at-any-scale': 'One conclusion and millions follow the same order.',
});

/**
 * A reasoning-workflow step, in constitutional order from first to last
 * (ai/reasoning/reasoning-workflow.md, "Specification"). The order is the document's; it is total and is
 * exposed by {@link reasoningStepAtOrAfter}.
 */
export type ReasoningWorkflowStep =
  | 'receive-request'
  | 'frame'
  | 'decompose'
  | 'analyze'
  | 'synthesize'
  | 'handle-uncertainty'
  | 'form-conclusion'
  | 'validate'
  | 'produce-outcome';

/** The reasoning-workflow steps, first to last; frozen. */
export const REASONING_WORKFLOW_STEPS: readonly ReasoningWorkflowStep[] = Object.freeze([
  'receive-request',
  'frame',
  'decompose',
  'analyze',
  'synthesize',
  'handle-uncertainty',
  'form-conclusion',
  'validate',
  'produce-outcome',
]);

/** What each reasoning-workflow step is (ai/reasoning/reasoning-workflow.md, "Specification"). */
export const REASONING_WORKFLOW_STEP_DESCRIPTIONS: Readonly<Record<ReasoningWorkflowStep, string>> =
  Object.freeze({
    'receive-request':
      'A reasoning is requested for a task, with the retrieved knowledge determined under ai/retrieval/ and the governing rules owned by ai/governance/.',
    frame: 'The reasoning is framed on the task, the retrieved knowledge, and the governing rules.',
    decompose:
      'The problem is broken into its parts, under the categories owned by ai/reasoning/reasoning-strategies.md.',
    analyze:
      'The parts are examined, applying comparison and trade-off analysis under ai/reasoning/reasoning-strategies.md, surfacing assumptions and checking evidence sufficiency under ai/reasoning/reasoning-validation.md, and detecting contradictions under ai/reasoning/reasoning-consistency.md.',
    synthesize:
      'The parts are integrated into a coherent basis for a conclusion, under ai/reasoning/reasoning-strategies.md.',
    'handle-uncertainty':
      'Any uncertainty is classified under ai/reasoning/uncertainty-handling.md, and where it cannot be resolved within the rules, the reasoning escalates under ai/governance/escalation.md.',
    'form-conclusion':
      'A governed conclusion is formed under ai/reasoning/conclusion-formation.md, only when the reasoning and its evidence are sufficient.',
    validate:
      'The reasoning and conclusion are validated for grounding and sufficiency, internal consistency, and quality, under ai/reasoning/reasoning-validation.md, ai/reasoning/reasoning-consistency.md, and ai/reasoning/reasoning-quality.md.',
    'produce-outcome':
      'The validated governed conclusion is produced, or, where none can be formed within the rules, the reasoning yields a classified uncertainty or escalates rather than conclude.',
  });

/**
 * A reasoning-workflow invariant: a guarantee the order always upholds
 * (ai/reasoning/reasoning-workflow.md, "Invariants").
 */
export type ReasoningWorkflowInvariant =
  | 'steps-occur-in-order'
  | 'no-conclusion-accepted-before-validate'
  | 'same-inputs-same-ordered-outcome'
  | 'order-is-inert';

/** The reasoning-workflow invariants, in constitutional order; frozen. */
export const REASONING_WORKFLOW_INVARIANTS: readonly ReasoningWorkflowInvariant[] = Object.freeze([
  'steps-occur-in-order',
  'no-conclusion-accepted-before-validate',
  'same-inputs-same-ordered-outcome',
  'order-is-inert',
]);

/** What each reasoning-workflow invariant guarantees (ai/reasoning/reasoning-workflow.md, "Invariants"). */
export const REASONING_WORKFLOW_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ReasoningWorkflowInvariant, string>
> = Object.freeze({
  'steps-occur-in-order':
    'Frame precedes Decompose, Analyze, and Synthesize, which precede Form conclusion, which precedes Validate.',
  'no-conclusion-accepted-before-validate': 'No conclusion is accepted before it passes Validate.',
  'same-inputs-same-ordered-outcome':
    'The same task, retrieved knowledge, and governing rules always produce the same ordered outcome.',
  'order-is-inert':
    'The order never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each workflow step in the constitutional order (first = 0). Internal to the ordering
 * predicate; never exported.
 */
const REASONING_WORKFLOW_STEP_RANK: Readonly<Record<ReasoningWorkflowStep, number>> = Object.freeze(
  {
    'receive-request': 0,
    frame: 1,
    decompose: 2,
    analyze: 3,
    synthesize: 4,
    'handle-uncertainty': 5,
    'form-conclusion': 6,
    validate: 7,
    'produce-outcome': 8,
  },
);

/**
 * Whether workflow step `a` is at or after workflow step `b` in the constitutional step order
 * (ai/reasoning/reasoning-workflow.md, "Specification"). Pure and total: it reads only the fixed order the
 * document defines and expresses that order verbatim. It states no policy of its own.
 */
export function reasoningStepAtOrAfter(
  a: ReasoningWorkflowStep,
  b: ReasoningWorkflowStep,
): boolean {
  return REASONING_WORKFLOW_STEP_RANK[a] >= REASONING_WORKFLOW_STEP_RANK[b];
}
