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
