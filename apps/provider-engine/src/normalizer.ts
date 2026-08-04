import type { Capability, ProviderId, ProviderResponse } from './types.js';

/**
 * Response normalization: it shapes a provider's raw output into the engine's neutral
 * `ProviderResponse`, so a caller never sees a vendor-shaped result. It owns envelope shape only; it
 * carries no intelligence and interprets no payload.
 */
export class ProviderResponseNormalizer {
  /** Normalize a provider's raw output into the neutral, frozen `ProviderResponse` envelope. */
  normalize(providerId: ProviderId, capability: Capability, output: unknown): ProviderResponse {
    const response: ProviderResponse = { providerId, capability, output, normalized: true };
    return Object.freeze(response);
  }
}
