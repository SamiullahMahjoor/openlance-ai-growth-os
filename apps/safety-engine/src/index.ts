/**
 * @packageDocumentation
 * `@openlance/aios-safety-engine`
 *
 * The AIOS Safety Engine (Phase 4, Stage 9): the Runtime's operational protection subsystem, the operational realization
 * of the frozen Safety namespace (the runtime evaluation the frozen namespace defers to the operational consumer). It
 * evaluates an authorized `AgentExecutionPlan` against the `GovernanceDecision` that authorized it, identifies runtime
 * hazards over the plan's steps and coordination (categorized by the frozen `HazardCategory`), classifies the required
 * protection by applying the governed `TrustLevel`, assesses impact along the frozen `IMPACT_DIMENSIONS`, and produces an
 * immutable `SafetyDecision` (`SAFE` / `SANITIZE` / `RESTRICT` / `DEGRADE` / `ESCALATE` / `REFUSE` / `UNSAFE`).
 *
 * The runtime pipeline is Agent -> Governance -> Safety (this engine) -> Operations (Stage 10) -> Execution/Provider
 * Runtime; safety decides whether an authorized execution is safe. It **protects and stops**: it authorizes nothing and
 * never overrides a governance decision (a non-`AUTHORIZE` decision is propagated as a constitutional `REFUSE` without
 * evaluation), executes nothing, invokes no engine, selects and invokes no provider, and performs no inference. Its
 * protective components are inert: they describe the sanitization, restriction, isolation, and degradation Operations is
 * to apply. It is deterministic, fail-closed, zero-trust, and contains no vendor knowledge (ADR-0043). This file is the
 * single supported public API (Engineering Rule 1).
 */

export type {
  SafetyId,
  SafetyOutcome,
  ProtectiveResponse,
  DirectiveKind,
  Hazard,
  SafetyDirective,
  SafetyRequest,
  SafetyDecision,
  SafetyRule,
  SafetyRuleInput,
  SafetyStatistics,
  SafetyDiagnostics,
} from './types.js';

export { SafetyError } from './errors.js';
export { SafetyNormalizer } from './normalizer.js';
export { SafetyHash } from './hash.js';
export { SafetyConfiguration, DEFAULT_POLICY } from './configuration.js';
export type { SafetyPolicy } from './configuration.js';
export {
  resolveEffectivePolicy,
  scopeMatches,
  PROTECTION_RANK,
  strongest,
  isExecuting,
} from './policy.js';
export type { EffectivePolicy } from './policy.js';
export { SafetyFactory } from './factory.js';
export { SafetyRuleRegistry } from './registry.js';
export { PromptSafetyInspector } from './prompt-safety-inspector.js';
export { ToolSafetyInspector } from './tool-safety-inspector.js';
export { MemorySafetyInspector } from './memory-safety-inspector.js';
export { RetrievalSafetyInspector } from './retrieval-safety-inspector.js';
export { HazardAnalyzer } from './hazard-analyzer.js';
export { RiskAnalyzer } from './risk-analyzer.js';
export type { ClassifiedHazard } from './risk-analyzer.js';
export { SanitizationEngine } from './sanitization-engine.js';
export { RuntimeBoundaryEnforcer } from './runtime-boundary-enforcer.js';
export { IsolationManager } from './isolation-manager.js';
export { SafeRefusalEngine } from './safe-refusal-engine.js';
export type { SafetyDisposition } from './safe-refusal-engine.js';
export { SafetyEvaluator } from './evaluator.js';
export { SafetyMetrics } from './metrics.js';
export { SafetyEvents, SAFETY_EVENT_TYPES } from './events.js';
export { SafetyPluginBridge } from './plugin-bridge.js';
export type { SafetyPlugin } from './plugin-bridge.js';
export { SafetyManager } from './manager.js';
export type { SafetyManagerOptions } from './manager.js';
export { safetyEngineModule, SAFETY_MANAGER } from './module.js';
