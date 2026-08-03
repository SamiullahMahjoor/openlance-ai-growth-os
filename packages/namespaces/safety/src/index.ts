/**
 * @packageDocumentation
 * `@openlance/aios-safety`
 *
 * The immutable, technology-neutral domain model of the AI layer's protective architecture
 * (Specification authority, ai/safety/). It states how hazards are identified, how risk is classified,
 * how impact is assessed, how boundaries are enforced, and how the AI refuses, escalates, or degrades to
 * stay safe, as strongly-typed classifications, immutable principles, and invariants that express the
 * safety specification verbatim.
 *
 * It performs no execution, no reasoning, no retrieval, no composition, and no persistence, and defines
 * no mechanism, framework, provider, model, or code (ADR-0020; the namespace owns the protective model,
 * ADR-0024 category 1 Pure Domain Model, like Governance). It applies the rules owned by ai/governance/
 * and references the truth owned by the knowledge repository, and owns neither. Evaluating a concrete
 * hazard, risk, impact, refusal, escalation, or degradation over a concrete action is a runtime
 * evaluation deferred to the runtime and the operational namespaces that consume this model.
 *
 * Safety exposes no predicate. The constitution defines no named ordered classification for safety - risk
 * levels are an ordered set whose members it does not enumerate (risk-classification.md), so no RiskLevel
 * enum or ordering predicate is invented - so the package is immutable definitions and unordered
 * classifications only (hazard categories, refusal categories, impact dimensions), and there is no
 * executable code and therefore no benchmark.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules
 * are prohibited and fail CI. Constitution: OL-AI-SAFETY-README.
 */

export type { SafetyInvariant, SafetyConcern } from './namespace.js';
export {
  SAFETY_INVARIANTS,
  SAFETY_INVARIANT_DESCRIPTIONS,
  SAFETY_CONCERNS,
  SAFETY_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type { SafetyPrinciple, SafetyPrinciplesInvariant } from './safety-principles.js';
export {
  SAFETY_PRINCIPLES,
  SAFETY_PRINCIPLE_DESCRIPTIONS,
  SAFETY_PRINCIPLES_INVARIANTS,
  SAFETY_PRINCIPLES_INVARIANT_DESCRIPTIONS,
} from './safety-principles.js';

export type {
  RiskClassificationPrinciple,
  RiskClassificationInvariant,
} from './risk-classification.js';
export {
  RISK_CLASSIFICATION_PRINCIPLES,
  RISK_CLASSIFICATION_PRINCIPLE_DESCRIPTIONS,
  RISK_CLASSIFICATION_INVARIANTS,
  RISK_CLASSIFICATION_INVARIANT_DESCRIPTIONS,
} from './risk-classification.js';

export type {
  HazardIdentificationPrinciple,
  HazardCategory,
  HazardIdentificationInvariant,
} from './hazard-identification.js';
export {
  HAZARD_IDENTIFICATION_PRINCIPLES,
  HAZARD_IDENTIFICATION_PRINCIPLE_DESCRIPTIONS,
  HAZARD_CATEGORIES,
  HAZARD_CATEGORY_DESCRIPTIONS,
  HAZARD_IDENTIFICATION_INVARIANTS,
  HAZARD_IDENTIFICATION_INVARIANT_DESCRIPTIONS,
} from './hazard-identification.js';

export type {
  BoundaryEnforcementPrinciple,
  BoundaryEnforcementInvariant,
} from './boundary-enforcement.js';
export {
  BOUNDARY_ENFORCEMENT_PRINCIPLES,
  BOUNDARY_ENFORCEMENT_PRINCIPLE_DESCRIPTIONS,
  BOUNDARY_ENFORCEMENT_INVARIANTS,
  BOUNDARY_ENFORCEMENT_INVARIANT_DESCRIPTIONS,
} from './boundary-enforcement.js';

export type {
  RefusalModelPrinciple,
  RefusalCategory,
  RefusalModelInvariant,
} from './refusal-model.js';
export {
  REFUSAL_MODEL_PRINCIPLES,
  REFUSAL_MODEL_PRINCIPLE_DESCRIPTIONS,
  REFUSAL_CATEGORIES,
  REFUSAL_CATEGORY_DESCRIPTIONS,
  REFUSAL_MODEL_INVARIANTS,
  REFUSAL_MODEL_INVARIANT_DESCRIPTIONS,
} from './refusal-model.js';

export type { EscalationModelPrinciple, EscalationModelInvariant } from './escalation-model.js';
export {
  ESCALATION_MODEL_PRINCIPLES,
  ESCALATION_MODEL_PRINCIPLE_DESCRIPTIONS,
  ESCALATION_MODEL_INVARIANTS,
  ESCALATION_MODEL_INVARIANT_DESCRIPTIONS,
} from './escalation-model.js';

export type {
  ImpactAssessmentPrinciple,
  ImpactDimension,
  ImpactAssessmentInvariant,
} from './impact-assessment.js';
export {
  IMPACT_ASSESSMENT_PRINCIPLES,
  IMPACT_ASSESSMENT_PRINCIPLE_DESCRIPTIONS,
  IMPACT_DIMENSIONS,
  IMPACT_DIMENSION_DESCRIPTIONS,
  IMPACT_ASSESSMENT_INVARIANTS,
  IMPACT_ASSESSMENT_INVARIANT_DESCRIPTIONS,
} from './impact-assessment.js';

export type {
  UncertaintyManagementPrinciple,
  UncertaintyManagementInvariant,
} from './uncertainty-management.js';
export {
  UNCERTAINTY_MANAGEMENT_PRINCIPLES,
  UNCERTAINTY_MANAGEMENT_PRINCIPLE_DESCRIPTIONS,
  UNCERTAINTY_MANAGEMENT_INVARIANTS,
  UNCERTAINTY_MANAGEMENT_INVARIANT_DESCRIPTIONS,
} from './uncertainty-management.js';

export type { SafeDegradationPrinciple, SafeDegradationInvariant } from './safe-degradation.js';
export {
  SAFE_DEGRADATION_PRINCIPLES,
  SAFE_DEGRADATION_PRINCIPLE_DESCRIPTIONS,
  SAFE_DEGRADATION_INVARIANTS,
  SAFE_DEGRADATION_INVARIANT_DESCRIPTIONS,
} from './safe-degradation.js';

export type { SafetyVersioningPrinciple, SafetyVersioningInvariant } from './safety-versioning.js';
export {
  SAFETY_VERSIONING_PRINCIPLES,
  SAFETY_VERSIONING_PRINCIPLE_DESCRIPTIONS,
  SAFETY_VERSIONING_INVARIANTS,
  SAFETY_VERSIONING_INVARIANT_DESCRIPTIONS,
} from './safety-versioning.js';
