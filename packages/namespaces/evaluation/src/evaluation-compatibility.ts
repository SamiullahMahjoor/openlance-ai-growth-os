/**
 * Evaluation compatibility: whether an evaluation is compatible with a subject, and whether an evaluation
 * version is compatible with a consumer (ai/evaluation/evaluation-compatibility.md,
 * OL-AI-EVALUATION-EVALUATION-COMPATIBILITY).
 *
 * The Specification enumerates a closed set of the two kinds of compatibility the model owns: subject
 * compatibility (an evaluation against a subject) and version compatibility (a version against a consumer).
 * This module owns the compatibility relation; the evolution and version rules are owned by
 * ai/evaluation/evaluation-versioning.md and the metrics compatibility rests on by
 * ai/evaluation/evaluation-metrics.md, referenced not restated. The kinds carry no ordering and no predicate;
 * this module is their immutable definition, and comparability and explicit incompatibility are stated in the
 * principles and invariants (ADR-0020).
 */

/**
 * An evaluation-compatibility principle: a permanent rule the compatibility model upholds, each instantiating
 * an evaluation invariant (ai/evaluation/evaluation-compatibility.md, "Principles").
 */
export type EvaluationCompatibilityPrinciple =
  | 'compatibility-is-a-defined-relation'
  | 'compatibility-rests-on-metrics-and-subject'
  | 'compatibility-keeps-results-comparable'
  | 'incompatibility-is-explicit';

/** The evaluation-compatibility principles, in constitutional order; frozen. */
export const EVALUATION_COMPATIBILITY_PRINCIPLES: readonly EvaluationCompatibilityPrinciple[] =
  Object.freeze([
    'compatibility-is-a-defined-relation',
    'compatibility-rests-on-metrics-and-subject',
    'compatibility-keeps-results-comparable',
    'incompatibility-is-explicit',
  ]);

/** What each evaluation-compatibility principle requires (ai/evaluation/evaluation-compatibility.md, "Principles"). */
export const EVALUATION_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvaluationCompatibilityPrinciple, string>
> = Object.freeze({
  'compatibility-is-a-defined-relation':
    'An evaluation is compatible with a subject, or a version with a consumer, by a defined relation, never by assumption.',
  'compatibility-rests-on-metrics-and-subject':
    "An evaluation is compatible with a subject when its metrics apply to that subject's output, drawn from ai/evaluation/evaluation-metrics.md.",
  'compatibility-keeps-results-comparable':
    'Results from compatible evaluations and versions are comparable; an incompatible change breaks comparability and is versioned.',
  'incompatibility-is-explicit':
    'An incompatible evaluation or version is identified as such, so an inapplicable evaluation is never applied and a broken version is never assumed compatible.',
});

/**
 * An evaluation-compatibility kind: one of the two compatibility relations the model owns, in constitutional
 * listing order (ai/evaluation/evaluation-compatibility.md, "Specification"). The set is unordered.
 */
export type EvaluationCompatibilityKind = 'subject' | 'version';

/** The two kinds of evaluation compatibility, in constitutional listing order; frozen. */
export const EVALUATION_COMPATIBILITY_KINDS: readonly EvaluationCompatibilityKind[] = Object.freeze(
  ['subject', 'version'],
);

/** What each evaluation-compatibility kind is (ai/evaluation/evaluation-compatibility.md, "Specification"). */
export const EVALUATION_COMPATIBILITY_KIND_DESCRIPTIONS: Readonly<
  Record<EvaluationCompatibilityKind, string>
> = Object.freeze({
  subject:
    "An evaluation is compatible with a subject when the metrics it measures, owned by ai/evaluation/evaluation-metrics.md, apply to that subject's output; an evaluation whose metrics do not apply is incompatible and is not used to judge it.",
  version:
    "An evaluation version, or a benchmark version, is compatible with a consumer of its results when the consumer's expectations still hold against that version, so results remain comparable; a change that breaks them is incompatible and is versioned and migrated under ai/evaluation/evaluation-versioning.md.",
});

/**
 * An evaluation-compatibility invariant: a guarantee the compatibility model always upholds
 * (ai/evaluation/evaluation-compatibility.md, "Invariants").
 */
export type EvaluationCompatibilityInvariant =
  | 'compatible-with-subject-only-when-metrics-apply'
  | 'version-compatible-only-when-consumer-expectations-hold'
  | 'compatible-results-comparable-incompatible-not-compared-as-alike'
  | 'incompatible-identified-never-used-as-compatible'
  | 'determining-compatibility-is-inert';

/** The evaluation-compatibility invariants, in constitutional order; frozen. */
export const EVALUATION_COMPATIBILITY_INVARIANTS: readonly EvaluationCompatibilityInvariant[] =
  Object.freeze([
    'compatible-with-subject-only-when-metrics-apply',
    'version-compatible-only-when-consumer-expectations-hold',
    'compatible-results-comparable-incompatible-not-compared-as-alike',
    'incompatible-identified-never-used-as-compatible',
    'determining-compatibility-is-inert',
  ]);

/** What each evaluation-compatibility invariant guarantees (ai/evaluation/evaluation-compatibility.md, "Invariants"). */
export const EVALUATION_COMPATIBILITY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvaluationCompatibilityInvariant, string>
> = Object.freeze({
  'compatible-with-subject-only-when-metrics-apply':
    "An evaluation is compatible with a subject only when its metrics apply to that subject's output.",
  'version-compatible-only-when-consumer-expectations-hold':
    "A version is compatible with a consumer only when the consumer's expectations still hold against it.",
  'compatible-results-comparable-incompatible-not-compared-as-alike':
    'Results from compatible evaluations and versions are comparable; results across incompatible versions are not compared as alike.',
  'incompatible-identified-never-used-as-compatible':
    'An incompatible evaluation or version is identified as such and never used as if compatible.',
  'determining-compatibility-is-inert':
    'Determining compatibility never reasons, executes, decides, measures, scores, or changes ownership, authority, governance, or business truth.',
});
