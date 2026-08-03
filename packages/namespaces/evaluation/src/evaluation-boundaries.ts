/**
 * Evaluation boundaries: what evaluation never owns, and where an evaluation stops
 * (ai/evaluation/evaluation-boundaries.md, OL-AI-EVALUATION-EVALUATION-BOUNDARIES).
 *
 * The Specification enumerates a closed set of the named architectural boundaries an evaluation operates
 * within. This module owns the boundaries; the rules that set them are owned by ai/governance/ and ai/safety/,
 * and the concerns beyond them by their namespaces. An evaluation that would cross any boundary does not
 * proceed; a result that would decide or change behavior is withheld and referred to ai/governance/. The
 * boundaries carry no ordering and no predicate; how a boundary is enforced is the runtime's, and this module
 * is their immutable definition (ADR-0020).
 */

/**
 * An evaluation-boundaries principle: a permanent rule the boundaries uphold, each instantiating an
 * evaluation invariant (ai/evaluation/evaluation-boundaries.md, "Principles").
 */
export type EvaluationBoundaryPrinciple =
  | 'evaluation-measures-it-does-not-perform-decide-or-change'
  | 'evaluation-observes-one-directionally'
  | 'evaluation-owns-no-subject-behavior-or-quality-definition'
  | 'evaluation-carries-no-truth-of-its-own';

/** The evaluation-boundaries principles, in constitutional order; frozen. */
export const EVALUATION_BOUNDARY_PRINCIPLES: readonly EvaluationBoundaryPrinciple[] = Object.freeze(
  [
    'evaluation-measures-it-does-not-perform-decide-or-change',
    'evaluation-observes-one-directionally',
    'evaluation-owns-no-subject-behavior-or-quality-definition',
    'evaluation-carries-no-truth-of-its-own',
  ],
);

/** What each evaluation-boundaries principle requires (ai/evaluation/evaluation-boundaries.md, "Principles"). */
export const EVALUATION_BOUNDARY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvaluationBoundaryPrinciple, string>
> = Object.freeze({
  'evaluation-measures-it-does-not-perform-decide-or-change':
    'An evaluation assesses an output and stops there; performing, deciding, and changing behavior belong to other namespaces.',
  'evaluation-observes-one-directionally':
    'Evaluation observes the outputs of the namespaces it evaluates, and those namespaces never depend on it.',
  'evaluation-owns-no-subject-behavior-or-quality-definition':
    "The behavior evaluated and the definition of its quality are owned by the subject's namespace.",
  'evaluation-carries-no-truth-of-its-own':
    'An evaluation references business truth as the ground it measures against and never owns, restates, or becomes it.',
});

/**
 * An evaluation boundary: one architectural boundary an evaluation operates within, in constitutional listing
 * order (ai/evaluation/evaluation-boundaries.md, "Specification"). The set is unordered.
 */
export type EvaluationBoundary =
  'behavior' | 'decision' | 'subject' | 'one-directional' | 'truth' | 'implementation';

/** The evaluation boundaries, in constitutional listing order; frozen. */
export const EVALUATION_BOUNDARIES: readonly EvaluationBoundary[] = Object.freeze([
  'behavior',
  'decision',
  'subject',
  'one-directional',
  'truth',
  'implementation',
]);

/** What each evaluation boundary is (ai/evaluation/evaluation-boundaries.md, "Specification"). */
export const EVALUATION_BOUNDARY_DESCRIPTIONS: Readonly<Record<EvaluationBoundary, string>> =
  Object.freeze({
    behavior:
      'An evaluation assesses an output and never produces or changes it; reasoning, retrieval, prompts, memory, agents, providers, and tools own the behavior, and evaluation observes it and performs none of it.',
    decision:
      'An evaluation result informs a decision but never makes one; the decision, ranking-for-action, or change of behavior drawn from an evaluation is owned by ai/governance/, and any protective response by ai/safety/; evaluation reports and never acts.',
    subject:
      "An evaluation measures a subject's output against the quality the subject's namespace defines, and never redefines that quality or reaches into the subject's behavior.",
    'one-directional':
      'Evaluation observes the outputs of the namespaces it evaluates, and those namespaces never depend on evaluation, so no cycle is possible; evaluation depends only on the constitution and the governance mandates.',
    truth:
      'An evaluation references business truth as the ground it measures against and never owns, restates, amends, or becomes it, which is owned by the knowledge repository.',
    implementation:
      'An evaluation is a model of assessment, never a metric mechanism, a test harness, a provider, a model, a framework, or code, and this namespace names none.',
  });

/**
 * An evaluation-boundaries invariant: a guarantee the boundaries always uphold
 * (ai/evaluation/evaluation-boundaries.md, "Invariants").
 */
export type EvaluationBoundaryInvariant =
  | 'assesses-an-output-never-produces-changes-or-decides'
  | 'observes-one-directionally-no-subject-depends-on-it'
  | 'never-redefines-subject-quality-or-reaches-into-behavior'
  | 'references-truth-as-ground-never-owns-or-restates'
  | 'enforcing-a-boundary-is-inert';

/** The evaluation-boundaries invariants, in constitutional order; frozen. */
export const EVALUATION_BOUNDARY_INVARIANTS: readonly EvaluationBoundaryInvariant[] = Object.freeze(
  [
    'assesses-an-output-never-produces-changes-or-decides',
    'observes-one-directionally-no-subject-depends-on-it',
    'never-redefines-subject-quality-or-reaches-into-behavior',
    'references-truth-as-ground-never-owns-or-restates',
    'enforcing-a-boundary-is-inert',
  ],
);

/** What each evaluation-boundaries invariant guarantees (ai/evaluation/evaluation-boundaries.md, "Invariants"). */
export const EVALUATION_BOUNDARY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvaluationBoundaryInvariant, string>
> = Object.freeze({
  'assesses-an-output-never-produces-changes-or-decides':
    'An evaluation assesses an output and never produces, changes, or decides.',
  'observes-one-directionally-no-subject-depends-on-it':
    'Evaluation observes one-directionally, and no subject namespace depends on it.',
  'never-redefines-subject-quality-or-reaches-into-behavior':
    "An evaluation never redefines a subject's quality or reaches into a subject's behavior.",
  'references-truth-as-ground-never-owns-or-restates':
    'An evaluation references business truth as ground and never owns or restates it.',
  'enforcing-a-boundary-is-inert':
    'Enforcing a boundary never changes ownership, authority, governance, or business truth.',
});
