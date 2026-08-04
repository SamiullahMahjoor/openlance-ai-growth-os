import type { HealthStatus, Provider, ProviderId } from './types.js';

/**
 * The provider health monitor: it probes providers and records their operational health, so selection
 * and routing skip an unhealthy provider. Health is recorded per id; an unprobed provider is `unknown`
 * (eligible, but not asserted healthy). It records health only; it decides no policy and invokes no
 * provider.
 */
export class ProviderHealthMonitor {
  readonly #status = new Map<ProviderId, HealthStatus>();

  /** Probe a provider and record its health; returns the observed status. */
  async check(provider: Provider): Promise<HealthStatus> {
    const status = await provider.probe();
    this.#status.set(provider.id, status);
    return status;
  }

  /** The recorded health of a provider, or `unknown` if it has not been probed. */
  status(id: ProviderId): HealthStatus {
    return this.#status.get(id) ?? 'unknown';
  }

  /** Whether a provider is recorded unhealthy. Selection and routing exclude an unhealthy provider. */
  isUnhealthy(id: ProviderId): boolean {
    return this.status(id) === 'unhealthy';
  }

  /** Forget a provider's recorded health, so a retired id leaves no stale status behind. */
  forget(id: ProviderId): void {
    this.#status.delete(id);
  }
}
