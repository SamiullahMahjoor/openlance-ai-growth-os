/**
 * Evaluation versioning: how an evaluation definition is versioned, evolves, migrates, and is deprecated
 * (ai/evaluation/evaluation-versioning.md, OL-AI-EVALUATION-EVALUATION-VERSIONING).
 *
 * The Specification enumerates a closed set of the four aspects of evaluation versioning: version rules,
 * evolution, migration, and deprecation. This module owns evaluation versioning; the compatibility a version
 * preserves is owned by ai/evaluation/evaluation-compatibility.md, the permission to change by
 * ai/governance/change-governance.md (applied not restated), and the amendment workflow by ai/CONTRIBUTING.md.
 * The aspects carry no ordering and no predicate; this module is their immutable definition (ADR-0020).
 */

/**
 * An evaluation-versioning principle: a permanent rule evaluation versioning upholds, each instantiating an
 * evaluation invariant (ai/evaluation/evaluation-versioning.md, "Principles").
 */
export type EvaluationVersioningPrinciple =
  | 'an-evaluation-definition-is-versioned'
  | 'change-is-governed'
  | 'comparability-is-preserved-or-migrated'
  | 'results-record-their-version';

/** The evaluation-versioning principles, in constitutional order; frozen. */
export const EVALUATION_VERSIONING_PRINCIPLES: readonly EvaluationVersioningPrinciple[] =
  Object.freeze([
    'an-evaluation-definition-is-versioned',
    'change-is-governed',
    'comparability-is-preserved-or-migrated',
    'results-record-their-version',
  ]);

/** What each evaluation-versioning principle requires (ai/evaluation/evaluation-versioning.md, "Principles"). */
export const EVALUATION_VERSIONING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvaluationVersioningPrinciple, string>
> = Object.freeze({
  'an-evaluation-definition-is-versioned':
    'An evaluation, a metric, a scoring model, and a benchmark carry a version, so a change is identified and traceable.',
  'change-is-governed':
    'An evaluation definition evolves only under the change rules owned by ai/governance/, never arbitrarily.',
  'comparability-is-preserved-or-migrated':
    'A change that keeps results comparable is absorbed; a change that breaks comparability is versioned and migrated, so no result is silently reinterpreted.',
  'results-record-their-version':
    'Every result records the evaluation and benchmark version it was produced under, so results are never confused across versions.',
});

/**
 * An evaluation-versioning aspect: one of the aspects of how an evaluation definition is versioned and
 * evolves, in constitutional listing order (ai/evaluation/evaluation-versioning.md, "Specification"). The set
 * is unordered.
 */
export type EvaluationVersioningAspect =
  'version-rules' | 'evolution' | 'migration' | 'deprecation';

/** The four aspects of evaluation versioning, in constitutional listing order; frozen. */
export const EVALUATION_VERSIONING_ASPECTS: readonly EvaluationVersioningAspect[] = Object.freeze([
  'version-rules',
  'evolution',
  'migration',
  'deprecation',
]);

/** What each evaluation-versioning aspect is (ai/evaluation/evaluation-versioning.md, "Specification"). */
export const EVALUATION_VERSIONING_ASPECT_DESCRIPTIONS: Readonly<
  Record<EvaluationVersioningAspect, string>
> = Object.freeze({
  'version-rules':
    'An evaluation definition, a metric, a scoring model, and a benchmark carry a version that identifies it, so a change is explicit and traceable, and a result records the version it was produced under.',
  evolution:
    'An evaluation definition evolves by governed change under ai/governance/change-governance.md, additively where possible, so the evaluation model grows and new metrics and benchmarks are absorbed without redesign; evolution never changes the behavior evaluated and never rewrites business truth.',
  migration:
    'A change that breaks comparability, judged under ai/evaluation/evaluation-compatibility.md, is issued as a new version and migrated deliberately: consumers of results are moved to it in a controlled way, and old results are not compared with new as if alike.',
  deprecation:
    'A superseded evaluation definition, metric, or benchmark is deprecated rather than abruptly removed, and it remains available for interpreting results produced under it until each consumer is migrated, so deprecation never invalidates a past result silently.',
});

/**
 * An evaluation-versioning invariant: a guarantee evaluation versioning always upholds
 * (ai/evaluation/evaluation-versioning.md, "Invariants").
 */
export type EvaluationVersioningInvariant =
  | 'each-part-carries-a-version-change-explicit-and-traceable'
  | 'evolves-only-under-governed-change'
  | 'comparability-breaking-change-versioned-and-migrated-never-silent'
  | 'every-result-records-the-version-it-was-produced-under'
  | 'versioning-an-evaluation-is-inert';

/** The evaluation-versioning invariants, in constitutional order; frozen. */
export const EVALUATION_VERSIONING_INVARIANTS: readonly EvaluationVersioningInvariant[] =
  Object.freeze([
    'each-part-carries-a-version-change-explicit-and-traceable',
    'evolves-only-under-governed-change',
    'comparability-breaking-change-versioned-and-migrated-never-silent',
    'every-result-records-the-version-it-was-produced-under',
    'versioning-an-evaluation-is-inert',
  ]);

/** What each evaluation-versioning invariant guarantees (ai/evaluation/evaluation-versioning.md, "Invariants"). */
export const EVALUATION_VERSIONING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvaluationVersioningInvariant, string>
> = Object.freeze({
  'each-part-carries-a-version-change-explicit-and-traceable':
    'An evaluation, metric, scoring model, and benchmark each carry a version, so a change is explicit and traceable.',
  'evolves-only-under-governed-change':
    'An evaluation definition evolves only under the governed change rules.',
  'comparability-breaking-change-versioned-and-migrated-never-silent':
    'A change that breaks comparability is versioned and migrated, never applied silently.',
  'every-result-records-the-version-it-was-produced-under':
    'Every result records the evaluation and benchmark version it was produced under.',
  'versioning-an-evaluation-is-inert':
    'Versioning an evaluation never reasons, executes, decides, measures, changes behavior, or changes ownership, authority, governance, or business truth.',
});
