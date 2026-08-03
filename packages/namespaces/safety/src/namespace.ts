/**
 * The Safety namespace, namespace-wide truth (ai/safety/README.md, OL-AI-SAFETY-README;
 * ai/safety/safety.md, OL-AI-SAFETY-SAFETY).
 *
 * The safety invariants every safety concern upholds, and the canonical inventory of the safety
 * concerns, as immutable definitions (ADR-0020). The namespace is a Pure Domain Model of the protective
 * architecture: it states how hazards are identified, how risk is classified, how impact is assessed,
 * how boundaries are enforced, and how the AI refuses, escalates, or degrades to stay safe, and it never
 * executes, reasons, retrieves, composes, or persists, and never defines a mechanism, a framework, a
 * provider, a model, or code (ai/safety/README.md). Safety is deterministic and scalable: the same
 * hazard, context, and governing rules yield the same protective response, and the model holds for one
 * action or an enterprise of agents (ai/safety/safety.md). It applies the rules owned by ai/governance/
 * and references the truth owned by the knowledge repository, and owns neither.
 */

/**
 * A safety invariant: a permanent guarantee every safety document upholds and no safety may violate
 * (ai/safety/README.md, "Safety Invariants"). Every safety concern's principles instantiate these.
 */
export type SafetyInvariant =
  | 'fails-closed'
  | 'deterministic'
  | 'layered'
  | 'protects-never-performs'
  | 'consumes-rules-and-truth-owns-neither'
  | 'surfaces-uncertainty'
  | 'escalation-bounded-and-acyclic'
  | 'single-owned-neutral-scalable';

/** The eight safety invariants, in constitutional order; frozen. */
export const SAFETY_INVARIANTS: readonly SafetyInvariant[] = Object.freeze([
  'fails-closed',
  'deterministic',
  'layered',
  'protects-never-performs',
  'consumes-rules-and-truth-owns-neither',
  'surfaces-uncertainty',
  'escalation-bounded-and-acyclic',
  'single-owned-neutral-scalable',
]);

/** The guarantee each safety invariant states (ai/safety/README.md, "Safety Invariants"). */
export const SAFETY_INVARIANT_DESCRIPTIONS: Readonly<Record<SafetyInvariant, string>> =
  Object.freeze({
    'fails-closed':
      'Where safety cannot confirm an action is within safe limits, the AI refuses, escalates, or degrades, never proceeds by default.',
    deterministic:
      'The same hazard, the same context, and the same governing rules yield the same protective response, with no randomness.',
    layered:
      'Protection is defense in depth across identification, classification, impact, enforcement, refusal, escalation, and degradation, so no single failure removes protection.',
    'protects-never-performs':
      'Safety identifies, classifies, bounds, refuses, escalates, and degrades, and never executes, reasons, retrieves, composes, or persists.',
    'consumes-rules-and-truth-owns-neither':
      'Safety applies the rules owned by ai/governance/ and references the truth owned by the knowledge repository.',
    'surfaces-uncertainty':
      'Uncertainty is made explicit and treated as a protective signal, never hidden.',
    'escalation-bounded-and-acyclic':
      'No infinite escalation and no circular escalation are possible.',
    'single-owned-neutral-scalable':
      'Each safety concern has exactly one owning document, and the model holds for one action or an entire enterprise of agents.',
  });

/**
 * A safety concern: one aspect of the safety model, each owned by exactly one document
 * (ai/safety/safety.md, "The Safety Concerns"). This is the namespace inventory identity; the model of
 * each concern is owned by its named document and this package's corresponding module.
 */
export type SafetyConcern =
  | 'safety-principles'
  | 'risk-classification'
  | 'hazard-identification'
  | 'boundary-enforcement'
  | 'refusal-model'
  | 'escalation-model'
  | 'impact-assessment'
  | 'uncertainty-management'
  | 'safe-degradation'
  | 'safety-versioning';

/** The ten safety concerns, in inventory order; frozen. */
export const SAFETY_CONCERNS: readonly SafetyConcern[] = Object.freeze([
  'safety-principles',
  'risk-classification',
  'hazard-identification',
  'boundary-enforcement',
  'refusal-model',
  'escalation-model',
  'impact-assessment',
  'uncertainty-management',
  'safe-degradation',
  'safety-versioning',
]);

/** What each safety concern owns (ai/safety/safety.md, "The Safety Concerns"). */
export const SAFETY_CONCERN_DESCRIPTIONS: Readonly<Record<SafetyConcern, string>> = Object.freeze({
  'safety-principles':
    'The safety philosophy and principles: constitutional safety, least harm, defense in depth, safe failure, fail closed, and the other enduring principles of protection.',
  'risk-classification':
    'The safety risk model: risk levels, categorization, confidence, escalation thresholds, risk boundaries, risk inheritance, and risk compatibility.',
  'hazard-identification':
    'The hazard model: hazard discovery and hazard categories across capability, knowledge, permission, reasoning, runtime, prompt, agent, and compound hazards.',
  'boundary-enforcement':
    'The boundary enforcement model: constraint, policy, permission, and execution boundary application, cross-layer boundary protection, isolation, and containment.',
  'refusal-model':
    'The refusal architecture: refusal categories, graceful, protective, constitutional, and escalation refusal, and recovery after refusal.',
  'escalation-model':
    'The safety escalation model: escalation routing, priority, hierarchy, and compatibility.',
  'impact-assessment':
    'The impact model: severity, likelihood, reversibility, propagation, scope, and human, organizational, and long-term impact.',
  'uncertainty-management':
    'The safety uncertainty model: confidence, unknowns, ambiguity, incomplete knowledge, conflict detection, safe handling, and escalation under uncertainty.',
  'safe-degradation':
    'Graceful degradation: restricted operation, safe mode, capability reduction, controlled shutdown, and recovery compatibility.',
  'safety-versioning':
    'Safety evolution, compatibility, migration, version rules, backward compatibility, deprecation, and constitutional amendment of safety.',
});
