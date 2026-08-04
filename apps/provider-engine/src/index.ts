/**
 * @packageDocumentation
 * `@openlance/aios-provider-engine`
 *
 * The Runtime's vendor-neutral operational Provider Engine (Phase 4, Stage 1; ADR-0035). It carries
 * out provider registration, capability evaluation, deterministic selection and routing, lifecycle,
 * health, governed invocation behind a required `GovernanceClearance`, bounded failover, and response
 * normalization, over a technology-neutral `Provider` abstraction, by consuming the frozen
 * `@openlance/aios-providers` and `@openlance/aios-runtime` models and the frozen substrate. It
 * re-owns none of them: the run-time invocation of a provider is the Runtime's, and this engine is
 * that runtime subsystem.
 *
 * It contains no vendor knowledge (ADR-0035): no vendor SDK, no vendor-specific request or response
 * model, no API URL, and no authentication. Concrete provider adapters are separate later sub-stages
 * implemented against the frozen `Provider` abstraction. The governance clearance minter is
 * deliberately not exported: production has no way to mint a clearance, so there is no
 * ungoverned-execution path.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal
 * modules are prohibited and fail CI. Constitution: OL-AI-PROVIDERS-README, OL-AI-RUNTIME-README.
 */

export type {
  Capability,
  ExecutionOptions,
  HealthStatus,
  Provider,
  ProviderDescriptor,
  ProviderDiagnostics,
  ProviderId,
  ProviderNeed,
  ProviderRequest,
  ProviderResponse,
  ProviderStatistics,
} from './types.js';

export type { GovernanceClearance } from './governance-clearance.js';

export { ProviderError } from './errors.js';
export { ProviderRegistry } from './registry.js';
export { ProviderCapabilities, providerSatisfies } from './capabilities.js';
export { ProviderLifecycle } from './lifecycle.js';
export { ProviderHealthMonitor } from './health.js';
export { ProviderRouter, isEligible } from './routing.js';
export { ProviderSelector } from './selection.js';
export { ProviderResponseNormalizer } from './normalizer.js';
export { ProviderMetrics } from './metrics.js';
export { ProviderExecutor } from './executor.js';
export { ProviderEvents, PROVIDER_EVENT_TYPES } from './events.js';
export { ProviderConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { ProviderEngineSettings } from './configuration.js';
export { ProviderFactory } from './factory.js';
export { ProviderPluginBridge } from './plugin-bridge.js';
export type { ProviderPlugin } from './plugin-bridge.js';
export { ProviderManager } from './manager.js';
export type { ProviderManagerOptions } from './manager.js';
export { providerEngineModule, PROVIDER_MANAGER } from './module.js';
