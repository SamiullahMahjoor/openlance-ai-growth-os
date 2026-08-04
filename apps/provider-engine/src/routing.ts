import { providerSatisfies } from './capabilities.js';
import type { ProviderHealthMonitor } from './health.js';
import type { ProviderLifecycle } from './lifecycle.js';
import type { Provider, ProviderNeed } from './types.js';

/**
 * Whether a provider is eligible to serve a need now: it satisfies the capability, it is in a usable
 * lifecycle phase, and it is not recorded unhealthy. Pure over the injected lifecycle and health.
 */
export const isEligible = (
  provider: Provider,
  need: ProviderNeed,
  lifecycle: ProviderLifecycle,
  health: ProviderHealthMonitor,
): boolean =>
  providerSatisfies(provider, need) &&
  lifecycle.isUsable(provider) &&
  !health.isUnhealthy(provider.id);

/**
 * Deterministic routing and the bounded, acyclic fallback order. `route` returns the eligible
 * providers for a need in registration order: the first is the primary, the rest are the ordered
 * fallbacks. The result is bounded by the registry and is a list, so it can never cycle
 * (ai/providers/provider-routing.md and provider-fallback.md; ADR-0020).
 */
export class ProviderRouter {
  readonly #lifecycle: ProviderLifecycle;
  readonly #health: ProviderHealthMonitor;

  constructor(lifecycle: ProviderLifecycle, health: ProviderHealthMonitor) {
    this.#lifecycle = lifecycle;
    this.#health = health;
  }

  /** The eligible providers for a need, in registration (fallback) order. */
  route(need: ProviderNeed, providers: readonly Provider[]): readonly Provider[] {
    return providers.filter((provider) =>
      isEligible(provider, need, this.#lifecycle, this.#health),
    );
  }
}
