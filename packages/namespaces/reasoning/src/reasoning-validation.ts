/**
 * Reasoning validation: how a reasoning is validated for grounding and sufficiency, through assumption
 * identification and evidence sufficiency (ai/reasoning/reasoning-validation.md,
 * OL-AI-REASONING-REASONING-VALIDATION).
 *
 * The Specification enumerates a closed, conjunctive set of dimensions a reasoning is validated against
 * (directly analogous to retrieval-validation's dimensions and governance's ValidationDimension): a
 * reasoning is validated only when all of them hold. This module owns what is validated; it never owns
 * the governance validation rule (ai/governance/), internal consistency
 * (ai/reasoning/reasoning-consistency.md), or the sufficiency of a conclusion once formed
 * (ai/reasoning/conclusion-formation.md). The dimensions carry no ordering and no predicate; the
 * mechanism that evaluates a check is the runtime's (ADR-0020).
 */

/**
 * A reasoning-validation principle: a permanent rule reasoning validation upholds
 * (ai/reasoning/reasoning-validation.md, "Principles").
 */
export type ReasoningValidationPrinciple =
  | 'reasoning-is-grounded'
  | 'assumptions-are-explicit'
  | 'evidence-is-sufficient'
  | 'insufficiency-is-safe';

/** The reasoning-validation principles, in constitutional order; frozen. */
export const REASONING_VALIDATION_PRINCIPLES: readonly ReasoningValidationPrinciple[] =
  Object.freeze([
    'reasoning-is-grounded',
    'assumptions-are-explicit',
    'evidence-is-sufficient',
    'insufficiency-is-safe',
  ]);

/** What each reasoning-validation principle requires (ai/reasoning/reasoning-validation.md, "Principles"). */
export const REASONING_VALIDATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ReasoningValidationPrinciple, string>
> = Object.freeze({
  'reasoning-is-grounded':
    'A reasoning rests only on retrieved knowledge and stated assumptions, never on invented facts.',
  'assumptions-are-explicit':
    'The assumptions a reasoning depends on are identified and made explicit, never left hidden.',
  'evidence-is-sufficient':
    'A reasoning proceeds to a conclusion only when the knowledge it rests on is sufficient for that conclusion.',
  'insufficiency-is-safe':
    'When the evidence is insufficient, the reasoning yields uncertainty or no conclusion, never an invented one.',
});

/**
 * A reasoning-validation dimension: one of the checks a reasoning is validated against, in constitutional
 * listing order (ai/reasoning/reasoning-validation.md, "Specification"). The set is conjunctive: a
 * reasoning is validated only when every dimension holds.
 */
export type ReasoningValidationDimension =
  'assumption-identification' | 'grounding' | 'evidence-sufficiency' | 'governed-validation';

/** The reasoning-validation dimensions, in constitutional listing order; frozen. */
export const REASONING_VALIDATION_DIMENSIONS: readonly ReasoningValidationDimension[] =
  Object.freeze([
    'assumption-identification',
    'grounding',
    'evidence-sufficiency',
    'governed-validation',
  ]);

/** What each reasoning-validation dimension checks (ai/reasoning/reasoning-validation.md, "Specification"). */
export const REASONING_VALIDATION_DIMENSION_DESCRIPTIONS: Readonly<
  Record<ReasoningValidationDimension, string>
> = Object.freeze({
  'assumption-identification':
    'The assumptions the reasoning depends on, the things it takes as given beyond the retrieved knowledge, are surfaced and made explicit, so that no conclusion rests on a hidden assumption.',
  grounding:
    'Every step of the reasoning is traceable to the retrieved knowledge or to a stated assumption, and never to an invented fact.',
  'evidence-sufficiency':
    'The knowledge the reasoning rests on is judged sufficient for the reasoning it supports; where it is insufficient, the reasoning yields uncertainty or escalates rather than conclude.',
  'governed-validation':
    'The reasoning conforms to the constitutional validation owned by ai/governance/constitutional-validation.md, which this validation applies and never restates.',
});

/**
 * A reasoning-validation invariant: a guarantee reasoning validation always upholds
 * (ai/reasoning/reasoning-validation.md, "Invariants").
 */
export type ReasoningValidationInvariant =
  | 'every-assumption-is-identified'
  | 'every-step-is-grounded'
  | 'conclusion-only-on-sufficient-evidence'
  | 'validation-defines-what-is-checked-never-the-rule'
  | 'validating-is-inert';

/** The reasoning-validation invariants, in constitutional order; frozen. */
export const REASONING_VALIDATION_INVARIANTS: readonly ReasoningValidationInvariant[] =
  Object.freeze([
    'every-assumption-is-identified',
    'every-step-is-grounded',
    'conclusion-only-on-sufficient-evidence',
    'validation-defines-what-is-checked-never-the-rule',
    'validating-is-inert',
  ]);

/** What each reasoning-validation invariant guarantees (ai/reasoning/reasoning-validation.md, "Invariants"). */
export const REASONING_VALIDATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ReasoningValidationInvariant, string>
> = Object.freeze({
  'every-assumption-is-identified':
    'Every assumption a reasoning depends on is identified and made explicit.',
  'every-step-is-grounded':
    'Every step is grounded in retrieved knowledge or a stated assumption, never in an invented fact.',
  'conclusion-only-on-sufficient-evidence':
    'A reasoning proceeds to a conclusion only when its evidence is sufficient; otherwise it yields uncertainty or escalates.',
  'validation-defines-what-is-checked-never-the-rule':
    'Validation defines what is checked, never the governance rule, which is owned by ai/governance/.',
  'validating-is-inert':
    'Validating a reasoning never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.',
});
