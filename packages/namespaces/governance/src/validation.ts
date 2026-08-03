/**
 * Constitutional validation governance (ai/governance/constitutional-validation.md,
 * OL-AI-GOVERNANCE-CONSTITUTIONAL-VALIDATION).
 *
 * What every significant action is validated against before it proceeds, as immutable rule
 * definitions (ADR-0020): the validation principles, the absolute validation mandates, and the
 * canonical sources (dimensions) an action is validated against. This concern owns the validation
 * mandate only; it never defines the runtime that performs validation, and it restates none of the
 * rules validated against, which are owned by the constitutions and the architecture.
 *
 * It exposes no predicate. A per-action validation result - whether a given action satisfied the
 * mandates, in what order, with what outcome - is a runtime evaluation over an Action and a
 * ValidationResult that the governance layer does not own. Under the Stage 3 boundary rule (ADR-0020,
 * ADR-0025) that evaluation is deferred to the runtime, exactly as the Authority model was in Stage 3.
 * Governance defines what validation means; the runtime performs it.
 */

/**
 * A validation principle: an enduring governance principle for validation
 * (ai/governance/constitutional-validation.md, "Principles"). Each instantiates a constitutional
 * principle owned by ai/README.md.
 */
export type ValidationPrinciple =
  | 'governance-precedes-execution'
  | 'nothing-bypasses-validation'
  | 'against-canonical-sources'
  | 'failure-is-safe';

/** The four validation principles, in constitutional order; frozen. */
export const VALIDATION_PRINCIPLES: readonly ValidationPrinciple[] = Object.freeze([
  'governance-precedes-execution',
  'nothing-bypasses-validation',
  'against-canonical-sources',
  'failure-is-safe',
]);

/** The statement each validation principle instantiates (ai/governance/constitutional-validation.md). */
export const VALIDATION_PRINCIPLE_DESCRIPTIONS: Readonly<Record<ValidationPrinciple, string>> =
  Object.freeze({
    'governance-precedes-execution':
      'Validation happens before a significant action, never after it.',
    'nothing-bypasses-validation':
      'Every path to a significant action passes through validation; no namespace, agent, or runtime may skip it.',
    'against-canonical-sources':
      'An action is validated against the constitutions, the governance rules, the authority hierarchy, ownership, and boundaries as they are owned, never against a restated copy.',
    'failure-is-safe':
      'An action that fails validation is refused or escalated, never taken anyway.',
  });

/**
 * A validation mandate: an absolute rule every significant action satisfies before it proceeds
 * (ai/governance/constitutional-validation.md, "Mandates"). The mandates are conjunctive - every
 * significant action satisfies all of them - not a ranked scale.
 */
export type ValidationMandate =
  | 'against-ai-constitution'
  | 'against-knowledge-constitution'
  | 'against-governance'
  | 'against-authority'
  | 'against-ownership'
  | 'against-boundaries'
  | 'ordered-before-execution'
  | 'reviewable';

/**
 * The eight validation mandates, in constitutional order; frozen. Every mandate is absolute and every
 * significant action satisfies all of them before it proceeds.
 */
export const VALIDATION_MANDATES: readonly ValidationMandate[] = Object.freeze([
  'against-ai-constitution',
  'against-knowledge-constitution',
  'against-governance',
  'against-authority',
  'against-ownership',
  'against-boundaries',
  'ordered-before-execution',
  'reviewable',
]);

/** The rule each validation mandate states (ai/governance/constitutional-validation.md). */
export const VALIDATION_MANDATE_DESCRIPTIONS: Readonly<Record<ValidationMandate, string>> =
  Object.freeze({
    'against-ai-constitution':
      'The action conforms to ai/README.md, including the boundary, the principles, and the Authority Hierarchy.',
    'against-knowledge-constitution':
      'Where the action relies on business truth, it conforms to knowledge/README.md and consumes that truth from its canonical owner, never redefining it.',
    'against-governance':
      'The action conforms to the mandates owned by the governance namespace, including permissions, autonomy boundaries, and policy precedence.',
    'against-authority':
      'The action is within the authority of the agent taking it, as owned by ai/README.md and classified by ai/architecture/authority-map.md.',
    'against-ownership':
      'The action reads and writes only what its owner permits, and never changes which namespace owns a concern, as classified by ai/architecture/ownership-map.md.',
    'against-boundaries':
      'The action stays within the AI boundary and the cross-layer boundary; it never writes business truth and never promotes runtime state into the knowledge repository.',
    'ordered-before-execution':
      'Validation completes before the action is taken; an action that has not been validated is not a permitted action.',
    reviewable:
      'The outcome of validation for a significant action is reviewable by an accountable human; this mandate requires reviewability and defines no logging or recording system.',
  });

/**
 * A validation dimension: a canonical source an action is validated against
 * (ai/governance/constitutional-validation.md, "Principles" / "Mandates"). This concern owns what an
 * action is validated against; each dimension's content is owned by the canonical owner named in its
 * description and is referenced, never restated.
 */
export type ValidationDimension =
  | 'ai-constitution'
  | 'knowledge-constitution'
  | 'governance'
  | 'authority'
  | 'ownership'
  | 'boundaries';

/**
 * The six canonical sources an action is validated against, in constitutional order; frozen. They are
 * conjunctive - a significant action is validated against all of them - not a ranked scale.
 */
export const VALIDATION_DIMENSIONS: readonly ValidationDimension[] = Object.freeze([
  'ai-constitution',
  'knowledge-constitution',
  'governance',
  'authority',
  'ownership',
  'boundaries',
]);

/**
 * The canonical source each validation dimension names, and its owner
 * (ai/governance/constitutional-validation.md, "Boundaries"). Governance references each owner; it
 * never restates the rules owned there.
 */
export const VALIDATION_DIMENSION_DESCRIPTIONS: Readonly<Record<ValidationDimension, string>> =
  Object.freeze({
    'ai-constitution':
      'The AI constitution, owned by ai/README.md: the boundary, the principles, and the Authority Hierarchy.',
    'knowledge-constitution':
      'The knowledge constitution, owned by knowledge/README.md and the knowledge repository: the business truth an action relies on.',
    governance:
      'The governance rules owned by the governance namespace, including permissions, autonomy boundaries, and policy precedence.',
    authority:
      'The authority hierarchy owned by ai/README.md and classified by ai/architecture/authority-map.md.',
    ownership: 'The ownership of concerns, classified by ai/architecture/ownership-map.md.',
    boundaries: 'The AI boundary and the cross-layer boundary owned by ai/README.md.',
  });
