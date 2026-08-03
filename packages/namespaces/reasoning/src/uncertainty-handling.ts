/**
 * Uncertainty handling: how the uncertainty a reasoning encounters is classified
 * (ai/reasoning/uncertainty-handling.md, OL-AI-REASONING-UNCERTAINTY-HANDLING).
 *
 * The Specification enumerates a closed taxonomy of the architectural kinds of uncertainty. This module
 * owns the classification only; it never defines a probability, statistic, confidence measure, or any
 * mathematics (implementation), and it never decides whether uncertainty requires escalation
 * (ai/governance/escalation.md). The kinds describe the source and nature of uncertainty, never its
 * magnitude; a reasoning may classify an uncertainty into one or more of them. The set is unordered, so
 * this module carries no predicate; it is the immutable definition of the taxonomy (ADR-0020).
 */

/**
 * An uncertainty-handling principle: a permanent rule uncertainty classification upholds
 * (ai/reasoning/uncertainty-handling.md, "Principles").
 */
export type UncertaintyHandlingPrinciple =
  | 'uncertainty-is-classified-not-scored'
  | 'uncertainty-is-surfaced-not-hidden'
  | 'uncertainty-defaults-to-caution'
  | 'classification-is-deterministic';

/** The uncertainty-handling principles, in constitutional order; frozen. */
export const UNCERTAINTY_HANDLING_PRINCIPLES: readonly UncertaintyHandlingPrinciple[] =
  Object.freeze([
    'uncertainty-is-classified-not-scored',
    'uncertainty-is-surfaced-not-hidden',
    'uncertainty-defaults-to-caution',
    'classification-is-deterministic',
  ]);

/** What each uncertainty-handling principle requires (ai/reasoning/uncertainty-handling.md, "Principles"). */
export const UNCERTAINTY_HANDLING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<UncertaintyHandlingPrinciple, string>
> = Object.freeze({
  'uncertainty-is-classified-not-scored':
    'Uncertainty is described by architectural kind, never by a probability, statistic, or confidence value.',
  'uncertainty-is-surfaced-not-hidden':
    'Uncertainty a reasoning encounters is made explicit, so it is handled rather than buried in a confident-looking conclusion.',
  'uncertainty-defaults-to-caution':
    'When uncertainty cannot be resolved within the reasoning, the reasoning yields no conclusion, or escalates, rather than invent one.',
  'classification-is-deterministic':
    'The same uncertainty over the same inputs is classified the same way.',
});

/**
 * An uncertainty kind: one architectural kind of uncertainty a reasoning may encounter, in constitutional
 * listing order (ai/reasoning/uncertainty-handling.md, "Specification"). The kinds describe the source and
 * nature of uncertainty, never its magnitude; the set is unordered.
 */
export type UncertaintyKind =
  'knowledge' | 'interpretation' | 'conflict' | 'applicability' | 'authority';

/** The uncertainty kinds, in constitutional listing order; frozen. */
export const UNCERTAINTY_KINDS: readonly UncertaintyKind[] = Object.freeze([
  'knowledge',
  'interpretation',
  'conflict',
  'applicability',
  'authority',
]);

/** What each uncertainty kind is (ai/reasoning/uncertainty-handling.md, "Specification"). */
export const UNCERTAINTY_KIND_DESCRIPTIONS: Readonly<Record<UncertaintyKind, string>> =
  Object.freeze({
    knowledge:
      'The retrieved knowledge is incomplete or silent on what the reasoning requires; a sufficiency gap related to the evidence sufficiency owned by ai/reasoning/reasoning-validation.md.',
    interpretation:
      'The retrieved knowledge admits more than one coherent interpretation, so the reasoning cannot settle on one without more.',
    conflict:
      'The retrieved knowledge or the reasoning holds a tension or contradiction, related to the contradiction detection owned by ai/reasoning/reasoning-consistency.md.',
    applicability:
      'It is unclear whether the retrieved knowledge or a governing rule applies to the case at hand.',
    authority:
      'It is unclear which of two sources or rules governs, a question resolved by the authority owned by the knowledge repository and ai/README.md, not invented here.',
  });

/**
 * An uncertainty-handling invariant: a guarantee uncertainty classification always upholds
 * (ai/reasoning/uncertainty-handling.md, "Invariants").
 */
export type UncertaintyHandlingInvariant =
  | 'uncertainty-is-a-kind-never-a-value'
  | 'uncertainty-is-made-explicit'
  | 'unresolvable-uncertainty-yields-no-conclusion-or-escalation'
  | 'classification-is-deterministic'
  | 'classifying-is-inert';

/** The uncertainty-handling invariants, in constitutional order; frozen. */
export const UNCERTAINTY_HANDLING_INVARIANTS: readonly UncertaintyHandlingInvariant[] =
  Object.freeze([
    'uncertainty-is-a-kind-never-a-value',
    'uncertainty-is-made-explicit',
    'unresolvable-uncertainty-yields-no-conclusion-or-escalation',
    'classification-is-deterministic',
    'classifying-is-inert',
  ]);

/** What each uncertainty-handling invariant guarantees (ai/reasoning/uncertainty-handling.md, "Invariants"). */
export const UNCERTAINTY_HANDLING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<UncertaintyHandlingInvariant, string>
> = Object.freeze({
  'uncertainty-is-a-kind-never-a-value':
    'Uncertainty is described by architectural kind, never by a probability, statistic, or confidence value.',
  'uncertainty-is-made-explicit':
    'Uncertainty a reasoning encounters is made explicit, never hidden in a conclusion.',
  'unresolvable-uncertainty-yields-no-conclusion-or-escalation':
    'Unresolvable uncertainty yields no conclusion or an escalation, never an invented conclusion.',
  'classification-is-deterministic':
    'Classification is deterministic over the same uncertainty and inputs.',
  'classifying-is-inert':
    'Classifying uncertainty never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.',
});
