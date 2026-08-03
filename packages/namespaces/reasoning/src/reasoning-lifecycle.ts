/**
 * Reasoning lifecycle: the phases of reasoning, from framing to validated conclusion
 * (ai/reasoning/reasoning-lifecycle.md, OL-AI-REASONING-REASONING-LIFECYCLE).
 *
 * The lifecycle is the coarse arc of a single reasoning as a progression of ordered phases. Each phase is
 * a distinct cognitive posture; the phases are ordered, and reasoning advances through them, except where
 * validation returns the reasoning to an earlier phase for revision. This module defines the ordered
 * phases, their principles, and their invariants, plus the pure ordering predicate the document's ordering
 * states. The mechanism that moves reasoning between phases is the runtime's; this module is the immutable
 * model of the ordering (ADR-0020). The ordered steps within the lifecycle are owned by
 * ai/reasoning/reasoning-workflow.md and the named states by ai/reasoning/reasoning-stages.md, referenced
 * not restated.
 */

/**
 * A reasoning-lifecycle principle: a permanent rule the lifecycle upholds, each instantiating a reasoning
 * invariant (ai/reasoning/reasoning-lifecycle.md, "Principles").
 */
export type ReasoningLifecyclePrinciple =
  | 'defined-beginning-and-end'
  | 'framing-precedes-transformation'
  | 'conclusion-precedes-validation'
  | 'every-reasoning-terminates';

/** The reasoning-lifecycle principles, in constitutional order; frozen. */
export const REASONING_LIFECYCLE_PRINCIPLES: readonly ReasoningLifecyclePrinciple[] = Object.freeze(
  [
    'defined-beginning-and-end',
    'framing-precedes-transformation',
    'conclusion-precedes-validation',
    'every-reasoning-terminates',
  ],
);

/** What each reasoning-lifecycle principle requires (ai/reasoning/reasoning-lifecycle.md, "Principles"). */
export const REASONING_LIFECYCLE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ReasoningLifecyclePrinciple, string>
> = Object.freeze({
  'defined-beginning-and-end':
    'Reasoning begins with framing and ends with a validated conclusion or a governed absence of one; it never runs unbounded.',
  'framing-precedes-transformation':
    'Reasoning establishes its basis before it transforms the knowledge.',
  'conclusion-precedes-validation':
    'A conclusion is formed before it is validated, and validation may return the reasoning for revision.',
  'every-reasoning-terminates':
    'Reasoning always reaches a validated conclusion, an escalation, or a governed absence of a conclusion.',
});

/**
 * A reasoning-lifecycle phase, in constitutional order from earliest to latest
 * (ai/reasoning/reasoning-lifecycle.md, "Specification"). The order is the document's; it is total and is
 * exposed by {@link reasoningPhaseAtOrAfter}. Each phase completes before the next begins, except where
 * validation returns the reasoning to an earlier phase for revision.
 */
export type ReasoningLifecyclePhase = 'framing' | 'transformation' | 'conclusion' | 'validation';

/** The reasoning-lifecycle phases, earliest to latest; frozen. */
export const REASONING_LIFECYCLE_PHASES: readonly ReasoningLifecyclePhase[] = Object.freeze([
  'framing',
  'transformation',
  'conclusion',
  'validation',
]);

/** What each reasoning-lifecycle phase is (ai/reasoning/reasoning-lifecycle.md, "Specification"). */
export const REASONING_LIFECYCLE_PHASE_DESCRIPTIONS: Readonly<
  Record<ReasoningLifecyclePhase, string>
> = Object.freeze({
  framing:
    'The reasoning is framed on the task, the retrieved knowledge determined under ai/retrieval/, and the governing rules owned by ai/governance/; framing establishes what is being reasoned about and the basis it rests on.',
  transformation:
    'The framed knowledge is transformed toward a conclusion, applying the categories of reasoning owned by ai/reasoning/reasoning-strategies.md, surfacing assumptions and detecting contradictions, and classifying any uncertainty under ai/reasoning/uncertainty-handling.md.',
  conclusion:
    'A governed conclusion is formed, under ai/reasoning/conclusion-formation.md, only when the reasoning and its evidence are sufficient; otherwise the reasoning yields uncertainty or no conclusion.',
  validation:
    'The reasoning and its conclusion are validated for grounding and sufficiency, internal consistency, and quality, under ai/reasoning/reasoning-validation.md, ai/reasoning/reasoning-consistency.md, and ai/reasoning/reasoning-quality.md, before the conclusion is accepted.',
});

/**
 * A reasoning-lifecycle invariant: a guarantee the lifecycle always upholds
 * (ai/reasoning/reasoning-lifecycle.md, "Invariants").
 */
export type ReasoningLifecycleInvariant =
  | 'one-lifecycle-per-reasoning'
  | 'phases-occur-in-order'
  | 'terminates-in-conclusion-escalation-or-governed-absence'
  | 'lifecycle-is-inert';

/** The reasoning-lifecycle invariants, in constitutional order; frozen. */
export const REASONING_LIFECYCLE_INVARIANTS: readonly ReasoningLifecycleInvariant[] = Object.freeze(
  [
    'one-lifecycle-per-reasoning',
    'phases-occur-in-order',
    'terminates-in-conclusion-escalation-or-governed-absence',
    'lifecycle-is-inert',
  ],
);

/** What each reasoning-lifecycle invariant guarantees (ai/reasoning/reasoning-lifecycle.md, "Invariants"). */
export const REASONING_LIFECYCLE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ReasoningLifecycleInvariant, string>
> = Object.freeze({
  'one-lifecycle-per-reasoning':
    'A reasoning holds exactly one lifecycle, from one framing to one terminal outcome.',
  'phases-occur-in-order':
    'The Framing phase precedes Transformation, which precedes Conclusion, which precedes Validation.',
  'terminates-in-conclusion-escalation-or-governed-absence':
    'A reasoning always terminates in a validated conclusion, an escalation, or a governed absence of a conclusion.',
  'lifecycle-is-inert':
    'The lifecycle never executes, loads, retrieves, expresses, or alters ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each lifecycle phase in the constitutional order (earliest = 0). Internal to the
 * ordering predicate; never exported.
 */
const REASONING_LIFECYCLE_PHASE_RANK: Readonly<Record<ReasoningLifecyclePhase, number>> =
  Object.freeze({
    framing: 0,
    transformation: 1,
    conclusion: 2,
    validation: 3,
  });

/**
 * Whether lifecycle phase `a` is at or after lifecycle phase `b` in the constitutional phase order
 * (ai/reasoning/reasoning-lifecycle.md, "Specification"). Pure and total: it reads only the fixed order the
 * document defines and expresses that order verbatim. It states no policy of its own.
 */
export function reasoningPhaseAtOrAfter(
  a: ReasoningLifecyclePhase,
  b: ReasoningLifecyclePhase,
): boolean {
  return REASONING_LIFECYCLE_PHASE_RANK[a] >= REASONING_LIFECYCLE_PHASE_RANK[b];
}
