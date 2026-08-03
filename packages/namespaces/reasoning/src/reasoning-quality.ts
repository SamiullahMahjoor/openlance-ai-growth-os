/**
 * Reasoning quality: the quality principles of reasoning, reasoning completeness and reasoning
 * traceability (ai/reasoning/reasoning-quality.md, OL-AI-REASONING-REASONING-QUALITY).
 *
 * The Specification defines a closed set of named quality properties a reasoning has. This module owns
 * those properties; it never owns governance traceability as a mandate (ai/governance/) or the
 * measurement or evaluation of reasoning (the Evaluation namespace). Completeness and traceability are
 * structural properties that hold or do not; the concern assigns no numeric quality, confidence, or
 * grade. The properties carry no ordering and no predicate; this module is their immutable definition
 * (ADR-0020).
 */

/**
 * A reasoning-quality principle: a permanent rule reasoning quality upholds
 * (ai/reasoning/reasoning-quality.md, "Principles").
 */
export type ReasoningQualityPrinciple =
  | 'reasoning-is-complete'
  | 'reasoning-is-traceable'
  | 'reasoning-is-sound-in-form'
  | 'quality-is-a-property-not-a-score';

/** The reasoning-quality principles, in constitutional order; frozen. */
export const REASONING_QUALITY_PRINCIPLES: readonly ReasoningQualityPrinciple[] = Object.freeze([
  'reasoning-is-complete',
  'reasoning-is-traceable',
  'reasoning-is-sound-in-form',
  'quality-is-a-property-not-a-score',
]);

/** What each reasoning-quality principle requires (ai/reasoning/reasoning-quality.md, "Principles"). */
export const REASONING_QUALITY_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ReasoningQualityPrinciple, string>
> = Object.freeze({
  'reasoning-is-complete':
    'A reasoning addresses what the task requires and leaves no necessary consideration unexamined before it concludes.',
  'reasoning-is-traceable':
    'Every step of a reasoning is explicit and can be followed from the retrieved knowledge and stated assumptions to the conclusion, so no conclusion rests on hidden reasoning.',
  'reasoning-is-sound-in-form':
    'A reasoning proceeds by defined categories, validated grounding, and internal consistency, so its quality is a property of its structure, not of an opinion about it.',
  'quality-is-a-property-not-a-score':
    'Completeness and traceability are architectural properties of a reasoning, never a numeric quality value.',
});

/**
 * A reasoning-quality property: one of the structural properties that define reasoning quality, in
 * constitutional listing order (ai/reasoning/reasoning-quality.md, "Specification"). Each is a property
 * that holds or does not; neither carries a numeric value.
 */
export type ReasoningQualityProperty = 'completeness' | 'traceability';

/** The reasoning-quality properties, in constitutional listing order; frozen. */
export const REASONING_QUALITY_PROPERTIES: readonly ReasoningQualityProperty[] = Object.freeze([
  'completeness',
  'traceability',
]);

/** What each reasoning-quality property is (ai/reasoning/reasoning-quality.md, "Specification"). */
export const REASONING_QUALITY_PROPERTY_DESCRIPTIONS: Readonly<
  Record<ReasoningQualityProperty, string>
> = Object.freeze({
  completeness:
    'A reasoning is complete when it has addressed every part the task requires, applied the categories of reasoning its parts call for, surfaced its assumptions, resolved or classified its uncertainties, and reached a sufficient basis for a conclusion or a governed absence of one; an incomplete reasoning does not conclude.',
  traceability:
    'A reasoning is traceable when each of its steps is explicit and connected to the retrieved knowledge or a stated assumption, and to the steps before and after it, so that the whole reasoning can be followed from basis to conclusion; it is the architectural counterpart, within reasoning, of the auditability owned by ai/governance/.',
});

/**
 * A reasoning-quality invariant: a guarantee reasoning quality always upholds
 * (ai/reasoning/reasoning-quality.md, "Invariants").
 */
export type ReasoningQualityInvariant =
  | 'concludes-only-when-complete'
  | 'every-step-is-explicit-and-traceable'
  | 'quality-is-structural-never-a-score'
  | 'assessing-quality-is-inert';

/** The reasoning-quality invariants, in constitutional order; frozen. */
export const REASONING_QUALITY_INVARIANTS: readonly ReasoningQualityInvariant[] = Object.freeze([
  'concludes-only-when-complete',
  'every-step-is-explicit-and-traceable',
  'quality-is-structural-never-a-score',
  'assessing-quality-is-inert',
]);

/** What each reasoning-quality invariant guarantees (ai/reasoning/reasoning-quality.md, "Invariants"). */
export const REASONING_QUALITY_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ReasoningQualityInvariant, string>
> = Object.freeze({
  'concludes-only-when-complete': 'A reasoning concludes only when it is complete.',
  'every-step-is-explicit-and-traceable':
    'Every step of a reasoning is explicit and traceable; no conclusion rests on hidden reasoning.',
  'quality-is-structural-never-a-score':
    'Completeness and traceability are structural properties, never numeric scores.',
  'assessing-quality-is-inert':
    'Assessing quality never executes, loads, retrieves, expresses, or changes ownership, authority, governance, or business truth.',
});
