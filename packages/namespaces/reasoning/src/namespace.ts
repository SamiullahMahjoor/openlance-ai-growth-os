/**
 * The Reasoning namespace, namespace-wide truth (ai/reasoning/README.md, OL-AI-REASONING-README;
 * ai/reasoning/reasoning.md, OL-AI-REASONING-REASONING).
 *
 * The reasoning invariants every reasoning concern upholds, and the canonical inventory of the
 * reasoning concerns, as immutable definitions (ADR-0020). The namespace is the cognitive model of the
 * AI layer: it defines how retrieved knowledge is transformed, under governing rules, into governed
 * conclusions, and it never executes reasoning, never determines the knowledge it reasons over, never
 * expresses itself as a prompt, and never defines an algorithm, a chain of thought, a hidden reasoning
 * process, a provider, a model, or code (ai/reasoning/README.md). Reasoning is deterministic,
 * repeatable, and scalable: the same task, retrieved knowledge, and governing rules produce the same
 * outcome, and the model holds for one conclusion or millions (ai/reasoning/reasoning.md).
 *
 * ADR-0024 classifies Reasoning as category 2 (Pure Algorithms). Its executable surface is three pure
 * deterministic algorithms over reasoning-owned classifications - the stage-transition relation
 * (transitionAllowed) and the lifecycle-phase and workflow-step orderings - realized per ADR-0020 as an
 * immutable stateless domain model with no IO; the reasoning mechanism itself is the runtime's.
 */

/**
 * A reasoning invariant: a permanent guarantee every reasoning document upholds and no reasoning may
 * violate (ai/reasoning/README.md, "Reasoning Invariants"). Every reasoning concern's principles
 * instantiate these.
 */
export type ReasoningInvariant =
  | 'deterministic'
  | 'explicit-never-hidden'
  | 'consumes-never-owns'
  | 'governed'
  | 'internally-consistent'
  | 'grounded'
  | 'sufficient-before-concludes'
  | 'repeatable-and-scalable';

/** The eight reasoning invariants, in constitutional order; frozen. */
export const REASONING_INVARIANTS: readonly ReasoningInvariant[] = Object.freeze([
  'deterministic',
  'explicit-never-hidden',
  'consumes-never-owns',
  'governed',
  'internally-consistent',
  'grounded',
  'sufficient-before-concludes',
  'repeatable-and-scalable',
]);

/** The guarantee each reasoning invariant states (ai/reasoning/README.md, "Reasoning Invariants"). */
export const REASONING_INVARIANT_DESCRIPTIONS: Readonly<Record<ReasoningInvariant, string>> =
  Object.freeze({
    deterministic:
      'The same task, the same retrieved knowledge, and the same governing rules produce the same reasoning outcome; there is no randomness.',
    'explicit-never-hidden':
      'Every step of reasoning is defined and traceable to its inputs; no conclusion rests on hidden reasoning.',
    'consumes-never-owns':
      'Reasoning consumes retrieved knowledge and governing rules and owns neither the truth nor the rules.',
    governed:
      'Every conclusion is formed within the governing rules owned by ai/governance/, and reasoning escalates rather than conclude outside them.',
    'internally-consistent':
      'Reasoning contains no contradiction, and it never produces conflicting conclusions from the same inputs.',
    grounded:
      'A conclusion rests only on the retrieved knowledge and stated assumptions, never on invented facts.',
    'sufficient-before-concludes':
      'A conclusion is formed only when the reasoning and its evidence are sufficient; otherwise reasoning yields uncertainty or no conclusion.',
    'repeatable-and-scalable':
      'The same reasoning reproduces the same outcome, and the model holds for one conclusion or millions.',
  });

/**
 * A reasoning concern: one aspect of the reasoning model, each owned by exactly one document
 * (ai/reasoning/reasoning.md, "The Reasoning Concerns"). This is the namespace inventory identity; the
 * model of each concern is owned by its named document and this package's corresponding module.
 */
export type ReasoningConcern =
  | 'reasoning-lifecycle'
  | 'reasoning-workflow'
  | 'reasoning-stages'
  | 'reasoning-strategies'
  | 'reasoning-validation'
  | 'reasoning-consistency'
  | 'uncertainty-handling'
  | 'conclusion-formation'
  | 'reasoning-quality'
  | 'reasoning-boundaries';

/** The ten reasoning concerns, in inventory order; frozen. */
export const REASONING_CONCERNS: readonly ReasoningConcern[] = Object.freeze([
  'reasoning-lifecycle',
  'reasoning-workflow',
  'reasoning-stages',
  'reasoning-strategies',
  'reasoning-validation',
  'reasoning-consistency',
  'uncertainty-handling',
  'conclusion-formation',
  'reasoning-quality',
  'reasoning-boundaries',
]);

/** What each reasoning concern owns (ai/reasoning/reasoning.md, "The Reasoning Concerns"). */
export const REASONING_CONCERN_DESCRIPTIONS: Readonly<Record<ReasoningConcern, string>> =
  Object.freeze({
    'reasoning-lifecycle': 'The phases of reasoning, from framing to validated conclusion.',
    'reasoning-workflow':
      'The required order of reasoning: the ordered sequence from framing to governed conclusion.',
    'reasoning-stages':
      'The reasoning state model: the named states reasoning may hold and the permitted transitions between them.',
    'reasoning-strategies':
      'The architectural categories of reasoning: decomposition, synthesis, comparison, and trade-off analysis.',
    'reasoning-validation':
      'Validation of reasoning: assumption identification and evidence sufficiency.',
    'reasoning-consistency':
      'Internal consistency of reasoning: contradiction detection and the absence of conflicting conclusions.',
    'uncertainty-handling': 'How uncertainty in reasoning is classified.',
    'conclusion-formation':
      'How a governed conclusion is formed, including conclusion sufficiency.',
    'reasoning-quality':
      'The quality principles of reasoning: reasoning completeness and reasoning traceability.',
    'reasoning-boundaries': 'What reasoning never owns, and where reasoning stops.',
  });
