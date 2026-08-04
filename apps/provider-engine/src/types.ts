import type { Result } from '@openlance/aios-kernel';
import type { ProviderLifecyclePhase } from '@openlance/aios-providers';

import type { ProviderError } from './errors.js';
import type { GovernanceClearance } from './governance-clearance.js';

/** A provider's stable identity within the engine. */
export type ProviderId = string;

/** A capability tag a provider declares and a need requires (a neutral string; no vendor meaning). */
export type Capability = string;

/**
 * A neutral invocation request. It carries the capability it needs and an opaque payload. It holds no
 * vendor-specific shape; a concrete adapter maps it to and from its source at the edge.
 */
export interface ProviderRequest {
  readonly capability: Capability;
  readonly payload: unknown;
}

/**
 * A neutral, normalized invocation response. The engine never surfaces a vendor-shaped result; the
 * normalizer wraps a provider's raw output in this envelope.
 */
export interface ProviderResponse {
  readonly providerId: ProviderId;
  readonly capability: Capability;
  readonly output: unknown;
  readonly normalized: true;
}

/** The operational health of a provider. An unprobed provider is `unknown`. */
export type HealthStatus = 'healthy' | 'unhealthy' | 'unknown';

/**
 * The vendor seam: the only surface a concrete provider adapter implements. It holds no vendor
 * knowledge here (no SDK, no vendor request or response model, no URL, no auth). A concrete adapter,
 * shipped as a separate later sub-stage, supplies `invoke` and `probe` against a real source. `invoke`
 * requires a governance clearance, so a provider is never invoked outside the governed path.
 */
export interface Provider {
  readonly id: ProviderId;
  readonly capabilities: readonly Capability[];
  readonly phase: ProviderLifecyclePhase;
  invoke(
    clearance: GovernanceClearance,
    request: ProviderRequest,
  ): Promise<Result<unknown, ProviderError>>;
  probe(): Promise<HealthStatus>;
}

/**
 * A provider adapter's registration input. The factory validates it and produces an immutable
 * `Provider`, filling a default lifecycle phase and probe when omitted.
 */
export interface ProviderDescriptor {
  readonly id: ProviderId;
  readonly capabilities: readonly Capability[];
  readonly phase?: ProviderLifecyclePhase;
  invoke(
    clearance: GovernanceClearance,
    request: ProviderRequest,
  ): Promise<Result<unknown, ProviderError>>;
  probe?(): Promise<HealthStatus>;
}

/** A need to satisfy: the capability an invocation requires. */
export interface ProviderNeed {
  readonly capability: Capability;
}

/**
 * The bounded execution policy for one governed invocation: the per-provider attempt bound, an
 * optional absolute clock-time deadline (`null` for none), and an optional cancellation signal
 * (`null` for none).
 */
export interface ExecutionOptions {
  readonly maxAttempts: number;
  readonly deadline: number | null;
  readonly signal: { readonly aborted: boolean } | null;
}

/** A read-only snapshot of the engine's operational counters. */
export interface ProviderStatistics {
  readonly registrations: number;
  readonly invocations: number;
  readonly successes: number;
  readonly failures: number;
  readonly failovers: number;
}

/** A read-only operational view of the engine. */
export interface ProviderDiagnostics {
  readonly providerCount: number;
  readonly statistics: ProviderStatistics;
}
