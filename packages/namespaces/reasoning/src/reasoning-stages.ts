/**
 * Reasoning stages: the reasoning state model, the named states a reasoning may hold and the permitted
 * transitions between them (ai/reasoning/reasoning-stages.md, OL-AI-REASONING-REASONING-STAGES).
 *
 * This is the reasoning namespace's genuine deterministic algorithm (ADR-0024 category 2). The state
 * model is a directed graph over the ten named stages; the permitted transitions are the edges the
 * constitution enumerates verbatim (ai/reasoning/reasoning-stages.md, "Specification"). The transition
 * relation is realized as an immutable adjacency map and a pure total predicate over it. It defines the
 * relation only; the mechanism that carries a reasoning along an edge is the runtime's, and the order
 * that drives transitions is owned by ai/reasoning/reasoning-workflow.md (ADR-0020).
 */

/**
 * A reasoning-stages principle: a permanent rule the state model upholds
 * (ai/reasoning/reasoning-stages.md, "Principles").
 */
export type ReasoningStagePrinciple =
  | 'always-in-exactly-one-stage'
  | 'transitions-are-defined-not-arbitrary'
  | 'every-reasoning-reaches-a-terminal-stage'
  | 'the-state-model-is-technology-neutral';

/** The reasoning-stages principles, in constitutional order; frozen. */
export const REASONING_STAGE_PRINCIPLES: readonly ReasoningStagePrinciple[] = Object.freeze([
  'always-in-exactly-one-stage',
  'transitions-are-defined-not-arbitrary',
  'every-reasoning-reaches-a-terminal-stage',
  'the-state-model-is-technology-neutral',
]);

/** What each reasoning-stages principle requires (ai/reasoning/reasoning-stages.md, "Principles"). */
export const REASONING_STAGE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ReasoningStagePrinciple, string>
> = Object.freeze({
  'always-in-exactly-one-stage':
    'A reasoning is always in exactly one stage; its condition is defined at every point in its life.',
  'transitions-are-defined-not-arbitrary':
    'A reasoning moves only along a permitted transition, never to an undefined stage.',
  'every-reasoning-reaches-a-terminal-stage':
    'The model always leads to a concluded, inconclusive, or escalated outcome, and thence to completion.',
  'the-state-model-is-technology-neutral':
    'The state model describes conditions and transitions, never a mechanism, algorithm, or chain of thought that implements them.',
});

/**
 * A reasoning stage: one named condition a reasoning may hold, in constitutional listing order
 * (ai/reasoning/reasoning-stages.md, "Specification"). This is a state identity, not an ordering; the
 * permitted moves between stages are given by {@link REASONING_STAGE_TRANSITIONS}.
 */
export type ReasoningStage =
  | 'initiated'
  | 'framed'
  | 'reasoning'
  | 'uncertain'
  | 'concluding'
  | 'validating'
  | 'concluded'
  | 'inconclusive'
  | 'escalated'
  | 'complete';

/** The reasoning stages, in constitutional listing order; frozen. */
export const REASONING_STAGES: readonly ReasoningStage[] = Object.freeze([
  'initiated',
  'framed',
  'reasoning',
  'uncertain',
  'concluding',
  'validating',
  'concluded',
  'inconclusive',
  'escalated',
  'complete',
]);

/** What each reasoning stage is (ai/reasoning/reasoning-stages.md, "Specification"). */
export const REASONING_STAGE_DESCRIPTIONS: Readonly<Record<ReasoningStage, string>> = Object.freeze(
  {
    initiated: 'The reasoning has begun but has not been framed.',
    framed:
      'The task, retrieved knowledge, and governing rules have been established as the basis for reasoning.',
    reasoning:
      'The knowledge is being transformed, applying the categories of reasoning, surfacing assumptions, and detecting contradictions.',
    uncertain:
      'Uncertainty has been encountered and is being classified under ai/reasoning/uncertainty-handling.md.',
    concluding: 'A governed conclusion is being formed under ai/reasoning/conclusion-formation.md.',
    validating:
      'The reasoning and conclusion are being validated for grounding, consistency, and quality.',
    concluded: 'A validated governed conclusion has been reached.',
    inconclusive:
      'The reasoning could not reach a sufficient conclusion and produced a governed absence of one.',
    escalated:
      'The reasoning could not proceed within the rules and was escalated under ai/governance/escalation.md.',
    complete: 'The reasoning is finished, in a terminal condition.',
  },
);

/**
 * The permitted transitions of the reasoning state model: for each stage, the stages it may move to
 * (ai/reasoning/reasoning-stages.md, "Specification"). These edges are the constitution's verbatim; the
 * map is the state model's directed graph. Frozen, and every stage is a key (a stage with no outgoing
 * transition maps to an empty, frozen list).
 */
export const REASONING_STAGE_TRANSITIONS: Readonly<
  Record<ReasoningStage, readonly ReasoningStage[]>
> = Object.freeze({
  initiated: Object.freeze(['framed'] as const),
  framed: Object.freeze(['reasoning'] as const),
  reasoning: Object.freeze(['uncertain', 'concluding', 'escalated', 'inconclusive'] as const),
  uncertain: Object.freeze(['reasoning'] as const),
  concluding: Object.freeze(['validating'] as const),
  validating: Object.freeze(['concluded', 'reasoning'] as const),
  concluded: Object.freeze(['complete'] as const),
  inconclusive: Object.freeze(['complete'] as const),
  escalated: Object.freeze(['complete'] as const),
  complete: Object.freeze([] as const),
});

/**
 * A reasoning-stages invariant: a guarantee the state model always upholds
 * (ai/reasoning/reasoning-stages.md, "Invariants").
 */
export type ReasoningStageInvariant =
  | 'exactly-one-stage-at-all-times'
  | 'concluded-only-via-validating-from-concluding'
  | 'every-path-reaches-complete'
  | 'complete-is-terminal'
  | 'a-stage-change-is-inert';

/** The reasoning-stages invariants, in constitutional order; frozen. */
export const REASONING_STAGE_INVARIANTS: readonly ReasoningStageInvariant[] = Object.freeze([
  'exactly-one-stage-at-all-times',
  'concluded-only-via-validating-from-concluding',
  'every-path-reaches-complete',
  'complete-is-terminal',
  'a-stage-change-is-inert',
]);

/** What each reasoning-stages invariant guarantees (ai/reasoning/reasoning-stages.md, "Invariants"). */
export const REASONING_STAGE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ReasoningStageInvariant, string>
> = Object.freeze({
  'exactly-one-stage-at-all-times': 'A reasoning is in exactly one stage at all times.',
  'concluded-only-via-validating-from-concluding':
    'Concluded is entered only from Validating, which is entered only from Concluding.',
  'every-path-reaches-complete':
    'Every path through the model reaches Complete, through Concluded, Inconclusive, or Escalated.',
  'complete-is-terminal': 'Complete is terminal; no reasoning leaves it.',
  'a-stage-change-is-inert':
    'A stage change never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.',
});

/**
 * Whether a reasoning in stage `from` may move to stage `to`, per the permitted transitions of the state
 * model (ai/reasoning/reasoning-stages.md, "Specification"). Pure and total: true exactly when `to` is
 * listed among `from`'s permitted transitions in {@link REASONING_STAGE_TRANSITIONS}. It reads only the
 * constitution's enumerated edges and states no policy of its own.
 */
export function transitionAllowed(from: ReasoningStage, to: ReasoningStage): boolean {
  return REASONING_STAGE_TRANSITIONS[from].includes(to);
}
