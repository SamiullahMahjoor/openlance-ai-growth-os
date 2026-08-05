/**
 * @packageDocumentation
 * `@openlance/aios-governance-engine`
 *
 * The AIOS Governance Enforcement Engine (Phase 4, Stage 8): the Runtime's operational authorization subsystem, the
 * operational realization of the frozen Governance namespace (the runtime validation pipeline ADR-0035 anticipated). It
 * authorizes an immutable `AgentExecutionPlan` by applying the frozen governance model (permission, constitutional
 * validation, autonomy, human oversight) and produces an immutable `GovernanceDecision`
 * (`AUTHORIZE` / `DENY` / `REQUIRE_APPROVAL` / `ESCALATE`). It **authorizes and stops**: it executes nothing, invokes no
 * engine, scores no risk, and mints no policy.
 *
 * The runtime pipeline is Agent -> Governance -> Safety (Stage 9) -> Operations (Stage 10) -> Execution/Provider Runtime;
 * governance decides whether execution is authorized. The governance model defers operational enforcement to the runtime
 * ("Governance defines what validation means; the runtime performs it"); this engine is that enforcement. It applies
 * governance and never defines, versions, or owns policy; it mints decisions, not policy, and mints no provider clearance
 * (the frozen provider-engine brand is private). It is deterministic, fail-closed, zero-trust, and contains no vendor
 * knowledge (ADR-0042). This file is the single supported public API (Engineering Rule 1).
 */

export type {
  GovernanceId,
  GovernanceGrant,
  GovernanceGrantInput,
  GovernanceRequest,
  GovernanceOutcome,
  GovernanceDecision,
  GovernanceStatistics,
  GovernanceDiagnostics,
} from './types.js';

export { GovernanceError } from './errors.js';
export { GovernanceNormalizer } from './normalizer.js';
export { GovernanceHash } from './hash.js';
export { GovernanceRegistry } from './registry.js';
export { GovernanceFactory } from './factory.js';
export { PermissionEvaluator } from './permission-evaluator.js';
export { ConstitutionalValidator } from './constitutional-validator.js';
export { AutonomyEvaluator } from './autonomy-evaluator.js';
export { OversightEvaluator } from './oversight-evaluator.js';
export { GovernanceEvaluator } from './evaluator.js';
export { GovernanceMetrics } from './metrics.js';
export { GovernanceEvents, GOVERNANCE_EVENT_TYPES } from './events.js';
export { GovernanceConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { GovernanceEngineSettings } from './configuration.js';
export { GovernancePluginBridge } from './plugin-bridge.js';
export type { GovernancePlugin } from './plugin-bridge.js';
export { GovernanceManager } from './manager.js';
export type { GovernanceManagerOptions } from './manager.js';
export { governanceEngineModule, GOVERNANCE_MANAGER } from './module.js';
