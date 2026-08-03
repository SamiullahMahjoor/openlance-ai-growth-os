/**
 * Impact assessment (ai/safety/impact-assessment.md, OL-AI-SAFETY-IMPACT-ASSESSMENT).
 *
 * How the potential impact of an action or hazard is assessed, along the dimensions that describe how
 * much harm it could do, as immutable definitions (ADR-0020). This concern owns the impact dimensions
 * only; it never defines the classification of risk from impact (owned by ai/safety/risk-classification.md)
 * nor the real-world consequences that give impact meaning (owned by the knowledge repository, referenced
 * never restated). Assessing a concrete impact is a runtime evaluation this concern does not own. This
 * concern states the impact dimensions and the invariants it always satisfies. The dimensions are
 * conjunctive - a potential harm is described along all of them - not a ranked scale.
 */

/**
 * An impact-assessment principle (ai/safety/impact-assessment.md, "Principles"). Each instantiates a
 * safety invariant owned by ai/safety/README.md.
 */
export type ImpactAssessmentPrinciple =
  | 'assessed-along-dimensions'
  | 'references-truth-never-defines'
  | 'irreversible-far-reaching-weighs-heaviest'
  | 'informs-not-classifies';

/** The four impact-assessment principles, in constitutional order; frozen. */
export const IMPACT_ASSESSMENT_PRINCIPLES: readonly ImpactAssessmentPrinciple[] = Object.freeze([
  'assessed-along-dimensions',
  'references-truth-never-defines',
  'irreversible-far-reaching-weighs-heaviest',
  'informs-not-classifies',
]);

/** The statement each impact-assessment principle makes (ai/safety/impact-assessment.md). */
export const IMPACT_ASSESSMENT_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ImpactAssessmentPrinciple, string>
> = Object.freeze({
  'assessed-along-dimensions':
    'A potential harm is described by defined dimensions, so its magnitude and reach are explicit, never vague.',
  'references-truth-never-defines':
    'The real-world consequences that make an impact matter are owned by the knowledge repository; this document references them.',
  'irreversible-far-reaching-weighs-heaviest':
    'The less reversible and the wider an impact, the graver it is, so protection accounts for what cannot be undone.',
  'informs-not-classifies':
    'This document measures impact; the risk level drawn from it is owned by ai/safety/risk-classification.md.',
});

/**
 * A dimension along which impact is assessed (ai/safety/impact-assessment.md, "Specification"). The
 * impact of an action or hazard is assessed along exactly these eight dimensions.
 */
export type ImpactDimension =
  | 'severity'
  | 'likelihood'
  | 'reversibility'
  | 'propagation'
  | 'scope'
  | 'human'
  | 'organizational'
  | 'long-term';

/** The eight impact dimensions, in constitutional order; frozen. */
export const IMPACT_DIMENSIONS: readonly ImpactDimension[] = Object.freeze([
  'severity',
  'likelihood',
  'reversibility',
  'propagation',
  'scope',
  'human',
  'organizational',
  'long-term',
]);

/** What each impact dimension describes (ai/safety/impact-assessment.md). */
export const IMPACT_DIMENSION_DESCRIPTIONS: Readonly<Record<ImpactDimension, string>> =
  Object.freeze({
    severity:
      'How grave the harm would be if it occurred; the depth of a potential harm, and the dimension the risk model draws on under ai/safety/risk-classification.md.',
    likelihood:
      'How likely the harm is to occur; the chance of a potential harm, expressed with the confidence owned by ai/safety/uncertainty-management.md.',
    reversibility:
      'Whether the harm can be undone, and at what cost; an irreversible impact weighs heavier than a reversible one.',
    propagation:
      'How far the harm would spread if it occurred, from a single action to many, informing the containment owned by ai/safety/boundary-enforcement.md.',
    scope:
      'How much of the AI, the organization, or the world a harm would reach, from a narrow to a broad scope.',
    human:
      'The effect on the people an action affects, whose definition is owned by the knowledge repository and referenced, never restated, here.',
    organizational:
      'The effect on the operating organization, whose definition is owned by the knowledge repository and referenced here.',
    'long-term':
      'The effect that persists beyond the immediate action, so that lasting harm is weighed alongside immediate harm.',
  });

/**
 * An impact-assessment invariant (ai/safety/impact-assessment.md, "Invariants"): a guarantee that always
 * holds for the impact model.
 */
export type ImpactAssessmentInvariant =
  | 'described-along-dimensions-never-vague'
  | 'irreversible-or-far-reaching-weighs-heavier'
  | 'references-consequences-never-restates'
  | 'measures-not-classifies'
  | 'assessing-is-inert';

/** The five impact-assessment invariants, in constitutional order; frozen. */
export const IMPACT_ASSESSMENT_INVARIANTS: readonly ImpactAssessmentInvariant[] = Object.freeze([
  'described-along-dimensions-never-vague',
  'irreversible-or-far-reaching-weighs-heavier',
  'references-consequences-never-restates',
  'measures-not-classifies',
  'assessing-is-inert',
]);

/** The guarantee each impact-assessment invariant states (ai/safety/impact-assessment.md). */
export const IMPACT_ASSESSMENT_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ImpactAssessmentInvariant, string>
> = Object.freeze({
  'described-along-dimensions-never-vague':
    'A potential harm is described along the defined impact dimensions, never left vague.',
  'irreversible-or-far-reaching-weighs-heavier':
    'An irreversible or far-reaching impact weighs heavier than a reversible or narrow one.',
  'references-consequences-never-restates':
    'Impact assessment references the real-world consequences owned by the knowledge repository and never restates them.',
  'measures-not-classifies':
    'Impact assessment measures impact and never classifies risk or enforces a boundary.',
  'assessing-is-inert':
    'Assessing impact never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
