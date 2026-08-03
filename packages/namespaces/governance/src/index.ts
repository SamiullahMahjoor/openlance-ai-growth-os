/**
 * @packageDocumentation
 * `@openlance/aios-governance`
 *
 * The immutable, technology-neutral domain model of the AI layer's governing rules (Mandate
 * authority, ai/governance/). It states constitutional truth as types, classifications, and pure
 * predicates; it performs no validation, enforcement, scoring, or runtime work, which are
 * operational and owned by the operational namespaces and the runtime (ADR-0020; ADR-0024 category
 * 1, Pure Domain Model). It owns no state, no lifecycle, no events, and no IO.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal
 * modules are prohibited and fail CI. Constitution: OL-AI-GOVERNANCE-README.
 */

export type { TrustLevel, OversightRequirement } from './risk.js';
export {
  TRUST_LEVELS,
  requiredOversight,
  requiresHumanApproval,
  trustAtLeast,
  higherTrust,
} from './risk.js';

export type { AutonomyLevel, AutonomyBound } from './autonomy.js';
export { AUTONOMY_LEVELS, autonomyAtLeast, higherAutonomy, AUTONOMY_BOUNDS } from './autonomy.js';

export type { PermissionPrinciple, PermissionMandate } from './permission.js';
export {
  PERMISSION_PRINCIPLES,
  PERMISSION_PRINCIPLE_DESCRIPTIONS,
  PERMISSION_MANDATES,
  PERMISSION_MANDATE_DESCRIPTIONS,
} from './permission.js';

export type { ValidationPrinciple, ValidationMandate, ValidationDimension } from './validation.js';
export {
  VALIDATION_PRINCIPLES,
  VALIDATION_PRINCIPLE_DESCRIPTIONS,
  VALIDATION_MANDATES,
  VALIDATION_MANDATE_DESCRIPTIONS,
  VALIDATION_DIMENSIONS,
  VALIDATION_DIMENSION_DESCRIPTIONS,
} from './validation.js';

export type { EscalationPrinciple, EscalationTrigger } from './escalation.js';
export {
  ESCALATION_PRINCIPLES,
  ESCALATION_PRINCIPLE_DESCRIPTIONS,
  ESCALATION_TRIGGERS,
  ESCALATION_TRIGGER_DESCRIPTIONS,
} from './escalation.js';

export type { PolicyEnforcementPrinciple, PolicyEnforcementMandate } from './policy-enforcement.js';
export {
  POLICY_ENFORCEMENT_PRINCIPLES,
  POLICY_ENFORCEMENT_PRINCIPLE_DESCRIPTIONS,
  POLICY_ENFORCEMENT_MANDATES,
  POLICY_ENFORCEMENT_MANDATE_DESCRIPTIONS,
} from './policy-enforcement.js';

export type { HumanOversightPrinciple, HumanOversightMandate } from './human-oversight.js';
export {
  HUMAN_OVERSIGHT_PRINCIPLES,
  HUMAN_OVERSIGHT_PRINCIPLE_DESCRIPTIONS,
  HUMAN_OVERSIGHT_MANDATES,
  HUMAN_OVERSIGHT_MANDATE_DESCRIPTIONS,
} from './human-oversight.js';

export type { DecisionMakingPrinciple, DecisionMakingMandate } from './decision-making.js';
export {
  DECISION_MAKING_PRINCIPLES,
  DECISION_MAKING_PRINCIPLE_DESCRIPTIONS,
  DECISION_MAKING_MANDATES,
  DECISION_MAKING_MANDATE_DESCRIPTIONS,
} from './decision-making.js';
