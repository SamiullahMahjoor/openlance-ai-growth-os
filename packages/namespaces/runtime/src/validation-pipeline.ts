/**
 * Validation pipeline: the order in which an execution is validated against governance before it proceeds
 * (ai/runtime/validation-pipeline.md, OL-AI-RUNTIME-VALIDATION-PIPELINE).
 *
 * Before an execution proceeds, the runtime runs the required validations in a fixed order, each resting on
 * the one before it; the full order completes before the Execute step of the workflow. This module defines the
 * ordered validation stages, their principles, and their invariants, plus the pure ordering predicate the
 * document's ordering states. The validation rules themselves, and the decision to continue, escalate, or
 * refuse, are owned by ai/governance/, applied not restated (ADR-0020).
 */

/**
 * A validation-pipeline principle: a permanent rule the pipeline upholds, each instantiating a runtime
 * invariant (ai/runtime/validation-pipeline.md, "Principles").
 */
export type ValidationPipelinePrinciple =
  | 'validation-precedes-execution'
  | 'the-runtime-orders-governance-rules'
  | 'higher-validations-first'
  | 'a-failed-validation-stops-execution'
  | 'the-pipeline-never-invents-a-rule';

/** The validation-pipeline principles, in constitutional order; frozen. */
export const VALIDATION_PIPELINE_PRINCIPLES: readonly ValidationPipelinePrinciple[] = Object.freeze(
  [
    'validation-precedes-execution',
    'the-runtime-orders-governance-rules',
    'higher-validations-first',
    'a-failed-validation-stops-execution',
    'the-pipeline-never-invents-a-rule',
  ],
);

/** What each validation-pipeline principle requires (ai/runtime/validation-pipeline.md, "Principles"). */
export const VALIDATION_PIPELINE_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ValidationPipelinePrinciple, string>
> = Object.freeze({
  'validation-precedes-execution': 'Every required validation completes before the task runs.',
  'the-runtime-orders-governance-rules':
    'The runtime defines the order of validation and never the rules, thresholds, or outcomes, which are owned by ai/governance/.',
  'higher-validations-first':
    'An execution is validated against the more foundational constraints before the more specific ones, so a failure is caught at the highest applicable level.',
  'a-failed-validation-stops-execution':
    'An execution that fails any required validation does not proceed; the outcome is decided by governance.',
  'the-pipeline-never-invents-a-rule':
    'Where governance does not clearly permit an action, the pipeline yields to escalation or refusal, never to an assumed rule.',
});

/**
 * A validation stage, in constitutional order from first-applied to last-applied
 * (ai/runtime/validation-pipeline.md, "Specification"). The stages are ordered ("each rests on the one before
 * it") and the order is total, exposed by {@link validationStageAtOrAfter}.
 */
export type ValidationStage =
  'constitutional-validation' | 'permission-validation' | 'policy-validation';

/** The validation stages, first-applied to last-applied; frozen. */
export const VALIDATION_STAGES: readonly ValidationStage[] = Object.freeze([
  'constitutional-validation',
  'permission-validation',
  'policy-validation',
]);

/** What each validation stage validates (ai/runtime/validation-pipeline.md, "Specification"). */
export const VALIDATION_STAGE_DESCRIPTIONS: Readonly<Record<ValidationStage, string>> =
  Object.freeze({
    'constitutional-validation':
      'The execution is validated against the AI constitution and the knowledge constitution, under ai/governance/constitutional-validation.md, including authority, ownership, and boundaries; it is the initial admission gate.',
    'permission-validation':
      'The execution is validated against the permission mandates, under ai/governance/permission-governance.md, so it acts only within granted authority.',
    'policy-validation':
      'The execution is validated against the applicable policies and their precedence, under ai/governance/policy-enforcement.md.',
  });

/**
 * A validation-pipeline invariant: a guarantee the pipeline always upholds (ai/runtime/validation-pipeline.md,
 * "Invariants").
 */
export type ValidationPipelineInvariant =
  | 'the-full-pipeline-completes-before-execute'
  | 'constitutional-before-permission-before-policy'
  | 'fails-any-required-validation-never-reaches-execute'
  | 'the-pipeline-defines-order-only-never-a-rule'
  | 'running-the-pipeline-is-inert';

/** The validation-pipeline invariants, in constitutional order; frozen. */
export const VALIDATION_PIPELINE_INVARIANTS: readonly ValidationPipelineInvariant[] = Object.freeze(
  [
    'the-full-pipeline-completes-before-execute',
    'constitutional-before-permission-before-policy',
    'fails-any-required-validation-never-reaches-execute',
    'the-pipeline-defines-order-only-never-a-rule',
    'running-the-pipeline-is-inert',
  ],
);

/** What each validation-pipeline invariant guarantees (ai/runtime/validation-pipeline.md, "Invariants"). */
export const VALIDATION_PIPELINE_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ValidationPipelineInvariant, string>
> = Object.freeze({
  'the-full-pipeline-completes-before-execute':
    'The full validation pipeline completes before the Execute step.',
  'constitutional-before-permission-before-policy':
    'Constitutional validation runs before permission validation, which runs before policy validation.',
  'fails-any-required-validation-never-reaches-execute':
    'An execution that fails any required validation never reaches Execute.',
  'the-pipeline-defines-order-only-never-a-rule':
    'The pipeline defines order only; it never defines or overrides a governance rule.',
  'running-the-pipeline-is-inert':
    'Running the pipeline never changes ownership, authority, governance, or business truth.',
});

/**
 * The private rank of each validation stage in the constitutional order (first-applied = 0). Internal to the
 * ordering predicate; never exported.
 */
const VALIDATION_STAGE_RANK: Readonly<Record<ValidationStage, number>> = Object.freeze({
  'constitutional-validation': 0,
  'permission-validation': 1,
  'policy-validation': 2,
});

/**
 * Whether validation stage `a` is at or after validation stage `b` in the constitutional stage order, from
 * constitutional first to policy last (ai/runtime/validation-pipeline.md, "Specification"). Pure and total:
 * it reads only the fixed order the document defines and expresses that order verbatim. It states no policy of
 * its own.
 */
export function validationStageAtOrAfter(a: ValidationStage, b: ValidationStage): boolean {
  return VALIDATION_STAGE_RANK[a] >= VALIDATION_STAGE_RANK[b];
}
